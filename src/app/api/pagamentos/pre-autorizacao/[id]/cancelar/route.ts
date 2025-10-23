import { NextRequest, NextResponse } from 'next/server';
import { pagamentoService } from '@/services/pagamentoService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: preAuthId } = await params;

    if (!preAuthId) {
      return NextResponse.json(
        { erro: 'ID da pré-autorização é obrigatório' },
        { status: 400 }
      );
    }

    const resultado = await pagamentoService.cancelarPreAutorizacao(preAuthId);

    if (resultado.sucesso) {
      return NextResponse.json({ mensagem: 'Pré-autorização cancelada com sucesso' });
    } else {
      return NextResponse.json(
        { erro: resultado.erro },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao cancelar pré-autorização:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}