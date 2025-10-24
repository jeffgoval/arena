import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { checkRateLimit, RATE_LIMITS } from '@/lib/security/rate-limiter';
import { logSecurityEvent, SecurityEventType, SecurityLevel } from '@/lib/security/security-logger';

// ============================================================
// CONSTANTES DE SEGURANÇA
// ============================================================

const VALID_ROLES = ['cliente', 'gestor', 'admin'] as const;
type ValidRole = typeof VALID_ROLES[number];

const CACHE_DURATION = 5 * 60; // 5 minutos em segundos
const MAX_REDIRECTS = 3;

// ============================================================
// FUNÇÃO AUXILIAR: Validar Role
// ============================================================

function isValidRole(role: string | null | undefined): role is ValidRole {
  if (!role) return false;
  return VALID_ROLES.includes(role as ValidRole);
}

// ============================================================
// FUNÇÃO AUXILIAR: Obter IP do Cliente
// ============================================================

function getClientIp(request: NextRequest): string {
  // Priorizar headers do Vercel/Cloudflare
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  return 'unknown';
}

// ============================================================
// FUNÇÃO AUXILIAR: Normalizar Pathname (Prevenir Path Traversal)
// ============================================================

function normalizePathname(pathname: string): string {
  try {
    // Decodificar URL encoding
    const decoded = decodeURIComponent(pathname);
    // Normalizar barras
    const normalized = decoded.replace(/\\/g, '/');
    // Remover múltiplas barras
    return normalized.replace(/\/+/g, '/');
  } catch {
    // Se decodificação falhar, retornar pathname original
    return pathname;
  }
}

// ============================================================
// FUNÇÃO AUXILIAR: Obter Role com Cache Seguro
// ============================================================

async function getRoleWithCache(
  user: { id: string; user_metadata?: any; app_metadata?: any },
  request: NextRequest,
  supabase: any
): Promise<ValidRole | null> {
  let userRole: string | null = null;

  // 1. Tentar obter role do cookie cache (vinculado ao user.id)
  const cacheKey = `user-role-${user.id}`;
  const cachedRole = request.cookies.get(cacheKey)?.value;
  const cacheTimestampKey = `user-role-ts-${user.id}`;
  const cacheTimestamp = request.cookies.get(cacheTimestampKey)?.value;

  // Validar cache
  if (cachedRole && cacheTimestamp) {
    const now = Date.now();
    const timestamp = parseInt(cacheTimestamp, 10);
    const cacheAge = now - timestamp;

    // Cache válido por CACHE_DURATION
    if (!isNaN(timestamp) && cacheAge >= 0 && cacheAge < CACHE_DURATION * 1000) {
      // Validar formato de role
      if (isValidRole(cachedRole)) {
        return cachedRole;
      }
    }
  }

  // 2. Tentar obter role do JWT metadata (secundário)
  if (user.user_metadata?.role) {
    userRole = user.user_metadata.role;
  } else if (user.app_metadata?.role) {
    userRole = user.app_metadata.role;
  }

  // 3. Fallback: SEMPRE consultar banco como fonte de verdade
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('role, status, banned')
      .eq('id', user.id)
      .single();

    if (error) {
      logSecurityEvent(SecurityEventType.DATABASE_ERROR, SecurityLevel.ERROR, {
        userId: user.id,
        error: error.message,
        context: 'Error fetching user profile'
      });
      throw error;
    }

    // CRÍTICO: Verificar se usuário está banido ou suspenso
    if (profile?.banned === true) {
      logSecurityEvent(SecurityEventType.BANNED_USER_ACCESS, SecurityLevel.CRITICAL, {
        userId: user.id,
        bannedAt: profile.banned_at,
        reason: profile.banned_reason
      });
      return null;
    }

    if (profile?.status === 'suspended' || profile?.status === 'inactive') {
      logSecurityEvent(SecurityEventType.SUSPENDED_USER_ACCESS, SecurityLevel.ERROR, {
        userId: user.id,
        status: profile.status
      });
      return null;
    }

    userRole = profile?.role || null;
  } catch (err) {
    logSecurityEvent(SecurityEventType.DATABASE_ERROR, SecurityLevel.CRITICAL, {
      userId: user.id,
      error: err instanceof Error ? err.message : 'Unknown error',
      context: 'Database query failed in getRoleWithCache'
    });
    // Em caso de erro, não confiar em cache - retornar null
    return null;
  }

  // Validar formato de role antes de retornar
  if (!isValidRole(userRole)) {
    logSecurityEvent(SecurityEventType.INVALID_ROLE_INJECTION, SecurityLevel.CRITICAL, {
      userId: user.id,
      invalidRole: userRole
    });
    return null;
  }

  return userRole;
}

// ============================================================
// FUNÇÃO AUXILIAR: Salvar Role em Cache Seguro
// ============================================================

function setCacheRole(
  response: NextResponse,
  userId: string,
  role: ValidRole
): void {
  const now = Date.now();
  const cacheKey = `user-role-${userId}`;
  const cacheTimestampKey = `user-role-ts-${userId}`;

  const cookieOptions = {
    maxAge: CACHE_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // CRÍTICO: strict para prevenir CSRF
    path: '/',
  };

  response.cookies.set(cacheKey, role, cookieOptions);
  response.cookies.set(cacheTimestampKey, now.toString(), cookieOptions);
}

