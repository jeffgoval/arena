import { useQuery } from '@tanstack/react-query';
import { relatoriosService } from '@/services/core/relatorios.service';

/**
 * Hook para buscar relatório de faturamento
 */
export function useRelatorioFaturamento(dataInicio?: Date, dataFim?: Date) {
  return useQuery({
    queryKey: ['relatorios', 'faturamento', dataInicio, dataFim],
    queryFn: () => relatoriosService.getFaturamento(dataInicio, dataFim),
    staleTime: 5 * 60 * 1000, // 5 minutos (relatórios podem ser cached por mais tempo)
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar relatório de participação
 */
export function useRelatorioParticipacao() {
  return useQuery({
    queryKey: ['relatorios', 'participacao'],
    queryFn: () => relatoriosService.getParticipacao(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar relatório de convites
 */
export function useRelatorioConvites() {
  return useQuery({
    queryKey: ['relatorios', 'convites'],
    queryFn: () => relatoriosService.getConvites(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
