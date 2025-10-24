/**
 * Simplified React Query Hooks for Rateio (Cost Splitting) System
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rateioService } from '@/services/core/rateios.service';
import { ReservaParticipant, RateioMode } from '@/types/reservas.types';

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
      participants: ReservaParticipant[];
      splitMode: RateioMode;
    }) => rateioService.saveRateioConfiguration(reservaId, participants, splitMode),
    onSuccess: (_, variables) => {
      // Invalidate and refetch rateio configuration
      queryClient.invalidateQueries({ queryKey: ['rateio', variables.reservaId] });
      
      // Also invalidate reservation details to update the UI
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reservaId] });
    },
  });
};