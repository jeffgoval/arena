import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ConviteStatus } from '@/types/convites.types';

export const runtime = 'edge';

/**
 * GET /api/convites/simple
 * Versão simplificada para testar sem problemas de RLS
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status') as ConviteStatus | null;

    console.log('Buscando convites para usuário:', user.id);

    // Buscar apenas convites básicos
    let query = supabase
      .from('convites')
      .select('*')
      .eq('criado_por', user.id)
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: convites, error: convitesError } = await query;

    if (convitesError) {
      console.error('Erro ao buscar convites:', convitesError);
      return NextResponse.json(
        { error: 'Erro ao buscar convites', details: convitesError.message },
        { status: 500 }
      );
    }

    console.log('Convites encontrados:', convites?.length || 0);

    const convitesData = convites || [];

    // Calcular estatísticas simples
    const stats = {
      total: convitesData.length,
      ativos: convitesData.filter(c => c.status === 'ativo').length,
      completos: convitesData.filter(c => c.status === 'completo').length,
      expirados: convitesData.filter(c => c.status === 'expirado').length,
      totalAceites: convitesData.reduce((sum, c) => sum + (c.total_aceites || 0), 0),
      taxaAceite: 0,
    };

    // Calcular taxa de aceite
    const totalVagas = convitesData.reduce((sum, c) => sum + (c.vagas_totais || 0), 0);
    stats.taxaAceite = totalVagas > 0 ? (stats.totalAceites / totalVagas) * 100 : 0;

    return NextResponse.json({
      convites: convitesData,
      stats,
    });
  } catch (error) {
    console.error('Erro na API de convites simples:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}