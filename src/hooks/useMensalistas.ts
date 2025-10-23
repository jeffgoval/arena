import { useState, useEffect } from 'react';
import type { 
  PlanoMensalista,
  AssinaturaMensalista,
  ReservaRecorrente,
  CobrancaMensalista,
  EstatisticasMensalista,
  ConfiguracaoRecorrencia
} from '@/types/mensalistas.types';

export function useMensalistas() {
  const [planos, setPlanos] = useState<PlanoMensalista[]>([]);
  const [assinatura, setAssinatura] = useState<AssinaturaMensalista | null>(null);
  const [reservasRecorrentes, setReservasRecorrentes] = useState<ReservaRecorrente[]>([]);
  const [cobrancas, setCobrancas] = useState<CobrancaMensalista[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasMensalista | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar planos disponíveis
  const buscarPlanos = async () => {
    try {
      const response = await fetch('/api/mensalistas/planos');
      const data = await response.json();

      if (response.ok) {
        setPlanos(data.planos);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar planos');
    }
  };

  // Buscar assinatura do usuário
  const buscarAssinatura = async () => {
    try {
      const response = await fetch('/api/mensalistas/assinatura');
      const data = await response.json();

      if (response.ok) {
        setAssinatura(data.assinatura);
      } else if (response.status !== 404) {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar assinatura');
    }
  };

  // Buscar reservas recorrentes
  const buscarReservasRecorrentes = async () => {
    try {
      const response = await fetch('/api/mensalistas/reservas-recorrentes');
      const data = await response.json();

      if (response.ok) {
        setReservasRecorrentes(data.reservas);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar reservas recorrentes');
    }
  };

  // Buscar cobranças
  const buscarCobrancas = async () => {
    try {
      const response = await fetch('/api/mensalistas/cobrancas');
      const data = await response.json();

      if (response.ok) {
        setCobrancas(data.cobrancas);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar cobranças');
    }
  };

  // Buscar estatísticas
  const buscarEstatisticas = async () => {
    try {
      const response = await fetch('/api/mensalistas/estatisticas');
      const data = await response.json();

      if (response.ok) {
        setEstatisticas(data.estatisticas);
      } else if (response.status !== 404) {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar estatísticas');
    }
  };

  // Criar assinatura
  const criarAssinatura = async (planoId: string, diaVencimento: number) => {
    try {
      const response = await fetch('/api/mensalistas/assinatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planoId,
          diaVencimento,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await buscarAssinatura();
        await buscarEstatisticas();
        return { success: true, assinatura: data.assinatura };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao criar assinatura' };
    }
  };

  // Pausar assinatura
  const pausarAssinatura = async () => {
    if (!assinatura) return { success: false, error: 'Nenhuma assinatura encontrada' };

    try {
      const response = await fetch(`/api/mensalistas/assinatura/${assinatura.id}/pausar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await buscarAssinatura();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao pausar assinatura' };
    }
  };

  // Cancelar assinatura
  const cancelarAssinatura = async () => {
    if (!assinatura) return { success: false, error: 'Nenhuma assinatura encontrada' };

    try {
      const response = await fetch(`/api/mensalistas/assinatura/${assinatura.id}/cancelar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await buscarAssinatura();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao cancelar assinatura' };
    }
  };

  // Criar reserva recorrente
  const criarReservaRecorrente = async (
    quadraId: string,
    configuracao: ConfiguracaoRecorrencia & {
      titulo: string;
      descricao?: string;
      valor_por_reserva: number;
      desconto_percentual?: number;
    }
  ) => {
    try {
      const response = await fetch('/api/mensalistas/reservas-recorrentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quadraId,
          ...configuracao,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await buscarReservasRecorrentes();
        return { success: true, reserva: data.reserva };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao criar reserva recorrente' };
    }
  };

  // Pausar reserva recorrente
  const pausarReservaRecorrente = async (reservaId: string) => {
    try {
      const response = await fetch(`/api/mensalistas/reservas-recorrentes/${reservaId}/pausar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await buscarReservasRecorrentes();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao pausar reserva recorrente' };
    }
  };

  // Cancelar reserva recorrente
  const cancelarReservaRecorrente = async (reservaId: string) => {
    try {
      const response = await fetch(`/api/mensalistas/reservas-recorrentes/${reservaId}/cancelar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await buscarReservasRecorrentes();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao cancelar reserva recorrente' };
    }
  };

  // Processar pagamento
  const processarPagamento = async (cobrancaId: string, metodoPagamento: string) => {
    try {
      const response = await fetch(`/api/mensalistas/cobrancas/${cobrancaId}/pagar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metodoPagamento,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await buscarCobrancas();
        await buscarEstatisticas();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao processar pagamento' };
    }
  };

  // Carregar todos os dados
  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    await Promise.all([
      buscarPlanos(),
      buscarAssinatura(),
      buscarReservasRecorrentes(),
      buscarCobrancas(),
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
    planos,
    assinatura,
    reservasRecorrentes,
    cobrancas,
    estatisticas,
    loading,
    error,

    // Ações de assinatura
    criarAssinatura,
    pausarAssinatura,
    cancelarAssinatura,

    // Ações de reservas recorrentes
    criarReservaRecorrente,
    pausarReservaRecorrente,
    cancelarReservaRecorrente,

    // Ações de cobrança
    processarPagamento,

    // Utilitários
    recarregar,
    buscarPlanos,
    buscarAssinatura,
    buscarReservasRecorrentes,
    buscarCobrancas,
    buscarEstatisticas,
  };
}