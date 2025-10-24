import { NextRequest, NextResponse } from 'next/server';
import { getAuditLog, getAuditStats, exportAuditLog } from '@/lib/audit/audit-logger';
import { createClient } from '@/lib/supabase/server';

/**
 * API de Auditoria
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

    // Obter parâmetros de query
    const searchParams = request.nextUrl.searchParams;
    const export_format = searchParams.get('export');

    // Se solicitado export, retornar arquivo
    if (export_format === 'json' || export_format === 'csv') {
      const exported = exportAuditLog(export_format);

      return new NextResponse(exported, {
        headers: {
          'Content-Type': export_format === 'json' ? 'application/json' : 'text/csv',
          'Content-Disposition': `attachment; filename="audit-log-${Date.now()}.${export_format}"`
        }
      });
    }

    // Obter logs com filtros
    const userId = searchParams.get('userId') || undefined;
    const targetId = searchParams.get('targetId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');

    const logs = getAuditLog({ userId, targetId, limit });
    const stats = getAuditStats();

    return NextResponse.json({
      logs,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[AUDIT API] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
