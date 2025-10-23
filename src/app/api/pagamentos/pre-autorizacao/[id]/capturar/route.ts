import { NextRequest, NextResponse } from 'next/server';
import { pagamentoService } from '@/services/pagamentoService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const preAuthId = params.id;
    const { valor } = await request.json();

    if (!preAuthId) {
      return NextResponse.json(
        { erro: 'ID da pré-autorização é obrigatório' },
        { status: 400 }
      );
    }

    const resultado = await pagamentoService.capturarPreAutorizacao(preAuthId, valor);

    if (resultado.sucesso) {
      return NextResponse.json(resultado.dados);
    } else {
      return NextResponse.json(
        { erro: resultado.erro, codigo: resultado.codigoErro },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao capturar pré-autorização:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}