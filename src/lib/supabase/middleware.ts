import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteger rotas de dashboard
  if (
    request.nextUrl.pathname.startsWith('/cliente') ||
    request.nextUrl.pathname.startsWith('/gestor') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!user) {
      // Redirecionar para login se não estiver autenticado
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Proteger rotas de admin (apenas role: admin)
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      // Redirecionar para dashboard do cliente se não for admin
      return NextResponse.redirect(new URL('/cliente', request.url));
    }
  }

  // Proteger rotas de gestor (apenas role: gestor ou admin)
  if (request.nextUrl.pathname.startsWith('/gestor') && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'gestor' && profile?.role !== 'admin') {
      // Redirecionar para dashboard do cliente se não for gestor/admin
      return NextResponse.redirect(new URL('/cliente', request.url));
    }
  }

  // Redirecionar usuários autenticados que tentam acessar páginas de auth
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/cadastro' ||
      request.nextUrl.pathname === '/recuperar-senha')
  ) {
    // Buscar role para redirecionar corretamente
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (profile?.role === 'gestor') {
      return NextResponse.redirect(new URL('/gestor', request.url));
    } else {
      return NextResponse.redirect(new URL('/cliente', request.url));
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
