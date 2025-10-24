import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o usuário é dono da reserva ou é admin
    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    if (reserva.user_id !== session.user.id) {
      // Verificar se é admin
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userProfile?.role !== 'admin' && userProfile?.role !== 'gestor') {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        );
      }
    }

    // Parse do corpo da requisição
    const body = await request.json();
    const { participants, splitMode } = body;

    // TODO: Implementar a lógica de salvamento do rateio
    // Esta é uma implementação temporária até que o serviço esteja completo

    return NextResponse.json({
      success: true,
      message: 'Configuração de rateio salva com sucesso',
      reservaId: params.id,
      splitMode,
      participantsCount: participants.length
    });
  } catch (error) {
    console.error('Erro ao salvar configuração de rateio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o usuário é dono da reserva ou é admin
    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    if (reserva.user_id !== session.user.id) {
      // Verificar se é admin
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userProfile?.role !== 'admin' && userProfile?.role !== 'gestor') {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        );
      }
    }

    // TODO: Implementar a lógica de obtenção do rateio
    // Esta é uma implementação temporária até que o serviço esteja completo

    return NextResponse.json({
      splitMode: 'percentual',
      participants: []
    });
  } catch (error) {
    console.error('Erro ao obter configuração de rateio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}