import { createClient } from '@/lib/supabase/client';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, startOfDay, endOfDay, subDays } from 'date-fns';

const supabase = createClient();

// ============================================================
// TYPES
// ============================================================

export interface ResumoFinanceiro {
  receitaTotal: number;
  receitaMes: number;
  despesasMes: number;
  lucroMes: number;
  crescimentoMes: number;
  clientesAtivos: number;
  ticketMedio: number;
  receitaMesAnterior: number;
}

export interface TransacaoFinanceira {
  id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  metodo: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  origem: 'reserva' | 'credito' | 'mensalista';
}

export interface MetodoPagamento {
  metodo: string;
  valor: number;
  percentual: number;
}

export interface FiltrosTransacoes {
  periodo?: 'mes-atual' | 'mes-anterior' | 'trimestre' | 'ano' | 'custom';
  data_inicio?: string;
  data_fim?: string;
  tipo?: 'receita' | 'despesa' | 'todos';
  busca?: string;
}

// ============================================================
// HELPERS
// ============================================================

function getPeriodoDatas(periodo: string) {
  const hoje = new Date();

  switch (periodo) {
    case 'mes-atual':
      return {
        inicio: startOfMonth(hoje),
        fim: endOfMonth(hoje),
      };
    case 'mes-anterior':
      const mesPassado = subMonths(hoje, 1);
      return {
        inicio: startOfMonth(mesPassado),
        fim: endOfMonth(mesPassado),
      };
    case 'trimestre':
      const tresMesesAtras = subMonths(hoje, 3);
      return {
        inicio: startOfDay(tresMesesAtras),
        fim: endOfDay(hoje),
      };
    case 'ano':
      return {
        inicio: startOfYear(hoje),
        fim: endOfYear(hoje),
      };
    default:
      return {
        inicio: startOfMonth(hoje),
        fim: endOfMonth(hoje),
      };
  }
}

// ============================================================
// SERVICE
// ============================================================

