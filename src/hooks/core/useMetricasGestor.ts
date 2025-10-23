import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface MetricasDashboard {
  faturamentoMes: number;
  faturamentoMesAnterior: number;
  totalReservasMes: number;
  totalReservasMesAnterior: number;
  taxaOcupacao: number;
  clientesAtivos: number;
  clientesNovos: number;
  reservasHoje: number;
  reservasPendentes: number;
  mediaPorReserva: number;
}

/**
 * Hook para buscar métricas do dashboard do gestor
 */
export function useMetricasGestor() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['metricas-gestor'],
    queryFn: async () => {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

      // Formatar datas
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const hojeStr = formatDate(hoje);
      const inicioMes = formatDate(primeiroDiaMes);
      const fimMes = formatDate(ultimoDiaMes);
      const inicioMesAnterior = formatDate(primeiroDiaMesAnterior);
      const fimMesAnterior = formatDate(ultimoDiaMesAnterior);

      // Buscar reservas do mês atual
      const { data: reservasMes, error: errorMes } = await supabase
        .from('reservas')
        .select('valor_total, status, organizador_id')
        .gte('data', inicioMes)
        .lte('data', fimMes);

      if (errorMes) throw errorMes;

      // Buscar reservas do mês anterior
      const { data: reservasMesAnterior, error: errorMesAnterior } = await supabase
        .from('reservas')
        .select('valor_total, status')
        .gte('data', inicioMesAnterior)
        .lte('data', fimMesAnterior);

      if (errorMesAnterior) throw errorMesAnterior;

      // Buscar reservas de hoje
      const { data: reservasHoje, error: errorHoje } = await supabase
        .from('reservas')
        .select('id')
        .eq('data', hojeStr);

      if (errorHoje) throw errorHoje;

      // Buscar reservas pendentes
      const { data: reservasPendentes, error: errorPendentes } = await supabase
        .from('reservas')
        .select('id')
        .eq('status', 'pendente')
        .gte('data', hojeStr);

      if (errorPendentes) throw errorPendentes;

      // Buscar total de quadras e horários para calcular ocupação
      const { data: quadras } = await supabase
        .from('quadras')
        .select('id')
        .eq('status', 'ativa');

      const { data: horarios } = await supabase
        .from('horarios')
        .select('id')
        .eq('status', 'ativo');

      // Buscar clientes novos do mês
      const { data: clientesNovos, error: errorClientesNovos } = await supabase
        .from('users')
        .select('id')
        .gte('created_at', inicioMes)
        .lte('created_at', fimMes);

      if (errorClientesNovos) throw errorClientesNovos;

      // Calcular métricas
      const reservasConfirmadas = reservasMes?.filter(r => r.status === 'confirmada') || [];
      const faturamentoMes = reservasConfirmadas.reduce((sum, r) => sum + (r.valor_total || 0), 0);
      
      const reservasConfirmadasAnterior = reservasMesAnterior?.filter(r => r.status === 'confirmada') || [];
      const faturamentoMesAnterior = reservasConfirmadasAnterior.reduce((sum, r) => sum + (r.valor_total || 0), 0);

      const totalReservasMes = reservasMes?.length || 0;
      const totalReservasMesAnterior = reservasMesAnterior?.length || 0;

      // Clientes únicos do mês
      const clientesAtivos = new Set(reservasMes?.map(r => r.organizador_id)).size;

      // Taxa de ocupação (simplificada)
      const diasNoMes = ultimoDiaMes.getDate();
      const horariosDisponiveis = (quadras?.length || 0) * (horarios?.length || 0) * diasNoMes;
      const taxaOcupacao = horariosDisponiveis > 0 
        ? (totalReservasMes / horariosDisponiveis) * 100
        : 0;

      // Média por reserva
      const mediaPorReserva = reservasConfirmadas.length > 0
        ? faturamentoMes / reservasConfirmadas.length
        : 0;

      return {
        faturamentoMes,
        faturamentoMesAnterior,
        totalReservasMes,
        totalReservasMesAnterior,
        taxaOcupacao: Number(taxaOcupacao.toFixed(1)),
        clientesAtivos,
        clientesNovos: clientesNovos?.length || 0,
        reservasHoje: reservasHoje?.length || 0,
        reservasPendentes: reservasPendentes?.length || 0,
        mediaPorReserva,
      } as MetricasDashboard;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar atividades recentes
 */
export function useAtividadesRecentes(limit = 10) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['atividades-recentes', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          id,
          created_at,
          status,
          tipo,
          valor_total,
          organizador:users!reservas_organizador_id_fkey(nome_completo),
          quadra:quadras(nome)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(reserva => {
        const organizador = Array.isArray(reserva.organizador) ? reserva.organizador[0] : reserva.organizador;
        const quadra = Array.isArray(reserva.quadra) ? reserva.quadra[0] : reserva.quadra;
        
        return {
          id: reserva.id,
          tipo: 'reserva' as const,
          descricao: `${organizador?.nome_completo || 'Cliente'} criou uma reserva na ${quadra?.nome || 'quadra'}`,
          valor: reserva.valor_total,
          status: reserva.status,
          timestamp: reserva.created_at,
        };
      }) || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para calcular variação percentual
 */
export function calcularVariacao(atual: number, anterior: number): {
  percentual: string;
  isPositivo: boolean;
} {
  if (anterior === 0) {
    return { percentual: '+100%', isPositivo: true };
  }

  const variacao = ((atual - anterior) / anterior) * 100;
  const isPositivo = variacao >= 0;
  const percentual = `${isPositivo ? '+' : ''}${variacao.toFixed(1)}%`;

  return { percentual, isPositivo };
}
