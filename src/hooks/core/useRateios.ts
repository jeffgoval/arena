/**
 * React Query Hooks for Rateio (Cost Splitting) System
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rateioService } from '@/services/core/rateios.service';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

// Types
interface RateioConfig {
  reservationId: string;
  totalValue: number;
  participantsCount: number;
  mode: 'percentual' | 'valor_fixo';
}

interface RateioValidation {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

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

export const useValidateRateioMutation = () => {
  return useMutation({
    mutationFn: ({
      reservaId,
      participants,
      splitMode,
    }: {
      reservaId: string;
      participants: any[];
      splitMode: any;
    }) => rateioService.validateRateio(reservaId, participants, splitMode),
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
 * Note: This is a simplified client-side validation.
 * For full validation with database checks, use useValidateRateioMutation.
 */
export function useValidateRateio() {
  return (config: RateioConfig): RateioValidation => {
    // Client-side validation logic
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.reservationId) {
      errors.push('Reservation ID is required');
    }

    if (config.totalValue <= 0) {
      errors.push('Total value must be greater than 0');
    }

    if (config.participantsCount <= 0) {
      errors.push('At least one participant is required');
    }

    if (!['percentual', 'valor_fixo'].includes(config.mode)) {
      errors.push('Invalid split mode');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
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
    // Client-side auto-distribution logic
    if (config.mode === 'percentual') {
      const percentPerParticipant = 100 / config.participantsCount;
      return {
        splitValue: parseFloat(percentPerParticipant.toFixed(2)),
        mode: 'percentual' as const,
      };
    } else {
      const valuePerParticipant = config.totalValue / config.participantsCount;
      return {
        splitValue: parseFloat(valuePerParticipant.toFixed(2)),
        mode: 'valor_fixo' as const,
      };
    }
  };
}

/**
 * Calculate participant amounts
 */
export function useCalculateParticipantAmounts() {
  return (config: RateioConfig) => {
    // Client-side calculation logic
    const amountPerParticipant = config.totalValue / config.participantsCount;

    if (config.mode === 'percentual') {
      const percentPerParticipant = 100 / config.participantsCount;
      return {
        perParticipant: parseFloat(amountPerParticipant.toFixed(2)),
        splitValue: parseFloat(percentPerParticipant.toFixed(2)),
        mode: 'percentual' as const,
      };
    } else {
      return {
        perParticipant: parseFloat(amountPerParticipant.toFixed(2)),
        splitValue: parseFloat(amountPerParticipant.toFixed(2)),
        mode: 'valor_fixo' as const,
      };
    }
  };
}
