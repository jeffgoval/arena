import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Obter saldo e histórico de créditos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar histórico de créditos
    const { data: historico, error: historicoError } = await supabase
      .from('creditos')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (historicoError) {
      console.error('Erro ao buscar histórico de créditos:', historicoError);
      return NextResponse.json(
        { error: `Erro ao buscar créditos: ${historicoError.message}` },
        { status: 500 }
      );
    }

    // Calcular saldo atual
    const creditosAtivos = historico?.filter(c => 
      c.status === 'ativo' && 
      c.valor > 0 &&
      (!c.data_expiracao || new Date(c.data_expiracao) > new Date())
    ) || [];

    const creditosUsados = historico?.filter(c => c.status === 'usado') || [];
    const creditosExpirados = historico?.filter(c => c.status === 'expirado') || [];

    const saldoAtivo = creditosAtivos.reduce((sum, c) => sum + c.valor, 0);
    const totalUsado = Math.abs(creditosUsados.reduce((sum, c) => sum + c.valor, 0));
    const totalExpirado = creditosExpirados.reduce((sum, c) => sum + c.valor, 0);

    // Créditos expirando em 30 dias
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 30);
    
    const creditosExpirandoSoon = creditosAtivos.filter(c => 
      c.data_expiracao && new Date(c.data_expiracao) <= dataLimite
    );
    const valorExpirandoSoon = creditosExpirandoSoon.reduce((sum, c) => sum + c.valor, 0);

    const saldo = {
      total: saldoAtivo,
      ativo: saldoAtivo,
      expirandoEm30Dias: valorExpirandoSoon,
      usado: totalUsado,
      expirado: totalExpirado
    };

    return NextResponse.json({
      success: true,
      saldo,
      historico: historico || [],
      creditosAtivos,
      creditosExpirandoSoon,
      pagination: {
        limit,
        offset,
        total: historico?.length || 0
      }
    });

  } catch (error) {
    console.error('Erro na API de créditos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Adicionar créditos (compra, bônus, etc.)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      usuarioId,
      tipo,
      valor,
      descricao,
      dataExpiracao,
      reservaId,
      indicacaoId,
      metodoPagamento
    } = body;

    // Validações
    if (!usuarioId || !tipo || !valor || !descricao) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: usuarioId, tipo, valor, descricao' },
        { status: 400 }
      );
    }

    if (valor <= 0 && !['uso', 'expiracao'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Valor deve ser positivo para este tipo de transação' },
        { status: 400 }
      );
    }

    // Criar transação de crédito
    const { data: credito, error: creditoError } = await supabase
      .from('creditos')
      .insert({
        usuario_id: usuarioId,
        tipo,
        valor,
        descricao,
        status: 'ativo',
        data_expiracao: dataExpiracao,
        reserva_id: reservaId,
        indicacao_id: indicacaoId,
        metodo_pagamento: metodoPagamento
      })
      .select()
      .single();

    if (creditoError) {
      console.error('Erro ao criar crédito:', creditoError);
      return NextResponse.json(
        { error: 'Erro ao processar créditos' },
        { status: 500 }
      );
    }

    // Se for uma compra, criar registro de pagamento
    if (tipo === 'compra' && metodoPagamento) {
      // Aqui você integraria com o sistema de pagamentos
      // Por exemplo, criar cobrança no Asaas
    }

    return NextResponse.json({
      success: true,
      credito,
      message: 'Créditos adicionados com sucesso'
    });

  } catch (error) {
    console.error('Erro ao adicionar créditos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}