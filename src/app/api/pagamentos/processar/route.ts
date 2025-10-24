import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent, AuditAction } from '@/lib/audit/audit-logger';
import { logSecurityEvent, SecurityEventType, SecurityLevel } from '@/lib/security/security-logger';

interface DadosPagamento {
  reservaId: string;
  valor: number;
  metodo: 'pix' | 'cartao' | 'saldo';
  dadosCartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
}

/**
 * POST /api/pagamentos/processar
 * Processa pagamento REAL - NUNCA simular no cliente
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticação obrigatória
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.CRITICAL,
        {
          reason: 'Tentativa de pagamento sem autenticação',
          path: '/api/pagamentos/processar'
        }
      );

      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const dados: DadosPagamento = await request.json();

    // Validação rigorosa de entrada
    if (!dados.reservaId || !dados.valor || dados.valor <= 0) {
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.ERROR,
        {
          userId: user.id,
          reason: 'Dados de pagamento inválidos',
          dados: { reservaId: dados.reservaId, valor: dados.valor }
        }
      );

      return NextResponse.json(
        { error: 'Dados de pagamento inválidos' },
        { status: 400 }
      );
    }

    if (!['pix', 'cartao', 'saldo'].includes(dados.metodo)) {
      return NextResponse.json(
        { error: 'Método de pagamento inválido' },
        { status: 400 }
      );
    }

    // Verificar se reserva existe e pertence ao usuário
    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select('*, quadras!inner(nome)')
      .eq('id', dados.reservaId)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se usuário tem permissão
    const { data: participante } = await supabase
      .from('reserva_participantes')
      .select('*')
      .eq('reserva_id', dados.reservaId)
      .eq('user_id', user.id)
      .single();

    if (reserva.user_id !== user.id && !participante) {
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.CRITICAL,
        {
          userId: user.id,
          reason: 'Tentativa de pagar reserva de outro usuário',
          reservaId: dados.reservaId
        }
      );

      return NextResponse.json(
        { error: 'Sem permissão para pagar esta reserva' },
        { status: 403 }
      );
    }

    // Validar valor com banco de dados
    const valorEsperado = reserva.valor_total || 0;
    if (Math.abs(dados.valor - valorEsperado) > 0.01) {
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.CRITICAL,
        {
          userId: user.id,
          reason: 'Valor de pagamento não corresponde ao esperado',
          valorRecebido: dados.valor,
          valorEsperado,
          diferenca: Math.abs(dados.valor - valorEsperado)
        }
      );

      return NextResponse.json(
        {
          error: 'Valor de pagamento não corresponde ao total da reserva',
          valorEsperado
        },
        { status: 400 }
      );
    }

    // ============================================================
    // PROCESSAR PAGAMENTO REAL
    // ============================================================

    let statusPagamento: 'aprovado' | 'pendente' | 'recusado' = 'pendente';
    let transactionId = '';
    let metodoPagamentoTexto = '';

    if (dados.metodo === 'saldo') {
      // Verificar saldo do usuário
      const { data: profile } = await supabase
        .from('users')
        .select('saldo_creditos')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.saldo_creditos || 0) < dados.valor) {
        return NextResponse.json(
          { error: 'Saldo insuficiente' },
          { status: 400 }
        );
      }

      // Debitar saldo
      const { error: debitError } = await supabase
        .from('users')
        .update({
          saldo_creditos: (profile.saldo_creditos || 0) - dados.valor
        })
        .eq('id', user.id);

      if (debitError) {
        throw new Error('Erro ao debitar saldo');
      }

      statusPagamento = 'aprovado';
      transactionId = `SALDO-${Date.now()}`;
      metodoPagamentoTexto = 'Saldo em Conta';

    } else if (dados.metodo === 'pix') {
      // TODO: Integrar com gateway de pagamento (Asaas)
      // Por enquanto, criar pagamento pendente
      statusPagamento = 'pendente';
      transactionId = `PIX-${Date.now()}`;
      metodoPagamentoTexto = 'PIX';

    } else if (dados.metodo === 'cartao') {
      // TODO: Integrar com gateway de pagamento (Asaas)
      // NUNCA processar cartão no servidor próprio
      // SEMPRE usar gateway certificado PCI-DSS

      if (!dados.dadosCartao) {
        return NextResponse.json(
          { error: 'Dados do cartão não fornecidos' },
          { status: 400 }
        );
      }

      statusPagamento = 'pendente';
      transactionId = `CARD-${Date.now()}`;
      metodoPagamentoTexto = 'Cartão de Crédito';
    }

    // Registrar pagamento no banco
    const { data: pagamento, error: pagamentoError } = await supabase
      .from('pagamentos')
      .insert({
        user_id: user.id,
        reserva_id: dados.reservaId,
        valor: dados.valor,
        metodo_pagamento: dados.metodo,
        status: statusPagamento,
        transaction_id: transactionId
      })
      .select()
      .single();

    if (pagamentoError) {
      throw new Error('Erro ao registrar pagamento');
    }

    // Atualizar status da reserva se aprovado
    if (statusPagamento === 'aprovado') {
      await supabase
        .from('reservas')
        .update({ status: 'confirmada' })
        .eq('id', dados.reservaId);
    }

    // Log de auditoria
    logAuditEvent(AuditAction.PAYMENT_CREATED, user.id, {
      targetId: pagamento.id,
      targetType: 'pagamento',
      metadata: {
        reservaId: dados.reservaId,
        valor: dados.valor,
        metodo: dados.metodo,
        status: statusPagamento
      }
    });

    if (statusPagamento === 'aprovado') {
      logAuditEvent(AuditAction.PAYMENT_COMPLETED, user.id, {
        targetId: pagamento.id,
        targetType: 'pagamento'
      });
    }

    // Gerar comprovante
    const comprovante = {
      id: transactionId,
      tipo: 'reserva',
      status: statusPagamento,
      valor: dados.valor,
      metodoPagamento: metodoPagamentoTexto,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      detalhes: {
        quadra: reserva.quadras?.nome,
        dataReserva: reserva.data_reserva,
        horario: `${reserva.horario_inicio} - ${reserva.horario_fim}`
      }
    };

    return NextResponse.json({
      success: true,
      pagamentoId: pagamento.id,
      status: statusPagamento,
      comprovante
    });

  } catch (error) {
    console.error('[API] Erro ao processar pagamento:', error);

    logSecurityEvent(
      SecurityEventType.PAYMENT_FAILED,
      SecurityLevel.ERROR,
      {
        error: error instanceof Error ? error.message : 'Unknown',
        path: '/api/pagamentos/processar'
      }
    );

    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
