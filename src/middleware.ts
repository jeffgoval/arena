import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthFromRequest, canAccessRoute } from '@/lib/auth';

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/design-system',
  '/api/auth/login',
  '/api/auth/logout'
];

// Rotas que redirecionam baseado no role
const ROLE_REDIRECTS = {
  cliente: '/cliente',
  gestor: '/gestor',
  admin: '/gestor' // Admin usa interface do gestor
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir assets estáticos primeiro
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Permitir rotas públicas
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Para demo, permitir acesso direto às rotas protegidas
    // Em produção, descomentar a verificação de autenticação
    
    /*
    // Verificar autenticação via JWT
    const user = await getAuthFromRequest(request);
    
    // Se não autenticado, redirecionar para login
    if (!user) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar se pode acessar a rota
    if (!canAccessRoute(user, pathname)) {
      // Redirecionar para dashboard apropriado baseado no role
      const redirectPath = ROLE_REDIRECTS[user.role] || '/auth';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    */

    // Adicionar headers de segurança
    const response = NextResponse.next();
    
    // Headers de segurança
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // Em caso de erro, permitir acesso (para demo)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};