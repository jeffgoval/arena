/**
 * RATE LIMITER - Sistema de Limitação de Taxa
 *
 * Implementação em memória (para desenvolvimento)
 * PRODUÇÃO: Usar Redis ou Vercel KV
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
  message?: string;
}

// Store em memória (limpa a cada 1 hora)
const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

// Configs por tipo de endpoint
export const RATE_LIMITS = {
  // Autenticação - muito restritivo
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueio
    message: 'Muitas tentativas de login. Tente novamente em 30 minutos.'
  },

  // Dashboard - moderado
  DASHBOARD: {
    maxRequests: 60,
    windowMs: 1 * 60 * 1000, // 1 minuto
    blockDurationMs: 5 * 60 * 1000, // 5 minutos
    message: 'Muitas requisições. Aguarde alguns minutos.'
  },

  // API - normal
  API: {
    maxRequests: 30,
    windowMs: 1 * 60 * 1000, // 1 minuto
    blockDurationMs: 2 * 60 * 1000, // 2 minutos
    message: 'Limite de requisições excedido. Tente novamente em breve.'
  },

  // Pagamentos - SUPER restritivo
  PAYMENT: {
    maxRequests: 3,
    windowMs: 1 * 60 * 1000, // 1 minuto
    blockDurationMs: 60 * 60 * 1000, // 1 hora de bloqueio
    message: 'Limite de transações excedido. Aguarde 1 hora.'
  }
} as const;

/**
 * Limpar entradas antigas do store (garbage collection)
 */
function cleanupStore(): void {
  const now = Date.now();

  // Limpar apenas a cada 1 hora
  if (now - lastCleanup < 60 * 60 * 1000) {
    return;
  }

  let removed = 0;
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remover se resetAt já passou e não está bloqueado
    if (entry.resetAt < now && (!entry.blocked || (entry.blockedUntil && entry.blockedUntil < now))) {
      rateLimitStore.delete(key);
      removed++;
    }
  }

  lastCleanup = now;

  if (removed > 0) {
    console.log(`[RATE_LIMITER] Cleanup: ${removed} entries removed, ${rateLimitStore.size} remaining`);
  }
}

/**
 * Verificar rate limit para um identifier
 *
 * @param identifier - Pode ser IP, userId, email, etc
 * @param config - Configuração de rate limit
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
  reason?: string;
} {
  cleanupStore();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Verificar se está bloqueado
  if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      reason: config.message || 'Bloqueado temporariamente'
    };
  }

  // Se não existe entrada ou expirou, criar nova
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
      blocked: false
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs
    };
  }

  // Incrementar contador
  entry.count++;

  // Verificar se excedeu limite
  if (entry.count > config.maxRequests) {
    // Bloquear por blockDurationMs
    if (config.blockDurationMs) {
      entry.blocked = true;
      entry.blockedUntil = now + config.blockDurationMs;

      console.warn('[RATE_LIMITER] Identifier blocked:', {
        identifier,
        count: entry.count,
        blockedUntil: new Date(entry.blockedUntil).toISOString()
      });
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: config.blockDurationMs ? Math.ceil(config.blockDurationMs / 1000) : Math.ceil((entry.resetAt - now) / 1000),
      reason: config.message || 'Limite excedido'
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt
  };
}

/**
 * Resetar rate limit para um identifier (ex: após login bem-sucedido)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
  console.log('[RATE_LIMITER] Reset:', identifier);
}

/**
 * Bloquear manualmente um identifier
 */
export function blockIdentifier(identifier: string, durationMs: number = 60 * 60 * 1000): void {
  const now = Date.now();

  rateLimitStore.set(identifier, {
    count: 999,
    resetAt: now + durationMs,
    blocked: true,
    blockedUntil: now + durationMs
  });

  console.warn('[RATE_LIMITER] Manual block:', {
    identifier,
    blockedUntil: new Date(now + durationMs).toISOString()
  });
}

/**
 * Obter estatísticas do rate limiter
 */
export function getRateLimitStats(): {
  totalEntries: number;
  blockedCount: number;
  topOffenders: Array<{ identifier: string; count: number }>;
} {
  const blocked = Array.from(rateLimitStore.entries()).filter(([, entry]) => entry.blocked);

  const sorted = Array.from(rateLimitStore.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)
    .map(([identifier, entry]) => ({ identifier, count: entry.count }));

  return {
    totalEntries: rateLimitStore.size,
    blockedCount: blocked.length,
    topOffenders: sorted
  };
}
