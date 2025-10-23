import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAvaliacaoSchema } from '@/lib/validations/avaliacao.schema';

/**
 * POST /api/avaliacoes
 * Criar uma nova avaliação
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    // Validar dados
    const validatedData = createAvaliacaoSchema.parse(body);

    // Verificar se a reserva existe e pertence ao usuário
    const { data: reserva, error: reservaError } = await supabase
      .from('reservations')
      .select('id, organizador_id, data')
      .eq('id', validatedData.reserva_id)
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
      .eq('reserva_id', validatedData.reserva_id)
      .eq('user_id', user.id)
      .single();

    if (reserva.organizador_id !== user.id && !participante) {
      return NextResponse.json(
        { error: 'Você não tem permissão para avaliar esta reserva' },
        { status: 403 }
      );
    }

    // Verificar se já existe avaliação
    const { data: avaliacaoExistente } = await supabase
      .from('reviews')
      .select('id')
      .eq('reserva_id', validatedData.reserva_id)
      .eq('user_id', user.id)
      .single();

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Você já avaliou esta reserva' },
        { status: 400 }
      );
    }

    // Criar avaliação
    const { data: avaliacao, error: createError } = await supabase
      .from('reviews')
      .insert({
        reserva_id: validatedData.reserva_id,
        user_id: user.id,
        rating: validatedData.rating,
        comentario: validatedData.comentario || null,
      })
      .select(`
        *,
        user:profiles!reviews_user_id_fkey(id, nome_completo),
        reserva:reservations!reviews_reserva_id_fkey(
          id,
          data,
          quadra:courts!reservations_quadra_id_fkey(id, nome)
        )
      `)
      .single();

    if (createError) {
      console.error('Erro ao criar avaliação:', createError);
      return NextResponse.json(
        { error: 'Erro ao criar avaliação' },
        { status: 500 }
      );
    }

    return NextResponse.json(avaliacao, { status: 201 });
  } catch (error) {
    console.error('Erro na API de avaliações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/avaliacoes
 * Listar avaliações com filtros
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
    const quadra_id = searchParams.get('quadra_id');
    const user_id = searchParams.get('user_id');
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles!reviews_user_id_fkey(id, nome_completo),
        reserva:reservations!reviews_reserva_id_fkey(
          id,
          data,
          quadra:courts!reservations_quadra_id_fkey(id, nome)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (quadra_id) {
      query = query.eq('reserva.quadra_id', quadra_id);
    }

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (rating) {
      query = query.eq('rating', parseInt(rating));
    }

    const { data: avaliacoes, error } = await query;

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar avaliações' },
        { status: 500 }
      );
    }

    return NextResponse.json(avaliacoes);
  } catch (error) {
    console.error('Erro na API de avaliações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
