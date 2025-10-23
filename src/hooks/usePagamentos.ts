"use client";

import { useState } from 'react';
import { 
  DadosPagamento, 
  DadosPreAutorizacao, 
  StatusPagamento, 
  TipoPagamento 
} from '@/types/pagamento.types';

export function usePagamentos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar pagamento
  const criarPagamento = async (dados: DadosPagamento): Promise<StatusPagamento | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pagamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar pagamento');
      }

      const resultado = await response.json();
      return resultado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Consultar pagamento
  const consultarPagamento = async (pagamentoId: string): Promise<StatusPagamento | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pagamentos?id=${pagamentoId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao consultar pagamento');
      }

      const resultado = await response.json();
      return resultado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar pagamento
  const cancelarPagamento = async (pagamentoId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pagamentos/${pagamentoId}/cancelar`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao cancelar pagamento');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Estornar pagamento
  const estornarPagamento = async (
    pagamentoId: string, 
    valor?: number, 
    descricao?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pagamentos/${pagamentoId}/estornar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor, descricao }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao estornar pagamento');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Criar pré-autorização
  const criarPreAutorizacao = async (dados: DadosPreAutorizacao) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pagamentos/pre-autorizacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar pré-autorização');
      }

      const resultado = await response.json();
      return resultado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Capturar pré-autorização
  const capturarPreAutorizacao = async (preAuthId: string, valor?: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pagamentos/pre-autorizacao/${preAuthId}/capturar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao capturar pré-autorização');
      }

      const resultado = await response.json();
      return resultado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar pré-autorização
  const cancelarPreAutorizacao = async (preAuthId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pagamentos/pre-autorizacao/${preAuthId}/cancelar`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao cancelar pré-autorização');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    criarPagamento,
    consultarPagamento,
    cancelarPagamento,
    estornarPagamento,
    criarPreAutorizacao,
    capturarPreAutorizacao,
    cancelarPreAutorizacao,
  };
}

// Hook específico para pagamentos PIX
export function usePagamentoPix() {
  const { criarPagamento, loading, error } = usePagamentos();

  const criarPagamentoPix = async (
    clienteId: string,
    valor: number,
    descricao: string,
    dataVencimento?: string
  ) => {
    const dados: DadosPagamento = {
      clienteId,
      tipoPagamento: TipoPagamento.PIX,
      valor,
      descricao,
      dataVencimento: dataVencimento || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24h
    };

    return await criarPagamento(dados);
  };

  return {
    criarPagamentoPix,
    loading,
    error,
  };
}

// Hook específico para pagamentos com cartão
export function usePagamentoCartao() {
  const { criarPagamento, loading, error } = usePagamentos();

  const criarPagamentoCartao = async (
    clienteId: string,
    valor: number,
    descricao: string,
    dadosCartao: DadosPagamento['dadosCartao'],
    dadosPortadorCartao: DadosPagamento['dadosPortadorCartao'],
    parcelas = 1
  ) => {
    const dados: DadosPagamento = {
      clienteId,
      tipoPagamento: TipoPagamento.CARTAO_CREDITO,
      valor,
      descricao,
      dataVencimento: new Date().toISOString().split('T')[0],
      parcelas,
      valorParcela: parcelas > 1 ? valor / parcelas : undefined,
      dadosCartao,
      dadosPortadorCartao,
    };

    return await criarPagamento(dados);
  };

  return {
    criarPagamentoCartao,
    loading,
    error,
  };
}

// Hook para caução (pré-autorização)
export function useCaucao() {
  const { criarPreAutorizacao, capturarPreAutorizacao, cancelarPreAutorizacao, loading, error } = usePagamentos();

  const criarCaucao = async (
    clienteId: string,
    valor: number,
    descricao: string,
    dadosCartao: DadosPreAutorizacao['dadosCartao'],
    dadosPortadorCartao: DadosPreAutorizacao['dadosPortadorCartao']
  ) => {
    const dados: DadosPreAutorizacao = {
      clienteId,
      valor,
      descricao,
      dadosCartao,
      dadosPortadorCartao,
    };

    return await criarPreAutorizacao(dados);
  };

  const capturarCaucao = async (preAuthId: string, valor?: number) => {
    return await capturarPreAutorizacao(preAuthId, valor);
  };

  const cancelarCaucao = async (preAuthId: string) => {
    return await cancelarPreAutorizacao(preAuthId);
  };

  return {
    criarCaucao,
    capturarCaucao,
    cancelarCaucao,
    loading,
    error,
  };
}