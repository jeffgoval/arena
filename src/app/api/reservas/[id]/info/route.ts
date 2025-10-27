import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: reservaId } = await params;

    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select(`
        id,
        data,
        organizador_id,
        quadra:quadras!reservas_quadra_id_fkey(nome)
      `)
      .eq('id', reservaId)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
    }

    const { data: participante } = await supabase
      .from('reserva_participantes')
      .select('id')
      .eq('reserva_id', reservaId)
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
      .eq('reserva_id', reservaId)
      .eq('user_id', user.id)
      .maybeSingle();

    const quadra = Array.isArray(reserva.quadra) ? reserva.quadra[0] : reserva.quadra;

    return NextResponse.json({
      id: reserva.id,
      quadra_nome: quadra?.nome || 'Quadra',
      data: reserva.data,
      ja_avaliada: !!avaliacaoExistente,
    });
  } catch (error) {
    console.error('Erro ao buscar informações da reserva:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
