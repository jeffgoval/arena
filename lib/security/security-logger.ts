/**
 * SECURITY LOGGER - Sistema Centralizado de Logs de Segurança
 *
 * Todos os eventos de segurança devem ser logados aqui
 * Em produção, envia para Sentry, LogRocket, ou serviço de monitoring
 */

export enum SecurityEventType {
  // Autenticação
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_BLOCKED = 'LOGIN_BLOCKED',
  LOGOUT = 'LOGOUT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Autorização
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  PRIVILEGE_ESCALATION_ATTEMPT = 'PRIVILEGE_ESCALATION_ATTEMPT',
  BANNED_USER_ACCESS = 'BANNED_USER_ACCESS',
  SUSPENDED_USER_ACCESS = 'SUSPENDED_USER_ACCESS',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_BLOCKED = 'RATE_LIMIT_BLOCKED',

  // Ataques
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  CSRF_ATTEMPT = 'CSRF_ATTEMPT',
  INVALID_ROLE_INJECTION = 'INVALID_ROLE_INJECTION',

  // Transações Financeiras
  PAYMENT_FRAUD_SUSPECTED = 'PAYMENT_FRAUD_SUSPECTED',
  UNUSUAL_PAYMENT_PATTERN = 'UNUSUAL_PAYMENT_PATTERN',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  // Sistema
  DATABASE_ERROR = 'DATABASE_ERROR',
  API_ERROR = 'API_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR'
}

export enum SecurityLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

interface SecurityEvent {
  type: SecurityEventType;
  level: SecurityLevel;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Store de eventos (últimos 1000)
const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 1000;

/**
 * Registrar evento de segurança
 */
export function logSecurityEvent(
  type: SecurityEventType,
  level: SecurityLevel,
  details?: {
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    path?: string;
    method?: string;
    [key: string]: any;
  }
): void {
  const event: SecurityEvent = {
    type,
    level,
    userId: details?.userId,
    email: details?.email,
    ip: details?.ip,
    userAgent: details?.userAgent,
    path: details?.path,
    method: details?.method,
    details,
    timestamp: new Date().toISOString()
  };

  // Adicionar ao store
  securityEvents.unshift(event);

  // Limitar tamanho
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.pop();
  }

  // Log no console com formatação
  const emoji = getEmojiForLevel(level);
  const color = getColorForLevel(level);

  console.log(`${emoji} [SECURITY] ${type}`, {
    level,
    ...details,
    timestamp: event.timestamp
  });

  // PRODUÇÃO: Enviar para serviço externo
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService(event);
  }

  // CRÍTICO: Enviar alerta imediato
  if (level === SecurityLevel.CRITICAL) {
    sendCriticalAlert(event);
  }
}

/**
 * Helpers
 */
function getEmojiForLevel(level: SecurityLevel): string {
  switch (level) {
    case SecurityLevel.INFO: return 'ℹ️';
    case SecurityLevel.WARNING: return '⚠️';
    case SecurityLevel.ERROR: return '❌';
    case SecurityLevel.CRITICAL: return '🚨';
  }
}

function getColorForLevel(level: SecurityLevel): string {
  switch (level) {
    case SecurityLevel.INFO: return '\x1b[36m'; // Cyan
    case SecurityLevel.WARNING: return '\x1b[33m'; // Yellow
    case SecurityLevel.ERROR: return '\x1b[31m'; // Red
    case SecurityLevel.CRITICAL: return '\x1b[35m'; // Magenta
  }
}

/**
 * Enviar para serviço de monitoring (Sentry, LogRocket, etc)
 */
async function sendToMonitoringService(event: SecurityEvent): Promise<void> {
  // TODO: Implementar integração com Sentry
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureMessage(event.type, {
  //     level: event.level.toLowerCase(),
  //     extra: event.details
  //   });
  // }

  // TODO: Implementar integração com webhook customizado
  if (process.env.SECURITY_WEBHOOK_URL) {
    try {
      await fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (err) {
      console.error('[SECURITY] Failed to send to webhook:', err);
    }
  }
}

/**
 * Enviar alerta crítico (email, SMS, Slack, etc)
 */
async function sendCriticalAlert(event: SecurityEvent): Promise<void> {
  console.error('🚨🚨🚨 CRITICAL SECURITY EVENT 🚨🚨🚨', event);

  // TODO: Enviar email/SMS/Slack para administradores
  // if (process.env.ALERT_EMAIL) {
  //   await sendEmail({
  //     to: process.env.ALERT_EMAIL,
  //     subject: `🚨 CRITICAL: ${event.type}`,
  //     body: JSON.stringify(event, null, 2)
  //   });
  // }

  // TODO: Enviar para Slack
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 *CRITICAL SECURITY EVENT*\n\`\`\`\n${JSON.stringify(event, null, 2)}\n\`\`\``
        })
      });
    } catch (err) {
      console.error('[SECURITY] Failed to send Slack alert:', err);
    }
  }
}

/**
 * Obter eventos recentes (para dashboard de admin)
 */
export function getRecentSecurityEvents(limit: number = 100): SecurityEvent[] {
  return securityEvents.slice(0, limit);
}

/**
 * Obter eventos por tipo
 */
export function getEventsByType(type: SecurityEventType): SecurityEvent[] {
  return securityEvents.filter(e => e.type === type);
}

/**
 * Obter eventos por usuário
 */
export function getEventsByUser(userId: string): SecurityEvent[] {
  return securityEvents.filter(e => e.userId === userId);
}

/**
 * Obter estatísticas de segurança
 */
export function getSecurityStats(): {
  totalEvents: number;
  criticalCount: number;
  errorCount: number;
  warningCount: number;
  topEvents: Array<{ type: SecurityEventType; count: number }>;
  topUsers: Array<{ userId: string; count: number }>;
} {
  const critical = securityEvents.filter(e => e.level === SecurityLevel.CRITICAL).length;
  const error = securityEvents.filter(e => e.level === SecurityLevel.ERROR).length;
  const warning = securityEvents.filter(e => e.level === SecurityLevel.WARNING).length;

  // Top events
  const eventCounts = new Map<SecurityEventType, number>();
  securityEvents.forEach(e => {
    eventCounts.set(e.type, (eventCounts.get(e.type) || 0) + 1);
  });
  const topEvents = Array.from(eventCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  // Top users
  const userCounts = new Map<string, number>();
  securityEvents.forEach(e => {
    if (e.userId) {
      userCounts.set(e.userId, (userCounts.get(e.userId) || 0) + 1);
    }
  });
  const topUsers = Array.from(userCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([userId, count]) => ({ userId, count }));

  return {
    totalEvents: securityEvents.length,
    criticalCount: critical,
    errorCount: error,
    warningCount: warning,
    topEvents,
    topUsers
  };
}

/**
 * Limpar eventos antigos (chamado por cron job)
 */
export function cleanupOldEvents(daysToKeep: number = 30): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const initialLength = securityEvents.length;

  const filtered = securityEvents.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate > cutoffDate;
  });

  securityEvents.length = 0;
  securityEvents.push(...filtered);

  const removed = initialLength - securityEvents.length;

  if (removed > 0) {
    console.log(`[SECURITY] Cleaned up ${removed} old events`);
  }

  return removed;
}
