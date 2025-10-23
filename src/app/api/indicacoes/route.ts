import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IndicacoesService } from '@/services/indicacoes.service';

// GET - Listar indicações do usuário
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

    const indicacoes = await IndicacoesService.listarIndicacoesUsuario(user.id);
    
    return NextResponse.json({ indicacoes });
  } catch (error) {
    console.error('Erro ao buscar indicações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova indicação
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
    const { emailIndicado, nomeIndicado } = body;

    if (!emailIndicado) {
      return NextResponse.json(
        { error: 'Email do indicado é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar código de indicação do usuário
    const codigoUsuario = await IndicacoesService.buscarCodigoUsuario(user.id);
    
    if (!codigoUsuario) {
      return NextResponse.json(
        { error: 'Código de indicação não encontrado' },
        { status: 404 }
      );
    }

    const indicacao = await IndicacoesService.criarIndicacao({
      usuarioIndicadorId: user.id,
      codigoIndicacao: codigoUsuario.codigo,
      emailIndicado,
      nomeIndicado,
    });

    if (!indicacao) {
      return NextResponse.json(
        { error: 'Erro ao criar indicação' },
        { status: 500 }
      );
    }

    return NextResponse.json({ indicacao }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar indicação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}