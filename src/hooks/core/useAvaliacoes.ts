import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Avaliacao, AvaliacaoStats } from '@/types/avaliacoes.types';
import type { CreateAvaliacaoData } from '@/lib/validations/avaliacao.schema';

export interface AvaliacoesFilters {
  quadra_id?: string;
  user_id?: string;
  rating?: number;
  limit?: number;
}

/**
 * Hook para buscar avaliações com filtros
 */
export function useAvaliacoes(filters?: AvaliacoesFilters) {
  return useQuery({
    queryKey: ['avaliacoes', filters],
    queryFn: async () => {
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
      return data as Avaliacao[];
    },
  });
}

/**
 * Hook para buscar estatísticas de avaliações
 */
export function useAvaliacoesStats() {
  return useQuery({
    queryKey: ['avaliacoes-stats'],
    queryFn: async () => {
      const response = await fetch('/api/avaliacoes/stats');

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }

      const data = await response.json();
      return data as AvaliacaoStats;
    },
  });
}

/**
 * Hook para criar uma nova avaliação
 */
export function useCreateAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAvaliacaoData) => {
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar avaliação');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
      queryClient.invalidateQueries({ queryKey: ['avaliacoes-stats'] });
    },
  });
}
