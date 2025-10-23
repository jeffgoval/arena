import { NextRequest, NextResponse } from 'next/server';
import { pagamentoService } from '@/services/pagamentoService';
import { DadosPagamento, TipoPagamento } from '@/types/pagamento.types';

export async function POST(request: NextRequest) {
  try {
    const dados: DadosPagamento = await request.json();

    // Validar dados obrigatórios
    if (!dados.clienteId || !dados.valor || !dados.dataVencimento || !dados.tipoPagamento) {
      return NextResponse.json(
        { erro: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    let resultado;

    switch (dados.tipoPagamento) {
      case TipoPagamento.PIX:
        resultado = await pagamentoService.criarPagamentoPix(dados);
        break;
      
      case TipoPagamento.CARTAO_CREDITO:
        if (!dados.dadosCartao || !dados.dadosPortadorCartao) {
          return NextResponse.json(
            { erro: 'Dados do cartão são obrigatórios para pagamento com cartão' },
            { status: 400 }
          );
        }
        resultado = await pagamentoService.criarPagamentoCartao(dados);
        break;
      
      case TipoPagamento.BOLETO:
        resultado = await pagamentoService.criarPagamentoBoleto(dados);
        break;
      
      default:
        return NextResponse.json(
          { erro: 'Tipo de pagamento não suportado' },
          { status: 400 }
        );
    }

    if (resultado.sucesso) {
      return NextResponse.json(resultado.dados);
    } else {
      return NextResponse.json(
        { erro: resultado.erro, codigo: resultado.codigoErro },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagamentoId = searchParams.get('id');

    if (!pagamentoId) {
      return NextResponse.json(
        { erro: 'ID do pagamento é obrigatório' },
        { status: 400 }
      );
    }

    const pagamento = await pagamentoService.consultarPagamento(pagamentoId);

    if (!pagamento) {
      return NextResponse.json(
        { erro: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pagamento);

  } catch (error: any) {
    console.error('Erro ao consultar pagamento:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}