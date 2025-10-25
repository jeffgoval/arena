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
      console.error('Erro de autenticação:', authError);
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status') as ConviteStatus | null;

    // Buscar perfil do usuário para verificar role
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil do usuário:', profileError);
      return NextResponse.json(
        { error: 'Erro ao buscar perfil do usuário' },
        { status: 500 }
      );
    }

    const isGestor = userProfile?.role === 'gestor' || userProfile?.role === 'admin';

    // Buscar convites (gestor vê todos, cliente vê apenas os seus)
    let query = supabase
      .from('convites')
      .select(`
        id,
        created_at,
        criado_por,
        data_expiracao,
        mensagem,
        reserva_id,
        status,
        token,
        total_aceites,
        updated_at,
        vagas_disponiveis,
        vagas_totais,
        valor_por_pessoa
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
        { error: 'Erro ao buscar convites', details: convitesError.message },
        { status: 500 }
      );
    }

    if (!convites || convites.length === 0) {
      return NextResponse.json({
        convites: [],
        stats: {
          total: 0,
          ativos: 0,
          completos: 0,
          expirados: 0,
          totalAceites: 0,
          taxaAceite: 0,
        },
      });
    }

    // Buscar dados das reservas separadamente (apenas se o usuário for o organizador)
    const reservaIds = convites.map(c => c.reserva_id);
    let reservas: any[] = [];
    let quadras: any[] = [];
    let horarios: any[] = [];

    if (reservaIds.length > 0) {
      const { data: reservasData, error: reservasError } = await supabase
        .from('reservas')
        .select(`
          id,
          data,
          valor_total,
          quadra_id,
          horario_id,
          organizador_id
        `)
        .in('id', reservaIds)
        .eq('organizador_id', user.id); // Apenas reservas do usuário

      if (reservasError) {
        console.error('Erro ao buscar reservas:', reservasError);
      } else {
        reservas = reservasData || [];
      }

      // Buscar dados das quadras separadamente
      const quadraIds = reservas.map(r => r.quadra_id).filter(Boolean);
      if (quadraIds.length > 0) {
        const { data: quadrasData, error: quadrasError } = await supabase
          .from('quadras')
          .select('id, nome, tipo')
          .in('id', quadraIds);

        if (quadrasError) {
          console.error('Erro ao buscar quadras:', quadrasError);
        } else {
          quadras = quadrasData || [];
        }
      }

      // Buscar dados dos horários separadamente
      const horarioIds = reservas.map(r => r.horario_id).filter(Boolean);
      if (horarioIds.length > 0) {
        const { data: horariosData, error: horariosError } = await supabase
          .from('horarios')
          .select('id, hora_inicio, hora_fim')
          .in('id', horarioIds);

        if (horariosError) {
          console.error('Erro ao buscar horários:', horariosError);
        } else {
          horarios = horariosData || [];
        }
      }
    }

    // Buscar total de aceites para cada convite
    const convitesComDados = await Promise.all(
      convites.map(async (convite) => {
        let totalAceites = 0;
        
        try {
          const { count, error: aceitesError } = await supabase
            .from('convite_aceites')
            .select('*', { count: 'exact', head: true })
            .eq('convite_id', convite.id)
            .eq('confirmado', true);

          if (aceitesError) {
            console.error('Erro ao buscar aceites:', aceitesError);
          } else {
            totalAceites = count || 0;
          }
        } catch (error) {
          console.error('Erro ao buscar aceites para convite:', convite.id, error);
        }

        // Encontrar dados relacionados
        const reserva = reservas.find(r => r.id === convite.reserva_id);
        const quadra = quadras.find(q => q.id === reserva?.quadra_id);
        const horario = horarios.find(h => h.id === reserva?.horario_id);

        return {
          ...convite,
          total_aceites: totalAceites,
          reservas: reserva ? {
            ...reserva,
            quadras: quadra || null,
            horarios: horario || null,
          } : null,
        };
      })
    );

    // Calcular estatísticas
    const stats = {
      total: convitesComDados.length,
      ativos: convitesComDados.filter(c => c.status === 'ativo').length,
      completos: convitesComDados.filter(c => c.status === 'completo').length,
      expirados: convitesComDados.filter(c => c.status === 'expirado').length,
      totalAceites: convitesComDados.reduce((sum, c) => sum + c.total_aceites, 0),
      taxaAceite: 0,
    };

    // Calcular taxa de aceite (aceites / vagas totais)
    const totalVagas = convitesComDados.reduce((sum, c) => sum + (c.vagas_totais || 0), 0);
    stats.taxaAceite = totalVagas > 0 ? (stats.totalAceites / totalVagas) * 100 : 0;

    return NextResponse.json({
      convites: convitesComDados,
      stats,
    });
  } catch (error) {
    console.error('Erro na API de convites:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}