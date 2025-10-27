import { NextRequest, NextResponse } from 'next/server';
import { asaasAPI } from '@/lib/asaas';
import { WebhookPagamento, EventoWebhook } from '@/types/pagamento.types';
import { createClient } from '@/lib/supabase/server';
import { whatsappService } from '@/services/whatsappService';
import { notificacaoService } from '@/services/notificacaoService';

export async function POST(request: NextRequest) {
  try {
    // Obter o payload e a assinatura
    const payload = await request.text();
    const signature = request.headers.get('asaas-signature') || '';

    // Validar a assinatura do webhook
    if (!asaasAPI.validateWebhook(payload, signature)) {
      console.error('Webhook signature validation failed');
      return NextResponse.json(
        { erro: 'Assinatura inválida' },
        { status: 401 }
      );
    }

    // Parse do payload
    const webhookData: WebhookPagamento = JSON.parse(payload);

    console.log('Webhook recebido:', {
      event: webhookData.event,
      paymentId: webhookData.payment.id,
      status: webhookData.payment.status
    });

    // Processar o evento baseado no tipo
    await processarEventoWebhook(webhookData);

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function processarEventoWebhook(webhookData: WebhookPagamento) {
  const { event, payment } = webhookData;

  try {
    switch (event) {
      case EventoWebhook.PAGAMENTO_CRIADO:
        await processarPagamentoCriado(payment);
        break;

      case EventoWebhook.AGUARDANDO_PAGAMENTO:
        await processarAguardandoPagamento(payment);
        break;

      case EventoWebhook.PAGAMENTO_RECEBIDO:
        await processarPagamentoRecebido(payment);
        break;

      case EventoWebhook.PAGAMENTO_CONFIRMADO:
        await processarPagamentoConfirmado(payment);
        break;

      case EventoWebhook.PAGAMENTO_VENCIDO:
        await processarPagamentoVencido(payment);
        break;

      case EventoWebhook.PAGAMENTO_ESTORNADO:
        await processarPagamentoEstornado(payment);
        break;

      case EventoWebhook.PAGAMENTO_DELETADO:
        await processarPagamentoDeletado(payment);
        break;

      default:
        console.log(`Evento não tratado: ${event}`);
    }
  } catch (error) {
    console.error(`Erro ao processar evento ${event}:`, error);
    throw error;
  }
}

async function processarPagamentoCriado(payment: WebhookPagamento['payment']) {
  console.log(`Pagamento criado: ${payment.id}`);
  
  // Aqui você pode:
  // 1. Atualizar o status no banco de dados
  // 2. Enviar notificação para o usuário
  // 3. Registrar log da transação
  
  // Exemplo de atualização no banco (implementar conforme sua estrutura)
  // await updatePaymentStatus(payment.id, 'CREATED');
  
  // Exemplo de notificação
  // await sendNotification(payment.customer, 'Pagamento criado com sucesso');
}

async function processarAguardandoPagamento(payment: WebhookPagamento['payment']) {
  console.log(`Aguardando pagamento: ${payment.id}`);
  
  // Atualizar status para aguardando pagamento
  // await updatePaymentStatus(payment.id, 'AWAITING_PAYMENT');
}

async function processarPagamentoRecebido(payment: WebhookPagamento['payment']) {
  console.log(`Pagamento recebido: ${payment.id}`);
  
  // Atualizar status para recebido
  // await updatePaymentStatus(payment.id, 'RECEIVED');
  
  // Enviar notificação de pagamento recebido
  // await sendNotification(payment.customer, 'Pagamento recebido com sucesso');
}

async function processarPagamentoConfirmado(payment: WebhookPagamento['payment']) {
  console.log(`Pagamento confirmado: ${payment.id}`);
  
  const supabase = await createClient();
  
  try {
    // Atualizar status no banco de dados
    const { data: pagamentoData, error: pagamentoError } = await supabase
      .from('pagamentos')
      .update({
        status: 'confirmado',
        data_pagamento: payment.paymentDate,
        data_confirmacao: payment.confirmedDate,
        valor_liquido: payment.netValue,
        updated_at: new Date().toISOString()
      })
      .eq('asaas_payment_id', payment.id)
      .select('reserva_id')
      .single();

    if (pagamentoError) {
      console.error('Erro ao atualizar pagamento confirmado:', pagamentoError);
      return;
    }

    // Confirmar reserva se existir
    if (pagamentoData?.reserva_id) {
      const { data: reservaData, error: reservaError } = await supabase
        .from('reservas')
        .update({
          status: 'confirmada',
          updated_at: new Date().toISOString()
        })
        .eq('id', pagamentoData.reserva_id)
        .select('id, data_hora, usuario_id, quadra_id')
        .single();

      if (reservaError) {
        console.error('Erro ao confirmar reserva:', reservaError);
        return;
      }
      
      // Buscar dados do usuário e quadra separadamente
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('nome, telefone')
        .eq('id', reservaData?.usuario_id)
        .single();
      
      const { data: quadraData } = await supabase
        .from('quadras')
        .select('nome')
        .eq('id', reservaData?.quadra_id)
        .single();

      // Enviar notificação de pagamento confirmado
      if (usuarioData?.telefone) {
        try {
          await whatsappService.notificarPagamentoRecebido(
            usuarioData.telefone,
            {
              id: payment.id,
              valor: payment.value,
              metodo: payment.billingType === 'PIX' ? 'PIX' : 
                     payment.billingType === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Boleto',
              referencia: `Reserva ${reservaData.id}`
            }
          );

          // Agendar lembretes automáticos para a reserva
          await notificacaoService.agendarLembretesReserva(
            reservaData.id,
            {
              telefone: usuarioData.telefone,
              quadra: quadraData?.nome || '',
              data: new Date(reservaData.data_hora),
              horario: new Date(reservaData.data_hora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              participantes: [usuarioData.nome]
            }
          );

          console.log(`Notificações enviadas e lembretes agendados para reserva ${reservaData.id}`);
        } catch (notificationError) {
          console.error('Erro ao enviar notificações:', notificationError);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao processar pagamento confirmado:', error);
  }
}

async function processarPagamentoVencido(payment: WebhookPagamento['payment']) {
  console.log(`Pagamento vencido: ${payment.id}`);
  
  const supabase = await createClient();
  
  try {
    // Atualizar status no banco de dados
    const { data: pagamentoData, error: pagamentoError } = await supabase
      .from('pagamentos')
      .update({
        status: 'vencido',
        updated_at: new Date().toISOString()
      })
      .eq('asaas_payment_id', payment.id)
      .select('reserva_id')
      .single();

    if (pagamentoError) {
      console.error('Erro ao atualizar pagamento vencido:', pagamentoError);
      return;
    }

    // Cancelar reserva se existir
    if (pagamentoData?.reserva_id) {
      const { data: reservaData, error: reservaError } = await supabase
        .from('reservas')
        .update({
          status: 'cancelada',
          motivo_cancelamento: 'Pagamento vencido',
          updated_at: new Date().toISOString()
        })
        .eq('id', pagamentoData.reserva_id)
        .select('id, usuario_id')
        .single();
      
      // Buscar telefone do usuário
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('telefone')
        .eq('id', reservaData?.usuario_id)
        .single();

      if (reservaError) {
        console.error('Erro ao cancelar reserva por vencimento:', reservaError);
        return;
      }

      // Cancelar notificações agendadas
      await notificacaoService.cancelarNotificacoesReserva(pagamentoData.reserva_id);

      // Notificar cancelamento por vencimento
      if (usuarioData?.telefone) {
        try {
          await whatsappService.notificarCancelamento(
            usuarioData.telefone,
            {
              tipo: 'reserva',
              id: reservaData.id,
              motivo: 'Pagamento não foi realizado no prazo'
            }
          );
        } catch (notificationError) {
          console.error('Erro ao notificar cancelamento:', notificationError);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao processar pagamento vencido:', error);
  }
}

async function processarPagamentoEstornado(payment: WebhookPagamento['payment']) {
  console.log(`Pagamento estornado: ${payment.id}`);
  
  // Atualizar status para estornado
  // await updatePaymentStatus(payment.id, 'REFUNDED');
  
  // Processar ações pós-estorno:
  // 1. Cancelar reserva
  // 2. Reverter créditos/bônus
  // 3. Enviar notificação de estorno
  
  // Exemplo:
  // await cancelReservation(payment.externalReference);
  // await reverseCredits(payment.customer, payment.value);
  // await sendRefundNotification(payment.customer, payment.value);
}

async function processarPagamentoDeletado(payment: WebhookPagamento['payment']) {
  console.log(`Pagamento deletado: ${payment.id}`);
  
  // Atualizar status para deletado
  // await updatePaymentStatus(payment.id, 'DELETED');
  
  // Processar ações para pagamento deletado
  // await cancelReservation(payment.externalReference);
}

// Funções auxiliares (implementar conforme sua estrutura de dados)

// async function updatePaymentStatus(paymentId: string, status: string) {
//   // Implementar atualização no banco de dados
//   console.log(`Atualizando status do pagamento ${paymentId} para ${status}`);
// }

// async function sendNotification(customerId: string, message: string) {
//   // Implementar envio de notificação
//   console.log(`Enviando notificação para cliente ${customerId}: ${message}`);
// }

// async function confirmReservation(reservationId: string) {
//   // Implementar confirmação de reserva
//   console.log(`Confirmando reserva ${reservationId}`);
// }

// async function cancelReservation(reservationId: string) {
//   // Implementar cancelamento de reserva
//   console.log(`Cancelando reserva ${reservationId}`);
// }

// async function sendPaymentReceipt(customerId: string, paymentId: string) {
//   // Implementar envio de comprovante
//   console.log(`Enviando comprovante para cliente ${customerId}, pagamento ${paymentId}`);
// }

// async function processReferralBonus(customerId: string, amount: number) {
//   // Implementar processamento de bônus de indicação
//   console.log(`Processando bônus de indicação para cliente ${customerId}, valor ${amount}`);
// }