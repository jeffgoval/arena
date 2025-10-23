import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Obter detalhes de um jogo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jogoId } = await params;
    const supabase = await createClient();

    const { data: jogo, error } = await supabase
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
        updated_at,
        usuarios (
          id,
          nome,
          email,
          avatar_url
        ),
        reservas (
          id,
          quadras (
            id,
            nome,
            tipo,
            localizacao
          )
        ),
        jogo_participantes (
          usuarios (
            id,
            nome,
            email,
            avatar_url
          )
        )
      `)
      .eq('id', jogoId)
      .single();

    if (error) {
      console.error('Erro ao buscar jogo:', error);
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      jogo
    });

  } catch (error) {
    console.error('Erro na API de jogo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Atualizar jogo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jogoId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const {
      resultado,
      pontuacaoUsuario,
      pontuacaoAdversario,
      duracao,
      avaliacao,
      observacoes
    } = body;

    const { data: jogo, error } = await supabase
      .from('jogos')
      .update({
        resultado,
        pontuacao_usuario: pontuacaoUsuario,
        pontuacao_adversario: pontuacaoAdversario,
        duracao,
        avaliacao,
        observacoes,
        updated_at: new Date().toISOString()
      })
      .eq('id', jogoId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar jogo:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar jogo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      jogo
    });

  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Deletar jogo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jogoId } = await params;
    const supabase = await createClient();

    // Primeiro deletar participantes
    await supabase
      .from('jogo_participantes')
      .delete()
      .eq('jogo_id', jogoId);

    // Depois deletar o jogo
    const { error } = await supabase
      .from('jogos')
      .delete()
      .eq('id', jogoId);

    if (error) {
      console.error('Erro ao deletar jogo:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar jogo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Jogo deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}