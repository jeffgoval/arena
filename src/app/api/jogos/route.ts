import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Listar jogos do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const modalidade = searchParams.get('modalidade');
    const resultado = searchParams.get('resultado');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('jogos')
      .select(`
        id,
        data_hora,
        duracao,
        modalidade,
        tipo_jogo,
        resultado,
        pontuacao_usuario,
        pontuacao_adversario,
        avaliacao,
        observacoes,
        created_at,
        reservas (
          id,
          quadras (nome)
        ),
        jogo_participantes (
          usuarios (nome, email)
        )
      `)
      .eq('usuario_id', userId)
      .order('data_hora', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (modalidade && modalidade !== 'todas') {
      query = query.eq('modalidade', modalidade);
    }

    if (resultado && resultado !== 'todos') {
      query = query.eq('resultado', resultado);
    }

    const { data: jogos, error } = await query;

    if (error) {
      console.error('Erro ao buscar jogos:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    // Calcular estatísticas
    const { data: estatisticas, error: statsError } = await supabase
      .from('jogos')
      .select('resultado, duracao, avaliacao')
      .eq('usuario_id', userId);

    if (statsError) {
      console.error('Erro ao calcular estatísticas:', statsError);
    }

    const stats = {
      total: estatisticas?.length || 0,
      vitorias: estatisticas?.filter(j => j.resultado === 'vitoria').length || 0,
      derrotas: estatisticas?.filter(j => j.resultado === 'derrota').length || 0,
      empates: estatisticas?.filter(j => j.resultado === 'empate').length || 0,
      tempoTotal: estatisticas?.reduce((acc, jogo) => acc + (jogo.duracao || 0), 0) || 0,
      avaliacaoMedia: estatisticas?.filter(j => j.avaliacao).length > 0 
        ? estatisticas.filter(j => j.avaliacao).reduce((acc, jogo) => acc + (jogo.avaliacao || 0), 0) / estatisticas.filter(j => j.avaliacao).length
        : 0
    };

    return NextResponse.json({
      success: true,
      jogos: jogos || [],
      estatisticas: stats,
      pagination: {
        limit,
        offset,
        total: stats.total
      }
    });

  } catch (error) {
    console.error('Erro na API de jogos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Criar novo jogo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      usuarioId,
      reservaId,
      modalidade,
      tipoJogo,
      resultado,
      pontuacaoUsuario,
      pontuacaoAdversario,
      duracao,
      participantes,
      avaliacao,
      observacoes
    } = body;

    // Validações
    if (!usuarioId || !modalidade || !tipoJogo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: usuarioId, modalidade, tipoJogo' },
        { status: 400 }
      );
    }

    // Criar jogo
    const { data: jogo, error: jogoError } = await supabase
      .from('jogos')
      .insert({
        usuario_id: usuarioId,
        reserva_id: reservaId,
        data_hora: new Date().toISOString(),
        modalidade,
        tipo_jogo: tipoJogo,
        resultado,
        pontuacao_usuario: pontuacaoUsuario,
        pontuacao_adversario: pontuacaoAdversario,
        duracao,
        avaliacao,
        observacoes
      })
      .select()
      .single();

    if (jogoError) {
      console.error('Erro ao criar jogo:', jogoError);
      return NextResponse.json(
        { error: 'Erro ao criar jogo' },
        { status: 500 }
      );
    }

    // Adicionar participantes se fornecidos
    if (participantes && participantes.length > 0) {
      const participantesData = participantes.map((participanteId: string) => ({
        jogo_id: jogo.id,
        usuario_id: participanteId
      }));

      const { error: participantesError } = await supabase
        .from('jogo_participantes')
        .insert(participantesData);

      if (participantesError) {
        console.error('Erro ao adicionar participantes:', participantesError);
      }
    }

    return NextResponse.json({
      success: true,
      jogo
    });

  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}