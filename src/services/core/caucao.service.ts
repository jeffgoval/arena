import { createClient } from '@/lib/supabase/server';
import { pagamentoService } from '../pagamentoService';

export class CaucaoService {
  private supabase: any;

  constructor() {
    // O cliente será criado nos métodos
  }

  /**
   * Criar pré-autorização (caução) para uma reserva
   * @param reservaId - ID da reserva
   * @param userId - ID do usuário organizador
   * @param valorTotal - Valor total da reserva
   * @param dadosCartao - Dados do cartão para pré-autorização
   * @param dadosPortador - Dados do portador do cartão
   * @returns Resultado da criação da pré-autorização
   */
  async criarPreAutorizacao(
    reservaId: string,
    userId: string,
    valorTotal: number,
    dadosCartao: any,
    dadosPortador: any
  ) {
    try {
      const supabase = await createClient();
      
      // 1. Criar cliente no Asaas se necessário
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      const clienteAsaas = {
        nome: user.nome_completo,
        email: user.email,
        cpf: user.cpf,
        telefone: user.telefone,
        cep: user.cep,
        endereco: user.endereco,
        numero: user.numero,
        complemento: user.complemento,
        bairro: user.bairro,
        cidade: user.cidade,
        estado: user.estado
      };
      
      const clienteId = await pagamentoService.criarOuAtualizarCliente(clienteAsaas);
      
      // 2. Criar pré-autorização
      const dadosPreAuth = {
        clienteId,
        valor: valorTotal,
        descricao: `Caução para reserva #${reservaId.substring(0, 8)}`,
        referencia: `CAUCAO_${reservaId.substring(0, 8)}_${Date.now()}`,
        dadosCartao,
        dadosPortadorCartao: {
          nome: dadosPortador.nome,
          email: dadosPortador.email,
          cpf: dadosPortador.cpf,
          cep: dadosPortador.cep,
          numero: dadosPortador.numero,
          complemento: dadosPortador.complemento || '',
          telefone: dadosPortador.telefone,
          celular: dadosPortador.celular
        }
      };
      
      const resultado = await pagamentoService.criarPreAutorizacao(dadosPreAuth);
      
      if (!resultado.sucesso) {
        throw new Error(resultado.erro);
      }
      
      // 3. Salvar registro da pré-autorização no banco
      const { data: preAuth, error: preAuthError } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          reservation_id: reservaId,
          amount: valorTotal,
          method: 'credit_card',
          status: 'authorized',
          transaction_id: resultado.dados?.id,
          metadata: {
            type: 'pre_authorization',
            descricao: dadosPreAuth.descricao,
            referencia: dadosPreAuth.referencia
          },
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (preAuthError) {
        throw new Error(`Erro ao salvar pré-autorização: ${preAuthError.message}`);
      }
      
      return {
        sucesso: true,
        dados: {
          id: preAuth.id,
          transaction_id: resultado.dados?.id,
          valor: resultado.dados?.valor,
          status: resultado.dados?.status,
          data_expiracao: resultado.dados?.dataExpiracao
        }
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Capturar pré-autorização parcialmente
   * @param preAuthId - ID da pré-autorização no banco
   * @param valorCapturar - Valor a ser capturado
   * @returns Resultado da captura
   */
  async capturarPreAutorizacao(preAuthId: string, valorCapturar: number) {
    try {
      const supabase = await createClient();
      
      // 1. Obter dados da pré-autorização
      const { data: preAuth, error: preAuthError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', preAuthId)
        .single();
        
      if (preAuthError || !preAuth) {
        throw new Error('Pré-autorização não encontrada');
      }
      
      if (preAuth.status !== 'authorized') {
        throw new Error('Pré-autorização não está autorizada');
      }
      
      // 2. Capturar parcialmente no Asaas
      const resultado = await pagamentoService.capturarPreAutorizacao(
        preAuth.transaction_id,
        valorCapturar
      );
      
      if (!resultado.sucesso) {
        throw new Error(resultado.erro);
      }
      
      // 3. Atualizar status no banco
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          capture_amount: valorCapturar,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', preAuthId);
        
      if (updateError) {
        throw new Error(`Erro ao atualizar pré-autorização: ${updateError.message}`);
      }
      
      return {
        sucesso: true,
        dados: {
          id: preAuth.id,
          transaction_id: preAuth.transaction_id,
          valor_capturado: valorCapturar,
          status: 'paid'
        }
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Cancelar pré-autorização
   * @param preAuthId - ID da pré-autorização no banco
   * @returns Resultado do cancelamento
   */
  async cancelarPreAutorizacao(preAuthId: string) {
    try {
      const supabase = await createClient();
      
      // 1. Obter dados da pré-autorização
      const { data: preAuth, error: preAuthError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', preAuthId)
        .single();
        
      if (preAuthError || !preAuth) {
        throw new Error('Pré-autorização não encontrada');
      }
      
      if (preAuth.status !== 'authorized') {
        throw new Error('Pré-autorização não está autorizada');
      }
      
      // 2. Cancelar no Asaas
      const resultado = await pagamentoService.cancelarPreAutorizacao(preAuth.transaction_id);
      
      if (!resultado.sucesso) {
        throw new Error(resultado.erro || 'Erro ao cancelar pré-autorização');
      }
      
      // 3. Atualizar status no banco
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', preAuthId);
        
      if (updateError) {
        throw new Error(`Erro ao atualizar pré-autorização: ${updateError.message}`);
      }
      
      return {
        sucesso: true,
        mensagem: 'Pré-autorização cancelada com sucesso'
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Obter status da pré-autorização
   * @param preAuthId - ID da pré-autorização no banco
   * @returns Status da pré-autorização
   */
  async getStatusPreAutorizacao(preAuthId: string) {
    try {
      const supabase = await createClient();
      
      // 1. Obter dados da pré-autorização
      const { data: preAuth, error: preAuthError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', preAuthId)
        .single();
        
      if (preAuthError || !preAuth) {
        throw new Error('Pré-autorização não encontrada');
      }
      
      // 2. Consultar status no Asaas
      const status = await pagamentoService.consultarPagamento(preAuth.transaction_id);
      
      if (!status) {
        throw new Error('Não foi possível consultar o status da pré-autorização');
      }
      
      // 3. Atualizar status no banco se necessário
      if (status.status !== preAuth.status) {
        await supabase
          .from('payments')
          .update({
            status: status.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', preAuthId);
      }
      
      return {
        sucesso: true,
        dados: {
          id: preAuth.id,
          transaction_id: preAuth.transaction_id,
          status: status.status,
          valor: status.valor,
          valor_liquido: status.valorLiquido,
          data_vencimento: status.dataVencimento,
          data_pagamento: status.dataPagamento,
          data_confirmacao: status.dataConfirmacao
        }
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Calcular valor a ser capturado do organizador
   * @param reservaId - ID da reserva
   * @returns Valor a ser capturado
   */
  async calcularValorCapturar(reservaId: string) {
    try {
      const supabase = await createClient();
      
      // 1. Obter dados da reserva
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .select('valor_total')
        .eq('id', reservaId)
        .single();
        
      if (reservaError || !reserva) {
        throw new Error('Reserva não encontrada');
      }
      
      // 2. Obter pagamentos confirmados dos participantes
      const { data: participantes } = await supabase
        .from('reserva_participantes')
        .select('amount_to_pay')
        .eq('reserva_id', reservaId)
        .in('payment_status', ['paid', 'free']);
        
      const totalPagoParticipantes = participantes?.reduce(
        (sum, p) => sum + (p.amount_to_pay || 0),
        0
      ) || 0;
      
      // 3. Calcular valor restante para o organizador
      const valorCapturar = Math.max(0, reserva.valor_total - totalPagoParticipantes);
      
      return {
        sucesso: true,
        dados: {
          valor_total: reserva.valor_total,
          total_pago_participantes: totalPagoParticipantes,
          valor_capturar: parseFloat(valorCapturar.toFixed(2))
        }
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export const caucaoService = new CaucaoService();