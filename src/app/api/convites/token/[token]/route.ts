import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

/**
 * GET /api/convites/token/[token]
 * Buscar convite por token (para página pública)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const supabase = await createClient();
    const { token } = await params;

    // Buscar convite pelo token
    const { data: convite, error: conviteError } = await supabase
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
      `)
      .eq('token', token)
      .single();

    if (conviteError || !convite) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o convite expirou
    if (convite.data_expiracao && new Date(convite.data_expiracao) < new Date()) {
      // Atualizar status para expirado
      await supabase
        .from('convites')
        .update({ status: 'expirado' })
        .eq('id', convite.id);
      
      return NextResponse.json(
        { error: 'Convite expirado' },
        { status: 410 }
      );
    }

    // Buscar total de aceites confirmados
    const { count: totalAceites } = await supabase
      .from('aceites_convite')
      .select('*', { count: 'exact', head: true })
      .eq('convite_id', convite.id)
      .eq('confirmado', true);

    return NextResponse.json({
      ...convite,
      total_aceites: totalAceites || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar convite por token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/convites/token/[token]/aceitar
 * Aceitar convite por token
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const supabase = await createClient();
    const { token } = await params;
    const body = await request.json();
    const { nome, email, whatsapp } = body;

    // Buscar convite pelo token
    const { data: convite, error: conviteError } = await supabase
      .from('convites')
      .select('*')
      .eq('token', token)
      .single();

    if (conviteError || !convite) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o convite está ativo
    if (convite.status !== 'ativo') {
      return NextResponse.json(
        { error: 'Convite não está mais disponível' },
        { status: 400 }
      );
    }

    // Verificar se o convite expirou
    if (convite.data_expiracao && new Date(convite.data_expiracao) < new Date()) {
      // Atualizar status para expirado
      await supabase
        .from('convites')
        .update({ status: 'expirado' })
        .eq('id', convite.id);
      
      return NextResponse.json(
        { error: 'Convite expirado' },
        { status: 410 }
      );
    }

    // Verificar se ainda há vagas disponíveis
    const { count: totalAceites } = await supabase
      .from('aceites_convite')
      .select('*', { count: 'exact', head: true })
      .eq('convite_id', convite.id)
      .eq('confirmado', true);

    if (totalAceites && totalAceites >= convite.vagas_disponiveis) {
      // Atualizar status para completo
      await supabase
        .from('convites')
        .update({ status: 'completo' })
        .eq('id', convite.id);
      
      return NextResponse.json(
        { error: 'Todas as vagas deste convite já foram preenchidas' },
        { status: 400 }
      );
    }

    // Verificar se o usuário já aceitou este convite
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: aceiteExistente } = await supabase
        .from('aceites_convite')
        .select('id')
        .eq('convite_id', convite.id)
        .eq('user_id', user.id)
        .single();

      if (aceiteExistente) {
        return NextResponse.json(
          { error: 'Você já aceitou este convite' },
          { status: 400 }
        );
      }
    }

    // Criar aceite do convite
    const { data: aceite, error: aceiteError } = await supabase
      .from('aceites_convite')
      .insert({
        convite_id: convite.id,
        nome: nome || (user ? user.user_metadata?.full_name : ''),
        email: email || (user ? user.email : ''),
        whatsapp: whatsapp || '',
        user_id: user?.id,
        confirmado: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (aceiteError) {
      console.error('Erro ao criar aceite:', aceiteError);
      return NextResponse.json(
        { error: 'Erro ao aceitar convite' },
        { status: 500 }
      );
    }

    // Adicionar convidado como participante da reserva
    const { error: participanteError } = await supabase
      .from('reserva_participantes')
      .insert({
        reserva_id: convite.reserva_id,
        user_id: user?.id,
        nome: nome || (user ? user.user_metadata?.full_name : ''),
        email: email || (user ? user.email : ''),
        whatsapp: whatsapp || '',
        origem: 'convite',
        convite_id: convite.id,
        status_pagamento: 'pendente',
        created_at: new Date().toISOString()
      });

    if (participanteError) {
      console.error('Erro ao adicionar participante:', participanteError);
      // Reverter aceite em caso de erro
      await supabase
        .from('aceites_convite')
        .delete()
        .eq('id', aceite.id);
      
      return NextResponse.json(
        { error: 'Erro ao adicionar participante à reserva' },
        { status: 500 }
      );
    }

    // Verificar se todas as vagas foram preenchidas
    const novoTotalAceites = (totalAceites || 0) + 1;
    if (novoTotalAceites >= convite.vagas_disponiveis) {
      // Atualizar status do convite para completo
      await supabase
        .from('convites')
        .update({ status: 'completo' })
        .eq('id', convite.id);
    }

    // Notificar organizador (implementar notificação)
    console.log(`Convite aceito por ${nome || 'usuário'} para a reserva ${convite.reserva_id}`);

    return NextResponse.json({
      success: true,
      aceite,
      message: 'Convite aceito com sucesso'
    });
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}