import axios, { AxiosInstance } from 'axios';
import { logger, sanitizarDadosParaLog } from '@/lib/utils/logger';

// Interface para erros da API Asaas
export interface AsaasErrorResponse {
  errors: Array<{
    code: string;
    description: string;
  }>;
  message?: string;
}

// Tipos para a API do Asaas
export interface AsaasCustomer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  country?: string;
  observations?: string;
}

export interface AsaasPayment {
  id?: string;
  customer: string; // ID do cliente
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  dueDate: string; // YYYY-MM-DD
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  installmentValue?: number;
  discount?: {
    value: number;
    dueDateLimitDays: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
  interest?: {
    value: number;
    type: 'PERCENTAGE';
  };
  fine?: {
    value: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
  postalService?: boolean;
  split?: Array<{
    walletId: string;
    fixedValue?: number;
    percentualValue?: number;
  }>;
}

export interface AsaasCreditCardPayment extends AsaasPayment {
  billingType: 'CREDIT_CARD';
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
    mobilePhone?: string;
  };
  remoteIp?: string;
}

export interface AsaasPixPayment extends AsaasPayment {
  billingType: 'PIX';
}

export interface AsaasWebhook {
  id: string;
  name: string;
  url: string;
  email?: string;
  sendType: 'SEQUENTIALLY' | 'NON_SEQUENTIALLY';
  apiVersion: number;
  enabled: boolean;
  interrupted: boolean;
  authToken?: string;
  events: Array<
    | 'PAYMENT_CREATED'
    | 'PAYMENT_AWAITING_PAYMENT'
    | 'PAYMENT_RECEIVED'
    | 'PAYMENT_CONFIRMED'
    | 'PAYMENT_OVERDUE'
    | 'PAYMENT_DELETED'
    | 'PAYMENT_RESTORED'
    | 'PAYMENT_REFUNDED'
    | 'PAYMENT_RECEIVED_IN_CASH_UNDONE'
    | 'PAYMENT_CHARGEBACK_REQUESTED'
    | 'PAYMENT_CHARGEBACK_DISPUTE'
    | 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL'
    | 'PAYMENT_DUNNING_RECEIVED'
    | 'PAYMENT_DUNNING_REQUESTED'
    | 'PAYMENT_BANK_SLIP_VIEWED'
    | 'PAYMENT_CHECKOUT_VIEWED'
  >;
}

export interface AsaasPreAuthorization {
  id?: string;
  customer: string;
  value: number;
  description?: string;
  externalReference?: string;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
    mobilePhone?: string;
  };
}

class AsaasAPI {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;
  
  // Configuração de retry
  private readonly retryConfig = {
    maxRetries: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    initialDelay: 1000, // 1 segundo
    backoffMultiplier: 2
  };

