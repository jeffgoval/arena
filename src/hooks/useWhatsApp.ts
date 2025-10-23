"use client";

import { useState } from 'react';

interface EnviarMensagemParams {
  telefone: string;
  tipo: string;
  dados: any;
}

interface EnviarMassaParams {
  telefones: string[];
  mensagem: string;
  intervalo?: number;
}

export function useWhatsApp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enviar mensagem individual
  const enviarMensagem = async ({ telefone, tipo, dados }: EnviarMensagemParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/whatsapp/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefone, tipo, dados }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao enviar mensagem');
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

  // Enviar mensagem em massa
  const enviarMassa = async ({ telefones, mensagem, intervalo = 1000 }: EnviarMassaParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/whatsapp/massa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefones, mensagem, intervalo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro no envio em massa');
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

  // Funções específicas para diferentes tipos de notificação
  const notificarReservaConfirmada = async (telefone: string, dadosReserva: {
    id: string;
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'reserva_confirmada',
      dados: dadosReserva
    });
  };

  const notificarPagamentoRecebido = async (telefone: string, dadosPagamento: {
    id: string;
    valor: number;
    metodo: string;
    referencia?: string;
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'pagamento_recebido',
      dados: dadosPagamento
    });
  };

  const enviarLembreteJogo = async (telefone: string, dadosJogo: {
    quadra: string;
    data: string;
    horario: string;
    participantes: string[];
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'lembrete_jogo',
      dados: dadosJogo
    });
  };

  const notificarCancelamento = async (telefone: string, dadosCancelamento: {
    tipo: 'reserva' | 'jogo';
    id: string;
    motivo?: string;
    reembolso?: number;
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'cancelamento',
      dados: dadosCancelamento
    });
  };

  const enviarPromocao = async (telefone: string, dadosPromocao: {
    titulo: string;
    descricao: string;
    desconto: number;
    validadeAte: string;
    codigoCupom?: string;
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'promocao',
      dados: dadosPromocao
    });
  };

  const enviarQRCodePix = async (telefone: string, dadosPix: {
    valor: number;
    qrCode: string;
    pixCopiaECola: string;
    vencimento: string;
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'qr_code_pix',
      dados: dadosPix
    });
  };

  const enviarComprovante = async (telefone: string, dadosComprovante: {
    comprovanteUrl: string;
    id: string;
    valor: number;
    data: string;
    metodo: string;
  }) => {
    return await enviarMensagem({
      telefone,
      tipo: 'comprovante',
      dados: dadosComprovante
    });
  };

  const enviarMensagemTexto = async (telefone: string, mensagem: string) => {
    return await enviarMensagem({
      telefone,
      tipo: 'texto',
      dados: { mensagem }
    });
  };

  const enviarMenu = async (telefone: string) => {
    return await enviarMensagem({
      telefone,
      tipo: 'menu',
      dados: {}
    });
  };

  return {
    loading,
    error,
    enviarMensagem,
    enviarMassa,
    notificarReservaConfirmada,
    notificarPagamentoRecebido,
    enviarLembreteJogo,
    notificarCancelamento,
    enviarPromocao,
    enviarQRCodePix,
    enviarComprovante,
    enviarMensagemTexto,
    enviarMenu,
  };
}

// Hook específico para notificações de reserva
export function useNotificacoesReserva() {
  const { notificarReservaConfirmada, enviarLembreteJogo, notificarCancelamento, loading, error } = useWhatsApp();

  const notificarReserva = async (telefone: string, status: 'confirmada' | 'lembrete' | 'cancelada', dados: any) => {
    switch (status) {
      case 'confirmada':
        return await notificarReservaConfirmada(telefone, dados);
      case 'lembrete':
        return await enviarLembreteJogo(telefone, dados);
      case 'cancelada':
        return await notificarCancelamento(telefone, { tipo: 'reserva', ...dados });
      default:
        throw new Error('Status de reserva inválido');
    }
  };

  return {
    notificarReserva,
    loading,
    error,
  };
}

// Hook específico para notificações de pagamento
export function useNotificacoesPagamento() {
  const { notificarPagamentoRecebido, enviarQRCodePix, enviarComprovante, loading, error } = useWhatsApp();

  const notificarPagamento = async (telefone: string, tipo: 'recebido' | 'pix' | 'comprovante', dados: any) => {
    switch (tipo) {
      case 'recebido':
        return await notificarPagamentoRecebido(telefone, dados);
      case 'pix':
        return await enviarQRCodePix(telefone, dados);
      case 'comprovante':
        return await enviarComprovante(telefone, dados);
      default:
        throw new Error('Tipo de notificação de pagamento inválido');
    }
  };

  return {
    notificarPagamento,
    loading,
    error,
  };
}

// Hook para campanhas de marketing
export function useMarketingWhatsApp() {
  const { enviarPromocao, enviarMassa, loading, error } = useWhatsApp();

  const enviarCampanha = async (telefones: string[], dadosCampanha: {
    titulo: string;
    descricao: string;
    desconto?: number;
    validadeAte?: string;
    codigoCupom?: string;
    mensagemPersonalizada?: string;
  }) => {
    if (dadosCampanha.mensagemPersonalizada) {
      // Enviar mensagem personalizada
      return await enviarMassa({
        telefones,
        mensagem: dadosCampanha.mensagemPersonalizada,
        intervalo: 2000 // 2 segundos entre envios
      });
    } else if (dadosCampanha.desconto) {
      // Enviar promoção estruturada
      const resultados = [];
      for (const telefone of telefones) {
        const resultado = await enviarPromocao(telefone, {
          titulo: dadosCampanha.titulo,
          descricao: dadosCampanha.descricao,
          desconto: dadosCampanha.desconto,
          validadeAte: dadosCampanha.validadeAte || '',
          codigoCupom: dadosCampanha.codigoCupom
        });
        resultados.push({ telefone, resultado });
        
        // Aguardar 2 segundos entre envios
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return resultados;
    }
  };

  return {
    enviarCampanha,
    loading,
    error,
  };
}