/**
 * Edge Function: close-game
 *
 * Automatically closes games 2 hours before start time:
 * 1. Consolidates participant payments
 * 2. Captures pre-authorization (caução) for organizer's portion
 * 3. Charges organizer's balance if needed
 * 4. Updates reservation status to 'confirmada'
 * 5. Sends confirmation notifications
 *
 * Triggered by cron job (hourly) or manual invocation
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')!;
const ASAAS_ENVIRONMENT = Deno.env.get('ASAAS_ENVIRONMENT') || 'sandbox';
const CRON_SECRET = Deno.env.get('CRON_SECRET_TOKEN')!;

const ASAAS_BASE_URL =
  ASAAS_ENVIRONMENT === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3';

serve(async (req) => {
  try {
    // 1. Verify cron secret
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 3. Find reservations that need to be closed
    // (2 hours before start time, status = 'pendente')
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

    const { data: reservations, error: fetchError } = await supabase
      .from('reservas')
      .select(`
        *,
        quadras (nome),
        horarios (inicio, fim)
      `)
      .eq('status', 'pendente')
      .lte('data', twoHoursFromNow.toISOString().split('T')[0]);

    if (fetchError) {
      throw new Error(`Error fetching reservations: ${fetchError.message}`);
    }

    console.log(`Found ${reservations?.length || 0} reservations to process`);

    let processedCount = 0;
    let errorCount = 0;

    // 4. Process each reservation
    for (const reserva of reservations || []) {
      try {
        // Check if this game is actually 2 hours away
        const gameDateTime = new Date(`${reserva.data}T${reserva.horarios.inicio}`);
        const now = new Date();
        const hoursUntilGame = (gameDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilGame > 2.5 || hoursUntilGame < 0) {
          // Skip if not in the 2-hour window
          continue;
        }

        console.log(`Processing reservation ${reserva.id} - ${reserva.quadras.nome}`);

        // 5. Get all participants
        const { data: participants, error: participantsError } = await supabase
          .from('reserva_participantes')
          .select('*')
          .eq('reserva_id', reserva.id);

        if (participantsError) {
          throw new Error(`Error fetching participants: ${participantsError.message}`);
        }

        // 6. Calculate totals
        const participantsTotal = participants
          ?.filter((p) => p.payment_status === 'paid' || p.payment_status === 'free')
          .reduce((sum, p) => sum + (p.amount_to_pay || 0), 0) || 0;

        const organizerAmount = Math.max(0, reserva.valor_total - participantsTotal);

        console.log(`  Participants total: R$ ${participantsTotal.toFixed(2)}`);
        console.log(`  Organizer amount: R$ ${organizerAmount.toFixed(2)}`);

        // 7. Check for pre-authorization
        const { data: preAuth, error: preAuthError } = await supabase
          .from('payments')
          .select('*')
          .eq('reservation_id', reserva.id)
          .eq('status', 'authorized')
          .eq('metadata->>type', 'pre_authorization')
          .single();

        if (preAuth && !preAuthError) {
          // 7a. Capture pre-authorization for organizer's amount
          console.log(`  Capturing pre-auth: R$ ${organizerAmount.toFixed(2)}`);

          const captureResponse = await fetch(`${ASAAS_BASE_URL}/payments/${preAuth.transaction_id}/captureAuthorizedPayment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access_token': ASAAS_API_KEY,
            },
            body: JSON.stringify({ value: organizerAmount }),
          });

          if (!captureResponse.ok) {
            throw new Error(`Asaas capture failed: ${await captureResponse.text()}`);
          }

          // Update payment record
          await supabase
            .from('payments')
            .update({
              status: 'paid',
              capture_amount: organizerAmount,
              paid_at: new Date().toISOString(),
            })
            .eq('id', preAuth.id);

          console.log(`  ✅ Pre-auth captured successfully`);
        } else {
          // 7b. No pre-auth, charge organizer's balance
          console.log(`  No pre-auth found, charging balance: R$ ${organizerAmount.toFixed(2)}`);

          const { data: organizer } = await supabase
            .from('users')
            .select('saldo_creditos')
            .eq('id', reserva.cliente_id)
            .single();

          if (!organizer || organizer.saldo_creditos < organizerAmount) {
            throw new Error(`Organizer has insufficient balance. Required: R$ ${organizerAmount.toFixed(2)}, Available: R$ ${organizer?.saldo_creditos || 0}`);
          }

          // Deduct from balance
          await supabase.rpc('deduct_user_credits', {
            p_user_id: reserva.cliente_id,
            p_amount: organizerAmount,
          });

          // Create payment record
          await supabase.from('payments').insert({
            user_id: reserva.cliente_id,
            reservation_id: reserva.id,
            amount: organizerAmount,
            method: 'balance',
            status: 'paid',
            paid_at: new Date().toISOString(),
            metadata: { type: 'game_closure_balance' },
          });

          console.log(`  ✅ Balance charged successfully`);
        }

        // 8. Update reservation status to 'confirmada'
        await supabase
          .from('reservas')
          .update({
            status: 'confirmada',
            updated_at: new Date().toISOString(),
          })
          .eq('id', reserva.id);

        // 9. Send notifications
        // TODO: Implement notification service call
        console.log(`  📧 Notifications would be sent here`);

        console.log(`✅ Reservation ${reserva.id} closed successfully`);
        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing reservation ${reserva.id}:`, error);
        errorCount++;

        // Log error to database
        await supabase.from('edge_function_logs').insert({
          function_name: 'close-game',
          reservation_id: reserva.id,
          error_message: error.message,
          created_at: new Date().toISOString(),
        });
      }
    }

    // 10. Return summary
    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        errors: errorCount,
        total: reservations?.length || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});