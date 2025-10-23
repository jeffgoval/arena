import { useState, useCallback } from 'react';

export interface EstatisticasNotificacao {
  total: number;
  enviadas: number;
  pendentes: number;
  falharam: number;
  porTipo: Record<string, {
    total: number;
    enviadas: number;
    taxa: number;
  }>;
}

export function useNotificacoesAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processarNotificacoesPendentes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notificacoes/processar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao processar notificações');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao processar notificações:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const obterEstatisticas = useCallback(async (
    dataInicio?: Date,
    dataFim?: Date
  ): Promise<EstatisticasNotificacao | null> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (dataInicio) params.append('dataInicio', dataInicio.toISOString().split('T')[0]);
      if (dataFim) params.append('dataFim', dataFim.toISOString().split('T')[0]);

      const response = await fetch(`/api/notificacoes/estatisticas?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao obter estatísticas');
      }

      const data = await response.json();
      return data.estatisticas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao obter estatísticas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const limparNotificacoesAntigas = useCallback(async (diasAntigos = 30) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notificacoes/limpar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ diasAntigos })
      });

      if (!response.ok) {
        throw new Error('Erro ao limpar notificações antigas');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao limpar notificações:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reenviarNotificacaoFalhada = useCallback(async (notificacaoId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/notificacoes/${notificacaoId}/reenviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao reenviar notificação');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao reenviar notificação:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    processarNotificacoesPendentes,
    obterEstatisticas,
    limparNotificacoesAntigas,
    reenviarNotificacaoFalhada
  };
}