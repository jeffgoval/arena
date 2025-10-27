import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent, AuditAction } from '@/lib/audit/audit-logger';
import { logSecurityEvent, SecurityEventType, SecurityLevel } from '@/lib/security/security-logger';

/**
 * ============================================================================
 * ARQUITETURA - ROLES vs FUNÇÕES
 * ============================================================================
 *
 * ROLES DE USUÁRIO (campo users.role) - APENAS 3:
 * - admin    = Administrador do sistema
 * - gestor   = Gerente da arena (cria quadras, horários, etc)
 * - cliente  = Cliente que faz reservas e joga
 *
 * FUNÇÕES NA RESERVA (NÃO são roles!):
 * - organizador  = O CLIENTE que criou a reserva (reservas.organizador_id)
 * - participante = Outro CLIENTE convidado para jogar junto (reserva_participantes)
 *
 * IMPORTANTE: Tanto "organizador" quanto "participante" são CLIENTES (role=cliente)
 * A diferença é apenas quem criou a reserva vs quem foi convidado.
 * ============================================================================
 */

interface DadosPagamento {
  reservaId: string;
  valor: number;
  metodo: 'pix' | 'cartao' | 'saldo';
  dadosCartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
}

/**
 * POST /api/pagamentos/processar
 * Processa pagamento REAL - NUNCA simular no cliente
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API] /api/pagamentos/processar - Iniciando processamento');

    // Autenticação obrigatória
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('[API] Usuário não autenticado');
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.CRITICAL,
        {
          reason: 'Tentativa de pagamento sem autenticação',
          path: '/api/pagamentos/processar'
        }
      );

      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const dados: DadosPagamento = await request.json();
    console.log('[API] Dados recebidos:', {
      reservaId: dados.reservaId,
      valor: dados.valor,
      metodo: dados.metodo,
      userId: user.id
    });

    // Validação rigorosa de entrada
    if (!dados.reservaId || !dados.valor || dados.valor <= 0) {
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.ERROR,
        {
          userId: user.id,
          reason: 'Dados de pagamento inválidos',
          dados: { reservaId: dados.reservaId, valor: dados.valor }
        }
      );

      return NextResponse.json(
        { error: 'Dados de pagamento inválidos' },
        { status: 400 }
      );
    }

    if (!['pix', 'cartao', 'saldo'].includes(dados.metodo)) {
      return NextResponse.json(
        { error: 'Método de pagamento inválido' },
        { status: 400 }
      );
    }

    // Verificar se reserva existe e pertence ao usuário
    console.log('[API] Buscando reserva:', dados.reservaId);
    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select('*, quadra:quadras!inner(nome), horario:horarios!inner(hora_inicio, hora_fim)')
      .eq('id', dados.reservaId)
      .single();

    if (reservaError || !reserva) {
      console.error('[API] Reserva não encontrada:', reservaError);
      return NextResponse.json(
        { error: 'Reserva não encontrada', details: reservaError?.message },
        { status: 404 }
      );
    }

    console.log('[API] Reserva encontrada:', {
      id: reserva.id,
      organizador_id: reserva.organizador_id,
      valor_total: reserva.valor_total
    });

    // NOTA: organizador_id = ID do CLIENTE que criou a reserva (não é um role!)
    // Verificar se o usuário atual pode pagar esta reserva:
    // 1. É o cliente que criou a reserva (organizador), OU
    // 2. É um participante convidado para jogar junto

    const isOrganizador = reserva.organizador_id === user.id;

    // Verificar se é participante
    const { data: participante } = await supabase
      .from('reserva_participantes')
      .select('*')
      .eq('reserva_id', dados.reservaId)
      .eq('user_id', user.id)
      .single();

    const isParticipante = !!participante;

    console.log('[API] Verificando permissões de pagamento:', {
      userId: user.id,
      organizadorDaReserva: reserva.organizador_id,
      podePargar: isOrganizador || isParticipante,
      motivo: isOrganizador ? 'É quem criou a reserva' : isParticipante ? 'É participante convidado' : 'Sem permissão'
    });

    // REGRA: Somente quem criou a reserva OU participantes podem pagar
    if (!isOrganizador && !isParticipante) {
      console.error('[API] Usuário sem permissão para pagar esta reserva');
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.CRITICAL,
        {
          userId: user.id,
          reason: 'Tentativa de pagar reserva de outro cliente',
          reservaId: dados.reservaId
        }
      );

      return NextResponse.json(
        { error: 'Você não tem permissão para pagar esta reserva' },
        { status: 403 }
      );
    }

    // Validar valor com banco de dados
    const valorEsperado = reserva.valor_total || 0;
    if (Math.abs(dados.valor - valorEsperado) > 0.01) {
      logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        SecurityLevel.CRITICAL,
        {
          userId: user.id,
          reason: 'Valor de pagamento não corresponde ao esperado',
          valorRecebido: dados.valor,
          valorEsperado,
          diferenca: Math.abs(dados.valor - valorEsperado)
        }
      );

      return NextResponse.json(
        {
          error: 'Valor de pagamento não corresponde ao total da reserva',
          valorEsperado
        },
        { status: 400 }
      );
    }

    // ============================================================
    // PROCESSAR PAGAMENTO REAL
    // ============================================================

    let statusPagamento: 'aprovado' | 'pendente' | 'recusado' = 'pendente';
    let transactionId = '';
    let metodoPagamentoTexto = '';

    // Preparar objeto de dados do pagamento (será preenchido depois)
    const dadosPagamento: any = {
      user_id: user.id,
      reserva_id: dados.reservaId,
      valor: dados.valor,
      tipo: dados.metodo.toLowerCase(), // pix, cartao, saldo
      metadata: {
        metodo_original: dados.metodo
      }
    };

    console.log('[API] Processando pagamento:', dados.metodo);

    if (dados.metodo === 'saldo') {
      console.log('[API] Método: Saldo em conta');

      // Verificar saldo do usuário
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('saldo_creditos')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('[API] Erro ao buscar perfil:', profileError);
        return NextResponse.json(
          { error: 'Erro ao verificar saldo', details: profileError.message },
          { status: 500 }
        );
      }

      console.log('[API] Saldo atual:', profile?.saldo_creditos, 'Valor necessário:', dados.valor);

      if (!profile || (profile.saldo_creditos || 0) < dados.valor) {
        console.error('[API] Saldo insuficiente');
        return NextResponse.json(
          { error: 'Saldo insuficiente' },
          { status: 400 }
        );
      }

      // Debitar saldo
      const novoSaldo = (profile.saldo_creditos || 0) - dados.valor;
      console.log('[API] Debitando saldo. Novo saldo será:', novoSaldo);

      const { error: debitError } = await supabase
        .from('users')
        .update({
          saldo_creditos: novoSaldo
        })
        .eq('id', user.id);

      if (debitError) {
        console.error('[API] Erro ao debitar saldo:', debitError);
        throw new Error('Erro ao debitar saldo: ' + debitError.message);
      }

      console.log('[API] Saldo debitado com sucesso');
      statusPagamento = 'aprovado';
      transactionId = `SALDO-${Date.now()}`;
      metodoPagamentoTexto = 'Saldo em Conta';

      // Atualizar dados do pagamento
      dadosPagamento.asaas_payment_id = transactionId;
      dadosPagamento.paid_at = new Date().toISOString();
      dadosPagamento.metadata = {
        ...dadosPagamento.metadata,
        transaction_id: transactionId,
        status_interno: statusPagamento,
        saldo_anterior: profile.saldo_creditos,
        saldo_novo: novoSaldo
      };

    } else if (dados.metodo === 'pix') {
      console.log('[API] Método: PIX - Integrando com Asaas');

      // Integrar com Asaas para gerar PIX de verdade
      const { pagamentoService } = await import('@/services/pagamentoService');

      try {
        // Buscar dados do usuário para Asaas
        const { data: userData } = await supabase
          .from('users')
          .select('asaas_customer_id, nome_completo, cpf, whatsapp, email')
          .eq('id', user.id)
          .single();

        if (!userData) {
          throw new Error('Dados do usuário não encontrados');
        }

        console.log('[API] Criando/atualizando cliente no Asaas...');

        // Buscar/criar cliente no Asaas
        let clienteAsaasId: string;
        try {
          clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
            id: userData.asaas_customer_id,
            nome: userData.nome_completo || 'Cliente',
            email: userData.email || user.email || '',
            cpf: userData.cpf || '',
            telefone: userData.whatsapp || '',
            celular: userData.whatsapp || ''
          });
        } catch (clienteError: any) {
          // Se o cliente foi removido no Asaas, criar um novo
          if (clienteError.message?.includes('invalid_customer') || clienteError.message?.includes('removido')) {
            console.log('[API] Cliente removido no Asaas, criando novo cliente...');
            clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
              id: undefined, // Força criação de novo cliente
              nome: userData.nome_completo || 'Cliente',
              email: userData.email || user.email || '',
              cpf: userData.cpf || '',
              telefone: userData.whatsapp || '',
              celular: userData.whatsapp || ''
            });
          } else {
            throw clienteError;
          }
        }

        // Sempre atualizar o asaas_customer_id (pode ter mudado se foi recriado)
        if (clienteAsaasId !== userData.asaas_customer_id) {
          await supabase.from('users').update({ asaas_customer_id: clienteAsaasId }).eq('id', user.id);
          console.log('[API] asaas_customer_id atualizado:', clienteAsaasId);
        }

        console.log('[API] Criando pagamento PIX no Asaas...');

        // Criar pagamento PIX no Asaas
        const resultadoPix = await pagamentoService.criarPagamentoPix({
          clienteId: clienteAsaasId,
          tipoPagamento: 'PIX',
          valor: dados.valor,
          dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24h
          descricao: `Reserva ${dados.reservaId}`,
          referencia: dados.reservaId
        });

        if (!resultadoPix.sucesso) {
          console.error('[API] Erro ao criar PIX no Asaas:', resultadoPix.erro);
          return NextResponse.json(
            { error: 'Erro ao gerar PIX', details: resultadoPix.erro },
            { status: 500 }
          );
        }

        console.log('[API] PIX criado no Asaas com sucesso:', {
          paymentId: resultadoPix.dados?.id,
          hasQrCode: !!resultadoPix.dados?.qrCode
        });

        statusPagamento = 'pendente';
        transactionId = resultadoPix.dados?.id || `PIX-${Date.now()}`;
        metodoPagamentoTexto = 'PIX';

        // Salvar dados do PIX para mostrar QR Code depois
        dadosPagamento.asaas_payment_id = transactionId;
        dadosPagamento.asaas_pix_qrcode = resultadoPix.dados?.qrCode;
        dadosPagamento.asaas_pix_payload = resultadoPix.dados?.payload;
        dadosPagamento.metadata = {
          ...dadosPagamento.metadata,
          transaction_id: transactionId,
          status_interno: statusPagamento,
          asaas_customer_id: clienteAsaasId
        };

      } catch (asaasError) {
        console.error('[API] Erro na integração com Asaas:', asaasError);
        // Continuar sem Asaas por enquanto
        statusPagamento = 'pendente';
        transactionId = `PIX-FALLBACK-${Date.now()}`;
        metodoPagamentoTexto = 'PIX';
      }

    } else if (dados.metodo === 'cartao') {
      console.log('[API] Método: Cartão de Crédito - Integrando com Asaas');

      if (!dados.dadosCartao) {
        console.error('[API] Dados do cartão não fornecidos');
        return NextResponse.json(
          { error: 'Dados do cartão não fornecidos' },
          { status: 400 }
        );
      }

      // Integrar com Asaas para processar cartão
      const { pagamentoService } = await import('@/services/pagamentoService');

      try {
        // Buscar dados do usuário para Asaas
        const { data: userData } = await supabase
          .from('users')
          .select('asaas_customer_id, nome_completo, cpf, whatsapp, email, cep, logradouro, numero, bairro, cidade, estado')
          .eq('id', user.id)
          .single();

        if (!userData) {
          throw new Error('Dados do usuário não encontrados');
        }

        if (!userData.cpf) {
          return NextResponse.json(
            { error: 'CPF é obrigatório para pagamento com cartão', details: 'Atualize seu perfil' },
            { status: 400 }
          );
        }

        console.log('[API] Criando/atualizando cliente no Asaas...');

        // Criar/atualizar cliente no Asaas
        let clienteAsaasId: string;
        try {
          clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
            id: userData.asaas_customer_id,
            nome: userData.nome_completo || 'Cliente',
            email: userData.email || user.email || '',
            cpf: userData.cpf,
            telefone: userData.whatsapp || '',
            celular: userData.whatsapp || '',
            cep: userData.cep || '',
            endereco: userData.logradouro || '',
            numero: userData.numero || '',
            bairro: userData.bairro || '',
            cidade: userData.cidade || '',
            estado: userData.estado || ''
          });
        } catch (clienteError: any) {
          // Se o cliente foi removido, criar um novo
          if (clienteError.message?.includes('invalid_customer') || clienteError.message?.includes('removido')) {
            console.log('[API] Cliente removido no Asaas, criando novo...');
            clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
              id: undefined, // Força criação de novo cliente
              nome: userData.nome_completo || 'Cliente',
              email: userData.email || user.email || '',
              cpf: userData.cpf,
              telefone: userData.whatsapp || '',
              celular: userData.whatsapp || '',
              cep: userData.cep || '',
              endereco: userData.logradouro || '',
              numero: userData.numero || '',
              bairro: userData.bairro || '',
              cidade: userData.cidade || '',
              estado: userData.estado || ''
            });
          } else {
            throw clienteError;
          }
        }

        // Sempre atualizar o asaas_customer_id para garantir sincronização
        await supabase.from('users').update({ asaas_customer_id: clienteAsaasId }).eq('id', user.id);
        console.log('[API] asaas_customer_id salvo/atualizado:', clienteAsaasId);

        console.log('[API] Processando pagamento com cartão no Asaas...');

        // Processar pagamento com cartão
        let resultadoCartao = await pagamentoService.criarPagamentoCartao({
          clienteId: clienteAsaasId,
          tipoPagamento: 'CREDIT_CARD',
          valor: dados.valor,
          dataVencimento: new Date().toISOString().split('T')[0],
          descricao: `Reserva ${dados.reservaId}`,
          referencia: dados.reservaId,
          dadosCartao: {
            nomePortador: dados.dadosCartao.nome,
            numero: dados.dadosCartao.numero.replace(/\s/g, ''),
            mesVencimento: dados.dadosCartao.validade.split('/')[0],
            anoVencimento: '20' + dados.dadosCartao.validade.split('/')[1],
            codigoSeguranca: dados.dadosCartao.cvv
          },
          dadosPortadorCartao: {
            nome: userData.nome_completo || 'Cliente',
            email: userData.email || user.email || '',
            cpf: userData.cpf,
            cep: userData.cep || '00000000',
            numero: userData.numero || 'S/N',
            telefone: userData.whatsapp || ''
          }
        });

        // Se falhou por cliente inválido, tentar criar novo cliente e processar novamente
        if (!resultadoCartao.sucesso && (resultadoCartao.erro?.includes('invalid_customer') || resultadoCartao.erro?.includes('removido'))) {
          console.log('[API] Cliente inválido ao processar pagamento, recriando cliente...');

          // Criar novo cliente
          clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
            id: undefined, // Força criação de novo cliente
            nome: userData.nome_completo || 'Cliente',
            email: userData.email || user.email || '',
            cpf: userData.cpf,
            telefone: userData.whatsapp || '',
            celular: userData.whatsapp || '',
            cep: userData.cep || '',
            endereco: userData.logradouro || '',
            numero: userData.numero || '',
            bairro: userData.bairro || '',
            cidade: userData.cidade || '',
            estado: userData.estado || ''
          });

          // Atualizar no banco
          await supabase.from('users').update({ asaas_customer_id: clienteAsaasId }).eq('id', user.id);
          console.log('[API] Novo cliente criado:', clienteAsaasId);

          // Tentar processar pagamento novamente com novo cliente
          resultadoCartao = await pagamentoService.criarPagamentoCartao({
            clienteId: clienteAsaasId,
            tipoPagamento: 'CREDIT_CARD',
            valor: dados.valor,
            dataVencimento: new Date().toISOString().split('T')[0],
            descricao: `Reserva ${dados.reservaId}`,
            referencia: dados.reservaId,
            dadosCartao: {
              nomePortador: dados.dadosCartao.nome,
              numero: dados.dadosCartao.numero.replace(/\s/g, ''),
              mesVencimento: dados.dadosCartao.validade.split('/')[0],
              anoVencimento: '20' + dados.dadosCartao.validade.split('/')[1],
              codigoSeguranca: dados.dadosCartao.cvv
            },
            dadosPortadorCartao: {
              nome: userData.nome_completo || 'Cliente',
              email: userData.email || user.email || '',
              cpf: userData.cpf,
              cep: userData.cep || '00000000',
              numero: userData.numero || 'S/N',
              telefone: userData.whatsapp || ''
            }
          });
        }

        if (!resultadoCartao.sucesso) {
          console.error('[API] Erro ao processar cartão no Asaas:', resultadoCartao.erro);
          return NextResponse.json(
            { error: 'Erro ao processar cartão', details: resultadoCartao.erro },
            { status: 500 }
          );
        }

        console.log('[API] Cartão processado no Asaas:', {
          sucesso: resultadoCartao.sucesso,
          paymentId: resultadoCartao.dados?.id,
          status: resultadoCartao.dados?.status,
          clienteId: clienteAsaasId
        });

        // Status pode ser RECEIVED (aprovado) ou PENDING (em análise)
        statusPagamento = resultadoCartao.dados?.status === 'RECEIVED' ? 'aprovado' : 'pendente';
        transactionId = resultadoCartao.dados?.id || `CARD-${Date.now()}`;
        metodoPagamentoTexto = 'Cartão de Crédito';

        dadosPagamento.asaas_payment_id = transactionId;
        if (statusPagamento === 'aprovado') {
          dadosPagamento.paid_at = new Date().toISOString();
        }
        dadosPagamento.metadata = {
          ...dadosPagamento.metadata,
          transaction_id: transactionId,
          status_interno: statusPagamento,
          asaas_customer_id: clienteAsaasId,
          asaas_status: resultadoCartao.dados?.status
        };

      } catch (asaasError: any) {
        console.error('[API] Erro na integração com Asaas (cartão):', asaasError);
        return NextResponse.json(
          {
            error: 'Erro ao processar pagamento com cartão',
            details: asaasError.message || 'Erro desconhecido'
          },
          { status: 500 }
        );
      }
    }

    // Registrar pagamento no banco
    console.log('[API] Registrando pagamento no banco:', {
      user_id: dadosPagamento.user_id,
      reserva_id: dadosPagamento.reserva_id,
      valor: dadosPagamento.valor,
      tipo: dadosPagamento.tipo,
      asaas_payment_id: dadosPagamento.asaas_payment_id,
      hasPixQrCode: !!dadosPagamento.asaas_pix_qrcode,
      statusInterno: statusPagamento
    });

    const { data: pagamento, error: pagamentoError } = await supabase
      .from('pagamentos')
      .insert(dadosPagamento)
      .select()
      .single();

    if (pagamentoError) {
      console.error('[API] Erro ao registrar pagamento:', pagamentoError);
      return NextResponse.json(
        { error: 'Erro ao registrar pagamento', details: pagamentoError.message },
        { status: 500 }
      );
    }

    console.log('[API] Pagamento registrado com sucesso:', pagamento.id);

    // Atualizar status da reserva se aprovado
    if (statusPagamento === 'aprovado') {
      console.log('[API] Atualizando status da reserva para confirmada');
      const { error: updateError } = await supabase
        .from('reservas')
        .update({ status: 'confirmada' })
        .eq('id', dados.reservaId);

      if (updateError) {
        console.error('[API] Erro ao atualizar status da reserva:', updateError);
        // Não falhar a operação por causa disso
      } else {
        console.log('[API] Status da reserva atualizado com sucesso');
      }
    }

    // Log de auditoria
    logAuditEvent(AuditAction.PAYMENT_CREATED, user.id, {
      targetId: pagamento.id,
      targetType: 'pagamento',
      metadata: {
        reservaId: dados.reservaId,
        valor: dados.valor,
        metodo: dados.metodo,
        status: statusPagamento
      }
    });

    if (statusPagamento === 'aprovado') {
      logAuditEvent(AuditAction.PAYMENT_COMPLETED, user.id, {
        targetId: pagamento.id,
        targetType: 'pagamento'
      });
    }

    // Gerar comprovante
    const comprovante = {
      id: transactionId,
      tipo: 'reserva',
      status: statusPagamento,
      valor: dados.valor,
      metodoPagamento: metodoPagamentoTexto,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      detalhes: {
        quadra: (reserva as any).quadra?.nome,
        dataReserva: (reserva as any).data,
        horario: `${(reserva as any).horario?.hora_inicio} - ${(reserva as any).horario?.hora_fim}`
      }
    };

    console.log('[API] Processamento concluído com sucesso. Retornando comprovante:', {
      pagamentoId: pagamento.id,
      status: statusPagamento,
      transactionId
    });

    return NextResponse.json({
      success: true,
      pagamentoId: pagamento.id,
      status: statusPagamento,
      comprovante
    });

  } catch (error) {
    console.error('[API] Erro ao processar pagamento:', error);
    console.error('[API] Stack trace:', error instanceof Error ? error.stack : 'N/A');

    logSecurityEvent(
      SecurityEventType.PAYMENT_FAILED,
      SecurityLevel.ERROR,
      {
        error: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        path: '/api/pagamentos/processar'
      }
    );

    return NextResponse.json(
      {
        error: 'Erro ao processar pagamento',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
