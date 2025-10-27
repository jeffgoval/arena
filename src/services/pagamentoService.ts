import { asaasAPI } from '@/lib/asaas';
import { logger, sanitizarDadosParaLog } from '@/lib/utils/logger';
import { clienteValidator, DadosCliente } from '@/lib/validators/clienteValidator';
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
    logger.info('PagamentoService', 'Iniciando criação/atualização de cliente', {
      clienteId: cliente.id,
      temCPF: !!cliente.cpf,
      temEmail: !!cliente.email,
      temEndereco: !!cliente.endereco
    });

    try {
      // Se tem ID, verificar se o cliente ainda existe no Asaas
      if (cliente.id) {
        try {
          await asaasAPI.getCustomer(cliente.id);
          logger.info('PagamentoService', 'Cliente existe no Asaas, atualizando', { clienteId: cliente.id });
        } catch (error: any) {
          // Se o cliente não existe mais (404 ou invalid_customer), criar um novo
          if (error.message?.includes('404') || error.message?.includes('invalid_customer') || error.message?.includes('não encontrado')) {
            logger.info('PagamentoService', 'Cliente não existe mais no Asaas, será criado um novo', { clienteIdAntigo: cliente.id });
            cliente.id = undefined; // Força criação de novo cliente
          } else {
            throw error;
          }
        }
      }
      // Converter Cliente para DadosCliente (formato do validator)
      const dadosParaValidar: DadosCliente = {
        name: cliente.nome,
        email: cliente.email,
        cpfCnpj: cliente.cpf,
        phone: cliente.telefone,
        mobilePhone: cliente.celular,
        postalCode: cliente.cep,
        address: cliente.endereco,
        addressNumber: cliente.numero,
        complement: cliente.complemento,
        province: cliente.bairro,
        observations: cliente.observacoes
      };

      // Validar dados do cliente
      logger.info('PagamentoService', 'Validando dados do cliente', {
        clienteId: cliente.id
      });

      const validacao = clienteValidator.validarDadosCliente(dadosParaValidar);

      // Se houver avisos, registrar no log
      if (validacao.avisos.length > 0) {
        logger.info('PagamentoService', 'Avisos na validação do cliente', {
          clienteId: cliente.id,
          avisos: validacao.avisos
        });
      }

      // Se a validação falhar, lançar erro com mensagens claras
      if (!validacao.valido) {
        const mensagemErro = `Dados do cliente inválidos: ${validacao.erros.join(', ')}`;
        logger.error('PagamentoService', 'Validação de cliente falhou', new Error(mensagemErro), {
          clienteId: cliente.id,
          erros: validacao.erros,
          avisos: validacao.avisos
        });
        
        throw new Error(mensagemErro);
      }

      logger.info('PagamentoService', 'Validação do cliente concluída com sucesso', {
        clienteId: cliente.id
      });

      // Sanitizar dados (remove campos vazios e faz trim)
      const dadosSanitizados = clienteValidator.sanitizarDados(dadosParaValidar);

      // Garantir que cpfCnpj está presente (já validado acima)
      if (!dadosSanitizados.cpfCnpj) {
        throw new Error('CPF/CNPJ é obrigatório para criar cliente');
      }

      // Construir objeto no formato AsaasCustomer
      const customerData: any = {
        name: dadosSanitizados.name,
        email: dadosSanitizados.email,
        cpfCnpj: dadosSanitizados.cpfCnpj
      };

      // Adicionar campos opcionais apenas se presentes
      if (dadosSanitizados.phone) customerData.phone = dadosSanitizados.phone;
      if (dadosSanitizados.mobilePhone) customerData.mobilePhone = dadosSanitizados.mobilePhone;
      if (dadosSanitizados.postalCode) customerData.postalCode = dadosSanitizados.postalCode;
      if (dadosSanitizados.address) customerData.address = dadosSanitizados.address;
      if (dadosSanitizados.addressNumber) customerData.addressNumber = dadosSanitizados.addressNumber;
      if (dadosSanitizados.complement) customerData.complement = dadosSanitizados.complement;
      if (dadosSanitizados.province) customerData.province = dadosSanitizados.province;
      if (dadosSanitizados.observations) customerData.observations = dadosSanitizados.observations;

      logger.info('PagamentoService', 'Dados do cliente sanitizados', {
        clienteId: cliente.id,
        camposPreenchidos: Object.keys(customerData),
        dadosSanitizados: sanitizarDadosParaLog(customerData)
      });

      // Verificar se cliente já existe
      if (cliente.id) {
        logger.info('PagamentoService', 'Atualizando cliente existente', { clienteId: cliente.id });
        await asaasAPI.updateCustomer(cliente.id, customerData);
        logger.info('PagamentoService', 'Cliente atualizado com sucesso', { clienteId: cliente.id });
        return cliente.id;
      } else {
        logger.info('PagamentoService', 'Criando novo cliente');
        const response = await asaasAPI.createCustomer(customerData);
        logger.info('PagamentoService', 'Novo cliente criado com sucesso', { clienteId: response.id });
        return response.id;
      }
    } catch (error) {
      logger.error('PagamentoService', 'Erro ao criar/atualizar cliente', error as Error, {
        clienteId: cliente.id,
        dadosCliente: sanitizarDadosParaLog(cliente)
      });
      throw error;
    }
  }

  // Criar pagamento PIX
  async criarPagamentoPix(dados: DadosPagamento): Promise<ResultadoPagamento> {
    logger.info('PagamentoService', 'Iniciando criação de pagamento PIX', {
      clienteId: dados.clienteId,
      valor: dados.valor,
      referencia: dados.referencia
    });

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

      logger.info('PagamentoService', 'Pagamento PIX criado com sucesso', {
        pagamentoId: response.id,
        status: response.status,
        valor: response.value
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
      logger.error('PagamentoService', 'Erro ao criar pagamento PIX', error, {
        clienteId: dados.clienteId,
        valor: dados.valor,
        referencia: dados.referencia
      });
      return {
        sucesso: false,
        erro: error.message,
        codigoErro: 'PIX_ERROR'
      };
    }
  }

  // Criar pagamento com cartão de crédito
  async criarPagamentoCartao(dados: DadosPagamento): Promise<ResultadoPagamento> {
    logger.info('PagamentoService', 'Iniciando criação de pagamento com cartão', {
      clienteId: dados.clienteId,
      valor: dados.valor,
      parcelas: dados.parcelas,
      referencia: dados.referencia
    });

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

      logger.info('PagamentoService', 'Pagamento com cartão criado com sucesso', {
        pagamentoId: response.id,
        status: response.status,
        valor: response.value
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
      logger.error('PagamentoService', 'Erro ao criar pagamento com cartão', error, {
        clienteId: dados.clienteId,
        valor: dados.valor,
        parcelas: dados.parcelas,
        referencia: dados.referencia
      });
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