import { useQuery } from '@tanstack/react-query';
import { notificacoesService } from '@/services/core/notificacoes.service';

/**
 * Hook para buscar estatísticas gerais de notificações
 */
export function useNotificacoesStats() {
  return useQuery({
    queryKey: ['notificacoes', 'stats'],
    queryFn: () => notificacoesService.getStats(),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar estatísticas por tipo de notificação
 */
export function useNotificacoesByTipo() {
  return useQuery({
    queryKey: ['notificacoes', 'stats-tipo'],
    queryFn: () => notificacoesService.getStatsByTipo(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar estatísticas por canal de comunicação
 */
export function useNotificacoesByCanal() {
  return useQuery({
    queryKey: ['notificacoes', 'stats-canal'],
    queryFn: () => notificacoesService.getStatsByCanal(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
