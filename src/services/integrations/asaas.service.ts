/**
 * Asaas Payment Gateway Integration Service
 *
 * Provides integration with Asaas API for:
 * - PIX payments
 * - Credit/Debit card payments
 * - Pre-authorizations (caução)
 * - Webhook handling
 *
 * Docs: https://docs.asaas.com/
 */

import axios, { AxiosInstance } from 'axios';

// =====================================================
// TYPES
// =====================================================

export type AsaasEnvironment = 'sandbox' | 'production';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export type PaymentStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH'
  | 'REFUND_REQUESTED'
  | 'CHARGEBACK_REQUESTED'
  | 'CHARGEBACK_DISPUTE'
  | 'AWAITING_CHARGEBACK_REVERSAL'
  | 'DUNNING_REQUESTED'
  | 'DUNNING_RECEIVED'
  | 'AWAITING_RISK_ANALYSIS';

export interface AsaasCustomer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
}

export interface AsaasPayment {
  id?: string;
  customer: string; // Customer ID
  billingType: PaymentMethod;
  value: number;
  dueDate: string; // YYYY-MM-DD
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  installmentValue?: number;
  discount?: {
    value?: number;
    dueDateLimitDays?: number;
    type?: 'FIXED' | 'PERCENTAGE';
  };
  interest?: {
    value: number;
  };
  fine?: {
    value: number;
    type?: 'FIXED' | 'PERCENTAGE';
  };
  postalService?: boolean;
  split?: Array<{
    walletId: string;
    fixedValue?: number;
    percentualValue?: number;
  }>;
  callback?: {
    successUrl: string;
    autoRedirect: boolean;
  };
}

export interface AsaasPixPaymentResponse {
  id: string;
  status: PaymentStatus;
  value: number;
  netValue: number;
  billingType: PaymentMethod;
  pixTransaction?: {
    qrCode: {
      encodedImage: string; // Base64 QR Code
      payload: string; // PIX copia e cola
      expirationDate: string;
    };
  };
  externalReference?: string;
}

export interface AsaasCardPayment {
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
  remoteIp: string;
}

export interface AsaasPreAuthorization {
  customer: string;
  billingType: 'CREDIT_CARD';
  value: number; // Full amount to authorize
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
  };
}

export interface AsaasCaptureRequest {
  value: number; // Amount to capture (can be partial)
}

export interface AsaasWebhookEvent {
  event: string;
  payment: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    billingType: PaymentMethod;
    status: PaymentStatus;
    description?: string;
    externalReference?: string;
    confirmedDate?: string;
    paymentDate?: string;
    clientPaymentDate?: string;
  };
}

// =====================================================
// ASAAS SERVICE
// =====================================================

class AsaasService {
  private client: AxiosInstance;
  private environment: AsaasEnvironment;

