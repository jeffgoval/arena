import { useState, useEffect } from 'react';
import type { 
  Indicacao, 
  CodigoIndicacao, 
  CreditoIndicacao, 
  EstatisticasIndicacao 
} from '@/types/indicacoes.types';

export function useIndicacoes() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [codigo, setCodigo] = useState<CodigoIndicacao | null>(null);
  const [creditos, setCreditos] = useState<CreditoIndicacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasIndicacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar código de indicação do usuário
  const buscarCodigo = async () => {
    try {
      const response = await fetch('/api/indicacoes/codigo');
      const data = await response.json();

      if (response.ok) {
        setCodigo(data.codigo);
      } else {
        if (response.status === 404) {
          // Código não encontrado - isso é normal para usuários novos
          setCodigo(null);
        } else {
          setError(data.error || 'Erro ao buscar código de indicação');
        }
      }
    } catch (err) {
      setError('Erro ao buscar código de indicação');
    }
  };

  // Buscar indicações do usuário
  const buscarIndicacoes = async () => {
    try {
      const response = await fetch('/api/indicacoes');
      const data = await response.json();

      if (response.ok) {
        setIndicacoes(data.indicacoes);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar indicações');
    }
  };

  // Buscar créditos do usuário
  const buscarCreditos = async () => {
    try {
      const response = await fetch('/api/indicacoes/creditos');
      const data = await response.json();

      if (response.ok) {
        setCreditos(data.creditos);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar créditos');
    }
  };

  // Buscar estatísticas do usuário
  const buscarEstatisticas = async () => {
    try {
      const response = await fetch('/api/indicacoes/estatisticas');
      const data = await response.json();

      if (response.ok) {
        setEstatisticas(data.estatisticas);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar estatísticas');
    }
  };

  // Criar nova indicação
  const criarIndicacao = async (emailIndicado: string, nomeIndicado?: string) => {
    try {
      const response = await fetch('/api/indicacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailIndicado,
          nomeIndicado,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await buscarIndicacoes(); // Recarregar lista
        await buscarEstatisticas(); // Atualizar estatísticas
        return { success: true, indicacao: data.indicacao };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao criar indicação' };
    }
  };

  // Aplicar código de indicação
  const aplicarCodigo = async (codigoIndicacao: string) => {
    try {
      const response = await fetch('/api/indicacoes/aplicar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigoIndicacao,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao aplicar código de indicação' };
    }
  };

  // Usar créditos
  const usarCreditos = async (valorCreditos: number, reservaId: string) => {
    try {
      const response = await fetch('/api/indicacoes/creditos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valorCreditos,
          reservaId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await buscarCreditos(); // Recarregar créditos
        await buscarEstatisticas(); // Atualizar estatísticas
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao usar créditos' };
    }
  };

  // Carregar todos os dados iniciais
  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    await Promise.all([
      buscarCodigo(),
      buscarIndicacoes(),
      buscarCreditos(),
      buscarEstatisticas(),
    ]);

    setLoading(false);
  };

  // Recarregar dados
  const recarregar = () => {
    carregarDados();
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return {
    // Estados
    indicacoes,
    codigo,
    creditos,
    estatisticas,
    loading,
    error,

    // Ações
    criarIndicacao,
    aplicarCodigo,
    usarCreditos,
    recarregar,

    // Funções de busca individuais
    buscarCodigo,
    buscarIndicacoes,
    buscarCreditos,
    buscarEstatisticas,
  };
}