import { asaasAPI } from '@/lib/asaas';
import {
  Cliente,
  DadosPagamento,
  DadosPreAutorizacao,
  StatusPagamento,
  ResultadoPagamento,
  ResultadoPreAutorizacao,
  TipoPagamento,
  StatusPagamentoEnum
} from '@/types/pagamento.types';

export class PagamentoService {
  
  // Criar ou atualizar cliente no Asaas
  async criarOuAtualizarCliente(cliente: Cliente): Promise<string> {
    try {
      // Verificar se cliente já existe
      if (cliente.id) {
        await asaasAPI.updateCustomer(cliente.id, {
          name: cliente.nome,
          email: cliente.email,
          phone: cliente.telefone,
          mobilePhone: cliente.celular,
          cpfCnpj: cliente.cpf,
          postalCode: cliente.cep,
          address: cliente.endereco,
          addressNumber: cliente.numero,
          complement: cliente.complemento,
          province: cliente.bairro,
          city: cliente.cidade,
          state: cliente.estado,
          observations: cliente.observacoes
        });
        return cliente.id;
      } else {
        const response = await asaasAPI.createCustomer({
          name: cliente.nome,
          email: cliente.email,
          phone: cliente.telefone,
          mobilePhone: cliente.celular,
          cpfCnpj: cliente.cpf,
          postalCode: cliente.cep,
          address: cliente.endereco,
          addressNumber: cliente.numero,
          complement: cliente.complemento,
          province: cliente.bairro,
          city: cliente.cidade,
          state: cliente.estado,
          observations: cliente.observacoes
        });
        return response.id;
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar cliente:', error);
      throw error;
    }
  }

  // Criar pagamento PIX
  async criarPagamentoPix(dados: DadosPagamento): Promise<ResultadoPagamento> {
    try {
      const response = await asaasAPI.createPixPayment({
        customer: dados.clienteId,
        billingType: 'PIX',
        value: dados.valor,
        dueDate: dados.dataVencimento,
        description: dados.descricao,
        externalReference: dados.referencia,
        discount: dados.desconto ? {
          value: dados.desconto.valor,
          dueDateLimitDays: dados.desconto.diasLimite,
          type: dados.desconto.tipo
        } : undefined,
        interest: dados.juros ? {
          value: dados.juros.valor,
          type: dados.juros.tipo
        } : undefined,
        fine: dados.multa ? {
          value: dados.multa.valor,
          type: dados.multa.tipo
        } : undefined
      });

      // Gerar QR Code PIX
      const qrCodeData = await asaasAPI.getPixQrCode(response.id);

      return {
        sucesso: true,
        dados: {
          id: response.id,
          status: this.mapearStatus(response.status),
          valor: response.value,
          valorLiquido: response.netValue,
          dataVencimento: response.dueDate,
          dataPagamento: response.paymentDate,
          dataConfirmacao: response.confirmedDate,
          tipoPagamento: 'PIX',
          descricao: response.description,
          referencia: response.externalReference,
          qrCodePix: qrCodeData.encodedImage,
          pixCopiaECola: qrCodeData.payload,
          linkPagamento: response.invoiceUrl,
          cliente: {
            id: response.customer,
            nome: '',
            email: ''
          }
        }
      };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message,
        codigoErro: 'PIX_ERROR'
      };
    }
  }

