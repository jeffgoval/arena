import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

/**
 * GET /api/convites/[conviteId]/aceites
 * Buscar todos os aceites de um convite específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conviteId: string } }
) {
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

    const { conviteId } = params;

    // Buscar convite e verificar se pertence ao usuário
    const { data: convite, error: conviteError } = await supabase
      .from('invites')
      .select(`
        *,
        reserva:reservations!invites_reserva_id_fkey(
          id,
          data,
          valor_total,
          quadra:courts!reservations_quadra_id_fkey(
            id,
            nome,
            tipo
          ),
          horario:time_slots!reservations_horario_id_fkey(
            id,
            hora_inicio,
            hora_fim
          )
        )
      `)
      .eq('id', conviteId)
      .single();

    if (conviteError || !convite) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      );
    }

    if (convite.criado_por !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para ver os aceites deste convite' },
        { status: 403 }
      );
    }

    // Buscar aceites do convite
    const { data: aceites, error: aceitesError } = await supabase
      .from('invite_acceptances')
      .select('*')
      .eq('convite_id', conviteId)
      .order('created_at', { ascending: false });

    if (aceitesError) {
      console.error('Erro ao buscar aceites:', aceitesError);
      return NextResponse.json(
        { error: 'Erro ao buscar aceites' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      convite,
      aceites: aceites || [],
    });
  } catch (error) {
    console.error('Erro na API de aceites:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
