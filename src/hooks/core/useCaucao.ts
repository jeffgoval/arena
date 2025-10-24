/**
 * React Query Hooks for Caução (Pre-Authorization) System
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

/**
 * Get pre-authorization status for a reservation
 */
export function useCaucaoStatus(reservationId: string | null) {
  return useQuery({
    queryKey: ['caucao-status', reservationId],
    queryFn: () => caucaoService.getPreAuthorizationStatus(reservationId!),
    enabled: !!reservationId,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
}

/**
 * Calculate organizer's final amount
 */
export function useOrganizerAmount(reservationId: string | null) {
  return useQuery({
    queryKey: ['organizer-amount', reservationId],
    queryFn: () => caucaoService.calculateOrganizerAmount(reservationId!),
    enabled: !!reservationId,
    staleTime: 30000,
    gcTime: 300000,
  });
}

/**
 * Create pre-authorization mutation
 */
export function useCreatePreAuthorization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CaucaoCreateParams) => caucaoService.createPreAuthorization(params),
    onSuccess: (paymentId, variables) => {
      toast({
        title: 'Pré-autorização criada',
        description: 'O valor foi reservado no seu cartão. Você só será cobrado pelo valor final.',
      });

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['caucao-status', variables.reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservas'],
      });
    },
    onError: (error: Error) => {
      console.error('[useCaucao] Error creating pre-authorization:', error);
      toast({
        title: 'Erro ao criar pré-autorização',
        description: error.message || 'Não foi possível reservar o valor no cartão.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Capture pre-authorization mutation
 * Should be called by backend Edge Function when game closes
 */
export function useCapturePreAuthorization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CaucaoCaptureParams) => caucaoService.capturePreAuthorization(params),
    onSuccess: (_, variables) => {
      toast({
        title: 'Pagamento capturado',
        description: `R$ ${variables.finalAmount.toFixed(2)} foi cobrado do seu cartão.`,
      });

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['caucao-status', variables.reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservas'],
      });
      queryClient.invalidateQueries({
        queryKey: ['payments'],
      });
    },
    onError: (error: Error) => {
      console.error('[useCaucao] Error capturing pre-authorization:', error);
      toast({
        title: 'Erro ao capturar pagamento',
        description: error.message || 'Não foi possível processar o pagamento.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Release pre-authorization mutation
 * Used when reservation is cancelled
 */
export function useReleasePreAuthorization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reservationId: string) => caucaoService.releasePreAuthorization(reservationId),
    onSuccess: (_, reservationId) => {
      toast({
        title: 'Pré-autorização liberada',
        description: 'O valor reservado foi liberado no seu cartão.',
      });

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['caucao-status', reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservas'],
      });
    },
    onError: (error: Error) => {
      console.error('[useCaucao] Error releasing pre-authorization:', error);
      toast({
        title: 'Erro ao liberar pré-autorização',
        description: error.message || 'Não foi possível liberar o valor.',
        variant: 'destructive',
      });
    },
  });
}
