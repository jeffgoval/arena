import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pagamentoService } from '@/services/pagamentoService';

// Comprar créditos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      usuarioId,
      pacote,
      metodoPagamento,
      dadosCartao,
      dadosPortadorCartao
    } = body;

    // Validações
    if (!usuarioId || !pacote || !metodoPagamento) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: usuarioId, pacote, metodoPagamento' },
        { status: 400 }
      );
    }

    // Definir pacotes disponíveis
    const pacotes = {
      basico: {
        nome: 'Pacote Básico',
        valor: 50.00,
        creditos: 50.00,
        bonus: 0,
        validadeMeses: 6
      },
      premium: {
        nome: 'Pacote Premium',
        valor: 100.00,
        creditos: 100.00,
        bonus: 10.00,
        validadeMeses: 12
      },
      vip: {
        nome: 'Pacote VIP',
        valor: 200.00,
        creditos: 200.00,
        bonus: 50.00,
        validadeMeses: 18
      }
    };

    const pacoteEscolhido = pacotes[pacote as keyof typeof pacotes];
    if (!pacoteEscolhido) {
      return NextResponse.json(
        { error: 'Pacote inválido' },
        { status: 400 }
      );
    }

    // Buscar dados do usuário
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', usuarioId)
      .single();

    if (usuarioError || !usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Criar cliente no Asaas se necessário
    let clienteAsaasId = usuario.asaas_customer_id;
    
    if (!clienteAsaasId) {
      clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        celular: usuario.telefone,
        cpf: usuario.cpf || '',
        cep: usuario.cep || '',
        endereco: usuario.endereco || '',
        numero: usuario.numero || '',
        complemento: usuario.complemento || '',
        bairro: usuario.bairro || '',
        cidade: usuario.cidade || '',
        estado: usuario.estado || ''
      });

      // Salvar ID do cliente Asaas
      await supabase
        .from('usuarios')
        .update({ asaas_customer_id: clienteAsaasId })
        .eq('id', usuarioId);
    }

    // Calcular data de expiração
    const dataExpiracao = new Date();
    dataExpiracao.setMonth(dataExpiracao.getMonth() + pacoteEscolhido.validadeMeses);

    // Criar registro de compra de créditos (pendente)
    const { data: compraCreditos, error: compraError } = await supabase
      .from('creditos')
      .insert({
        usuario_id: usuarioId,
        tipo: 'compra',
        valor: pacoteEscolhido.creditos,
        descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
        status: 'pendente',
        data_expiracao: dataExpiracao.toISOString(),
        metodo_pagamento: metodoPagamento,
        pacote_info: pacoteEscolhido
      })
      .select()
      .single();

    if (compraError) {
      console.error('Erro ao criar compra de créditos:', compraError);
      return NextResponse.json(
        { error: 'Erro ao processar compra' },
        { status: 500 }
      );
    }

    // Criar bônus se houver
    let bonusCredito = null;
    if (pacoteEscolhido.bonus > 0) {
      const { data: bonus, error: bonusError } = await supabase
        .from('creditos')
        .insert({
          usuario_id: usuarioId,
          tipo: 'bonus',
          valor: pacoteEscolhido.bonus,
          descricao: `Bônus ${pacoteEscolhido.nome}`,
          status: 'pendente',
          data_expiracao: dataExpiracao.toISOString(),
          credito_origem_id: compraCreditos.id
        })
        .select()
        .single();

      if (!bonusError) {
        bonusCredito = bonus;
      }
    }

    // Processar pagamento
    let resultadoPagamento;
    
    try {
      switch (metodoPagamento) {
        case 'PIX':
          resultadoPagamento = await pagamentoService.criarPagamentoPix({
            clienteId: clienteAsaasId,
            valor: pacoteEscolhido.valor,
            dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24h
            descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
            referencia: compraCreditos.id
          });
          break;

        case 'CREDIT_CARD':
          if (!dadosCartao || !dadosPortadorCartao) {
            return NextResponse.json(
              { error: 'Dados do cartão são obrigatórios' },
              { status: 400 }
            );
          }

          resultadoPagamento = await pagamentoService.criarPagamentoCartao({
            clienteId: clienteAsaasId,
            valor: pacoteEscolhido.valor,
            dataVencimento: new Date().toISOString().split('T')[0],
            descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
            referencia: compraCreditos.id,
            dadosCartao,
            dadosPortadorCartao
          });
          break;

        case 'BOLETO':
          resultadoPagamento = await pagamentoService.criarPagamentoBoleto({
            clienteId: clienteAsaasId,
            valor: pacoteEscolhido.valor,
            dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
            descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
            referencia: compraCreditos.id
          });
          break;

        default:
          return NextResponse.json(
            { error: 'Método de pagamento inválido' },
            { status: 400 }
          );
      }

      if (!resultadoPagamento.sucesso) {
        // Cancelar compra se pagamento falhou
        await supabase
          .from('creditos')
          .update({ status: 'cancelado' })
          .eq('id', compraCreditos.id);

        if (bonusCredito) {
          await supabase
            .from('creditos')
            .update({ status: 'cancelado' })
            .eq('id', bonusCredito.id);
        }

        return NextResponse.json(
          { 
            error: 'Erro ao processar pagamento',
            detalhes: resultadoPagamento.erro
          },
          { status: 400 }
        );
      }

      // Salvar dados do pagamento
      await supabase
        .from('creditos')
        .update({ 
          asaas_payment_id: resultadoPagamento.dados?.id,
          status: metodoPagamento === 'CREDIT_CARD' ? 'ativo' : 'aguardando_pagamento'
        })
        .eq('id', compraCreditos.id);

      if (bonusCredito) {
        await supabase
          .from('creditos')
          .update({ 
            status: metodoPagamento === 'CREDIT_CARD' ? 'ativo' : 'aguardando_pagamento'
          })
          .eq('id', bonusCredito.id);
      }

      return NextResponse.json({
        success: true,
        compra: compraCreditos,
        bonus: bonusCredito,
        pagamento: resultadoPagamento.dados,
        message: 'Compra processada com sucesso'
      });

    } catch (error) {
      console.error('Erro no pagamento:', error);
      
      // Cancelar compra em caso de erro
      await supabase
        .from('creditos')
        .update({ status: 'cancelado' })
        .eq('id', compraCreditos.id);

      if (bonusCredito) {
        await supabase
          .from('creditos')
          .update({ status: 'cancelado' })
          .eq('id', bonusCredito.id);
      }

      return NextResponse.json(
        { error: 'Erro ao processar pagamento' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erro na compra de créditos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}