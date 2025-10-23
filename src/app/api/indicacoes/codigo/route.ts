import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IndicacoesService } from '@/services/indicacoes.service';

// GET - Buscar código de indicação do usuário
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

    const codigo = await IndicacoesService.buscarCodigoUsuario(user.id);
    
    if (!codigo) {
      return NextResponse.json(
        { error: 'Código de indicação não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ codigo });
  } catch (error) {
    console.error('Erro ao buscar código de indicação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}