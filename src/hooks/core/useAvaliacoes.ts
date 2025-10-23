import { useState, useCallback } from 'react';
import type { Avaliacao, AvaliacaoStats } from '@/types/avaliacoes.types';
import type { CreateAvaliacaoData } from '@/lib/validations/avaliacao.schema';

export interface UseAvaliacoesReturn {
  avaliacoes: Avaliacao[];
  stats: AvaliacaoStats | null;
  loading: boolean;
  error: string | null;
  createAvaliacao: (data: CreateAvaliacaoData) => Promise<boolean>;
  fetchAvaliacoes: (filters?: AvaliacoesFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
}

export interface AvaliacoesFilters {
  quadra_id?: string;
  user_id?: string;
  rating?: number;
  limit?: number;
}

export function useAvaliacoes(): UseAvaliacoesReturn {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [stats, setStats] = useState<AvaliacaoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAvaliacao = useCallback(async (data: CreateAvaliacaoData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar avaliação');
      }

      const newAvaliacao = await response.json();
      setAvaliacoes((prev) => [newAvaliacao, ...prev]);
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar avaliação';
      setError(message);
      console.error('Erro ao criar avaliação:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvaliacoes = useCallback(async (filters?: AvaliacoesFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.quadra_id) params.append('quadra_id', filters.quadra_id);
      if (filters?.user_id) params.append('user_id', filters.user_id);
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/avaliacoes?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar avaliações');
      }

      const data = await response.json();
      setAvaliacoes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar avaliações';
      setError(message);
      console.error('Erro ao buscar avaliações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/avaliacoes/stats');

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar estatísticas';
      setError(message);
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    avaliacoes,
    stats,
    loading,
    error,
    createAvaliacao,
    fetchAvaliacoes,
    fetchStats,
  };
}
