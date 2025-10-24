import { createClient } from '@/lib/supabase/server';
import { 
  ReservaParticipant, 
  RateioMode
} from '@/types/reservas.types';

export class RateioService {
  private supabase: any; // Vamos tipar corretamente depois

  constructor() {
    // O cliente Supabase precisa ser criado em cada método
    // porque é assíncrono
  }

  /**
   * Validate and save rateio configuration for a reservation
   * @param reservaId - Reservation ID
   * @param participants - List of participants with their split values
   * @param splitMode - Split mode (percentual or valor_fixo)
   * @returns Validation result and saved data
   */
  async saveRateioConfiguration(
    reservaId: string,
    participants: ReservaParticipant[],
    splitMode: RateioMode
  ) {
    try {
      const supabase = await createClient();
      
      // 1. Validate the rateio configuration
      const validation = this.validateRateio(participants, splitMode);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          errorCode: 'INVALID_RATEIO'
        };
      }

      // 2. Calculate amount to pay for each participant
      const totalValue = await this.getReservationTotalValue(reservaId);
      const participantsWithAmounts = this.calculateAmountsToPay(
        participants,
        splitMode,
        totalValue
      );

      // 3. Update participants with calculated amounts
      const updateResults = [];
      for (const participant of participantsWithAmounts) {
        const { data, error } = await supabase
          .from('reserva_participantes')
          .update({
            split_type: splitMode === 'percentual' ? 'percentual' : 'valor_fixo',
            split_value: participant.percentual_rateio || participant.valor_rateio,
            amount_to_pay: participant.amount_to_pay,
            updated_at: new Date().toISOString()
          })
          .eq('id', participant.id)
          .select()
          .single();

        if (error) {
          updateResults.push({ success: false, error, participantId: participant.id });
        } else {
          updateResults.push({ success: true, data, participantId: participant.id });
        }
      }

      // 4. Update reservation with split mode
      const { error: reservaError } = await supabase
        .from('reservas')
        .update({
          split_mode: splitMode,
          updated_at: new Date().toISOString()
        })
        .eq('id', reservaId);

      if (reservaError) {
        return {
          success: false,
          error: reservaError.message,
          errorCode: 'RESERVA_UPDATE_FAILED'
        };
      }

      return {
        success: true,
        data: {
          participants: updateResults,
          splitMode,
          totalValue
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'RATEIO_SAVE_ERROR'
      };
    }
  }

  /**
   * Validate rateio configuration based on split mode
   * @param participants - List of participants with split values
   * @param splitMode - Split mode (percentual or valor_fixo)
   * @returns Validation result
   */
  validateRateio(
    participants: ReservaParticipant[],
    splitMode: RateioMode
  ): { isValid: boolean; error?: string } {
    try {
      if (splitMode === 'percentual') {
        // For percentual mode, sum must be exactly 100%
        const totalPercentage = participants.reduce(
          (sum, p) => sum + (p.percentual_rateio || 0),
          0
        );

        if (Math.abs(totalPercentage - 100) > 0.01) {
          return {
            isValid: false,
            error: `Total percentage must be exactly 100%. Current total: ${totalPercentage.toFixed(2)}%`
          };
        }
      } else if (splitMode === 'fixo') {
        // For valor_fixo mode, sum must be <= total reservation value
        // This validation requires the total value, so we'll do it in the save method
        const totalFixed = participants.reduce(
          (sum, p) => sum + (p.valor_rateio || 0),
          0
        );

        // We'll validate this against the reservation total in the save method
      }

      // Check that all participants have valid split values
      for (const participant of participants) {
        if (splitMode === 'percentual' && (participant.percentual_rateio === null || participant.percentual_rateio === undefined)) {
          return {
            isValid: false,
            error: `Participant ${participant.nome} is missing split value`
          };
        }

        if (splitMode === 'fixo' && (participant.valor_rateio === null || participant.valor_rateio === undefined)) {
          return {
            isValid: false,
            error: `Participant ${participant.nome} is missing split value`
          };
        }

        if (splitMode === 'percentual' && (participant.percentual_rateio || 0) < 0) {
          return {
            isValid: false,
            error: `Participant ${participant.nome} has negative split value`
          };
        }

        if (splitMode === 'fixo' && (participant.valor_rateio || 0) < 0) {
          return {
            isValid: false,
            error: `Participant ${participant.nome} has negative split value`
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Validation error'
      };
    }
  }

  /**
   * Calculate amounts to pay for each participant
   * @param participants - List of participants with split values
   * @param splitMode - Split mode (percentual or valor_fixo)
   * @param totalValue - Total reservation value
   * @returns Participants with calculated amounts
   */
  calculateAmountsToPay(
    participants: ReservaParticipant[],
    splitMode: RateioMode,
    totalValue: number
  ): any[] {
    return participants.map(participant => {
      let amountToPay = 0;

      if (splitMode === 'percentual') {
        // Calculate percentage of total value
        amountToPay = (participant.percentual_rateio || 0) * totalValue / 100;
      } else if (splitMode === 'fixo') {
        // Use fixed value directly
        amountToPay = participant.valor_rateio || 0;
      }

      return {
        ...participant,
        amount_to_pay: parseFloat(amountToPay.toFixed(2))
      };
    });
  }

  /**
   * Get total value of a reservation
   * @param reservaId - Reservation ID
   * @returns Total value of the reservation
   */
  private async getReservationTotalValue(reservaId: string): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reservas')
      .select('valor_total')
      .eq('id', reservaId)
      .single();

    if (error) {
      throw new Error(`Failed to get reservation total value: ${error.message}`);
    }

    return data.valor_total || 0;
  }

  /**
   * Get rateio configuration for a reservation
   * @param reservaId - Reservation ID
   * @returns Rateio configuration
   */
  async getRateioConfiguration(reservaId: string) {
    try {
      const supabase = await createClient();
      
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .select('split_mode')
        .eq('id', reservaId)
        .single();

      if (reservaError) {
        return {
          success: false,
          error: reservaError.message,
          errorCode: 'RESERVA_FETCH_ERROR'
        };
      }

      const { data: participants, error: participantsError } = await supabase
        .from('reserva_participantes')
        .select(`
          id,
          nome,
          split_type,
          split_value,
          amount_to_pay,
          payment_status
        `)
        .eq('reserva_id', reservaId);

      if (participantsError) {
        return {
          success: false,
          error: participantsError.message,
          errorCode: 'PARTICIPANTS_FETCH_ERROR'
        };
      }

      return {
        success: true,
        data: {
          splitMode: reserva.split_mode,
          participants
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'RATEIO_FETCH_ERROR'
      };
    }
  }
}

export const rateioService = new RateioService();