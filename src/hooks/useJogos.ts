import { useState, useCallback } from 'react';

export interface Jogo {
  id: string;
  data_hora: string;
  duracao: number;
  modalidade: 'futebol' | 'tenis' | 'padel' | 'volei';
  tipo_jogo: 'individual' | 'dupla' | 'grupo';
  resultado?: 'vitoria' | 'derrota' | 'empate';
  pontuacao_usuario?: number;
  pontuacao_adversario?: number;
  avaliacao?: number;
  observacoes?: string;
  reservas?: {
    id: string;
    quadras: {
      nome: string;
    };
  };
  jogo_participantes?: Array<{
    usuarios: {
      nome: string;
      email: string;
    };
  }>;
}

export interface EstatisticasJogos {
  total: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  tempoTotal: number;
  avaliacaoMedia: number;
}

export interface FiltrosJogos {
  modalidade?: string;
  resultado?: string;
  busca?: string;
  limit?: number;
  offset?: number;
}

export function useJogos() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasJogos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarJogos = useCallback(async (userId: string, filtros: FiltrosJogos = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId,
        ...Object.fromEntries(
          Object.entries(filtros).map(([key, value]) => [key, String(value)])
        )
      });

      const response = await fetch(`/api/jogos?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar jogos');
      }

      setJogos(data.jogos);
      setEstatisticas(data.estatisticas);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar jogos:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarJogo = useCallback(async (jogoId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/jogos/${jogoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar jogo');
      }

      return data.jogo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar jogo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarJogo = useCallback(async (dadosJogo: {
    usuarioId: string;
    reservaId?: string;
    modalidade: string;
    tipoJogo: string;
    resultado?: string;
    pontuacaoUsuario?: number;
    pontuacaoAdversario?: number;
    duracao?: number;
    participantes?: string[];
    avaliacao?: number;
    observacoes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/jogos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosJogo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar jogo');
      }

      // Atualizar lista local
      setJogos(prev => [data.jogo, ...prev]);

      return data.jogo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao criar jogo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarJogo = useCallback(async (jogoId: string, dadosAtualizacao: {
    resultado?: string;
    pontuacaoUsuario?: number;
    pontuacaoAdversario?: number;
    duracao?: number;
    avaliacao?: number;
    observacoes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/jogos/${jogoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizacao),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar jogo');
      }

      // Atualizar lista local
      setJogos(prev => prev.map(jogo => 
        jogo.id === jogoId ? { ...jogo, ...data.jogo } : jogo
      ));

      return data.jogo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao atualizar jogo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarJogo = useCallback(async (jogoId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/jogos/${jogoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar jogo');
      }

      // Remover da lista local
      setJogos(prev => prev.filter(jogo => jogo.id !== jogoId));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao deletar jogo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const calcularPerformance = useCallback((jogosData: Jogo[]) => {
    const total = jogosData.length;
    if (total === 0) return { vitorias: 0, derrotas: 0, empates: 0, percentualVitorias: 0 };

    const vitorias = jogosData.filter(j => j.resultado === 'vitoria').length;
    const derrotas = jogosData.filter(j => j.resultado === 'derrota').length;
    const empates = jogosData.filter(j => j.resultado === 'empate').length;
    const percentualVitorias = (vitorias / total) * 100;

    return { vitorias, derrotas, empates, percentualVitorias };
  }, []);

  const obterJogosPorModalidade = useCallback((jogosData: Jogo[]) => {
    const modalidades = ['futebol', 'tenis', 'padel', 'volei'];
    
    return modalidades.map(modalidade => {
      const jogosModalidade = jogosData.filter(j => j.modalidade === modalidade);
      const performance = calcularPerformance(jogosModalidade);
      
      return {
        modalidade,
        total: jogosModalidade.length,
        ...performance
      };
    });
  }, [calcularPerformance]);

  const obterEstatisticasDetalhadas = useCallback((jogosData: Jogo[]) => {
    if (!jogosData.length) return null;

    const tempoTotal = jogosData.reduce((acc, jogo) => acc + (jogo.duracao || 0), 0);
    const jogosAvaliados = jogosData.filter(j => j.avaliacao);
    const avaliacaoMedia = jogosAvaliados.length > 0 
      ? jogosAvaliados.reduce((acc, jogo) => acc + (jogo.avaliacao || 0), 0) / jogosAvaliados.length
      : 0;

    const performance = calcularPerformance(jogosData);
    const porModalidade = obterJogosPorModalidade(jogosData);

    return {
      ...performance,
      total: jogosData.length,
      tempoTotal,
      tempoMedio: tempoTotal / jogosData.length,
      avaliacaoMedia,
      porModalidade
    };
  }, [calcularPerformance, obterJogosPorModalidade]);

  return {
    jogos,
    estatisticas,
    loading,
    error,
    buscarJogos,
    buscarJogo,
    criarJogo,
    atualizarJogo,
    deletarJogo,
    calcularPerformance,
    obterJogosPorModalidade,
    obterEstatisticasDetalhadas
  };
}