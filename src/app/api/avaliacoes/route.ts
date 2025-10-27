import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAvaliacaoSchema } from '@/lib/validations/avaliacao.schema';

export const runtime = 'edge';

const SELECT_RELACAO = `
  *,
  usuario:users!avaliacoes_user_id_fkey(id, nome_completo),
  reserva:reservas!avaliacoes_reserva_id_fkey(
    id,
    data,
    quadra:quadras!reservas_quadra_id_fkey(id, nome)
  )
`;

/**
 * POST /api/avaliacoes
 * Criar uma nova avaliação
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const dadosValidados = createAvaliacaoSchema.parse(body);

    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select('id, organizador_id, data')
      .eq('id', dadosValidados.reserva_id)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
    }

    const { data: participante } = await supabase
      .from('reserva_participantes')
      .select('id')
      .eq('reserva_id', dadosValidados.reserva_id)
      .eq('user_id', user.id)
      .maybeSingle();

    const usuarioPodeAvaliar = reserva.organizador_id === user.id || !!participante;
    if (!usuarioPodeAvaliar) {
      return NextResponse.json(
        { error: 'Você não tem permissão para avaliar esta reserva' },
        { status: 403 }
      );
    }

    const { data: avaliacaoExistente } = await supabase
      .from('avaliacoes')
      .select('id')
      .eq('reserva_id', dadosValidados.reserva_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Você já avaliou esta reserva' },
        { status: 400 }
      );
    }

    const { data: avaliacao, error: insertError } = await supabase
      .from('avaliacoes')
      .insert({
        reserva_id: dadosValidados.reserva_id,
        user_id: user.id,
        nota: dadosValidados.rating,
        comentario: dadosValidados.comentario || null,
        avaliacao_atendimento: dadosValidados.avaliacao_atendimento || null,
        avaliacao_limpeza: dadosValidados.avaliacao_limpeza || null,
        avaliacao_instalacoes: dadosValidados.avaliacao_instalacoes || null,
      })
      .select(SELECT_RELACAO)
      .single();

    if (insertError) {
      console.error('Erro ao criar avaliação:', insertError);
      return NextResponse.json({ error: 'Erro ao criar avaliação' }, { status: 500 });
    }

    return NextResponse.json(avaliacao, { status: 201 });
  } catch (error) {
    console.error('Erro na API de avaliações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

/**
 * GET /api/avaliacoes
 * Listar avaliações com filtros
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const quadraId = searchParams.get('quadra_id');
    const userId = searchParams.get('user_id');
    const rating = searchParams.get('rating');
    const limit = Number.parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('avaliacoes')
      .select(SELECT_RELACAO)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (quadraId) {
      query = query.eq('reserva.quadra_id', quadraId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (rating) {
      query = query.eq('nota', Number.parseInt(rating));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return NextResponse.json({ error: 'Erro ao buscar avaliações' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API de avaliações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
