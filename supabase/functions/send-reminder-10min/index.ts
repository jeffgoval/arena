/**
 * Edge Function: send-reminder-10min
 *
 * Sends final reminder 10 minutes before game starts
 * Runs every 5 minutes via cron job
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET_TOKEN')!;

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find games starting in 8-12 minutes
    const now = new Date();
    const targetTimeMin = new Date(now.getTime() + 8 * 60 * 1000);
    const targetTimeMax = new Date(now.getTime() + 12 * 60 * 1000);

    const { data: reservations } = await supabase
      .from('reservas')
      .select(`*, quadras (nome), horarios (inicio), users!cliente_id (nome_completo, whatsapp)`)
      .eq('status', 'confirmada')
      .gte('data', now.toISOString().split('T')[0]);

    let sentCount = 0;

    for (const reserva of reservations || []) {
      const gameDateTime = new Date(`${reserva.data}T${reserva.horarios.inicio}`);

      if (gameDateTime < targetTimeMin || gameDateTime > targetTimeMax) continue;

      const { data: existingNotif } = await supabase
        .from('notificacoes')
        .select('id')
        .eq('reserva_id', reserva.id)
        .eq('tipo', 'lembrete_10min')
        .single();

      if (existingNotif) continue;

      const { data: participants } = await supabase
        .from('reserva_participantes')
        .select(`users!user_id (nome_completo, whatsapp)`)
        .eq('reserva_id', reserva.id)
        .eq('confirmado', true);

      const allUsers = [reserva.users, ...(participants?.map((p: any) => p.users) || [])];

      for (const user of allUsers) {
        if (!user.whatsapp) continue;

        const message = `⏰ *ATENÇÃO!*\n\nOlá ${user.nome_completo}! Seu jogo começa em 10 MINUTOS!\n\n📍 ${reserva.quadras.nome}\n🕐 ${reserva.horarios.inicio}\n\n⚠️ Esteja pronto! Nos vemos já! 🏃‍♂️⚽`;

        await sendWhatsApp(user.whatsapp, message);

        await supabase.from('notificacoes').insert({
          user_id: user.id,
          reserva_id: reserva.id,
          tipo: 'lembrete_10min',
          canal: 'whatsapp',
          status: 'enviada',
          conteudo: message,
        });

        sentCount++;
      }
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
      text: { body: message },
    }),
  });
}
