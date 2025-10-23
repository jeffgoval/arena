import { useState, useEffect, useCallback } from 'react';
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

interface UseConvitesReturn {
  convites: Convite[];
  stats: ConvitesStats | null;
  loading: boolean;
  error: string | null;
  fetchConvites: (filters?: { status?: ConviteStatus }) => Promise<void>;
  desativarConvite: (conviteId: string) => Promise<boolean>;
  copiarLink: (token: string) => Promise<void>;
}

export function useConvites(): UseConvitesReturn {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [stats, setStats] = useState<ConvitesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConvites = useCallback(async (filters?: { status?: ConviteStatus }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const response = await fetch(`/api/convites?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar convites');
      }

      const data = await response.json();
      setConvites(data.convites);
      setStats(data.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const desativarConvite = useCallback(async (conviteId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/convites/${conviteId}/desativar`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erro ao desativar convite');
      }

      toast({
        title: 'Sucesso',
        description: 'Convite desativado com sucesso',
      });

      // Atualizar lista
      await fetchConvites();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, fetchConvites]);

  const copiarLink = useCallback(async (token: string) => {
    const link = `${window.location.origin}/convite/${token}`;
    
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: 'Link copiado!',
        description: 'O link do convite foi copiado para a área de transferência',
      });
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    convites,
    stats,
    loading,
    error,
    fetchConvites,
    desativarConvite,
    copiarLink,
  };
}
