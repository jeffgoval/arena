import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { useReservasGestor } from './useReservasGestor';
import { useAvaliacoes } from './useAvaliacoes';

export interface JogoGestorStats {
  totalJogos: number;
  jogosAvaliados: number;
  quadrasUsadas: number;
  avaliacaoMedia: number;
}

export interface JogoGestorFiltrado {
  id: string;
  data: string;
  status: string;
  valor_total: number;
  quadra: {
    nome: string;
    tipo: string;
  };
  horario: {
    hora_inicio: string;
    hora_fim: string;
  };
  organizador: {
    nome_completo: string;
    email: string;
  };
  reserva_participantes: any[];
  participantes_count: number;
  avaliacao?: number;
}

/**
 * Hook para buscar todos os jogos do sistema (visão gestor)
 * Mostra jogos passados e confirmados de todos os usuários
 */
export function useJogosGestor(filtroModalidade: string = 'todas', busca: string = '') {
  const { data: reservasData, isLoading: isLoadingReservas } = useReservasGestor();
  const { data: avaliacoesData } = useAvaliacoes();

  const jogosData = useMemo(() => {
    if (!reservasData) return { jogosPassados: [], stats: null };

    const hoje = new Date();

    // Filtrar apenas jogos passados e confirmados
    const jogosPassados = reservasData
      .filter((reserva: any) => {
        const dataReserva = parseISO(reserva.data);
        return dataReserva < hoje && reserva.status === 'confirmada';
      })
      .sort((a: any, b: any) => {
        return parseISO(b.data).getTime() - parseISO(a.data).getTime(); // Mais recentes primeiro
      });

    // Criar mapa de avaliações
    const avaliacoesMap = new Map();
    avaliacoesData?.forEach((aval: any) => {
      avaliacoesMap.set(aval.reserva_id, aval.nota);
    });

    // Adicionar avaliações aos jogos
    const jogosComAvaliacoes = jogosPassados.map((jogo: any) => ({
      ...jogo,
      avaliacao: avaliacoesMap.get(jogo.id),
    }));

    // Calcular estatísticas
    const totalJogos = jogosPassados.length;
    const jogosComAvaliacao = jogosPassados.filter((j: any) => avaliacoesMap.has(j.id));
    const avaliacaoMedia = jogosComAvaliacao.length > 0
      ? jogosComAvaliacao.reduce((acc: number, j: any) => acc + avaliacoesMap.get(j.id), 0) / jogosComAvaliacao.length
      : 0;
    const quadrasUsadas = new Set(jogosPassados.map((j: any) => j.quadra?.nome)).size;

    const stats: JogoGestorStats = {
      totalJogos,
      jogosAvaliados: jogosComAvaliacao.length,
      quadrasUsadas,
      avaliacaoMedia,
    };

    return {
      jogosPassados: jogosComAvaliacoes,
      stats,
    };
  }, [reservasData, avaliacoesData]);

  // Aplicar filtros
  const jogosFiltrados = useMemo(() => {
    if (!jogosData.jogosPassados) return [];

    return jogosData.jogosPassados.filter((jogo: any) => {
      const modalidadeOk = filtroModalidade === 'todas' || jogo.quadra?.tipo === filtroModalidade;
      const buscaOk = busca === '' || jogo.quadra?.nome?.toLowerCase().includes(busca.toLowerCase());
      return modalidadeOk && buscaOk;
    });
  }, [jogosData.jogosPassados, filtroModalidade, busca]);

  return {
    jogos: jogosFiltrados,
    stats: jogosData.stats,
    isLoading: isLoadingReservas,
  };
}
