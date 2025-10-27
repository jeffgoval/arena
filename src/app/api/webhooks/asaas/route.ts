import { NextRequest, NextResponse } from 'next/server';
import { asaasAPI } from '@/lib/asaas';
import { WebhookPagamento, EventoWebhook } from '@/types/pagamento.types';
import { createClient } from '@/lib/supabase/server';
import { whatsappService } from '@/services/whatsappService';
import { notificacaoService } from '@/services/notificacaoService';
import { WebhookLogger } from '@/lib/webhooks/webhook-logger';
import { logger } from '@/lib/utils/logger';

/**
 * ============================================================================
 * WEBHOOK ASAAS - Sistema de Pagamento
 * ============================================================================
 *
 * Este endpoint recebe notificações do Asaas quando o status de um pagamento muda.
 *
 * EVENTOS IMPORTANTES:
 * - PAYMENT_CREATED: Pagamento criado (informativo)
 * - PAYMENT_AWAITING_PAYMENT: PIX aguardando pagamento
 * - PAYMENT_RECEIVED: Pagamento recebido (PIX pago)
 * - PAYMENT_CONFIRMED: Pagamento confirmado (CRÍTICO - confirma reserva)
 * - PAYMENT_OVERDUE: Pagamento vencido
 * - PAYMENT_REFUNDED: Pagamento estornado
 *
 * LOGGING:
 * - Todas as requisições são registradas na tabela webhook_logs
 * - Logs incluem payload completo, status e tempo de processamento
 * - Use para debug: SELECT * FROM webhook_logs ORDER BY created_at DESC;
 *
 * SEGURANÇA:
 * - Validação de assinatura obrigatória
 * - Header: asaas-signature
 * - Secret configurado em ASAAS_WEBHOOK_SECRET
 * ============================================================================
 */

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // PASSO 1: Obter payload e assinatura
    const payload = await request.text();
    const signature = request.headers.get('asaas-signature') || '';

    logger.info('Webhook:Asaas', 'Requisição recebida', {
      requestId,
      hasPayload: !!payload,
      hasSignature: !!signature,
      payloadSize: payload.length
    });

    // LOG: Registrar que webhook foi recebido
    await WebhookLogger.logReceived(requestId, payload, signature);

    // PASSO 2: Validar assinatura (SEGURANÇA CRÍTICA)
    if (!asaasAPI.validateWebhook(payload, signature)) {
      logger.warn('Webhook:Asaas', 'Assinatura inválida', {
        requestId,
        signatureLength: signature.length
      });

      await WebhookLogger.logInvalidSignature(requestId, payload);

      return NextResponse.json(
        { erro: 'Assinatura inválida' },
        { status: 401 }
      );
    }

    // PASSO 3: Parse do payload
    const webhookData: WebhookPagamento = JSON.parse(payload);

    logger.info('Webhook:Asaas', 'Webhook válido', {
      requestId,
      event: webhookData.event,
      paymentId: webhookData.payment.id,
      status: webhookData.payment.status,
      value: webhookData.payment.value
    });

    // LOG: Atualizar status para processing
    await WebhookLogger.logProcessing(
      requestId,
      webhookData.event,
      webhookData.payment.id
    );

    // PASSO 4: Processar o evento
    await processarEventoWebhook(webhookData, requestId);

    // PASSO 5: Sucesso!
    const processingTime = Date.now() - startTime;
    await WebhookLogger.logSuccess(requestId, processingTime);

    logger.info('Webhook:Asaas', 'Processamento concluído', {
      requestId,
      event: webhookData.event,
      processingTimeMs: processingTime
    });

    return NextResponse.json({
      status: 'ok',
      requestId,
      processingTimeMs: processingTime
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;

    logger.error('Webhook:Asaas', 'Erro fatal no processamento', error, {
      requestId,
      processingTimeMs: processingTime,
      errorMessage: error.message,
      errorStack: error.stack
    });

    // LOG: Registrar erro
    await WebhookLogger.logError(requestId, error, processingTime);

    return NextResponse.json(
      {
        erro: 'Erro interno do servidor',
        requestId,
        message: error.message
      },
      { status: 500 }
    );
  }
}

