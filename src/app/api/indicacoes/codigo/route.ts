import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IndicacoesService } from '@/services/indicacoes.service';

// Gerar código único de 8 caracteres
function gerarCodigoUnico(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem I, O, 0, 1 para evitar confusão
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

// GET - Buscar código de indicação do usuário (cria automaticamente se não existir)
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

    // Tentar buscar código existente
    let codigo = await IndicacoesService.buscarCodigoUsuario(user.id);

    // Se não existir, criar automaticamente
    if (!codigo) {
      const novoCodigo = gerarCodigoUnico();

      const { data, error } = await supabase
        .from('codigos_indicacao')
        .insert({
          usuario_id: user.id,
          codigo: novoCodigo,
          ativo: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar código de indicação:', error);
        return NextResponse.json(
          { error: 'Erro ao criar código de indicação' },
          { status: 500 }
        );
      }

      codigo = data;
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