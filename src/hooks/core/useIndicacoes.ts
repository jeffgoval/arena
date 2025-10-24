import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { 
  Indicacao, 
  CodigoIndicacao, 
  CreditoIndicacao, 
  EstatisticasIndicacao 
} from '@/types/indicacoes.types';

/**
 * Hook para buscar código de indicação do usuário
 */
export function useCodigoIndicacao() {
  return useQuery({
    queryKey: ['indicacoes-codigo'],
    queryFn: async (): Promise<CodigoIndicacao | null> => {
      const response = await fetch('/api/indicacoes/codigo');
      
      if (response.status === 404) {
        return null; // Normal para usuários novos
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar código');
      }

      const data = await response.json();
      return data.codigo;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - código não muda frequentemente
    gcTime: 10 * 60 * 1000, // 10 minutos em cache
  });
}

/**
 * Hook para buscar indicações do usuário
 */
export function useIndicacoes() {
  return useQuery({
    queryKey: ['indicacoes'],
    queryFn: async (): Promise<Indicacao[]> => {
      const response = await fetch('/api/indicacoes');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar indicações');
      }

      const data = await response.json();
      return data.indicacoes || [];
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar créditos de indicação
 */
export function useCreditosIndicacao() {
  return useQuery({
    queryKey: ['indicacoes-creditos'],
    queryFn: async (): Promise<CreditoIndicacao[]> => {
      const response = await fetch('/api/indicacoes/creditos');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar créditos');
      }

      const data = await response.json();
      return data.creditos || [];
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar estatísticas de indicação
 */
export function useEstatisticasIndicacao() {
  return useQuery({
    queryKey: ['indicacoes-estatisticas'],
    queryFn: async (): Promise<EstatisticasIndicacao | null> => {
      const response = await fetch('/api/indicacoes/estatisticas');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar estatísticas');
      }

      const data = await response.json();
      return data.estatisticas;
    },
    staleTime: 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar nova indicação
 */
export function useCreateIndicacao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ emailIndicado, nomeIndicado }: { 
      emailIndicado: string; 
      nomeIndicado?: string; 
    }) => {
      const response = await fetch('/api/indicacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailIndicado, nomeIndicado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar indicação');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Indicação criada com sucesso!',
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      queryClient.invalidateQueries({ queryKey: ['indicacoes-estatisticas'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para aplicar código de indicação
 */
export function useAplicarCodigo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (codigoIndicacao: string) => {
      const response = await fetch('/api/indicacoes/aplicar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigoIndicacao }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao aplicar código');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Sucesso!',
        description: data.message || 'Código aplicado com sucesso!',
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['indicacoes-creditos'] });
      queryClient.invalidateQueries({ queryKey: ['indicacoes-estatisticas'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para usar créditos de indicação
 */
export function useUsarCreditos() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ valorCreditos, reservaId }: { 
      valorCreditos: number; 
      reservaId: string; 
    }) => {
      const response = await fetch('/api/indicacoes/creditos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valorCreditos, reservaId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao usar créditos');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Sucesso!',
        description: data.message || 'Créditos utilizados com sucesso!',
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['indicacoes-creditos'] });
      queryClient.invalidateQueries({ queryKey: ['indicacoes-estatisticas'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook combinado para dados da página de indicações
 */
export function useIndicacoesData() {
  const codigo = useCodigoIndicacao();
  const indicacoes = useIndicacoes();
  const creditos = useCreditosIndicacao();
  const estatisticas = useEstatisticasIndicacao();

  return {
    codigo: codigo.data,
    indicacoes: indicacoes.data || [],
    creditos: creditos.data || [],
    estatisticas: estatisticas.data,
    isLoading: codigo.isLoading || indicacoes.isLoading || creditos.isLoading || estatisticas.isLoading,
    error: codigo.error || indicacoes.error || creditos.error || estatisticas.error,
  };
}