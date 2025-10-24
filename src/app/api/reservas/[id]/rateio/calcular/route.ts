import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent, AuditAction } from '@/lib/audit/audit-logger';

interface ParticipanteCalculo {
  id: string;
  nome: string;
  email?: string;
  valor?: number;
  percentual?: number;
}

type TipoRateio = 'igual' | 'personalizado' | 'percentual';

/**
 * POST /api/reservas/[id]/rateio/calcular
 * Calcula rateio de valores SERVER-SIDE (segurança crítica)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15: params is now async
    const { id } = await params;

    // Autenticação obrigatória
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { valorTotal, participantes, tipoRateio } = await request.json();

    // Validação de entrada
    if (!valorTotal || valorTotal <= 0) {
      return NextResponse.json(
        { error: 'Valor total inválido' },
        { status: 400 }
      );
    }

    if (!participantes || !Array.isArray(participantes) || participantes.length === 0) {
      return NextResponse.json(
        { error: 'Participantes inválidos' },
        { status: 400 }
      );
    }

    if (!['igual', 'personalizado', 'percentual'].includes(tipoRateio)) {
      return NextResponse.json(
        { error: 'Tipo de rateio inválido' },
        { status: 400 }
      );
    }

    // Verificar se usuário tem acesso à reserva
    const { data: reserva } = await supabase
      .from('reservas')
      .select('user_id, organizador_turma_id')
      .eq('id', id)
      .single();

    if (!reserva) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    const isOrganizador = reserva.user_id === user.id;
    const isMembro = participantes.some((p: ParticipanteCalculo) => p.email === user.email);

    if (!isOrganizador && !isMembro) {
      return NextResponse.json(
        { error: 'Sem permissão para calcular rateio desta reserva' },
        { status: 403 }
      );
    }

    // ============================================================
    // CÁLCULO SERVER-SIDE - NÃO CONFIAR NO CLIENTE
    // ============================================================

    let participantesCalculados: ParticipanteCalculo[] = [];

    if (tipoRateio === 'igual') {
      const valorPorPessoa = valorTotal / participantes.length;
      const percentualPorPessoa = 100 / participantes.length;

      participantesCalculados = participantes.map((p: ParticipanteCalculo) => ({
        id: p.id,
        nome: p.nome,
        email: p.email,
        valor: Math.round(valorPorPessoa * 100) / 100, // 2 casas decimais
        percentual: Math.round(percentualPorPessoa * 100) / 100
      }));
    } else if (tipoRateio === 'personalizado') {
      participantesCalculados = participantes.map((p: ParticipanteCalculo) => {
        const valor = p.valor || 0;
        return {
          id: p.id,
          nome: p.nome,
          email: p.email,
          valor: Math.round(valor * 100) / 100,
          percentual: Math.round((valor / valorTotal) * 100 * 100) / 100
        };
      });
    } else if (tipoRateio === 'percentual') {
      participantesCalculados = participantes.map((p: ParticipanteCalculo) => {
        const percentual = p.percentual || 0;
        const valor = (valorTotal * percentual) / 100;
        return {
          id: p.id,
          nome: p.nome,
          email: p.email,
          valor: Math.round(valor * 100) / 100,
          percentual: Math.round(percentual * 100) / 100
        };
      });
    }

    // ============================================================
    // VALIDAÇÃO CRÍTICA: Soma deve bater com valor total
    // ============================================================

    const somaValores = participantesCalculados.reduce((sum, p) => sum + (p.valor || 0), 0);
    const somaPercentuais = participantesCalculados.reduce((sum, p) => sum + (p.percentual || 0), 0);

    // Tolerância de 0.01 para arredondamento
    if (Math.abs(somaValores - valorTotal) > 0.01) {
      return NextResponse.json(
        {
          error: 'Soma dos valores não corresponde ao total',
          detalhes: {
            somaCalculada: somaValores,
            valorEsperado: valorTotal,
            diferenca: Math.abs(somaValores - valorTotal)
          }
        },
        { status: 400 }
      );
    }

    if (Math.abs(somaPercentuais - 100) > 0.1) {
      return NextResponse.json(
        {
          error: 'Soma dos percentuais deve ser 100%',
          detalhes: {
            somaCalculada: somaPercentuais,
            esperado: 100,
            diferenca: Math.abs(somaPercentuais - 100)
          }
        },
        { status: 400 }
      );
    }

    // Log de auditoria
    logAuditEvent(AuditAction.RESERVATION_MODIFIED, user.id, {
      targetId: id,
      targetType: 'reserva',
      metadata: {
        acao: 'calculo_rateio',
        tipoRateio,
        valorTotal,
        numeroParticipantes: participantes.length
      }
    });

    return NextResponse.json({
      success: true,
      participantes: participantesCalculados,
      validacao: {
        somaValores: Math.round(somaValores * 100) / 100,
        somaPercentuais: Math.round(somaPercentuais * 100) / 100,
        valorTotal
      }
    });

  } catch (error) {
    console.error('[API] Erro ao calcular rateio:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular rateio' },
      { status: 500 }
    );
  }
}
