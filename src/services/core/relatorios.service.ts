import { createClient } from '@/lib/supabase/client';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from 'date-fns';

export interface RelatorioFaturamento {
  total: number;
  porQuadra: {
    quadra: string;
    quadraId: string;
    valor: number;
    reservas: number;
    ocupacao: number;
  }[];
  porMes: {
    mes: string;
    valor: number;
  }[];
  totalReservas: number;
  mediaMensal: number;
  ocupacaoMedia: number;
}

export interface RelatorioParticipacao {
  clientesAtivos: number;
  clientesInativos: number;
  novosClientes: number;
  topClientes: {
    id: string;
    nome: string;
    jogos: number;
    ultimaReserva: string;
  }[];
  retencao: number;
  mediaJogosPorCliente: number;
}

export interface RelatorioConvites {
  totalEnviados: number;
  aceitos: number;
  recusados: number;
  pendentes: number;
  taxaAceite: number;
  porQuadra: {
    quadra: string;
    enviados: number;
    aceitos: number;
  }[];
}

/**
 * Serviço para gerar relatórios gerenciais
 */
export const relatoriosService = {
  /**
   * Relatório de faturamento
   */
  async getFaturamento(dataInicio?: Date, dataFim?: Date): Promise<RelatorioFaturamento> {
    const supabase = createClient();

    const inicio = dataInicio || startOfYear(new Date());
    const fim = dataFim || endOfYear(new Date());

    // Buscar reservas confirmadas no período
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select(`
        id,
        data,
        valor_total,
        quadra_id,
        quadras!reservas_quadra_id_fkey(id, nome)
      `)
      .eq('status', 'confirmada')
      .gte('data', inicio.toISOString())
      .lte('data', fim.toISOString());

    if (error) throw error;

    // Calcular total
    const total = (reservas || []).reduce((acc, r) => acc + (r.valor_total || 0), 0);
    const totalReservas = reservas?.length || 0;

    // Agrupar por quadra
    const porQuadraMap = new Map<string, { quadra: string; quadraId: string; valor: number; reservas: number }>();

    reservas?.forEach(r => {
      const quadraNome = (r.quadras as any)?.nome || 'Sem quadra';
      const quadraId = r.quadra_id || '';
      const existing = porQuadraMap.get(quadraId) || {
        quadra: quadraNome,
        quadraId,
        valor: 0,
        reservas: 0
      };
      existing.valor += r.valor_total || 0;
      existing.reservas += 1;
      porQuadraMap.set(quadraId, existing);
    });

    const porQuadra = Array.from(porQuadraMap.values()).map(item => ({
      ...item,
      ocupacao: 0, // TODO: calcular ocupação real baseado em horários
    }));

    // Agrupar por mês
    const porMesMap = new Map<string, number>();
    reservas?.forEach(r => {
      const mes = format(new Date(r.data), 'MMM');
      const valor = porMesMap.get(mes) || 0;
      porMesMap.set(mes, valor + (r.valor_total || 0));
    });

    const porMes = Array.from(porMesMap.entries()).map(([mes, valor]) => ({
      mes,
      valor,
    }));

    // Calcular médias
    const mesesAtivos = porMes.length || 1;
    const mediaMensal = total / mesesAtivos;
    const ocupacaoMedia = porQuadra.length > 0
      ? porQuadra.reduce((acc, q) => acc + q.ocupacao, 0) / porQuadra.length
      : 0;

    return {
      total,
      porQuadra,
      porMes,
      totalReservas,
      mediaMensal,
      ocupacaoMedia,
    };
  },

  /**
   * Relatório de participação de clientes
   */
  async getParticipacao(): Promise<RelatorioParticipacao> {
    const supabase = createClient();

    const hoje = new Date();
    const mes30DiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    const inicioMes = startOfMonth(hoje);

    // Buscar usuários com suas reservas
    const { data: usuarios, error: usuariosError } = await supabase
      .from('users')
      .select(`
        id,
        nome_completo,
        created_at,
        reservas!reservas_organizador_id_fkey(
          id,
          data,
          status
        )
      `)
      .eq('role', 'cliente');

    if (usuariosError) throw usuariosError;

    // Separar clientes ativos/inativos
    let clientesAtivos = 0;
    let clientesInativos = 0;
    let novosClientes = 0;

    const clientesComJogos: { id: string; nome: string; jogos: number; ultimaReserva: string }[] = [];

    (usuarios || []).forEach(user => {
      const reservas = (user.reservas as any) || [];
      const reservasConfirmadas = reservas.filter((r: any) => r.status === 'confirmada');
      const temReservaRecente = reservasConfirmadas.some((r: any) =>
        new Date(r.data) >= mes30DiasAtras
      );

      if (temReservaRecente) {
        clientesAtivos++;
      } else if (reservasConfirmadas.length > 0) {
        clientesInativos++;
      }

      if (new Date(user.created_at) >= inicioMes) {
        novosClientes++;
      }

      // Top clientes
      if (reservasConfirmadas.length > 0) {
        const ultimaReserva = reservasConfirmadas.sort((a: any, b: any) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
        )[0];

        clientesComJogos.push({
          id: user.id,
          nome: user.nome_completo || 'Sem nome',
          jogos: reservasConfirmadas.length,
          ultimaReserva: ultimaReserva.data,
        });
      }
    });

    // Top 10 clientes
    const topClientes = clientesComJogos
      .sort((a, b) => b.jogos - a.jogos)
      .slice(0, 10);

    // Calcular métricas
    const totalClientes = usuarios?.length || 1;
    const retencao = totalClientes > 0
      ? Math.round((clientesAtivos / totalClientes) * 100)
      : 0;

    const totalJogos = clientesComJogos.reduce((acc, c) => acc + c.jogos, 0);
    const mediaJogosPorCliente = totalClientes > 0
      ? Math.round((totalJogos / totalClientes) * 10) / 10
      : 0;

    return {
      clientesAtivos,
      clientesInativos,
      novosClientes,
      topClientes,
      retencao,
      mediaJogosPorCliente,
    };
  },

  /**
   * Relatório de convites
   */
  async getConvites(): Promise<RelatorioConvites> {
    const supabase = createClient();

    // Buscar todos os convites
    const { data: convites, error } = await supabase
      .from('convites')
      .select(`
        id,
        reserva_id,
        status,
        reservas!convites_reserva_id_fkey(
          quadra_id,
          quadras!reservas_quadra_id_fkey(nome)
        )
      `);

    if (error) throw error;

    const totalEnviados = convites?.length || 0;
    const aceitos = convites?.filter(c => c.status === 'aceito').length || 0;
    const recusados = convites?.filter(c => c.status === 'recusado').length || 0;
    const pendentes = convites?.filter(c => c.status === 'pendente').length || 0;

    const taxaAceite = totalEnviados > 0
      ? Math.round((aceitos / totalEnviados) * 100)
      : 0;

    // Agrupar por quadra
    const porQuadraMap = new Map<string, { quadra: string; enviados: number; aceitos: number }>();

    convites?.forEach(c => {
      const reserva = c.reservas as any;
      const quadraNome = reserva?.quadras?.nome || 'Sem quadra';
      const existing = porQuadraMap.get(quadraNome) || {
        quadra: quadraNome,
        enviados: 0,
        aceitos: 0
      };
      existing.enviados += 1;
      if (c.status === 'aceito') existing.aceitos += 1;
      porQuadraMap.set(quadraNome, existing);
    });

    const porQuadra = Array.from(porQuadraMap.values());

    return {
      totalEnviados,
      aceitos,
      recusados,
      pendentes,
      taxaAceite,
      porQuadra,
    };
  },
};
