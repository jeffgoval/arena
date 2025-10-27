/**
 * Helper para logging de webhooks
 * Registra todas as requisições de webhook no banco para auditoria e debug
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

export interface WebhookLogData {
  requestId: string;
  eventType: string;
  asaasPaymentId?: string;
  payload: any;
  signature: string;
  status: 'received' | 'success' | 'error' | 'invalid_signature' | 'processing';
  errorMessage?: string;
  errorStack?: string;
  processingTimeMs?: number;
}

export class WebhookLogger {

  /**
   * Registra que webhook foi recebido
   */
  static async logReceived(
    requestId: string,
    payload: string,
    signature: string
  ): Promise<void> {
    try {
      const supabase = await createClient();

      let parsedPayload: any = {};
      let eventType = 'UNKNOWN';
      let asaasPaymentId: string | undefined;

      try {
        parsedPayload = JSON.parse(payload);
        eventType = parsedPayload.event || 'UNKNOWN';
        asaasPaymentId = parsedPayload.payment?.id;
      } catch {
        // Se não conseguir fazer parse, salvar como string
        parsedPayload = { raw: payload };
      }

      await supabase.from('webhook_logs').insert({
        request_id: requestId,
        event_type: eventType,
        asaas_payment_id: asaasPaymentId,
        payload: parsedPayload,
        signature,
        status: 'received',
        created_at: new Date().toISOString()
      });

      logger.info('WebhookLogger', 'Webhook recebido', {
        requestId,
        eventType,
        asaasPaymentId
      });
    } catch (error) {
      // Não falhar o webhook se logging falhar
      logger.error('WebhookLogger', 'Erro ao registrar webhook recebido', error as Error, {
        requestId
      });
    }
  }

  /**
   * Atualiza status para invalid_signature
   */
  static async logInvalidSignature(
    requestId: string,
    payload: string
  ): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase
        .from('webhook_logs')
        .update({
          status: 'invalid_signature',
          error_message: 'Assinatura do webhook não é válida',
          updated_at: new Date().toISOString()
        })
        .eq('request_id', requestId);

      logger.warn('WebhookLogger', 'Assinatura inválida detectada', {
        requestId,
        payloadLength: payload.length
      });
    } catch (error) {
      logger.error('WebhookLogger', 'Erro ao registrar assinatura inválida', error as Error, {
        requestId
      });
    }
  }

  /**
   * Atualiza status para processing
   */
  static async logProcessing(
    requestId: string,
    eventType: string,
    paymentId: string
  ): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase
        .from('webhook_logs')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('request_id', requestId);

      logger.info('WebhookLogger', 'Processando webhook', {
        requestId,
        eventType,
        paymentId
      });
    } catch (error) {
      logger.error('WebhookLogger', 'Erro ao atualizar status para processing', error as Error, {
        requestId
      });
    }
  }

  /**
   * Registra sucesso no processamento
   */
  static async logSuccess(
    requestId: string,
    processingTimeMs: number
  ): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase
        .from('webhook_logs')
        .update({
          status: 'success',
          processing_time_ms: processingTimeMs,
          updated_at: new Date().toISOString()
        })
        .eq('request_id', requestId);

      logger.info('WebhookLogger', 'Webhook processado com sucesso', {
        requestId,
        processingTimeMs
      });
    } catch (error) {
      logger.error('WebhookLogger', 'Erro ao registrar sucesso', error as Error, {
        requestId
      });
    }
  }

  /**
   * Registra erro no processamento
   */
  static async logError(
    requestId: string,
    error: Error,
    processingTimeMs: number
  ): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase
        .from('webhook_logs')
        .update({
          status: 'error',
          error_message: error.message,
          error_stack: error.stack,
          processing_time_ms: processingTimeMs,
          updated_at: new Date().toISOString()
        })
        .eq('request_id', requestId);

      logger.error('WebhookLogger', 'Erro ao processar webhook', error, {
        requestId,
        processingTimeMs
      });
    } catch (logError) {
      logger.error('WebhookLogger', 'Erro ao registrar erro do webhook', logError as Error, {
        requestId,
        originalError: error.message
      });
    }
  }

  /**
   * Busca logs de um pagamento específico
   */
  static async getLogsForPayment(asaasPaymentId: string): Promise<WebhookLogData[]> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('asaas_payment_id', asaasPaymentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as WebhookLogData[];
    } catch (error) {
      logger.error('WebhookLogger', 'Erro ao buscar logs de pagamento', error as Error, {
        asaasPaymentId
      });
      return [];
    }
  }

  /**
   * Busca webhooks que falharam recentemente (para retry)
   */
  static async getRecentFailures(minutesAgo: number = 60): Promise<WebhookLogData[]> {
    try {
      const supabase = await createClient();

      const timeLimit = new Date();
      timeLimit.setMinutes(timeLimit.getMinutes() - minutesAgo);

      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('status', 'error')
        .gte('created_at', timeLimit.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as WebhookLogData[];
    } catch (error) {
      logger.error('WebhookLogger', 'Erro ao buscar falhas recentes', error as Error);
      return [];
    }
  }

  /**
   * Estatísticas de webhooks
   */
  static async getStats(hoursAgo: number = 24): Promise<{
    total: number;
    success: number;
    error: number;
    invalidSignature: number;
    avgProcessingTime: number;
  }> {
    try {
      const supabase = await createClient();

      const timeLimit = new Date();
      timeLimit.setHours(timeLimit.getHours() - hoursAgo);

      const { data, error } = await supabase
        .from('webhook_logs')
        .select('status, processing_time_ms')
        .gte('created_at', timeLimit.toISOString());

      if (error) throw error;

      const stats = {
        total: data.length,
        success: data.filter(log => log.status === 'success').length,
        error: data.filter(log => log.status === 'error').length,
        invalidSignature: data.filter(log => log.status === 'invalid_signature').length,
        avgProcessingTime: 0
      };

      const processingTimes = data
        .filter(log => log.processing_time_ms !== null)
        .map(log => log.processing_time_ms as number);

      if (processingTimes.length > 0) {
        stats.avgProcessingTime = Math.round(
          processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
        );
      }

      return stats;
    } catch (error) {
      logger.error('WebhookLogger', 'Erro ao calcular estatísticas', error as Error);
      return {
        total: 0,
        success: 0,
        error: 0,
        invalidSignature: 0,
        avgProcessingTime: 0
      };
    }
  }
}
