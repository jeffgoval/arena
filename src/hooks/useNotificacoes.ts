import { useState, useEffect, useCallback } from 'react';
import type { Notificacao, NotificacaoConfig, EstatisticasNotificacao } from '@/types/notificacoes.types';

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [config, setConfig] = useState<NotificacaoConfig>({
    habilitada: true,
    tipos: {
      reserva: true,
      pagamento: true,
      indicacao: true,
      sistema: true,
      mensalista: true,
      turma: true,
    },
    som: true,
    desktop: true,
    email: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simular notificações em tempo real
  useEffect(() => {
    const notificacoesIniciais: Notificacao[] = [
      {
        id: '1',
        tipo: 'reserva',
        titulo: 'Nova Reserva Confirmada',
        descricao: 'Sua reserva para hoje às 14:00 foi confirmada',
        data: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lida: false,
        prioridade: 'media',
        acao: {
          tipo: 'link',
          url: '/cliente/reservas',
          texto: 'Ver Reserva'
        },
        dados: {
          reservaId: 'res-123'
        }
      },
      {
        id: '2',
        tipo: 'indicacao',
        titulo: 'Indicação Aceita! 🎉',
        descricao: 'Maria Silva aceitou sua indicação e você ganhou 50 créditos!',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lida: false,
        prioridade: 'alta',
        acao: {
          tipo: 'link',
          url: '/cliente/indicacoes',
          texto: 'Ver Créditos'
        },
        dados: {
          valor: 50
        }
      },
      {
        id: '3',
        tipo: 'pagamento',
        titulo: 'Pagamento Processado',
        descricao: 'Seu pagamento de R$ 75,00 foi processado com sucesso',
        data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lida: true,
        prioridade: 'media',
        dados: {
          valor: 75.00
        }
      },
      {
        id: '4',
        tipo: 'sistema',
        titulo: 'Manutenção Programada',
        descricao: 'Sistema ficará indisponível das 02:00 às 04:00 para manutenção',
        data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lida: true,
        prioridade: 'baixa'
      },
      {
        id: '5',
        tipo: 'turma',
        titulo: 'Nova Aula Disponível',
        descricao: 'Aula de tênis de mesa avançado - Quinta 19:00',
        data: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        lida: false,
        prioridade: 'media',
        acao: {
          tipo: 'link',
          url: '/cliente/turmas',
          texto: 'Ver Turmas'
        }
      }
    ];

    setNotificacoes(notificacoesIniciais);
    setLoading(false);

    // Simular notificações em tempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance a cada 30 segundos
        const novaNotificacao: Notificacao = {
          id: Date.now().toString(),
          tipo: ['reserva', 'pagamento', 'indicacao', 'sistema'][Math.floor(Math.random() * 4)] as any,
          titulo: 'Nova Notificação',
          descricao: 'Esta é uma notificação simulada em tempo real',
          data: new Date().toISOString(),
          lida: false,
          prioridade: 'media'
        };

        setNotificacoes(prev => [novaNotificacao, ...prev]);
        
        // Tocar som se habilitado
        if (config.som) {
          playNotificationSound();
        }

        // Mostrar notificação desktop se habilitado
        if (config.desktop && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(novaNotificacao.titulo, {
            body: novaNotificacao.descricao,
            icon: '/favicon.ico'
          });
        }
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [config.som, config.desktop]);

  // Solicitar permissão para notificações desktop
  useEffect(() => {
    if (config.desktop && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [config.desktop]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignorar erro se não conseguir tocar o som
      });
    } catch (error) {
      // Ignorar erro
    }
  };

  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  }, []);

  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes(prev => 
      prev.map(n => ({ ...n, lida: true }))
    );
  }, []);

  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  }, []);

  const limparTodasLidas = useCallback(() => {
    setNotificacoes(prev => prev.filter(n => !n.lida));
  }, []);

  const atualizarConfig = useCallback((novaConfig: Partial<NotificacaoConfig>) => {
    setConfig(prev => ({ ...prev, ...novaConfig }));
  }, []);

  // Estatísticas
  const estatisticas: EstatisticasNotificacao = {
    total: notificacoes.length,
    naoLidas: notificacoes.filter(n => !n.lida).length,
    porTipo: notificacoes.reduce((acc, n) => {
      acc[n.tipo] = (acc[n.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    ultimaAtualizacao: new Date().toISOString()
  };

  return {
    notificacoes,
    config,
    estatisticas,
    loading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    limparTodasLidas,
    atualizarConfig,
  };
}