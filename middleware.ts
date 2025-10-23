import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // CRÍTICO: Desabilitar cache para evitar vazamento de dados entre usuários
  supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  supabaseResponse.headers.set('Pragma', 'no-cache');
  supabaseResponse.headers.set('Expires', '0');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Obter usuário autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ============================================================
  // Proteger rotas do dashboard (requer autenticação)
  // ============================================================

  if (pathname.startsWith('/cliente') || pathname.startsWith('/gestor')) {
    // Se não está autenticado, redirecionar para login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      const response = NextResponse.redirect(url);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }

    // Otimização: Verificar role com cache em cookie
    let userRole: string | null = null;

    // 1. Tentar obter role do cookie cache (mais rápido)
    const cachedRole = request.cookies.get('user-role')?.value;
    const cacheTimestamp = request.cookies.get('user-role-timestamp')?.value;
    const now = Date.now();
    const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;

    // Cache válido por 5 minutos
    if (cachedRole && cacheAge < 5 * 60 * 1000) {
      userRole = cachedRole;
    } else {
      // 2. Tentar obter role do JWT metadata
      if (user.user_metadata?.role) {
        userRole = user.user_metadata.role;
      } else if (user.app_metadata?.role) {
        userRole = user.app_metadata.role;
      } else {
        // 3. Fallback: consultar banco apenas se necessário
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        userRole = profile?.role || null;
      }

      // Salvar no cache se obteve o role
      if (userRole) {
        supabaseResponse.cookies.set('user-role', userRole, {
          maxAge: 5 * 60, // 5 minutos
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        supabaseResponse.cookies.set('user-role-timestamp', now.toString(), {
          maxAge: 5 * 60, // 5 minutos
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }
    }

    if (!userRole) {
      // Se não tem role, redirecionar para auth (erro)
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      const response = NextResponse.redirect(url);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }

    // Verificar permissões por rota
    if (pathname.startsWith('/gestor')) {
      // Rota /gestor: apenas admin e gestor
      if (userRole !== 'admin' && userRole !== 'gestor') {
        const url = request.nextUrl.clone();
        url.pathname = '/cliente'; // Redirecionar para área do cliente
        const response = NextResponse.redirect(url);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
      }
    }

    if (pathname.startsWith('/cliente')) {
      // Rota /cliente: todos os roles podem acessar
      // (admin e gestor também podem ver área do cliente se necessário)
    }
  }

  // ============================================================
  // Redirecionar usuários autenticados da landing page e auth
  // ============================================================

  if ((pathname === '/auth' || pathname === '/') && user) {
    // Buscar role para redirecionar corretamente
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const url = request.nextUrl.clone();

    if (profile?.role === 'admin' || profile?.role === 'gestor') {
      url.pathname = '/gestor'; // Admin e Gestor vão para área de gestão
    } else {
      url.pathname = '/cliente'; // Cliente vai para área do cliente
    }

    const response = NextResponse.redirect(url);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
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
