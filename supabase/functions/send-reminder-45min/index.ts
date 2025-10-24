/**
 * Edge Function: send-reminder-45min
 *
 * Sends reminder notification 45 minutes before game starts
 * Runs every 15 minutes via cron job
 *
 * Notifications sent via:
 * - WhatsApp (primary)
 * - Email (fallback)
 * - SMS (if configured)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET_TOKEN')!;

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

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

    // 3. Find games starting in 40-50 minutes (execution window)
    const now = new Date();
    const targetTimeMin = new Date(now.getTime() + 40 * 60 * 1000); // 40 min from now
    const targetTimeMax = new Date(now.getTime() + 50 * 60 * 1000); // 50 min from now

    const { data: reservations, error: fetchError } = await supabase
      .from('reservas')
      .select(`
        *,
        quadras (nome, endereco),
        horarios (inicio, fim),
        users!cliente_id (nome_completo, whatsapp, email)
      `)
      .eq('status', 'confirmada')
      .gte('data', now.toISOString().split('T')[0]);

    if (fetchError) {
      throw new Error(`Error fetching reservations: ${fetchError.message}`);
    }

    console.log(`Found ${reservations?.length || 0} confirmed reservations`);

    let sentCount = 0;
    let errorCount = 0;

    // 4. Process each reservation
    for (const reserva of reservations || []) {
      try {
        // Build full datetime
        const gameDateTime = new Date(`${reserva.data}T${reserva.horarios.inicio}`);

        // Check if game is in our 45-minute window
        if (gameDateTime < targetTimeMin || gameDateTime > targetTimeMax) {
          continue; // Skip - not in time window
        }

        console.log(`Processing reservation ${reserva.id} - Game at ${gameDateTime.toISOString()}`);

        // Check if reminder already sent
        const { data: existingNotif } = await supabase
          .from('notificacoes')
          .select('id')
          .eq('user_id', reserva.cliente_id)
          .eq('reserva_id', reserva.id)
          .eq('tipo', 'lembrete_45min')
          .single();

        if (existingNotif) {
          console.log(`  ⏭️  Reminder already sent for reservation ${reserva.id}`);
          continue;
        }

        // Get all participants
        const { data: participants } = await supabase
          .from('reserva_participantes')
          .select(`
            *,
            users!user_id (nome_completo, whatsapp, email)
          `)
          .eq('reserva_id', reserva.id)
          .eq('confirmado', true);

        const allUsers = [
          { ...reserva.users, role: 'organizer' },
          ...(participants?.map((p: any) => ({ ...p.users, role: 'participant' })) || [])
        ];

        // Send reminders to organizer and participants
        for (const user of allUsers) {
          if (!user.whatsapp) {
            console.log(`  ⚠️  User ${user.nome_completo} has no WhatsApp number`);
            continue;
          }

          try {
            const message = buildReminderMessage(
              user.nome_completo,
              reserva.quadras.nome,
              gameDateTime,
              reserva.horarios.fim,
              reserva.quadras.endereco,
              user.role
            );

            await sendWhatsAppMessage(user.whatsapp, message);

            // Save notification record
            await supabase.from('notificacoes').insert({
              user_id: user.id || reserva.cliente_id,
              reserva_id: reserva.id,
              tipo: 'lembrete_45min',
              canal: 'whatsapp',
              status: 'enviada',
              conteudo: message,
            });

            console.log(`  ✅ Reminder sent to ${user.nome_completo}`);
            sentCount++;
          } catch (userError) {
            console.error(`  ❌ Failed to send to ${user.nome_completo}:`, userError);
            errorCount++;
          }
        }

      } catch (error) {
        console.error(`❌ Error processing reservation ${reserva.id}:`, error);
        errorCount++;
      }
    }

    // 5. Return summary
    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
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

/**
 * Build reminder message
 */
function buildReminderMessage(
  nome: string,
  quadra: string,
  dataHora: Date,
  horaFim: string,
  endereco: string,
  role: string
): string {
  const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const data = dataHora.toLocaleDateString('pt-BR');

  const roleText = role === 'organizer' ? 'você organizou' : 'você foi convidado para';

  return `⏰ *Lembrete de Jogo*

Olá ${nome}! Seu jogo começa em 45 minutos.

📍 *Local:* ${quadra}
🕐 *Horário:* ${hora} - ${horaFim}
📅 *Data:* ${data}
📌 *Endereço:* ${endereco}

Lembre-se:
✅ Chegue com 10-15min de antecedência
✅ Traga água e toalha
✅ Use roupas e calçados adequados

Nos vemos lá! ⚽🎾`;
}

/**
 * Send WhatsApp message via Graph API
 */
async function sendWhatsAppMessage(phone: string, message: string): Promise<void> {
  // Format phone number (remove non-digits, add 55 if needed)
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const response = await fetch(WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message,
        preview_url: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }
}
