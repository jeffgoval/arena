import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IndicacoesService } from '@/services/indicacoes.service';

// POST - Aplicar código de indicação
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
    const { codigoIndicacao } = body;

    if (!codigoIndicacao) {
      return NextResponse.json(
        { error: 'Código de indicação é obrigatório' },
        { status: 400 }
      );
    }

    // Validar se o código existe
    const codigoValido = await IndicacoesService.validarCodigo(codigoIndicacao);
    
    if (!codigoValido) {
      return NextResponse.json(
        { error: 'Código de indicação inválido' },
        { status: 400 }
      );
    }

    // Verificar se o usuário não está tentando usar seu próprio código
    const codigoUsuario = await IndicacoesService.buscarCodigoUsuario(user.id);
    
    if (codigoUsuario?.codigo === codigoIndicacao) {
      return NextResponse.json(
        { error: 'Você não pode usar seu próprio código de indicação' },
        { status: 400 }
      );
    }

    const sucesso = await IndicacoesService.aplicarCodigoIndicacao(
      codigoIndicacao,
      user.id
    );

    if (!sucesso) {
      return NextResponse.json(
        { error: 'Erro ao aplicar código de indicação' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Código de indicação aplicado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao aplicar código de indicação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}