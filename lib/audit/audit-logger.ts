/**
 * AUDIT LOGGER - Sistema de Auditoria para Ações Críticas
 *
 * Registra todas as ações que envolvem:
 * - Transações financeiras
 * - Alterações de permissões
 * - Modificações de dados sensíveis
 * - Operações administrativas
 */

export enum AuditAction {
  // Transações Financeiras
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  CREDIT_ADDED = 'CREDIT_ADDED',
  CREDIT_DEDUCTED = 'CREDIT_DEDUCTED',

  // Reservas
  RESERVATION_CREATED = 'RESERVATION_CREATED',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  RESERVATION_MODIFIED = 'RESERVATION_MODIFIED',

  // Usuários e Permissões
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_BANNED = 'USER_BANNED',
  USER_UNBANNED = 'USER_UNBANNED',
  ROLE_CHANGED = 'ROLE_CHANGED',

  // Configurações
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  COURT_CREATED = 'COURT_CREATED',
  COURT_UPDATED = 'COURT_UPDATED',
  COURT_DELETED = 'COURT_DELETED',
  PRICING_UPDATED = 'PRICING_UPDATED',

  // Indicações e Créditos
  REFERRAL_CREATED = 'REFERRAL_CREATED',
  REFERRAL_BONUS_APPLIED = 'REFERRAL_BONUS_APPLIED'
}

interface AuditEntry {
  id: string;
  action: AuditAction;
  userId: string;
  userEmail?: string;
  userRole?: string;
  targetId?: string; // ID do recurso afetado
  targetType?: string; // Tipo do recurso (user, reservation, payment, etc)
  before?: any; // Estado anterior (para updates)
  after?: any; // Estado posterior (para updates)
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

// Store de auditoria (últimos 10000 eventos)
const auditLog: AuditEntry[] = [];
const MAX_AUDIT_ENTRIES = 10000;

/**
 * Registrar evento de auditoria
 */
export function logAuditEvent(
  action: AuditAction,
  userId: string,
  details: {
    userEmail?: string;
    userRole?: string;
    targetId?: string;
    targetType?: string;
    before?: any;
    after?: any;
    metadata?: Record<string, any>;
    ip?: string;
    userAgent?: string;
  } = {}
): void {
  const entry: AuditEntry = {
    id: generateAuditId(),
    action,
    userId,
    userEmail: details.userEmail,
    userRole: details.userRole,
    targetId: details.targetId,
    targetType: details.targetType,
    before: details.before,
    after: details.after,
    metadata: details.metadata,
    ip: details.ip,
    userAgent: details.userAgent,
    timestamp: new Date().toISOString()
  };

  // Adicionar ao store
  auditLog.unshift(entry);

  // Limitar tamanho
  if (auditLog.length > MAX_AUDIT_ENTRIES) {
    auditLog.pop();
  }

  // Log no console
  console.log(`📋 [AUDIT] ${action}`, {
    userId,
    targetId: details.targetId,
    targetType: details.targetType,
    timestamp: entry.timestamp
  });

  // PRODUÇÃO: Enviar para banco de dados permanente
  if (process.env.NODE_ENV === 'production') {
    saveAuditToDatabase(entry);
  }
}

/**
 * Gerar ID único para entrada de auditoria
 */
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Salvar auditoria no banco de dados (implementar conforme necessário)
 */
async function saveAuditToDatabase(entry: AuditEntry): Promise<void> {
  // TODO: Implementar integração com Supabase
  // await supabase.from('audit_log').insert(entry);

  // Ou enviar para serviço externo (AWS CloudTrail, etc)
  if (process.env.AUDIT_WEBHOOK_URL) {
    try {
      await fetch(process.env.AUDIT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (err) {
      console.error('[AUDIT] Failed to send to webhook:', err);
    }
  }
}

/**
 * Obter log de auditoria (para dashboard de admin)
 */
export function getAuditLog(filters?: {
  userId?: string;
  action?: AuditAction;
  targetId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): AuditEntry[] {
  let filtered = auditLog;

  if (filters?.userId) {
    filtered = filtered.filter(e => e.userId === filters.userId);
  }

  if (filters?.action) {
    filtered = filtered.filter(e => e.action === filters.action);
  }

  if (filters?.targetId) {
    filtered = filtered.filter(e => e.targetId === filters.targetId);
  }

  if (filters?.startDate) {
    filtered = filtered.filter(e => new Date(e.timestamp) >= filters.startDate!);
  }

  if (filters?.endDate) {
    filtered = filtered.filter(e => new Date(e.timestamp) <= filters.endDate!);
  }

  const limit = filters?.limit || 100;
  return filtered.slice(0, limit);
}

/**
 * Obter estatísticas de auditoria
 */
export function getAuditStats(): {
  totalEntries: number;
  byAction: Array<{ action: AuditAction; count: number }>;
  byUser: Array<{ userId: string; count: number }>;
  financialTransactions: number;
} {
  const actionCounts = new Map<AuditAction, number>();
  const userCounts = new Map<string, number>();

  let financialTransactions = 0;

  auditLog.forEach(entry => {
    actionCounts.set(entry.action, (actionCounts.get(entry.action) || 0) + 1);
    userCounts.set(entry.userId, (userCounts.get(entry.userId) || 0) + 1);

    // Contar transações financeiras
    if (entry.action.startsWith('PAYMENT_') || entry.action.startsWith('CREDIT_')) {
      financialTransactions++;
    }
  });

  const byAction = Array.from(actionCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([action, count]) => ({ action, count }));

  const byUser = Array.from(userCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([userId, count]) => ({ userId, count }));

  return {
    totalEntries: auditLog.length,
    byAction,
    byUser,
    financialTransactions
  };
}

/**
 * Limpar entradas antigas (chamado por cron job)
 */
export function cleanupOldAuditEntries(daysToKeep: number = 90): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const initialLength = auditLog.length;

  const filtered = auditLog.filter(e => {
    const entryDate = new Date(e.timestamp);
    return entryDate > cutoffDate;
  });

  auditLog.length = 0;
  auditLog.push(...filtered);

  const removed = initialLength - auditLog.length;

  if (removed > 0) {
    console.log(`[AUDIT] Cleaned up ${removed} old entries`);
  }

  return removed;
}

/**
 * Exportar log de auditoria (para compliance)
 */
export function exportAuditLog(format: 'json' | 'csv' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(auditLog, null, 2);
  }

  if (format === 'csv') {
    const headers = ['ID', 'Timestamp', 'Action', 'User ID', 'Target ID', 'IP'];
    const rows = auditLog.map(e => [
      e.id,
      e.timestamp,
      e.action,
      e.userId,
      e.targetId || '',
      e.ip || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  return '';
}
