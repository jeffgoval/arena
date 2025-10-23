import { NextRequest, NextResponse } from 'next/server';
import { pagamentoService } from '@/services/pagamentoService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pagamentoId = params.id;
    const { valor, descricao } = await request.json();

    if (!pagamentoId) {
      return NextResponse.json(
        { erro: 'ID do pagamento é obrigatório' },
        { status: 400 }
      );
    }

    const resultado = await pagamentoService.estornarPagamento(
      pagamentoId,
      valor,
      descricao
    );

    if (resultado.sucesso) {
      return NextResponse.json({ mensagem: 'Pagamento estornado com sucesso' });
    } else {
      return NextResponse.json(
        { erro: resultado.erro },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao estornar pagamento:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}