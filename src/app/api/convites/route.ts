import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ConviteStatus } from '@/types/convites.types';

export const runtime = 'edge';

/**
 * GET /api/convites
 * Listar todos os convites criados pelo usuário
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status') as ConviteStatus | null;

    // Buscar perfil do usuário para verificar role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isGestor = userProfile?.role === 'gestor' || userProfile?.role === 'admin';

    // Buscar convites (gestor vê todos, cliente vê apenas os seus)
    let query = supabase
      .from('convites')
      .select(`
        *,
        reserva:reservas!convites_reserva_id_fkey(
          id,
          data,
          valor_total,
          quadra:quadras!reservas_quadra_id_fkey(
            id,
            nome,
            tipo
          ),
          horario:horarios!reservas_horario_id_fkey(
            id,
            hora_inicio,
            hora_fim
          )
        ),
        organizador:users!convites_criado_por_fkey(
          id,
          nome_completo,
          email
        )
      `);

    // Filtrar por criador apenas se não for gestor
    if (!isGestor) {
      query = query.eq('criado_por', user.id);
    }

    query = query.order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: convites, error: convitesError } = await query;

    if (convitesError) {
      console.error('Erro ao buscar convites:', convitesError);
      return NextResponse.json(
        { error: 'Erro ao buscar convites' },
        { status: 500 }
      );
    }

    // Buscar total de aceites para cada convite
    const convitesComAceites = await Promise.all(
      (convites || []).map(async (convite) => {
        const { count } = await supabase
          .from('convite_aceites')
          .select('*', { count: 'exact', head: true })
          .eq('convite_id', convite.id)
          .eq('confirmado', true);

        return {
          ...convite,
          total_aceites: count || 0,
        };
      })
    );

    // Calcular estatísticas
    const stats = {
      total: convitesComAceites.length,
      ativos: convitesComAceites.filter(c => c.status === 'ativo').length,
      completos: convitesComAceites.filter(c => c.status === 'completo').length,
      expirados: convitesComAceites.filter(c => c.status === 'expirado').length,
      totalAceites: convitesComAceites.reduce((sum, c) => sum + c.total_aceites, 0),
      taxaAceite: 0,
    };

    // Calcular taxa de aceite (aceites / vagas totais)
    const totalVagas = convitesComAceites.reduce((sum, c) => sum + c.vagas_totais, 0);
    stats.taxaAceite = totalVagas > 0 ? (stats.totalAceites / totalVagas) * 100 : 0;

    return NextResponse.json({
      convites: convitesComAceites,
      stats,
    });
  } catch (error) {
    console.error('Erro na API de convites:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
