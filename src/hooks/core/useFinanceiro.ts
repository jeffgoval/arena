import { useQuery } from '@tanstack/react-query';
import { financeiroService, type FiltrosTransacoes } from '@/services/core/financeiro.service';

/**
 * Hook para buscar resumo financeiro
 */
export function useResumoFinanceiro() {
  return useQuery({
    queryKey: ['financeiro', 'resumo'],
    queryFn: () => financeiroService.getResumoFinanceiro(),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar transações financeiras com filtros
 */
export function useTransacoesFinanceiras(filtros: FiltrosTransacoes = {}) {
  return useQuery({
    queryKey: ['financeiro', 'transacoes', filtros],
    queryFn: () => financeiroService.getTransacoesFinanceiras(filtros),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar distribuição por método de pagamento
 */
export function useMetodosPagamento() {
  return useQuery({
    queryKey: ['financeiro', 'metodos-pagamento'],
    queryFn: () => financeiroService.getMetodosPagamento(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
