import { createClient } from '@/lib/supabase/client';

export class ValidationsService {
  private supabase: any;

  constructor() {
    this.supabase = createClient();
  }

  /**
   * Validar se cliente pode fazer nova reserva (RN-006)
   * Cliente não pode ter saldo devedor > R$ 200
   */
  async validarSaldoDevedor(userId: string): Promise<{ valido: boolean; error?: string }> {
    try {
      // Buscar saldo devedor do cliente
      const { data: user, error } = await this.supabase
        .from('users')
        .select('saldo_devedor')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar saldo devedor: ${error.message}`);
      }

      // Verificar se saldo devedor é maior que R$ 200
      if (user.saldo_devedor > 200) {
        return {
          valido: false,
          error: 'Cliente não pode ter saldo devedor maior que R$ 200 para fazer novas reservas'
        };
      }

      return { valido: true };
    } catch (error) {
      return {
        valido: false,
        error: error instanceof Error ? error.message : 'Erro ao validar saldo devedor'
      };
    }
  }

  /**
   * Validar total de participantes (RN-026)
   * Total de participantes (turma + convites) não pode exceder capacidade da quadra
   */
  async validarCapacidadeReserva(
    reservaId: string,
    quadraId: string
  ): Promise<{ valido: boolean; error?: string }> {
    try {
      // Buscar capacidade da quadra
      const { data: quadra, error: quadraError } = await this.supabase
        .from('quadras')
        .select('capacidade')
        .eq('id', quadraId)
        .single();

      if (quadraError) {
        throw new Error(`Erro ao buscar capacidade da quadra: ${quadraError.message}`);
      }

      // Contar participantes da turma
      const { count: turmaCount, error: turmaError } = await this.supabase
        .from('reserva_participantes')
        .select('*', { count: 'exact', head: true })
        .eq('reserva_id', reservaId)
        .eq('source', 'team');

      if (turmaError) {
        throw new Error(`Erro ao contar participantes da turma: ${turmaError.message}`);
      }

      // Contar aceites de convites
      const { count: convitesCount, error: convitesError } = await this.supabase
        .from('aceites_convite')
        .select('*', { count: 'exact', head: true })
        .eq('reserva_id', reservaId)
        .eq('status', 'aceito');

      if (convitesError) {
        throw new Error(`Erro ao contar aceites de convites: ${convitesError.message}`);
      }

      // Calcular total de participantes
      const totalParticipantes = (turmaCount || 0) + (convitesCount || 0);

      // Verificar se excede capacidade
      if (totalParticipantes > quadra.capacidade) {
        return {
          valido: false,
          error: `Total de participantes (${totalParticipantes}) excede a capacidade da quadra (${quadra.capacidade})`
        };
      }

      return { valido: true };
    } catch (error) {
      return {
        valido: false,
        error: error instanceof Error ? error.message : 'Erro ao validar capacidade da reserva'
      };
    }
  }

  /**
   * Validar rateio percentual (RN-017)
   * Soma de percentuais deve ser 100%
   */
  async validarRateioPercentual(
    participants: Array<{ percentual_rateio?: number }>
  ): Promise<{ valido: boolean; error?: string }> {
    try {
      // Calcular soma dos percentuais
      const totalPercentage = participants.reduce(
        (sum, p) => sum + (p.percentual_rateio || 0),
        0
      );

      // Verificar se é exatamente 100%
      if (Math.abs(totalPercentage - 100) > 0.01) {
        return {
          valido: false,
          error: `Total de percentuais deve ser exatamente 100%. Atual: ${totalPercentage.toFixed(2)}%`
        };
      }

      return { valido: true };
    } catch (error) {
      return {
        valido: false,
        error: error instanceof Error ? error.message : 'Erro ao validar rateio percentual'
      };
    }
  }

  /**
   * Validar rateio por valor fixo (RN-018)
   * Total valor fixo deve ser ≤ valor da reserva
   */
  async validarRateioValorFixo(
    participants: Array<{ valor_rateio?: number }>,
    valorReserva: number
  ): Promise<{ valido: boolean; error?: string }> {
    try {
      // Calcular soma dos valores fixos
      const totalFixed = participants.reduce(
        (sum, p) => sum + (p.valor_rateio || 0),
        0
      );

      // Verificar se é menor ou igual ao valor da reserva
      if (totalFixed > valorReserva) {
        return {
          valido: false,
          error: `Total dos valores fixos (R$ ${totalFixed.toFixed(2)}) não pode exceder o valor da reserva (R$ ${valorReserva.toFixed(2)})`
        };
      }

      return { valido: true };
    } catch (error) {
      return {
        valido: false,
        error: error instanceof Error ? error.message : 'Erro ao validar rateio por valor fixo'
      };
    }
  }

  /**
   * Calcular diferença para organizador (RN-019)
   * Calcula automaticamente a diferença que o organizador deve pagar
   */
  async calcularDiferencaOrganizador(
    participants: Array<{ amount_to_pay?: number }>,
    valorReserva: number
  ): Promise<number> {
    try {
      // Calcular soma dos valores a pagar dos participantes
      const totalPagoParticipantes = participants.reduce(
        (sum, p) => sum + (p.amount_to_pay || 0),
        0
      );

      // Calcular diferença para o organizador
      const diferencaOrganizador = Math.max(0, valorReserva - totalPagoParticipantes);
      
      return parseFloat(diferencaOrganizador.toFixed(2));
    } catch (error) {
      console.error('Erro ao calcular diferença para organizador:', error);
      return valorReserva;
    }
  }
}

export const validationsService = new ValidationsService();