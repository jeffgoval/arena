import { NextRequest, NextResponse } from 'next/server';
import { whatsappAPI } from '@/lib/whatsapp';
import { whatsappService } from '@/services/whatsappService';

// Verificação do webhook (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (!mode || !token || !challenge) {
      return NextResponse.json(
        { erro: 'Parâmetros de verificação ausentes' },
        { status: 400 }
      );
    }

    const validationResult = whatsappAPI.validarWebhook(mode, token, challenge);

    if (validationResult) {
      console.log('Webhook do WhatsApp verificado com sucesso');
      return new NextResponse(validationResult, { status: 200 });
    } else {
      console.error('Falha na verificação do webhook do WhatsApp');
      return NextResponse.json(
        { erro: 'Token de verificação inválido' },
        { status: 403 }
      );
    }

  } catch (error: any) {
    console.error('Erro na verificação do webhook:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Recebimento de mensagens (POST)
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log('Webhook WhatsApp recebido:', JSON.stringify(webhookData, null, 2));

    // Processar o webhook
    whatsappAPI.processarWebhook(webhookData);

    // Processar mensagens recebidas
    if (webhookData.entry) {
      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              await processarMensagemRecebida(message);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Erro ao processar webhook do WhatsApp:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function processarMensagemRecebida(message: any) {
  try {
    const telefone = message.from;
    const messageId = message.id;

    // Marcar mensagem como lida
    await whatsappAPI.marcarComoLida(messageId);

    // Processar diferentes tipos de mensagem
    switch (message.type) {
      case 'text':
        await whatsappService.processarMensagemRecebida(
          telefone,
          message.text.body,
          'text'
        );
        break;

      case 'button':
        await processarBotaoPressionado(telefone, message.button);
        break;

      case 'interactive':
        await processarInteracao(telefone, message.interactive);
        break;

      default:
        console.log(`Tipo de mensagem não tratado: ${message.type}`);
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          'Desculpe, não consigo processar este tipo de mensagem. Digite "menu" para ver as opções disponíveis.'
        );
    }

  } catch (error) {
    console.error('Erro ao processar mensagem recebida:', error);
  }
}

async function processarBotaoPressionado(telefone: string, button: any) {
  const buttonId = button.payload;

  try {
    switch (buttonId) {
      case 'nova_reserva':
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          '🎾 *Nova Reserva*\n\nPara fazer uma nova reserva, acesse nosso site:\n\n🌐 https://arena.com/reservas\n\nOu ligue para nós:\n📞 (11) 99999-9999'
        );
        break;

      case 'minhas_reservas':
      case 'ver_reservas':
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          '📅 *Minhas Reservas*\n\nPara ver suas reservas, acesse:\n\n🌐 https://arena.com/cliente/reservas\n\nOu entre em contato conosco:\n📞 (11) 99999-9999'
        );
        break;

      case 'cancelar_reserva':
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          '❌ *Cancelar Reserva*\n\nPara cancelar uma reserva:\n\n1️⃣ Acesse: https://arena.com/cliente/reservas\n2️⃣ Ou ligue: (11) 99999-9999\n3️⃣ Ou responda com o ID da reserva\n\n⚠️ Cancelamentos com menos de 2h de antecedência podem ter taxa.'
        );
        break;

      case 'suporte':
        await whatsappAPI.enviarBotoes(
          telefone,
          'Como podemos ajudá-lo?',
          [
            { id: 'horario_funcionamento', title: '🕐 Horários' },
            { id: 'endereco', title: '📍 Endereço' },
            { id: 'contato_humano', title: '👤 Falar com Atendente' }
          ],
          '🆘 Suporte'
        );
        break;

      case 'horario_funcionamento':
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          '🕐 *Horário de Funcionamento*\n\n📅 Segunda a Sexta: 06:00 às 23:00\n📅 Sábado e Domingo: 07:00 às 22:00\n\n📞 Central de Atendimento: 24h'
        );
        break;

      case 'endereco':
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          '📍 *Nosso Endereço*\n\nArena Dona Santa\nRua das Flores, 123 - Centro\nSão Paulo - SP\nCEP: 01234-567\n\n🚗 Estacionamento gratuito\n🚌 Próximo ao metrô'
        );
        break;

      case 'contato_humano':
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          '👤 *Atendimento Humano*\n\nNossos atendentes estão disponíveis:\n\n📞 Telefone: (11) 99999-9999\n📧 Email: contato@arena.com\n💬 WhatsApp: Este número\n\n⏰ Horário: 08:00 às 18:00 (Seg-Sex)'
        );
        break;

      default:
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          'Opção não reconhecida. Digite "menu" para ver as opções disponíveis.'
        );
    }
  } catch (error) {
    console.error('Erro ao processar botão:', error);
    await whatsappAPI.enviarMensagemTexto(
      telefone,
      'Desculpe, ocorreu um erro. Tente novamente ou entre em contato conosco.'
    );
  }
}

async function processarInteracao(telefone: string, interactive: any) {
  try {
    if (interactive.type === 'button_reply') {
      await processarBotaoPressionado(telefone, { payload: interactive.button_reply.id });
    } else if (interactive.type === 'list_reply') {
      const listId = interactive.list_reply.id;
      
      if (listId.startsWith('quadra_')) {
        const quadraId = listId.replace('quadra_', '');
        await whatsappAPI.enviarMensagemTexto(
          telefone,
          `🎾 Você selecionou a quadra ${quadraId}.\n\nPara continuar com a reserva, acesse:\n🌐 https://arena.com/reservas?quadra=${quadraId}`
        );
      }
    }
  } catch (error) {
    console.error('Erro ao processar interação:', error);
  }
}