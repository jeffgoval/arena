import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Usar créditos para pagamento de reserva
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { usuarioId, valor, reservaId, descricao } = body;

    // Validações
    if (!usuarioId || !valor || !reservaId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: usuarioId, valor, reservaId' },
        { status: 400 }
      );
    }

    if (valor <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser positivo' },
        { status: 400 }
      );
    }

    // Verificar saldo disponível
    const { data: creditosAtivos, error: saldoError } = await supabase
      .from('creditos')
      .select('id, valor, data_expiracao')
      .eq('usuario_id', usuarioId)
      .eq('status', 'ativo')
      .gt('valor', 0)
      .or('data_expiracao.is.null,data_expiracao.gt.' + new Date().toISOString())
      .order('data_expiracao', { ascending: true, nullsLast: true });

    if (saldoError) {
      console.error('Erro ao verificar saldo:', saldoError);
      return NextResponse.json(
        { error: 'Erro ao verificar saldo' },
        { status: 500 }
      );
    }

    const saldoTotal = creditosAtivos?.reduce((sum, c) => sum + c.valor, 0) || 0;

    if (saldoTotal < valor) {
      return NextResponse.json(
        { 
          error: 'Saldo insuficiente',
          saldoDisponivel: saldoTotal,
          valorSolicitado: valor
        },
        { status: 400 }
      );
    }

    // Usar créditos (FIFO - primeiro a expirar, primeiro a ser usado)
    let valorRestante = valor;
    const creditosUsados = [];

    for (const credito of creditosAtivos || []) {
      if (valorRestante <= 0) break;

      const valorUsar = Math.min(credito.valor, valorRestante);
      
      // Marcar crédito como usado (parcial ou total)
      if (valorUsar === credito.valor) {
        // Usar todo o crédito
        await supabase
          .from('creditos')
          .update({ status: 'usado' })
          .eq('id', credito.id);
      } else {
        // Usar parcialmente - reduzir valor do crédito original
        await supabase
          .from('creditos')
          .update({ valor: credito.valor - valorUsar })
          .eq('id', credito.id);
      }

      creditosUsados.push({
        creditoId: credito.id,
        valorUsado: valorUsar
      });

      valorRestante -= valorUsar;
    }

    // Criar registro de uso
    const { data: usoCredito, error: usoError } = await supabase
      .from('creditos')
      .insert({
        usuario_id: usuarioId,
        tipo: 'uso',
        valor: -valor,
        descricao: descricao || `Usado na reserva #${reservaId}`,
        status: 'usado',
        reserva_id: reservaId
      })
      .select()
      .single();

    if (usoError) {
      console.error('Erro ao registrar uso de créditos:', usoError);
      return NextResponse.json(
        { error: 'Erro ao processar uso de créditos' },
        { status: 500 }
      );
    }

    // Atualizar status da reserva se necessário
    await supabase
      .from('reservas')
      .update({ 
        creditos_utilizados: valor,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservaId);

    return NextResponse.json({
      success: true,
      usoCredito,
      creditosUsados,
      valorUtilizado: valor,
      message: 'Créditos utilizados com sucesso'
    });

  } catch (error) {
    console.error('Erro ao usar créditos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}