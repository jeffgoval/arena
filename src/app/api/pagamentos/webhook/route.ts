import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verificar se a requisição tem o header de assinatura
    const signature = request.headers.get('asaas-access-token') || 
                     request.headers.get('asaas-signature') ||
                     request.headers.get('x-asass-signature');
    
    // Verificar se o secret está configurado
    const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('ASAAS_WEBHOOK_SECRET não configurado');
      return NextResponse.json(
        { error: 'Webhook não configurado corretamente' },
        { status: 500 }
      );
    }

    // Verificar assinatura (se fornecida)
    if (signature) {
      const payload = await request.text();
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Assinatura inválida' },
          { status: 401 }
        );
      }
    }

    // Parse do payload
    const payload = await request.json();
    
    console.log('Webhook Asaas recebido:', JSON.stringify(payload, null, 2));

    // Processar diferentes tipos de eventos
    switch (payload.event) {
      case 'PAYMENT_RECEIVED':
        await handlePaymentReceived(supabase, payload);
        break;
        
      case 'PAYMENT_CONFIRMED':
        await handlePaymentConfirmed(supabase, payload);
        break;
        
      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(supabase, payload);
        break;
        
      case 'PAYMENT_DELETED':
        await handlePaymentDeleted(supabase, payload);
        break;
        
      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(supabase, payload);
        break;
        
      case 'PAYMENT_CHARGEBACK_REQUESTED':
        await handlePaymentChargeback(supabase, payload);
        break;
        
      default:
        console.log(`Evento não tratado: ${payload.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook Asaas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Handler para pagamento recebido
async function handlePaymentReceived(supabase: any, payload: any) {
  const paymentId = payload.payment.id;
  const status = payload.payment.status;
  const value = payload.payment.value;
  
  console.log(`Pagamento ${paymentId} recebido no valor de R$ ${value}`);
  
  // Atualizar status do pagamento no banco
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'received',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', paymentId);
    
  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
    return;
  }
  
  // Atualizar status do participante/reserva se for o caso
  const { data: payment } = await supabase
    .from('payments')
    .select('reservation_id, invitation_id, user_id')
    .eq('transaction_id', paymentId)
    .single();
    
  if (payment) {
    if (payment.reservation_id) {
      // Atualizar status do participante
      await supabase
        .from('reserva_participantes')
        .update({
          payment_status: 'paid',
          amount_paid: value,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', payment.id);
    }
    
    if (payment.invitation_id) {
      // Atualizar status do aceite de convite
      await supabase
        .from('aceites_convite')
        .update({
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', payment.id);
    }
  }
}

// Handler para pagamento confirmado
async function handlePaymentConfirmed(supabase: any, payload: any) {
  const paymentId = payload.payment.id;
  
  console.log(`Pagamento ${paymentId} confirmado`);
  
  // Atualizar status do pagamento no banco
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', paymentId);
    
  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
  }
}

// Handler para pagamento vencido
async function handlePaymentOverdue(supabase: any, payload: any) {
  const paymentId = payload.payment.id;
  
  console.log(`Pagamento ${paymentId} vencido`);
  
  // Atualizar status do pagamento no banco
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'overdue',
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', paymentId);
    
  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
  }
}

// Handler para pagamento deletado
async function handlePaymentDeleted(supabase: any, payload: any) {
  const paymentId = payload.payment.id;
  
  console.log(`Pagamento ${paymentId} deletado`);
  
  // Atualizar status do pagamento no banco
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'deleted',
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', paymentId);
    
  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
  }
}

// Handler para pagamento estornado
async function handlePaymentRefunded(supabase: any, payload: any) {
  const paymentId = payload.payment.id;
  const refundValue = payload.payment.refundValue;
  
  console.log(`Pagamento ${paymentId} estornado no valor de R$ ${refundValue}`);
  
  // Atualizar status do pagamento no banco
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'refunded',
      refunded_at: new Date().toISOString(),
      refund_value: refundValue,
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', paymentId);
    
  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
  }
}

// Handler para chargeback
async function handlePaymentChargeback(supabase: any, payload: any) {
  const paymentId = payload.payment.id;
  
  console.log(`Chargeback solicitado para pagamento ${paymentId}`);
  
  // Atualizar status do pagamento no banco
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'chargeback',
      chargeback_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', paymentId);
    
  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
  }
}