async function processarEventoWebhook(webhookData: WebhookPagamento, requestId: string) {
  const { event, payment } = webhookData;

  try {
    logger.info('Webhook:Processor', `Processando evento ${event}`, {
      requestId,
      event,
      paymentId: payment.id
    });

    switch (event) {
      case EventoWebhook.PAGAMENTO_CRIADO:
        await processarPagamentoCriado(payment, requestId);
        break;

      case EventoWebhook.AGUARDANDO_PAGAMENTO:
        await processarAguardandoPagamento(payment, requestId);
        break;

      case EventoWebhook.PAGAMENTO_RECEBIDO:
        await processarPagamentoRecebido(payment, requestId);
        break;

      case EventoWebhook.PAGAMENTO_CONFIRMADO:
        await processarPagamentoConfirmado(payment, requestId);
        break;

      case EventoWebhook.PAGAMENTO_VENCIDO:
        await processarPagamentoVencido(payment, requestId);
        break;

      case EventoWebhook.PAGAMENTO_ESTORNADO:
        await processarPagamentoEstornado(payment, requestId);
        break;

      case EventoWebhook.PAGAMENTO_DELETADO:
        await processarPagamentoDeletado(payment, requestId);
        break;

      default:
        logger.warn('Webhook:Processor', `Evento não tratado: ${event}`, {
          requestId,
          event
        });
    }
  } catch (error) {
    logger.error('Webhook:Processor', `Erro ao processar evento ${event}`, error as Error, {
      requestId,
      event,
      paymentId: payment.id
    });
    throw error;
  }
}

async function processarPagamentoCriado(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  logger.info('Webhook:PaymentCreated', 'Pagamento criado', {
    requestId,
    paymentId: payment.id,
    value: payment.value
  });

  // Evento informativo - não requer ação
  // O pagamento já foi criado na API /api/pagamentos/processar
}

async function processarAguardandoPagamento(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  logger.info('Webhook:AwaitingPayment', 'Aguardando pagamento', {
    requestId,
    paymentId: payment.id,
    billingType: payment.billingType
  });

  // PIX: Cliente ainda não pagou
  // Atualizar status se necessário
  const supabase = await createClient();

  await supabase
    .from('pagamentos')
    .update({ status: 'pendente' })
    .eq('asaas_payment_id', payment.id);
}

async function processarPagamentoRecebido(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  logger.info('Webhook:PaymentReceived', 'Pagamento recebido', {
    requestId,
    paymentId: payment.id,
    value: payment.value
  });

  // Para PIX: pagamento foi recebido, aguardando confirmação final
  // Para outros métodos: similar ao PAYMENT_CONFIRMED

  // Aguardar PAYMENT_CONFIRMED para confirmar definitivamente
}

/**
 * ============================================================================
 * PROCESSAR PAYMENT_CONFIRMED - FUNÇÃO CRÍTICA
 * ============================================================================
 *
 * Esta é a função mais importante do webhook. Ela:
 * 1. Atualiza o status do pagamento para "confirmado"
 * 2. Confirma a reserva associada
 * 3. Envia notificações para o cliente
 * 4. Agenda lembretes automáticos
 *
 * FALLBACKS:
 * - Se não encontrar por asaas_payment_id, busca por externalReference (reserva_id)
 * - Se não encontrar pagamento, registra como "pagamento órfão" para reconciliação
 * - Notificações não bloqueiam o processamento (executam assincronamente)
 * ============================================================================
 */