export const financeiroService = {
  /**
   * Buscar resumo financeiro com estatísticas gerais
   */
  async getResumoFinanceiro(): Promise<ResumoFinanceiro> {
    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);
    const inicioMesAnterior = startOfMonth(subMonths(hoje, 1));
    const fimMesAnterior = endOfMonth(subMonths(hoje, 1));

    // Buscar todas as reservas confirmadas
    const { data: reservasTotal, error: reservasTotalError } = await supabase
      .from('reservas')
      .select('valor_total, data')
      .eq('status', 'confirmada');

    if (reservasTotalError) throw reservasTotalError;

    // Buscar reservas do mês atual
    const { data: reservasMes, error: reservasMesError } = await supabase
      .from('reservas')
      .select('valor_total, organizador_id')
      .eq('status', 'confirmada')
      .gte('data', inicioMes.toISOString())
      .lte('data', fimMes.toISOString());

    if (reservasMesError) throw reservasMesError;

    // Buscar reservas do mês anterior
    const { data: reservasMesAnterior, error: reservasMesAnteriorError } = await supabase
      .from('reservas')
      .select('valor_total')
      .eq('status', 'confirmada')
      .gte('data', inicioMesAnterior.toISOString())
      .lte('data', fimMesAnterior.toISOString());

    if (reservasMesAnteriorError) throw reservasMesAnteriorError;

    // Buscar transações de crédito do mês (adições = receita, uso = despesa)
    const { data: transacoesMes, error: transacoesMesError } = await supabase
      .from('transacoes_credito')
      .select('tipo, valor')
      .gte('created_at', inicioMes.toISOString())
      .lte('created_at', fimMes.toISOString());

    if (transacoesMesError) throw transacoesMesError;

    // Calcular receita total
    const receitaTotal = (reservasTotal || []).reduce((acc, r) => acc + (r.valor_total || 0), 0);

    // Calcular receita do mês
    const receitaMes = (reservasMes || []).reduce((acc, r) => acc + (r.valor_total || 0), 0);

    // Adicionar receita de créditos comprados no mês
    const receitaCreditosMes = (transacoesMes || [])
      .filter(t => t.tipo === 'adicao')
      .reduce((acc, t) => acc + (t.valor || 0), 0);

    const receitaMesTotal = receitaMes + receitaCreditosMes;

    // Calcular receita do mês anterior
    const receitaMesAnterior = (reservasMesAnterior || []).reduce((acc, r) => acc + (r.valor_total || 0), 0);

    // Calcular despesas do mês (uso de créditos não é despesa real, então vamos usar 0 por enquanto)
    const despesasMes = 0; // TODO: implementar tabela de despesas se necessário

    // Calcular lucro
    const lucroMes = receitaMesTotal - despesasMes;

    // Calcular crescimento
    const crescimentoMes = receitaMesAnterior > 0
      ? ((receitaMesTotal - receitaMesAnterior) / receitaMesAnterior) * 100
      : 0;

    // Clientes ativos (organizadores únicos do mês)
    const clientesAtivos = new Set((reservasMes || []).map(r => r.organizador_id)).size;

    // Ticket médio
    const totalReservasMes = (reservasMes || []).length;
    const ticketMedio = totalReservasMes > 0 ? receitaMes / totalReservasMes : 0;

    return {
      receitaTotal,
      receitaMes: receitaMesTotal,
      despesasMes,
      lucroMes,
      crescimentoMes,
      clientesAtivos,
      ticketMedio,
      receitaMesAnterior,
    };
  },

  /**
   * Buscar transações financeiras com filtros
   */
  async getTransacoesFinanceiras(filtros: FiltrosTransacoes = {}): Promise<TransacaoFinanceira[]> {
    const periodo = getPeriodoDatas(filtros.periodo || 'mes-atual');
    const dataInicio = filtros.data_inicio ? new Date(filtros.data_inicio) : periodo.inicio;
    const dataFim = filtros.data_fim ? new Date(filtros.data_fim) : periodo.fim;

    // Buscar reservas do período
    let queryReservas = supabase
      .from('reservas')
      .select(`
        id,
        data,
        valor_total,
        status,
        quadra:quadras(nome),
        organizador:users!reservas_organizador_id_fkey(nome_completo)
      `)
      .eq('status', 'confirmada')
      .gte('data', dataInicio.toISOString())
      .lte('data', dataFim.toISOString())
      .order('data', { ascending: false });

    const { data: reservas, error: reservasError } = await queryReservas;
    if (reservasError) throw reservasError;

    // Buscar transações de crédito do período
    let queryTransacoes = supabase
      .from('transacoes_credito')
      .select(`
        id,
        created_at,
        tipo,
        valor,
        descricao,
        user_id,
        users!transacoes_credito_user_id_fkey(nome_completo)
      `)
      .gte('created_at', dataInicio.toISOString())
      .lte('created_at', dataFim.toISOString())
      .order('created_at', { ascending: false });

    const { data: transacoes, error: transacoesError } = await queryTransacoes;
    if (transacoesError) throw transacoesError;

    // Converter reservas em transações
    const transacoesReservas: TransacaoFinanceira[] = (reservas || []).map(r => ({
      id: r.id,
      data: r.data,
      tipo: 'receita' as const,
      descricao: `Reserva - ${(r.quadra as any)?.[0]?.nome || 'Quadra'} - ${(r.organizador as any)?.[0]?.nome_completo || 'Cliente'}`,
      valor: r.valor_total || 0,
      metodo: 'pix', // TODO: buscar método real quando implementado
      status: 'confirmado' as const,
      origem: 'reserva' as const,
    }));

    // Converter transações de crédito
    const transacoesCredito: TransacaoFinanceira[] = (transacoes || []).map(t => ({
      id: t.id,
      data: t.created_at,
      tipo: t.tipo === 'adicao' ? 'receita' as const : 'despesa' as const,
      descricao: t.descricao || `${t.tipo === 'adicao' ? 'Compra' : 'Uso'} de Créditos - ${(t.users as any)?.[0]?.nome_completo || 'Cliente'}`,
      valor: t.valor || 0,
      metodo: 'creditos',
      status: 'confirmado' as const,
      origem: 'credito' as const,
    }));

    // Combinar e ordenar
    let todasTransacoes = [...transacoesReservas, ...transacoesCredito].sort((a, b) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });

    // Aplicar filtros
    if (filtros.tipo && filtros.tipo !== 'todos') {
      todasTransacoes = todasTransacoes.filter(t => t.tipo === filtros.tipo);
    }

    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      todasTransacoes = todasTransacoes.filter(t =>
        t.descricao.toLowerCase().includes(busca)
      );
    }

    return todasTransacoes;
  },

  /**
   * Buscar distribuição por método de pagamento
   */
  async getMetodosPagamento(): Promise<MetodoPagamento[]> {
    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    // Buscar reservas do mês
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('valor_total')
      .eq('status', 'confirmada')
      .gte('data', inicioMes.toISOString())
      .lte('data', fimMes.toISOString());

    if (reservasError) throw reservasError;

    // Buscar transações de crédito do mês
    const { data: transacoes, error: transacoesError } = await supabase
      .from('transacoes_credito')
      .select('tipo, valor')
      .eq('tipo', 'adicao')
      .gte('created_at', inicioMes.toISOString())
      .lte('created_at', fimMes.toISOString());

    if (transacoesError) throw transacoesError;

    // Calcular totais (por enquanto, assumindo que reservas são PIX e transações são créditos)
    // TODO: implementar método de pagamento real nas reservas
    const totalReservas = (reservas || []).reduce((acc, r) => acc + (r.valor_total || 0), 0);
    const totalCreditos = (transacoes || []).reduce((acc, t) => acc + (t.valor || 0), 0);
    const totalGeral = totalReservas + totalCreditos;

    if (totalGeral === 0) {
      return [
        { metodo: 'PIX', valor: 0, percentual: 0 },
        { metodo: 'Créditos', valor: 0, percentual: 0 },
      ];
    }

    // Por enquanto, dividir reservas em 70% PIX e 30% outros métodos
    const pixValor = totalReservas * 0.7;
    const cartaoValor = totalReservas * 0.3;

    return [
      {
        metodo: 'PIX',
        valor: pixValor,
        percentual: Math.round((pixValor / totalGeral) * 100),
      },
      {
        metodo: 'Cartão',
        valor: cartaoValor,
        percentual: Math.round((cartaoValor / totalGeral) * 100),
      },
      {
        metodo: 'Créditos',
        valor: totalCreditos,
        percentual: Math.round((totalCreditos / totalGeral) * 100),
      },
    ].filter(m => m.valor > 0);
  },
};
