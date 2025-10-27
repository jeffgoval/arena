import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pagamentoService } from '@/services/pagamentoService';
import { logger, sanitizarDadosParaLog } from '@/lib/utils/logger';

// Comprar créditos
export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      usuarioId,
      pacote,
      metodoPagamento,
      dadosCartao,
      dadosPortadorCartao
    } = body;

    logger.info('API:ComprarCreditos', 'Nova requisição de compra', {
      requestId,
      usuarioId,
      pacote,
      metodoPagamento,
      temDadosCartao: !!dadosCartao,
      temDadosPortador: !!dadosPortadorCartao
    }, usuarioId);

    // Validações
    if (!usuarioId || !pacote || !metodoPagamento) {
      logger.warn('API:ComprarCreditos', 'Campos obrigatórios faltando', {
        requestId,
        temUsuarioId: !!usuarioId,
        temPacote: !!pacote,
        temMetodoPagamento: !!metodoPagamento
      });
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
      logger.warn('API:ComprarCreditos', 'Pacote inválido', { requestId, pacote }, usuarioId);
      return NextResponse.json(
        { error: 'Pacote inválido' },
        { status: 400 }
      );
    }

    logger.info('API:ComprarCreditos', 'Pacote selecionado', {
      requestId,
      pacote: pacoteEscolhido.nome,
      valor: pacoteEscolhido.valor,
      creditos: pacoteEscolhido.creditos
    }, usuarioId);

    // Buscar dados do usuário
    logger.info('API:ComprarCreditos', 'Buscando dados do usuário', { requestId, usuarioId }, usuarioId);
    
    const { data: usuario, error: usuarioError } = await supabase
      .from('users')
      .select('*')
      .eq('id', usuarioId)
      .single();

    if (usuarioError || !usuario) {
      logger.error('API:ComprarCreditos', 'Usuário não encontrado', usuarioError as Error, {
        requestId,
        usuarioId
      }, usuarioId);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    logger.info('API:ComprarCreditos', 'Dados do usuário carregados', {
      requestId,
      usuarioId,
      temCPF: !!usuario.cpf,
      temEmail: !!usuario.email,
      temEndereco: !!usuario.logradouro,
      temWhatsapp: !!usuario.whatsapp,
      dadosUsuario: sanitizarDadosParaLog({
        cpf: usuario.cpf,
        email: usuario.email,
        whatsapp: usuario.whatsapp
      })
    }, usuarioId);

    // Validar CPF obrigatório para Asaas
    if (!usuario.cpf) {
      logger.warn('API:ComprarCreditos', 'CPF ausente no perfil do usuário', {
        requestId,
        usuarioId
      }, usuarioId);
      return NextResponse.json(
        { 
          error: 'CPF é obrigatório para realizar pagamentos',
          sugestao: 'Por favor, complete seu perfil com o CPF antes de realizar a compra'
        },
        { status: 400 }
      );
    }

    // Criar ou buscar cliente no Asaas
    let clienteAsaasId: string;
    try {
      // Buscar asaas_customer_id se existir
      const asaasCustomerId = (usuario as any).asaas_customer_id || undefined;

      logger.info('API:ComprarCreditos', 'Preparando dados do cliente para Asaas', {
        requestId,
        usuarioId,
        jaTemClienteAsaas: !!asaasCustomerId,
        asaasCustomerId
      }, usuarioId);

      // Montar dados do cliente (campos vazios serão removidos pelo serviço)
      clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
        id: asaasCustomerId,
        nome: usuario.nome_completo || usuario.email,
        email: usuario.email,
        cpf: usuario.cpf,
        telefone: usuario.whatsapp || '',
        celular: usuario.whatsapp || '',
        cep: usuario.cep || '',
        endereco: usuario.logradouro || '',
        numero: usuario.numero || '',
        complemento: usuario.complemento || '',
        bairro: usuario.bairro || '',
        cidade: usuario.cidade || '',
        estado: usuario.estado || ''
      });

      logger.info('API:ComprarCreditos', 'Cliente Asaas criado/atualizado com sucesso', {
        requestId,
        usuarioId,
        clienteAsaasId,
        eraNovoCliente: !asaasCustomerId
      }, usuarioId);

      // Salvar o ID do cliente Asaas no banco se for novo
      if (!asaasCustomerId && clienteAsaasId) {
        await supabase
          .from('users')
          .update({ asaas_customer_id: clienteAsaasId })
          .eq('id', usuarioId);
        
        logger.info('API:ComprarCreditos', 'ID do cliente Asaas salvo no banco', {
          requestId,
          usuarioId,
          clienteAsaasId
        }, usuarioId);
      }
    } catch (asaasError: any) {
      logger.error('API:ComprarCreditos', 'Erro ao criar cliente Asaas', asaasError, {
        requestId,
        usuarioId,
        dadosUsuario: sanitizarDadosParaLog({
          cpf: usuario.cpf,
          email: usuario.email,
          nome: usuario.nome_completo
        })
      }, usuarioId);
      
      // Verificar se é um erro de autenticação
      let mensagemErro = 'Erro ao criar cliente no sistema de pagamento';
      let sugestao = 'Tente novamente em alguns instantes';
      
      if (asaasError.message && asaasError.message.includes('invalid_access_token')) {
        mensagemErro = 'Sistema de pagamento temporariamente indisponível';
        sugestao = 'Por favor, tente novamente mais tarde ou entre em contato com o suporte';
      } else if (asaasError.message && asaasError.message.includes('cpfCnpj')) {
        mensagemErro = 'CPF inválido';
        sugestao = 'Verifique se o CPF está correto no seu perfil';
      } else if (asaasError.message && asaasError.message.includes('email')) {
        mensagemErro = 'Email inválido';
        sugestao = 'Verifique se o email está correto no seu perfil';
      }
      
      return NextResponse.json(
        {
          error: mensagemErro,
          detalhes: asaasError.message,
          sugestao
        },
        { status: 500 }
      );
    }

    // Calcular data de expiração
    const dataExpiracao = new Date();
    dataExpiracao.setMonth(dataExpiracao.getMonth() + pacoteEscolhido.validadeMeses);

    // Criar registro de compra de créditos
    // Nota: Créditos são criados como 'ativo' e serão gerenciados via webhook do pagamento
    const { data: compraCreditos, error: compraError } = await supabase
      .from('creditos')
      .insert({
        usuario_id: usuarioId,
        tipo: 'compra',
        valor: pacoteEscolhido.creditos,
        descricao: `Compra de créditos - ${pacoteEscolhido.nome} (R$ ${pacoteEscolhido.valor})`,
        status: 'ativo',
        data_expiracao: dataExpiracao.toISOString(),
        metodo_pagamento: metodoPagamento
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
          status: 'ativo',
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
      logger.info('API:ComprarCreditos', 'Iniciando processamento de pagamento', {
        requestId,
        usuarioId,
        metodo: metodoPagamento,
        valor: pacoteEscolhido.valor,
        clienteAsaasId
      }, usuarioId);

      switch (metodoPagamento) {
        case 'PIX':
          resultadoPagamento = await pagamentoService.criarPagamentoPix({
            clienteId: clienteAsaasId,
            tipoPagamento: 'PIX',
            valor: pacoteEscolhido.valor,
            dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24h
            descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
            referencia: compraCreditos.id
          });
          logger.info('API:ComprarCreditos', 'Resultado pagamento PIX', {
            requestId,
            usuarioId,
            sucesso: resultadoPagamento.sucesso,
            pagamentoId: resultadoPagamento.dados?.id
          }, usuarioId);
          break;

        case 'CREDIT_CARD':
          if (!dadosCartao || !dadosPortadorCartao) {
            logger.warn('API:ComprarCreditos', 'Dados do cartão ausentes', {
              requestId,
              usuarioId
            }, usuarioId);
            return NextResponse.json(
              { 
                error: 'Dados do cartão são obrigatórios',
                sugestao: 'Preencha todos os dados do cartão de crédito'
              },
              { status: 400 }
            );
          }

          resultadoPagamento = await pagamentoService.criarPagamentoCartao({
            clienteId: clienteAsaasId,
            tipoPagamento: 'CREDIT_CARD',
            valor: pacoteEscolhido.valor,
            dataVencimento: new Date().toISOString().split('T')[0],
            descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
            referencia: compraCreditos.id,
            dadosCartao,
            dadosPortadorCartao
          });
          logger.info('API:ComprarCreditos', 'Resultado pagamento Cartão', {
            requestId,
            usuarioId,
            sucesso: resultadoPagamento.sucesso,
            pagamentoId: resultadoPagamento.dados?.id
          }, usuarioId);
          break;

        case 'BOLETO':
          resultadoPagamento = await pagamentoService.criarPagamentoBoleto({
            clienteId: clienteAsaasId,
            tipoPagamento: 'BOLETO',
            valor: pacoteEscolhido.valor,
            dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
            descricao: `Compra de créditos - ${pacoteEscolhido.nome}`,
            referencia: compraCreditos.id
          });
          logger.info('API:ComprarCreditos', 'Resultado pagamento Boleto', {
            requestId,
            usuarioId,
            sucesso: resultadoPagamento.sucesso,
            pagamentoId: resultadoPagamento.dados?.id
          }, usuarioId);
          break;

        default:
          logger.warn('API:ComprarCreditos', 'Método de pagamento inválido', {
            requestId,
            usuarioId,
            metodoPagamento
          }, usuarioId);
          return NextResponse.json(
            { 
              error: 'Método de pagamento inválido',
              sugestao: 'Escolha PIX, Cartão de Crédito ou Boleto'
            },
            { status: 400 }
          );
      }

      if (!resultadoPagamento.sucesso) {
        logger.warn('API:ComprarCreditos', 'Pagamento falhou, removendo créditos criados', {
          requestId,
          usuarioId,
          erro: resultadoPagamento.erro,
          codigoErro: resultadoPagamento.codigoErro
        }, usuarioId);

        // Remover créditos criados se pagamento falhou
        await supabase
          .from('creditos')
          .delete()
          .eq('id', compraCreditos.id);

        if (bonusCredito) {
          await supabase
            .from('creditos')
            .delete()
            .eq('id', bonusCredito.id);
        }

        return NextResponse.json(
          {
            error: 'Erro ao processar pagamento',
            detalhes: resultadoPagamento.erro,
            sugestao: 'Verifique os dados informados e tente novamente'
          },
          { status: 400 }
        );
      }

      // Salvar ID do pagamento Asaas
      // Nota: Status já é 'ativo', não precisa atualizar
      await supabase
        .from('creditos')
        .update({
          asaas_payment_id: resultadoPagamento.dados?.id
        })
        .eq('id', compraCreditos.id);

      logger.info('API:ComprarCreditos', 'Compra processada com sucesso', {
        requestId,
        usuarioId,
        compraId: compraCreditos.id,
        pagamentoId: resultadoPagamento.dados?.id,
        valor: pacoteEscolhido.valor,
        creditos: pacoteEscolhido.creditos,
        bonus: pacoteEscolhido.bonus
      }, usuarioId);

      return NextResponse.json({
        success: true,
        compra: compraCreditos,
        bonus: bonusCredito,
        pagamento: resultadoPagamento.dados,
        message: 'Compra processada com sucesso'
      });

    } catch (error) {
      logger.error('API:ComprarCreditos', 'Erro no processamento do pagamento', error as Error, {
        requestId,
        usuarioId,
        compraId: compraCreditos?.id
      }, usuarioId);

      // Remover créditos criados em caso de erro
      if (compraCreditos?.id) {
        await supabase
          .from('creditos')
          .delete()
          .eq('id', compraCreditos.id);
      }

      if (bonusCredito) {
        await supabase
          .from('creditos')
          .delete()
          .eq('id', bonusCredito.id);
      }

      return NextResponse.json(
        { 
          error: 'Erro ao processar pagamento',
          sugestao: 'Tente novamente em alguns instantes'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('API:ComprarCreditos', 'Erro geral na compra de créditos', error as Error, {
      requestId
    });
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        sugestao: 'Por favor, tente novamente mais tarde ou entre em contato com o suporte'
      },
      { status: 500 }
    );
  }
}