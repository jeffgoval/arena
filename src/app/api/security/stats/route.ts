import { NextRequest, NextResponse } from 'next/server';
import { getSecurityStats, getRecentSecurityEvents } from '@/lib/security/security-logger';
import { getRateLimitStats } from '@/lib/security/rate-limiter';
import { createClient } from '@/lib/supabase/server';

/**
 * API de Estatísticas de Segurança
 * Apenas para administradores
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar role (apenas admin)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Obter estatísticas
    const securityStats = getSecurityStats();
    const rateLimitStats = getRateLimitStats();
    const recentEvents = getRecentSecurityEvents(50);

    return NextResponse.json({
      security: securityStats,
      rateLimit: rateLimitStats,
      recentEvents,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[SECURITY API] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
