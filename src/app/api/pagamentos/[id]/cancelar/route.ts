import { NextRequest, NextResponse } from 'next/server';
import { pagamentoService } from '@/services/pagamentoService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pagamentoId } = await params;

    if (!pagamentoId) {
      return NextResponse.json(
        { erro: 'ID do pagamento é obrigatório' },
        { status: 400 }
      );
    }

    const resultado = await pagamentoService.cancelarPagamento(pagamentoId);

    if (resultado.sucesso) {
      return NextResponse.json({ mensagem: 'Pagamento cancelado com sucesso' });
    } else {
      return NextResponse.json(
        { erro: resultado.erro },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao cancelar pagamento:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}