// ============================================================
// FUNÇÃO AUXILIAR: Limpar Cache de Role
// ============================================================

export function clearRoleCache(response: NextResponse, userId?: string): void {
  if (userId) {
    // Limpar cache específico do usuário
    response.cookies.delete(`user-role-${userId}`);
    response.cookies.delete(`user-role-ts-${userId}`);
  } else {
    // Limpar todos cookies de role (fallback)
    // Nota: Em logout, userId deve sempre ser fornecido
    const allCookies = response.cookies.getAll();
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('user-role-') || cookie.name.startsWith('user-role-ts-')) {
        response.cookies.delete(cookie.name);
      }
    });
  }
}

// ============================================================
// FUNÇÃO AUXILIAR: Adicionar Headers de Segurança
// ============================================================

function addSecurityHeaders(response: NextResponse): void {
  // Cache Control (crítico para dados financeiros)
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Permissions Policy (restringir features perigosas)
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

  // Content Security Policy (CSP) - CRÍTICO para prevenir XSS
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com", // Vercel Analytics
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live https://vitals.vercel-insights.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // Strict Transport Security (HSTS) - forçar HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

// ============================================================
// FUNÇÃO AUXILIAR: Log de Tentativa de Acesso Não Autorizado
// ============================================================

function logUnauthorizedAccess(
  userId: string | undefined,
  role: ValidRole | null,
  attemptedPath: string,
  reason: string,
  ip?: string
): void {
  // Determinar tipo de evento e severidade
  let eventType = SecurityEventType.UNAUTHORIZED_ACCESS;
  let level = SecurityLevel.WARNING;

  if (reason.includes('Banned') || reason.includes('banido')) {
    eventType = SecurityEventType.BANNED_USER_ACCESS;
    level = SecurityLevel.CRITICAL;
  } else if (reason.includes('Suspended') || reason.includes('suspenso')) {
    eventType = SecurityEventType.SUSPENDED_USER_ACCESS;
    level = SecurityLevel.ERROR;
  } else if (reason.includes('Gestor attempted to access /cliente') || reason.includes('Insufficient privileges')) {
    eventType = SecurityEventType.PRIVILEGE_ESCALATION_ATTEMPT;
    level = SecurityLevel.ERROR;
  }

  logSecurityEvent(eventType, level, {
    userId,
    role: role || undefined,
    path: attemptedPath,
    reason,
    ip
  });
}

// ============================================================
// MIDDLEWARE PRINCIPAL
// ============================================================

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Adicionar headers de segurança em TODAS as respostas
  addSecurityHeaders(supabaseResponse);

  // Obter IP do cliente (para rate limiting e logs)
  const clientIp = getClientIp(request);
  const pathname = normalizePathname(request.nextUrl.pathname);

  // ============================================================
  // RATE LIMITING - Primeira linha de defesa
  // ============================================================

  // Determinar config de rate limit baseado na rota
  let rateLimitConfig: typeof RATE_LIMITS[keyof typeof RATE_LIMITS];

  if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
    rateLimitConfig = RATE_LIMITS.AUTH;
  } else if (pathname.startsWith('/api/pagamentos')) {
    rateLimitConfig = RATE_LIMITS.PAYMENT;
  } else if (pathname.startsWith('/api')) {
    rateLimitConfig = RATE_LIMITS.API;
  } else {
    rateLimitConfig = RATE_LIMITS.DASHBOARD;
  }

  // Aplicar rate limit por IP
  const rateLimitResult = checkRateLimit(clientIp, rateLimitConfig);

  if (!rateLimitResult.allowed) {
    logSecurityEvent(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      rateLimitResult.retryAfter && rateLimitResult.retryAfter > 60
        ? SecurityLevel.CRITICAL
        : SecurityLevel.WARNING,
      {
        ip: clientIp,
        path: pathname,
        retryAfter: rateLimitResult.retryAfter,
        reason: rateLimitResult.reason
      }
    );

    const response = new NextResponse(
      JSON.stringify({
        error: rateLimitResult.reason || 'Muitas requisições. Tente novamente mais tarde.',
        retryAfter: rateLimitResult.retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetAt.toString()
        }
      }
    );

    addSecurityHeaders(response);
    return response;
  }

  // Adicionar headers de rate limit na resposta
  supabaseResponse.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
  supabaseResponse.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  supabaseResponse.headers.set('X-RateLimit-Reset', rateLimitResult.resetAt.toString());

  // Build-time check: se variáveis não existem, FALHAR de forma segura
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    logSecurityEvent(SecurityEventType.CONFIGURATION_ERROR, SecurityLevel.CRITICAL, {
      reason: 'Missing Supabase environment variables',
      path: pathname
    });

    // Em produção, isso deve retornar 503 Service Unavailable
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Service Temporarily Unavailable', {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': '60'
        }
      });
    }
    // Em desenvolvimento, permitir (para builds locais)
    return supabaseResponse;
  }

  // Criar cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Obter usuário autenticado
  let user: { id: string; user_metadata?: any; app_metadata?: any } | null = null;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      logSecurityEvent(SecurityEventType.SESSION_EXPIRED, SecurityLevel.WARNING, {
        error: error.message,
        path: pathname,
        ip: clientIp
      });
    }

    user = data?.user || null;
  } catch (err) {
    logSecurityEvent(SecurityEventType.DATABASE_ERROR, SecurityLevel.CRITICAL, {
      error: err instanceof Error ? err.message : 'Unknown',
      path: pathname,
      ip: clientIp,
      context: 'Auth check failed'
    });
    user = null;
  }

  // ============================================================
  // Proteger rotas do dashboard (requer autenticação)
  // ============================================================

  if (pathname.startsWith('/cliente') || pathname.startsWith('/gestor')) {
    // Se não está autenticado, redirecionar para login
    if (!user) {
      logUnauthorizedAccess(undefined, null, pathname, 'Not authenticated', clientIp);

      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      const response = NextResponse.redirect(url);
      addSecurityHeaders(response);
      return response;
    }

    // Obter role com cache seguro
    let userRole: ValidRole | null = null;

    try {
      userRole = await getRoleWithCache(user, request, supabase);
    } catch (err) {
      logSecurityEvent(SecurityEventType.DATABASE_ERROR, SecurityLevel.ERROR, {
        userId: user.id,
        error: err instanceof Error ? err.message : 'Unknown',
        path: pathname,
        ip: clientIp,
        context: 'Role fetch failed'
      });
    }

    if (!userRole) {
      // Se não tem role válido (ou está banido), redirecionar para auth
      logUnauthorizedAccess(user.id, null, pathname, 'No valid role or banned', clientIp);

      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      const response = NextResponse.redirect(url);
      addSecurityHeaders(response);
      // Limpar cache ao redirecionar
      clearRoleCache(response, user.id);
      return response;
    }

    // Salvar role em cache (se ainda não estava cacheado)
    setCacheRole(supabaseResponse, user.id, userRole);

    // ============================================================
    // Verificar permissões por rota
    // ============================================================

    if (pathname.startsWith('/gestor')) {
      // Rota /gestor: apenas admin e gestor
      if (userRole !== 'admin' && userRole !== 'gestor') {
        logUnauthorizedAccess(user.id, userRole, pathname, 'Insufficient privileges for /gestor', clientIp);

        const url = request.nextUrl.clone();
        url.pathname = '/cliente'; // Redirecionar para área do cliente
        const response = NextResponse.redirect(url);
        addSecurityHeaders(response);
        return response;
      }
    }

    if (pathname.startsWith('/cliente')) {
      // Rota /cliente: apenas clientes (e admin para suporte)
      // Gestores NÃO devem acessar área do cliente
      if (userRole === 'gestor') {
        logUnauthorizedAccess(user.id, userRole, pathname, 'Gestor attempted to access /cliente', clientIp);

        const url = request.nextUrl.clone();
        url.pathname = '/gestor'; // Redirecionar gestor para sua área
        const response = NextResponse.redirect(url);
        addSecurityHeaders(response);
        return response;
      }

      // Admin pode acessar ambas áreas (para suporte/monitoramento)
      // Cliente pode acessar sua própria área
      if (userRole !== 'cliente' && userRole !== 'admin') {
        // Role desconhecida - redirecionar para auth
        logUnauthorizedAccess(user.id, userRole, pathname, 'Unknown role for /cliente', clientIp);

        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        const response = NextResponse.redirect(url);
        addSecurityHeaders(response);
        clearRoleCache(response, user.id);
        return response;
      }
    }
  }

  // ============================================================
  // Redirecionar usuários autenticados da landing page e auth
  // ============================================================

  if ((pathname === '/auth' || pathname === '/') && user) {
    // Obter role com cache seguro
    let userRole: ValidRole | null = null;

    try {
      userRole = await getRoleWithCache(user, request, supabase);
    } catch (err) {
      logSecurityEvent(SecurityEventType.DATABASE_ERROR, SecurityLevel.WARNING, {
        userId: user.id,
        error: err instanceof Error ? err.message : 'Unknown',
        path: pathname,
        ip: clientIp,
        context: 'Role fetch failed during redirect'
      });
    }

    if (!userRole) {
      // Se não conseguiu obter role, permitir acesso à página (evitar loop)
      return supabaseResponse;
    }

    // Salvar role em cache
    setCacheRole(supabaseResponse, user.id, userRole);

    const url = request.nextUrl.clone();

    if (userRole === 'admin' || userRole === 'gestor') {
      url.pathname = '/gestor'; // Admin e Gestor vão para área de gestão
    } else {
      url.pathname = '/cliente'; // Cliente vai para área do cliente
    }

    const response = NextResponse.redirect(url);
    addSecurityHeaders(response);
    // Transferir cookies de cache para response de redirect
    setCacheRole(response, user.id, userRole);
    return response;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/',
    '/cliente/:path*',
    '/gestor/:path*',
    '/auth',
  ],
};
