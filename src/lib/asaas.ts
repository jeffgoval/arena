import axios, { AxiosInstance } from 'axios';

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

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || '';
    this.baseURL = process.env.ASAAS_ENVIRONMENT === 'production' 
      ? 'https://www.asaas.com/api/v3'
      : 'https://sandbox.asaas.com/api/v3';

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Interceptor para logs
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[Asaas API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Asaas API] Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`[Asaas API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[Asaas API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Gerenciamento de Clientes
  async createCustomer(customer: AsaasCustomer) {
    try {
      const response = await this.api.post('/customers', customer);
      return response.data;
    } catch (error) {
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
    try {
      const response = await this.api.post(`/customers/${customerId}`, customer);
      return response.data;
    } catch (error) {
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
  private handleError(error: any, defaultMessage: string) {
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = errors.map((err: any) => err.description || err.message).join(', ');
      return new Error(`${defaultMessage}: ${errorMessages}`);
    }
    
    if (error.response?.data?.message) {
      return new Error(`${defaultMessage}: ${error.response.data.message}`);
    }

    return new Error(`${defaultMessage}: ${error.message}`);
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