  constructor() {
    this.environment = (process.env.ASAAS_ENVIRONMENT as AsaasEnvironment) || 'sandbox';

    const baseURL =
      this.environment === 'production'
        ? 'https://api.asaas.com/v3'
        : 'https://sandbox.asaas.com/api/v3';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        access_token: process.env.ASAAS_API_KEY || '',
      },
      timeout: 30000, // 30 seconds
    });

    // Log requests in development
    if (this.environment === 'sandbox') {
      this.client.interceptors.request.use(
        (config) => {
          console.log('[Asaas Request]', config.method?.toUpperCase(), config.url);
          return config;
        },
        (error) => {
          console.error('[Asaas Request Error]', error);
          return Promise.reject(error);
        }
      );

      this.client.interceptors.response.use(
        (response) => {
          console.log('[Asaas Response]', response.status, response.config.url);
          return response;
        },
        (error) => {
          console.error('[Asaas Response Error]', error.response?.data || error.message);
          return Promise.reject(error);
        }
      );
    }
  }

  // =====================================================
  // CUSTOMER MANAGEMENT
  // =====================================================

  /**
   * Create a new customer in Asaas
   */
  async createCustomer(customer: AsaasCustomer): Promise<AsaasCustomer> {
    try {
      const response = await this.client.post('/customers', customer);
      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas createCustomer error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  /**
   * Get or create customer by CPF
   */
  async getOrCreateCustomer(customer: AsaasCustomer): Promise<AsaasCustomer> {
    try {
      // Search for existing customer by CPF
      const response = await this.client.get('/customers', {
        params: { cpfCnpj: customer.cpfCnpj },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }

      // Create new customer if not found
      return await this.createCustomer(customer);
    } catch (error: any) {
      throw new Error(`Asaas getOrCreateCustomer error: ${error.message}`);
    }
  }

  // =====================================================
  // PIX PAYMENTS
  // =====================================================

  /**
   * Create PIX payment
   * Returns QR Code and "copia e cola" for customer to pay
   */
  async createPixPayment(
    customer: string,
    value: number,
    description: string,
    externalReference?: string
  ): Promise<AsaasPixPaymentResponse> {
    try {
      const payload: AsaasPayment = {
        customer,
        billingType: 'PIX',
        value,
        dueDate: new Date().toISOString().split('T')[0], // Today
        description,
        externalReference,
      };

      const response = await this.client.post('/payments', payload);

      // Generate PIX QR Code
      const pixResponse = await this.client.get(`/payments/${response.data.id}/pixQrCode`);

      return {
        ...response.data,
        pixTransaction: pixResponse.data,
      };
    } catch (error: any) {
      throw new Error(`Asaas createPixPayment error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  // =====================================================
  // CREDIT/DEBIT CARD PAYMENTS
  // =====================================================

  /**
   * Create credit card payment
   * Charges immediately
   */
  async createCreditCardPayment(
    customer: string,
    value: number,
    description: string,
    cardData: AsaasCardPayment,
    externalReference?: string,
    installments?: number
  ): Promise<any> {
    try {
      const payload: any = {
        customer,
        billingType: 'CREDIT_CARD',
        value,
        dueDate: new Date().toISOString().split('T')[0],
        description,
        externalReference,
        ...cardData,
      };

      if (installments && installments > 1) {
        payload.installmentCount = installments;
        payload.installmentValue = value / installments;
      }

      const response = await this.client.post('/payments', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas createCreditCardPayment error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  /**
   * Create debit card payment
   */
  async createDebitCardPayment(
    customer: string,
    value: number,
    description: string,
    cardData: AsaasCardPayment,
    externalReference?: string
  ): Promise<any> {
    try {
      const payload: any = {
        customer,
        billingType: 'DEBIT_CARD',
        value,
        dueDate: new Date().toISOString().split('T')[0],
        description,
        externalReference,
        ...cardData,
      };

      const response = await this.client.post('/payments', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas createDebitCardPayment error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  // =====================================================
  // PRE-AUTHORIZATION (CAUÇÃO)
  // =====================================================

  /**
   * Create pre-authorization (caução)
   * Reserves the full amount on customer's card without charging
   */
  async createPreAuthorization(data: AsaasPreAuthorization): Promise<any> {
    try {
      // Create payment with authorizeOnly flag
      const response = await this.client.post('/payments', {
        ...data,
        authorizeOnly: true, // This creates pre-authorization
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas createPreAuthorization error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  /**
   * Capture pre-authorized amount (full or partial)
   */
  async capturePreAuthorization(paymentId: string, amount?: number): Promise<any> {
    try {
      const payload: AsaasCaptureRequest = amount ? { value: amount } : { value: 0 };

      // If amount is not specified, Asaas captures the full authorized amount
      const response = await this.client.post(`/payments/${paymentId}/captureAuthorizedPayment`, payload);

      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas capturePreAuthorization error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  /**
   * Release pre-authorization without charging
   */
  async releasePreAuthorization(paymentId: string): Promise<any> {
    try {
      const response = await this.client.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas releasePreAuthorization error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<any> {
    try {
      const response = await this.client.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas getPayment error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, value?: number, description?: string): Promise<any> {
    try {
      const payload: any = {};
      if (value) payload.value = value;
      if (description) payload.description = description;

      const response = await this.client.post(`/payments/${paymentId}/refund`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Asaas refundPayment error: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  // =====================================================
  // WEBHOOK VERIFICATION
  // =====================================================

  /**
   * Verify webhook signature (if Asaas provides it)
   * For now, we validate the webhook token in the route
   */
  verifyWebhook(payload: AsaasWebhookEvent, signature?: string): boolean {
    // Asaas doesn't provide HMAC signatures in webhooks
    // Security is handled by webhook token validation in the API route
    return true;
  }

  /**
   * Parse webhook event
   */
  parseWebhookEvent(payload: any): AsaasWebhookEvent {
    return payload as AsaasWebhookEvent;
  }
}

// Singleton instance
export const asaasService = new AsaasService();
