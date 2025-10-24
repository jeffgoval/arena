/**
 * Edge Function: send-review-request
 *
 * Sends review request 2 hours after game ends
 * Runs every 30 minutes via cron job
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET_TOKEN')!;
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://arena.com';

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find games that ended 1.5-2.5 hours ago
    const now = new Date();
    const targetTimeMin = new Date(now.getTime() - 150 * 60 * 1000); // 2.5h ago
    const targetTimeMax = new Date(now.getTime() - 90 * 60 * 1000);  // 1.5h ago

    const { data: reservations } = await supabase
      .from('reservas')
      .select(`*, quadras (nome), horarios (fim), users!cliente_id (id, nome_completo, whatsapp)`)
      .eq('status', 'confirmada')
      .lte('data', now.toISOString().split('T')[0]);

    let sentCount = 0;

    for (const reserva of reservations || []) {
      const gameEndTime = new Date(`${reserva.data}T${reserva.horarios.fim}`);

      if (gameEndTime < targetTimeMin || gameEndTime > targetTimeMax) continue;

      // Check if already evaluated
      const { data: existingReview } = await supabase
        .from('avaliacoes')
        .select('id')
        .eq('reserva_id', reserva.id)
        .eq('user_id', reserva.cliente_id)
        .single();

      if (existingReview) continue;

      // Check if notification already sent
      const { data: existingNotif } = await supabase
        .from('notificacoes')
        .select('id')
        .eq('reserva_id', reserva.id)
        .eq('user_id', reserva.cliente_id)
        .eq('tipo', 'solicitar_avaliacao')
        .single();

      if (existingNotif) continue;

      const user = reserva.users;
      if (!user.whatsapp) continue;

      const reviewLink = `${APP_URL}/avaliar/${reserva.id}`;
      const message = `⭐ *Como foi seu jogo?*\n\nOlá ${user.nome_completo}!\n\nEsperamos que tenha curtido seu jogo na ${reserva.quadras.nome}.\n\nSua opinião é muito importante para nós! Avalie sua experiência:\n\n🔗 ${reviewLink}\n\nSão apenas 2 minutos! 😊\n\nObrigado!\nEquipe Arena Dona Santa`;

      await sendWhatsApp(user.whatsapp, message);

      await supabase.from('notificacoes').insert({
        user_id: user.id,
        reserva_id: reserva.id,
        tipo: 'solicitar_avaliacao',
        canal: 'whatsapp',
        status: 'enviada',
        conteudo: message,
      });

      sentCount++;
    }

    return new Response(JSON.stringify({ success: true, sent: sentCount }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function sendWhatsApp(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  await fetch(WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: { body: message, preview_url: true },
    }),
  });
}
