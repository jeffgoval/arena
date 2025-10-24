import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Convite, ConviteStatus } from '@/types/convites.types';

interface ConvitesStats {
  total: number;
  ativos: number;
  completos: number;
  expirados: number;
  taxaAceite: number;
  totalAceites: number;
}

interface ConvitesResponse {
  convites: Convite[];
  stats: ConvitesStats;
}

/**
 * Hook para buscar convites do usuário logado
 */
export function useConvites(filtroStatus?: ConviteStatus | 'todos') {
  return useQuery({
    queryKey: ['convites', filtroStatus],
    queryFn: async (): Promise<ConvitesResponse> => {
      const params = new URLSearchParams();
      if (filtroStatus && filtroStatus !== 'todos') {
        params.append('status', filtroStatus);
      }

      const response = await fetch(`/api/convites?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar convites');
      }

      const data = await response.json();
      return {
        convites: data.convites || [],
        stats: data.stats || {
          total: 0,
          ativos: 0,
          completos: 0,
          expirados: 0,
          taxaAceite: 0,
          totalAceites: 0,
        },
      };
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para desativar um convite
 */
export function useDesativarConvite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (conviteId: string) => {
      const response = await fetch(`/api/convites/${conviteId}/desativar`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao desativar convite');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Sucesso',
        description: 'Convite desativado com sucesso',
      });
      queryClient.invalidateQueries({ queryKey: ['convites'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao desativar convite',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para copiar link do convite
 */
export function useCopiarLinkConvite() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (token: string) => {
      const link = `${window.location.origin}/convite/${token}`;
      await navigator.clipboard.writeText(link);
      return { link };
    },
    onSuccess: () => {
      toast({
        title: 'Link copiado!',
        description: 'O link do convite foi copiado para a área de transferência',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link',
        variant: 'destructive',
      });
    },
  });
}