  // Criar pagamento com cartão de crédito
  async criarPagamentoCartao(dados: DadosPagamento): Promise<ResultadoPagamento> {
    try {
      if (!dados.dadosCartao || !dados.dadosPortadorCartao) {
        throw new Error('Dados do cartão são obrigatórios');
      }

      const response = await asaasAPI.createCreditCardPayment({
        customer: dados.clienteId,
        billingType: 'CREDIT_CARD',
        value: dados.valor,
        dueDate: dados.dataVencimento,
        description: dados.descricao,
        externalReference: dados.referencia,
        installmentCount: dados.parcelas,
        installmentValue: dados.valorParcela,
        discount: dados.desconto ? {
          value: dados.desconto.valor,
          dueDateLimitDays: dados.desconto.diasLimite,
          type: dados.desconto.tipo
        } : undefined,
        interest: dados.juros ? {
          value: dados.juros.valor,
          type: dados.juros.tipo
        } : undefined,
        fine: dados.multa ? {
          value: dados.multa.valor,
          type: dados.multa.tipo
        } : undefined,
        creditCard: {
          holderName: dados.dadosCartao.nomePortador,
          number: dados.dadosCartao.numero,
          expiryMonth: dados.dadosCartao.mesVencimento,
          expiryYear: dados.dadosCartao.anoVencimento,
          ccv: dados.dadosCartao.codigoSeguranca
        },
        creditCardHolderInfo: {
          name: dados.dadosPortadorCartao.nome,
          email: dados.dadosPortadorCartao.email,
          cpfCnpj: dados.dadosPortadorCartao.cpf,
          postalCode: dados.dadosPortadorCartao.cep,
          addressNumber: dados.dadosPortadorCartao.numero,
          addressComplement: dados.dadosPortadorCartao.complemento,
          phone: dados.dadosPortadorCartao.telefone,
          mobilePhone: dados.dadosPortadorCartao.celular
        },
        remoteIp: dados.ipRemoto
      });

      return {
        sucesso: true,
        dados: {
          id: response.id,
          status: this.mapearStatus(response.status),
          valor: response.value,
          valorLiquido: response.netValue,
          dataVencimento: response.dueDate,
          dataPagamento: response.paymentDate,
          dataConfirmacao: response.confirmedDate,
          tipoPagamento: 'CREDIT_CARD',
          descricao: response.description,
          referencia: response.externalReference,
          linkPagamento: response.invoiceUrl,
          cliente: {
            id: response.customer,
            nome: '',
            email: ''
          }
        }
      };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message,
        codigoErro: 'CREDIT_CARD_ERROR'
      };
    }
  }

  // Criar pagamento por boleto
  async criarPagamentoBoleto(dados: DadosPagamento): Promise<ResultadoPagamento> {
    try {
      const response = await asaasAPI.createPayment({
        customer: dados.clienteId,
        billingType: 'BOLETO',
        value: dados.valor,
        dueDate: dados.dataVencimento,
        description: dados.descricao,
        externalReference: dados.referencia,
        discount: dados.desconto ? {
          value: dados.desconto.valor,
          dueDateLimitDays: dados.desconto.diasLimite,
          type: dados.desconto.tipo
        } : undefined,
        interest: dados.juros ? {
          value: dados.juros.valor,
          type: dados.juros.tipo
        } : undefined,
        fine: dados.multa ? {
          value: dados.multa.valor,
          type: dados.multa.tipo
        } : undefined,
        postalService: false
      });

      return {
        sucesso: true,
        dados: {
          id: response.id,
          status: this.mapearStatus(response.status),
          valor: response.value,
          valorLiquido: response.netValue,
          dataVencimento: response.dueDate,
          dataPagamento: response.paymentDate,
          dataConfirmacao: response.confirmedDate,
          tipoPagamento: 'BOLETO',
          descricao: response.description,
          referencia: response.externalReference,
          linkBoleto: response.bankSlipUrl,
          linkPagamento: response.invoiceUrl,
          cliente: {
            id: response.customer,
            nome: '',
            email: ''
          }
        }
      };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message,
        codigoErro: 'BOLETO_ERROR'
      };
    }
  }

  // Criar pré-autorização (caução)
  async criarPreAutorizacao(dados: DadosPreAutorizacao): Promise<ResultadoPreAutorizacao> {
    try {
      const response = await asaasAPI.createPreAuthorization({
        customer: dados.clienteId,
        value: dados.valor,
        description: dados.descricao,
        externalReference: dados.referencia,
        creditCard: {
          holderName: dados.dadosCartao.nomePortador,
          number: dados.dadosCartao.numero,
          expiryMonth: dados.dadosCartao.mesVencimento,
          expiryYear: dados.dadosCartao.anoVencimento,
          ccv: dados.dadosCartao.codigoSeguranca
        },
        creditCardHolderInfo: {
          name: dados.dadosPortadorCartao.nome,
          email: dados.dadosPortadorCartao.email,
          cpfCnpj: dados.dadosPortadorCartao.cpf,
          postalCode: dados.dadosPortadorCartao.cep,
          addressNumber: dados.dadosPortadorCartao.numero,
          addressComplement: dados.dadosPortadorCartao.complemento,
          phone: dados.dadosPortadorCartao.telefone,
          mobilePhone: dados.dadosPortadorCartao.celular
        }
      });

      return {
        sucesso: true,
        dados: {
          id: response.id,
          status: response.status,
          valor: response.value,
          dataExpiracao: response.expirationDate
        }
      };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message,
        codigoErro: 'PRE_AUTH_ERROR'
      };
    }
  }

  // Capturar pré-autorização
  async capturarPreAutorizacao(preAuthId: string, valor?: number): Promise<ResultadoPagamento> {
    try {
      const response = await asaasAPI.capturePreAuthorization(preAuthId, valor);

      return {
        sucesso: true,
        dados: {
          id: response.id,
          status: this.mapearStatus(response.status),
          valor: response.value,
          valorLiquido: response.netValue,
          dataVencimento: response.dueDate,
          dataPagamento: response.paymentDate,
          dataConfirmacao: response.confirmedDate,
          tipoPagamento: 'CREDIT_CARD',
          descricao: response.description,
          referencia: response.externalReference,
          cliente: {
            id: response.customer,
            nome: '',
            email: ''
          }
        }
      };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message,
        codigoErro: 'CAPTURE_ERROR'
      };
    }
  }

  // Cancelar pré-autorização
  async cancelarPreAutorizacao(preAuthId: string): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      await asaasAPI.cancelPreAuthorization(preAuthId);
      return { sucesso: true };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  // Consultar status do pagamento
  async consultarPagamento(pagamentoId: string): Promise<StatusPagamento | null> {
    try {
      const response = await asaasAPI.getPayment(pagamentoId);

      return {
        id: response.id,
        status: this.mapearStatus(response.status),
        valor: response.value,
        valorLiquido: response.netValue,
        dataVencimento: response.dueDate,
        dataPagamento: response.paymentDate,
        dataConfirmacao: response.confirmedDate,
        tipoPagamento: response.billingType,
        descricao: response.description,
        referencia: response.externalReference,
        linkBoleto: response.bankSlipUrl,
        linkPagamento: response.invoiceUrl,
        cliente: {
          id: response.customer,
          nome: '',
          email: ''
        }
      };
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      return null;
    }
  }

  // Cancelar pagamento
  async cancelarPagamento(pagamentoId: string): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      await asaasAPI.cancelPayment(pagamentoId);
      return { sucesso: true };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  // Estornar pagamento
  async estornarPagamento(
    pagamentoId: string, 
    valor?: number, 
    descricao?: string
  ): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      await asaasAPI.refundPayment(pagamentoId, valor, descricao);
      return { sucesso: true };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  // Mapear status do Asaas para nosso enum
  private mapearStatus(status: string): StatusPagamentoEnum {
    const statusMap: { [key: string]: StatusPagamentoEnum } = {
      'PENDING': StatusPagamentoEnum.PENDENTE,
      'AWAITING_PAYMENT': StatusPagamentoEnum.AGUARDANDO_PAGAMENTO,
      'RECEIVED': StatusPagamentoEnum.RECEBIDO,
      'CONFIRMED': StatusPagamentoEnum.CONFIRMADO,
      'OVERDUE': StatusPagamentoEnum.VENCIDO,
      'REFUNDED': StatusPagamentoEnum.ESTORNADO,
      'CANCELLED': StatusPagamentoEnum.CANCELADO
    };

    return statusMap[status] || StatusPagamentoEnum.PENDENTE;
  }

  // Validar dados do cartão
  validarDadosCartao(numero: string, mes: string, ano: string, cvv: string): boolean {
    // Validação básica do número do cartão (Luhn algorithm)
    const numeroLimpo = numero.replace(/\D/g, '');
    if (numeroLimpo.length < 13 || numeroLimpo.length > 19) return false;

    // Validar mês
    const mesNum = parseInt(mes);
    if (mesNum < 1 || mesNum > 12) return false;

    // Validar ano
    const anoNum = parseInt(ano);
    const anoAtual = new Date().getFullYear();
    if (anoNum < anoAtual || anoNum > anoAtual + 20) return false;

    // Validar CVV
    if (cvv.length < 3 || cvv.length > 4) return false;

    return true;
  }

  // Formatar número do cartão
  formatarNumeroCartao(numero: string): string {
    const numeroLimpo = numero.replace(/\D/g, '');
    return numeroLimpo.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // Identificar bandeira do cartão
  identificarBandeira(numero: string): string {
    const numeroLimpo = numero.replace(/\D/g, '');
    
    if (/^4/.test(numeroLimpo)) return 'Visa';
    if (/^5[1-5]/.test(numeroLimpo)) return 'Mastercard';
    if (/^3[47]/.test(numeroLimpo)) return 'American Express';
    if (/^6(?:011|5)/.test(numeroLimpo)) return 'Discover';
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(numeroLimpo)) return 'JCB';
    
    return 'Desconhecida';
  }
}

export const pagamentoService = new PagamentoService();