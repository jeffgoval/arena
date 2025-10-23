import { NextRequest, NextResponse } from 'next/server';
import { pagamentoService } from '@/services/pagamentoService';
import { DadosPreAutorizacao } from '@/types/pagamento.types';

export async function POST(request: NextRequest) {
  try {
    const dados: DadosPreAutorizacao = await request.json();

    // Validar dados obrigatórios
    if (!dados.clienteId || !dados.valor || !dados.dadosCartao || !dados.dadosPortadorCartao) {
      return NextResponse.json(
        { erro: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    const resultado = await pagamentoService.criarPreAutorizacao(dados);

    if (resultado.sucesso) {
      return NextResponse.json(resultado.dados);
    } else {
      return NextResponse.json(
        { erro: resultado.erro, codigo: resultado.codigoErro },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao criar pré-autorização:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}