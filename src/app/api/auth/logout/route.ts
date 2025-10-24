import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Não usar edge runtime - precisa acessar cookies do servidor
// export const runtime = 'edge';

export async function POST() {
  try {
    const supabase = await createClient();

    // Obter user ID antes de fazer logout
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Fazer logout no Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[SECURITY] Logout error:', {
        error: error.message,
        userId,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    // Criar resposta de sucesso
    const response = NextResponse.json({
      message: 'Logout realizado com sucesso'
    });

    // CRÍTICO: Limpar TODOS os cookies de autenticação e cache

    // 1. Limpar cookies do Supabase
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'auth-token', // Legacy
    ];

    cookieNames.forEach(name => {
      response.cookies.delete(name);
    });

    // 2. Limpar cookies de cache de role (vinculados ao user)
    if (userId) {
      response.cookies.delete(`user-role-${userId}`);
      response.cookies.delete(`user-role-ts-${userId}`);
    }

    // 3. Limpar qualquer cookie de role órfão (fallback)
    // Nota: NextResponse não permite iterar cookies existentes facilmente
    // Mas definimos os principais acima

    console.info('[SECURITY] User logged out successfully:', {
      userId,
      timestamp: new Date().toISOString()
    });

    return response;

  } catch (error) {
    console.error('[SECURITY] Logout error:', {
      error: error instanceof Error ? error.message : 'Unknown',
      timestamp: new Date().toISOString()
    });

    const response = NextResponse.json(
      { error: 'Erro ao realizar logout' },
      { status: 500 }
    );

    // Mesmo em caso de erro, tentar limpar cookies
    response.cookies.delete('auth-token');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');

    return response;
  }
}
