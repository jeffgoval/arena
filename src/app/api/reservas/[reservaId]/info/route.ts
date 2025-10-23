import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/reservas/[reservaId]/info
 * Obter informações básicas da reserva para avaliação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { reservaId: string } }
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

    const { reservaId } = params;

    // Buscar reserva
    const { data: reserva, error: reservaError } = await supabase
      .from('reservations')
      .select(`
        id,
        data,
        organizador_id,
        quadra:courts!reservations_quadra_id_fkey(nome)
      `)
      .eq('id', reservaId)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o organizador ou participante
    const { data: participante } = await supabase
      .from('reservation_participants')
      .select('id')
      .eq('reserva_id', reservaId)
      .eq('user_id', user.id)
      .single();

    if (reserva.organizador_id !== user.id && !participante) {
      return NextResponse.json(
        { error: 'Você não tem permissão para avaliar esta reserva' },
        { status: 403 }
      );
    }

    // Verificar se já foi avaliada pelo usuário
    const { data: avaliacaoExistente } = await supabase
      .from('reviews')
      .select('id')
      .eq('reserva_id', reservaId)
      .eq('user_id', user.id)
      .single();

    const info = {
      id: reserva.id,
      quadra_nome: reserva.quadra?.nome || 'Quadra',
      data: reserva.data,
      ja_avaliada: !!avaliacaoExistente,
    };

    return NextResponse.json(info);
  } catch (error) {
    console.error('Erro ao buscar informações da reserva:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
