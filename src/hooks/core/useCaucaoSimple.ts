/**
 * Simplified React Query Hooks for Caução (Pre-Authorization) System
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { caucaoService } from '@/services/core/caucao.service';

export const useCriarPreAutorizacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservaId,
      userId,
      valorTotal,
      dadosCartao,
      dadosPortador
    }: {
      reservaId: string;
      userId: string;
      valorTotal: number;
      dadosCartao: any;
      dadosPortador: any;
    }) => caucaoService.criarPreAutorizacao(
      reservaId,
      userId,
      valorTotal,
      dadosCartao,
      dadosPortador
    ),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reservaId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useCapturarPreAutorizacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      preAuthId,
      valorCapturar
    }: {
      preAuthId: string;
      valorCapturar: number;
    }) => caucaoService.capturarPreAutorizacao(preAuthId, valorCapturar),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['payment', variables.preAuthId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useCancelarPreAutorizacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      preAuthId
    }: {
      preAuthId: string;
    }) => caucaoService.cancelarPreAutorizacao(preAuthId),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['payment', variables.preAuthId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useStatusPreAutorizacao = (preAuthId: string) => {
  return useQuery({
    queryKey: ['payment', preAuthId],
    queryFn: () => caucaoService.getStatusPreAutorizacao(preAuthId),
    enabled: !!preAuthId,
  });
};

export const useCalcularValorCapturar = (reservaId: string) => {
  return useQuery({
    queryKey: ['valor-capturar', reservaId],
    queryFn: () => caucaoService.calcularValorCapturar(reservaId),
    enabled: !!reservaId,
  });
};