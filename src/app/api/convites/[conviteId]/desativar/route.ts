import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

/**
 * POST /api/convites/[conviteId]/desativar
 * Desativar um convite (marcar como expirado)
 */
export async function POST(
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

    // Verificar se o convite existe e pertence ao usuário
    const { data: convite, error: conviteError } = await supabase
      .from('invites')
      .select('id, criado_por, status')
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
        { error: 'Você não tem permissão para desativar este convite' },
        { status: 403 }
      );
    }

    if (convite.status !== 'ativo') {
      return NextResponse.json(
        { error: 'Este convite já está inativo' },
        { status: 400 }
      );
    }

    // Atualizar status para expirado
    const { error: updateError } = await supabase
      .from('invites')
      .update({ 
        status: 'expirado',
        updated_at: new Date().toISOString(),
      })
      .eq('id', conviteId);

    if (updateError) {
      console.error('Erro ao desativar convite:', updateError);
      return NextResponse.json(
        { error: 'Erro ao desativar convite' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API de desativar convite:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
