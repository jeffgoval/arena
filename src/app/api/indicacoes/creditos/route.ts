import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IndicacoesService } from '@/services/indicacoes.service';

// GET - Buscar créditos do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const creditos = await IndicacoesService.buscarCreditosUsuario(user.id);
    
    return NextResponse.json({ creditos });
  } catch (error) {
    console.error('Erro ao buscar créditos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Usar créditos para reserva
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { valorCreditos, reservaId } = body;

    if (!valorCreditos || !reservaId) {
      return NextResponse.json(
        { error: 'Valor dos créditos e ID da reserva são obrigatórios' },
        { status: 400 }
      );
    }

    const sucesso = await IndicacoesService.usarCreditos(
      user.id,
      valorCreditos,
      reservaId
    );

    if (!sucesso) {
      return NextResponse.json(
        { error: 'Erro ao usar créditos ou créditos insuficientes' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'Créditos utilizados com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao usar créditos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}