  constructor() {
    // Tentar carregar do process.env primeiro
    this.apiKey = process.env.ASAAS_API_KEY || '';

    // Fallback: carregar do arquivo de configuração se env não funcionar
    if (!this.apiKey) {
      try {
        const config = require('../../asaas.config.js');
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL;
        console.log('[Asaas API] Carregado do asaas.config.js (fallback)');
      } catch (error) {
        console.error('[Asaas API] ERRO: Não foi possível carregar configuração do Asaas');
        this.baseURL = 'https://sandbox.asaas.com/api/v3';
      }
    } else {
      this.baseURL = process.env.ASAAS_ENVIRONMENT === 'production'
        ? 'https://www.asaas.com/api/v3'
        : 'https://sandbox.asaas.com/api/v3';
    }

    // Validar API key
    if (!this.apiKey) {
      console.error('[Asaas API] ERRO: ASAAS_API_KEY não está configurada!');
      console.error('[Asaas API] Verifique se a variável está em .env.local ou asaas.config.js');
    } else {
      console.log('[Asaas API] Configurado com sucesso:', {
        environment: process.env.ASAAS_ENVIRONMENT || 'sandbox',
        baseURL: this.baseURL,
        apiKeyLength: this.apiKey.length,
        source: process.env.ASAAS_API_KEY ? 'env' : 'config file'
      });
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Interceptor para logs detalhados
    this.api.interceptors.request.use(
      (config) => {
        this.logRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', config.data);
        return config;
      },
      (error) => {
        logger.error('AsaasAPI', 'Request Interceptor Error', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        this.logResponse(response.status, response.data, response.config.url || '');
        return response;
      },
      (error) => {
        this.logError(error);
        return Promise.reject(error);
      }
    );
  }

  // Método de retry com backoff exponencial
  private async requestWithRetry<T>(
    fn: () => Promise<T>,
    context: string,
    maxRetries: number = this.retryConfig.maxRetries
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Primeira tentativa ou retry
        if (attempt > 0) {
          const delay = this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
          logger.info('AsaasAPI', `Retry ${attempt}/${maxRetries} para ${context}`, { 
            delay,
            attempt,
            maxRetries 
          });
          await this.sleep(delay);
        }
        
        const result = await fn();
        
        // Se chegou aqui, sucesso!
        if (attempt > 0) {
          logger.info('AsaasAPI', `Retry bem-sucedido para ${context}`, { attempt });
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        
        // Verificar se deve fazer retry
        const shouldRetry = this.shouldRetry(error, attempt, maxRetries);
        
        if (!shouldRetry) {
          logger.info('AsaasAPI', `Não será feito retry para ${context}`, {
            attempt,
            statusCode: error.response?.status,
            errorCode: error.code,
            reason: this.getNoRetryReason(error, attempt, maxRetries)
          });
          throw error;
        }
        
        logger.warn('AsaasAPI', `Tentativa ${attempt + 1} falhou para ${context}, será feito retry`, {
          attempt: attempt + 1,
          maxRetries,
          statusCode: error.response?.status,
          errorCode: error.code,
          errorMessage: error.message
        });
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    logger.error('AsaasAPI', `Todas as tentativas falharam para ${context}`, lastError, {
      totalAttempts: maxRetries + 1
    });
    throw lastError;
  }
  
  // Verificar se deve fazer retry
  private shouldRetry(error: any, attempt: number, maxRetries: number): boolean {
    // Não fazer retry se já atingiu o máximo de tentativas
    if (attempt >= maxRetries) {
      return false;
    }
    
    const statusCode = error.response?.status;
    
    // Não fazer retry para erros 4xx (validação, autenticação, etc)
    // Exceto 408 (Request Timeout) e 429 (Too Many Requests)
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      return this.retryConfig.retryableStatusCodes.includes(statusCode);
    }
    
    // Fazer retry para erros 5xx (servidor)
    if (statusCode && statusCode >= 500) {
      return this.retryConfig.retryableStatusCodes.includes(statusCode);
    }
    
    // Fazer retry para erros de rede/timeout
    if (error.code === 'ECONNABORTED' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ENETUNREACH') {
      return true;
    }
    
    return false;
  }
  
  // Obter razão para não fazer retry (para logs)
  private getNoRetryReason(error: any, attempt: number, maxRetries: number): string {
    if (attempt >= maxRetries) {
      return 'Máximo de tentativas atingido';
    }
    
    const statusCode = error.response?.status;
    
    if (statusCode && statusCode >= 400 && statusCode < 500 && 
        !this.retryConfig.retryableStatusCodes.includes(statusCode)) {
      return `Erro de validação/cliente (${statusCode}) - não é retentável`;
    }
    
    return 'Erro não retentável';
  }
  
  // Função auxiliar para sleep
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Gerenciamento de Clientes
  async createCustomer(customer: AsaasCustomer) {
    logger.info('AsaasAPI', 'Criando cliente', { customer: sanitizarDadosParaLog(customer) });
    
    try {
      const result = await this.requestWithRetry(
        async () => {
          const response = await this.api.post('/customers', customer);
          return response.data;
        },
        'createCustomer'
      );
      
      logger.info('AsaasAPI', 'Cliente criado com sucesso', { customerId: result.id });
      return result;
    } catch (error) {
      logger.error('AsaasAPI', 'Erro ao criar cliente', error as Error, { customer: sanitizarDadosParaLog(customer) });
      throw this.handleError(error, 'Erro ao criar cliente');
    }
  }

  async getCustomer(customerId: string) {
    try {
      const response = await this.api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar cliente');
    }
  }

  async updateCustomer(customerId: string, customer: Partial<AsaasCustomer>) {
    logger.info('AsaasAPI', 'Atualizando cliente', { customerId, customer: sanitizarDadosParaLog(customer) });
    
    try {
      const result = await this.requestWithRetry(
        async () => {
          const response = await this.api.post(`/customers/${customerId}`, customer);
          return response.data;
        },
        'updateCustomer'
      );
      
      logger.info('AsaasAPI', 'Cliente atualizado com sucesso', { customerId });
      return result;
    } catch (error) {
      logger.error('AsaasAPI', 'Erro ao atualizar cliente', error as Error, { customerId, customer: sanitizarDadosParaLog(customer) });
      throw this.handleError(error, 'Erro ao atualizar cliente');
    }
  }

  // Gerenciamento de Pagamentos
  async createPayment(payment: AsaasPayment) {
    try {
      const response = await this.api.post('/payments', payment);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar cobrança');
    }
  }

  async createCreditCardPayment(payment: AsaasCreditCardPayment) {
    try {
      const response = await this.api.post('/payments', payment);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao processar pagamento com cartão');
    }
  }

  async createPixPayment(payment: AsaasPixPayment) {
    try {
      const response = await this.api.post('/payments', payment);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar pagamento PIX');
    }
  }

  async getPayment(paymentId: string) {
    try {
      const response = await this.api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pagamento');
    }
  }

  async getPixQrCode(paymentId: string) {
    try {
      const response = await this.api.get(`/payments/${paymentId}/pixQrCode`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao gerar QR Code PIX');
    }
  }

  async cancelPayment(paymentId: string) {
    try {
      const response = await this.api.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao cancelar pagamento');
    }
  }

  async refundPayment(paymentId: string, value?: number, description?: string) {
    try {
      const data: any = {};
      if (value) data.value = value;
      if (description) data.description = description;

      const response = await this.api.post(`/payments/${paymentId}/refund`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao estornar pagamento');
    }
  }

  // Pré-autorização (Caução)
  async createPreAuthorization(preAuth: AsaasPreAuthorization) {
    try {
      const response = await this.api.post('/creditCard/preAuthorize', preAuth);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar pré-autorização');
    }
  }

  async capturePreAuthorization(preAuthId: string, value?: number) {
    try {
      const data = value ? { value } : {};
      const response = await this.api.post(`/creditCard/capture/${preAuthId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao capturar pré-autorização');
    }
  }

  async cancelPreAuthorization(preAuthId: string) {
    try {
      const response = await this.api.post(`/creditCard/cancel/${preAuthId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao cancelar pré-autorização');
    }
  }

  // Webhooks
  async createWebhook(webhook: Omit<AsaasWebhook, 'id'>) {
    try {
      const response = await this.api.post('/webhooks', webhook);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar webhook');
    }
  }

  async getWebhooks() {
    try {
      const response = await this.api.get('/webhooks');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao listar webhooks');
    }
  }

  async updateWebhook(webhookId: string, webhook: Partial<AsaasWebhook>) {
    try {
      const response = await this.api.post(`/webhooks/${webhookId}`, webhook);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao atualizar webhook');
    }
  }

  async deleteWebhook(webhookId: string) {
    try {
      const response = await this.api.delete(`/webhooks/${webhookId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao deletar webhook');
    }
  }

  // Utilitários
  private handleError(error: any, defaultMessage: string): Error {
    // Log detalhado do erro
    this.logError(error);

    const statusCode = error.response?.status;

    // Extrair mensagens específicas da Asaas
    if (error.response?.data) {
      const responseData = error.response.data as AsaasErrorResponse;
      
      // Caso 1: Array de erros estruturados
      if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        const errorMessages = responseData.errors
          .map((err) => {
            const code = err.code ? `[${err.code}]` : '';
            const description = err.description || 'Erro desconhecido';
            return `${code} ${description}`.trim();
          })
          .join('; ');
        
        const fullMessage = `${defaultMessage}: ${errorMessages}`;
        const newError = new Error(fullMessage);
        (newError as any).asaasErrors = responseData.errors;
        (newError as any).statusCode = statusCode;
        return newError;
      }
      
      // Caso 2: Mensagem simples
      if (responseData.message) {
        const fullMessage = `${defaultMessage}: ${responseData.message}`;
        const newError = new Error(fullMessage);
        (newError as any).statusCode = statusCode;
        return newError;
      }
    }

    // Caso 3: Erro de rede ou timeout
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      const newError = new Error(`${defaultMessage}: Timeout na conexão com Asaas`);
      (newError as any).isTimeout = true;
      return newError;
    }

    if (error.code === 'ECONNREFUSED') {
      const newError = new Error(`${defaultMessage}: Não foi possível conectar ao servidor Asaas`);
      (newError as any).isNetworkError = true;
      return newError;
    }

    // Caso 4: Erro genérico
    const fullMessage = error.message 
      ? `${defaultMessage}: ${error.message}`
      : defaultMessage;
    
    const newError = new Error(fullMessage);
    (newError as any).statusCode = statusCode;
    return newError;
  }

  // Métodos de logging
  private logRequest(method: string, url: string, data?: any): void {
    logger.info('AsaasAPI', `Request: ${method} ${url}`, {
      method,
      url,
      data: data ? sanitizarDadosParaLog(data) : undefined
    });
  }

  private logResponse(status: number, data: any, url: string): void {
    logger.info('AsaasAPI', `Response: ${status} from ${url}`, {
      status,
      url,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : []
    });
  }

  private logError(error: any): void {
    const errorData: any = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      code: error.code,
      stack: error.stack
    };

    // Adicionar dados da resposta de erro
    if (error.response?.data) {
      const responseData = error.response.data;
      
      // Se for um erro estruturado da Asaas
      if (responseData.errors && Array.isArray(responseData.errors)) {
        errorData.asaasErrors = responseData.errors.map((err: any) => ({
          code: err.code,
          description: err.description
        }));
      }
      
      // Incluir mensagem se houver
      if (responseData.message) {
        errorData.asaasMessage = responseData.message;
      }
      
      // Incluir resposta completa para debug
      errorData.responseData = responseData;
    }

    // Adicionar dados da requisição (sanitizados)
    if (error.config?.data) {
      try {
        const requestData = typeof error.config.data === 'string' 
          ? JSON.parse(error.config.data) 
          : error.config.data;
        errorData.requestData = sanitizarDadosParaLog(requestData);
      } catch (e) {
        errorData.requestData = '[Não foi possível parsear dados da requisição]';
      }
    }

    // Adicionar headers da requisição (sem token)
    if (error.config?.headers) {
      const headers = { ...error.config.headers };
      if (headers.access_token) {
        headers.access_token = '[REDACTED]';
      }
      errorData.requestHeaders = headers;
    }

    logger.error('AsaasAPI', 'Response Error', error, errorData);
  }

  // Validar webhook
  validateWebhook(payload: string, signature: string): boolean {
    // Implementar validação de assinatura do webhook
    // O Asaas usa HMAC-SHA256 para assinar os webhooks
    const crypto = require('crypto');
    const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET || '';
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }
}

export const asaasAPI = new AsaasAPI();