async function processarPagamentoConfirmado(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  const supabase = await createClient();

  logger.info('Webhook:PaymentConfirmed', 'Iniciando processamento', {
    requestId,
    paymentId: payment.id,
    status: payment.status,
    value: payment.value,
    billingType: payment.billingType,
    externalReference: payment.externalReference
  });

  try {
    // ========================================================================
    // PASSO 1: Buscar pagamento no banco (com fallback)
    // ========================================================================

    let pagamentoExistente: any = null;

    // Tentativa 1: Buscar por asaas_payment_id (método primário)
    logger.info('Webhook:PaymentConfirmed', 'Buscando pagamento por asaas_payment_id', {
      requestId,
      asaasPaymentId: payment.id
    });

    const { data: pagamentoPorId, error: findError } = await supabase
      .from('pagamentos')
      .select('*, reserva:reservas(*)')
      .eq('asaas_payment_id', payment.id)
      .maybeSingle();

    if (findError) {
      logger.error('Webhook:PaymentConfirmed', 'Erro ao buscar pagamento', findError as Error, {
        requestId,
        paymentId: payment.id
      });
      throw findError;
    }

    if (pagamentoPorId) {
      logger.info('Webhook:PaymentConfirmed', 'Pagamento encontrado por asaas_payment_id', {
        requestId,
        pagamentoId: pagamentoPorId.id,
        status: pagamentoPorId.status
      });
      pagamentoExistente = pagamentoPorId;
    }

    // Tentativa 2: Buscar por reserva_id (fallback)
    if (!pagamentoExistente && payment.externalReference) {
      logger.warn('Webhook:PaymentConfirmed', 'Pagamento não encontrado por ID, tentando fallback por reserva_id', {
        requestId,
        asaasPaymentId: payment.id,
        reservaId: payment.externalReference
      });

      const { data: pagamentoPorReferencia } = await supabase
        .from('pagamentos')
        .select('*, reserva:reservas(*)')
        .eq('reserva_id', payment.externalReference)
        .in('status', ['pendente', 'processando'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pagamentoPorReferencia) {
        logger.info('Webhook:PaymentConfirmed', 'Pagamento encontrado por reserva_id (fallback)', {
          requestId,
          pagamentoId: pagamentoPorReferencia.id,
          reservaId: payment.externalReference,
          statusAtual: pagamentoPorReferencia.status
        });

        // Atualizar com o asaas_payment_id correto
        await supabase
          .from('pagamentos')
          .update({ asaas_payment_id: payment.id })
          .eq('id', pagamentoPorReferencia.id);

        logger.info('Webhook:PaymentConfirmed', 'asaas_payment_id atualizado via fallback', {
          requestId,
          pagamentoId: pagamentoPorReferencia.id,
          asaasPaymentId: payment.id
        });

        pagamentoExistente = pagamentoPorReferencia;
      }
    }

    // Pagamento não encontrado - CRÍTICO!
    if (!pagamentoExistente) {
      logger.error(
        'Webhook:PaymentConfirmed',
        'Pagamento órfão detectado - não existe no banco',
        new Error('Payment not found in database'),
        {
          requestId,
          asaasPaymentId: payment.id,
          externalReference: payment.externalReference,
          value: payment.value,
          billingType: payment.billingType,
          sugestao: 'Verificar se pagamento foi criado corretamente. Pode precisar de reconciliação manual.'
        }
      );

      // Não falhar o webhook - apenas registrar o problema
      return;
    }

    // ========================================================================
    // PASSO 2: Atualizar status do pagamento
    // ========================================================================

    logger.info('Webhook:PaymentConfirmed', 'Atualizando status do pagamento', {
      requestId,
      pagamentoId: pagamentoExistente.id,
      statusAnterior: pagamentoExistente.status,
      statusNovo: 'confirmado'
    });

    const { data: pagamentoAtualizado, error: updateError } = await supabase
      .from('pagamentos')
      .update({
        status: 'confirmado',
        paid_at: payment.paymentDate || new Date().toISOString(),
        metadata: {
          ...(pagamentoExistente.metadata || {}),
          asaas_confirmed_at: payment.confirmedDate,
          asaas_net_value: payment.netValue,
          asaas_billing_type: payment.billingType,
          webhook_received_at: new Date().toISOString(),
          webhook_request_id: requestId
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', pagamentoExistente.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Webhook:PaymentConfirmed', 'Erro ao atualizar pagamento', updateError as Error, {
        requestId,
        pagamentoId: pagamentoExistente.id
      });
      throw updateError;
    }

    logger.info('Webhook:PaymentConfirmed', 'Pagamento atualizado com sucesso', {
      requestId,
      pagamentoId: pagamentoAtualizado.id,
      status: 'confirmado'
    });

    // ========================================================================
    // PASSO 3: Confirmar reserva
    // ========================================================================

    if (pagamentoExistente.reserva_id) {
      logger.info('Webhook:PaymentConfirmed', 'Confirmando reserva', {
        requestId,
        reservaId: pagamentoExistente.reserva_id
      });

      const { data: reservaAtualizada, error: reservaError } = await supabase
        .from('reservas')
        .update({
          status: 'confirmada',
          updated_at: new Date().toISOString()
        })
        .eq('id', pagamentoExistente.reserva_id)
        .select()
        .single();

      if (reservaError) {
        logger.error('Webhook:PaymentConfirmed', 'Erro ao confirmar reserva', reservaError as Error, {
          requestId,
          reservaId: pagamentoExistente.reserva_id
        });
        // Não falhar o webhook - pagamento já foi atualizado
      } else {
        logger.info('Webhook:PaymentConfirmed', 'Reserva confirmada com sucesso', {
          requestId,
          reservaId: reservaAtualizada.id,
          status: 'confirmada'
        });
      }
    }

    // ========================================================================
    // PASSO 4: Enviar notificações (assíncrono - não bloqueia)
    // ========================================================================

    // Executar notificações em background
    setImmediate(async () => {
      try {
        await enviarNotificacoesPagamentoConfirmado(
          pagamentoExistente,
          payment,
          requestId
        );
      } catch (notifError) {
        logger.error(
          'Webhook:PaymentConfirmed',
          'Erro ao enviar notificações (não crítico)',
          notifError as Error,
          { requestId, pagamentoId: pagamentoExistente.id }
        );
      }
    });

    logger.info('Webhook:PaymentConfirmed', 'Processamento concluído com sucesso', {
      requestId,
      pagamentoId: pagamentoAtualizado.id,
      reservaId: pagamentoExistente.reserva_id
    });

  } catch (error) {
    logger.error(
      'Webhook:PaymentConfirmed',
      'Erro fatal ao processar PAYMENT_CONFIRMED',
      error as Error,
      {
        requestId,
        paymentId: payment.id,
        externalReference: payment.externalReference
      }
    );
    throw error;
  }
}

/**
 * Envia notificações de pagamento confirmado (executa em background)
 */
async function enviarNotificacoesPagamentoConfirmado(
  pagamento: any,
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  const supabase = await createClient();

  if (!pagamento.reserva_id) {
    logger.info('Webhook:Notificacoes', 'Pagamento sem reserva associada, pulando notificações', {
      requestId,
      pagamentoId: pagamento.id
    });
    return;
  }

  try {
    // Buscar dados do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('nome_completo, whatsapp')
      .eq('id', pagamento.user_id)
      .single();

    // Buscar dados da reserva e quadra
    const { data: reservaData } = await supabase
      .from('reservas')
      .select('*, quadra:quadras(nome), horario:horarios(hora_inicio, hora_fim)')
      .eq('id', pagamento.reserva_id)
      .single();

    if (!userData?.whatsapp) {
      logger.warn('Webhook:Notificacoes', 'Usuário sem WhatsApp cadastrado', {
        requestId,
        userId: pagamento.user_id
      });
      return;
    }

    // Enviar notificação de pagamento confirmado
    await whatsappService.notificarPagamentoRecebido(
      userData.whatsapp,
      {
        id: payment.id,
        valor: payment.value,
        metodo: payment.billingType === 'PIX' ? 'PIX' :
               payment.billingType === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Boleto',
        referencia: `Reserva ${pagamento.reserva_id}`
      }
    );

    logger.info('Webhook:Notificacoes', 'Notificação de pagamento enviada', {
      requestId,
      telefone: userData.whatsapp.substring(0, 5) + '***'
    });

    // Agendar lembretes automáticos
    if (reservaData) {
      await notificacaoService.agendarLembretesReserva(
        pagamento.reserva_id,
        {
          telefone: userData.whatsapp,
          quadra: (reservaData as any).quadra?.nome || '',
          data: new Date((reservaData as any).data),
          horario: `${(reservaData as any).horario?.hora_inicio} - ${(reservaData as any).horario?.hora_fim}`,
          participantes: [userData.nome_completo || 'Cliente']
        }
      );

      logger.info('Webhook:Notificacoes', 'Lembretes agendados', {
        requestId,
        reservaId: pagamento.reserva_id
      });
    }

  } catch (error) {
    logger.error(
      'Webhook:Notificacoes',
      'Erro ao enviar notificações',
      error as Error,
      { requestId, pagamentoId: pagamento.id }
    );
    // Não propagar erro - notificações são best-effort
  }
}

async function processarPagamentoVencido(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  logger.info('Webhook:PaymentOverdue', 'Pagamento vencido', {
    requestId,
    paymentId: payment.id
  });
  
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

async function processarPagamentoEstornado(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  logger.info('Webhook:PaymentRefunded', 'Pagamento estornado', {
    requestId,
    paymentId: payment.id
  });
  
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

async function processarPagamentoDeletado(
  payment: WebhookPagamento['payment'],
  requestId: string
) {
  logger.info('Webhook:PaymentDeleted', 'Pagamento deletado', {
    requestId,
    paymentId: payment.id
  });
  
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