/**
 * React Query Hooks for Rateio (Cost Splitting) System
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rateioService } from '@/services/core/rateios.service';

export const useRateioConfiguration = (reservaId: string) => {
  return useQuery({
    queryKey: ['rateio', reservaId],
    queryFn: () => rateioService.getRateioConfiguration(reservaId),
    enabled: !!reservaId,
  });
};

export const useSaveRateioConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservaId,
      participants,
      splitMode,
    }: {
      reservaId: string;
      participants: any[];
      splitMode: any;
    }) => rateioService.saveRateioConfiguration(reservaId, participants, splitMode),
    onSuccess: (_, variables) => {
      // Invalidate and refetch rateio configuration
      queryClient.invalidateQueries({ queryKey: ['rateio', variables.reservaId] });
      
      // Also invalidate reservation details to update the UI
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reservaId] });
    },
  });
};

export const useValidateRateio = () => {
  return useMutation({
    mutationFn: ({
      participants,
      splitMode,
    }: {
      participants: any[];
      splitMode: any;
    }) => Promise.resolve(rateioService.validateRateio(participants, splitMode)),
  });
};

/**
 * Get rateio summary for a reservation
 */
export function useRateioSummary(reservationId: string | null) {
  return useQuery({
    queryKey: ['rateio-summary', reservationId],
    queryFn: async () => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await axios.get(`/api/reservas/${reservationId}/rateio`);
      return response.data;
    },
    enabled: !!reservationId,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
}

/**
 * Validate rateio configuration (client-side only, no save)
 */
export function useValidateRateio() {
  return (config: RateioConfig): RateioValidation => {
    return rateiosService.validateRateio(config);
  };
}

/**
 * Validate and save rateio configuration
 */
export function useSaveRateio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (config: RateioConfig) => {
      const response = await axios.post(`/api/reservas/${config.reservationId}/rateio`, config);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.warnings && data.warnings.length > 0) {
        toast({
          title: 'Rateio salvo com avisos',
          description: data.warnings.join('. '),
        });
      } else {
        toast({
          title: 'Rateio configurado',
          description: `Organizador pagará R$ ${data.organizerAmount?.toFixed(2)}. Participantes pagarão R$ ${data.participantsAmount?.toFixed(2)}.`,
        });
      }

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['rateio-summary', variables.reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservas'],
      });
      queryClient.invalidateQueries({
        queryKey: ['reserva-participantes', variables.reservationId],
      });
    },
    onError: (error: any) => {
      console.error('[useRateios] Error saving rateio:', error);

      const errorData = error.response?.data;

      if (errorData?.errors && errorData.errors.length > 0) {
        toast({
          title: 'Erro na configuração do rateio',
          description: errorData.errors.join('. '),
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro ao salvar rateio',
          description: error.message || 'Não foi possível salvar a configuração.',
          variant: 'destructive',
        });
      }
    },
  });
}

/**
 * Auto-distribute rateio equally among participants
 */
export function useAutoDistributeRateio() {
  return (config: {
    totalValue: number;
    participantsCount: number;
    mode: 'percentual' | 'valor_fixo';
  }) => {
    return rateiosService.autoDistribute(config);
  };
}

/**
 * Calculate participant amounts
 */
export function useCalculateParticipantAmounts() {
  return (config: RateioConfig) => {
    return rateiosService.calculateParticipantAmounts(config);
  };
}
