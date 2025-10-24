import { createClient } from '@/lib/supabase/client';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface NotificacaoStats {
  totalEnviadas: number;
  pendentes: number;
  taxaEntrega: number;
  templatesAtivos: number;
}

export interface NotificacaoTipo {
  tipo: string;
  total: number;
  enviadas: number;
  pendentes: number;
  taxaEntrega: number;
}

export interface NotificacaoCanal {
  canal: string;
  total: number;
  enviadas: number;
  falhas: number;
  taxaEntrega: number;
}

/**
 * Serviço para gerenciar notificações
 */
export const notificacoesService = {
  /**
   * Busca estatísticas gerais de notificações
   */
  async getStats(): Promise<NotificacaoStats> {
    const supabase = createClient();

    // Buscar todas as notificações
    const { data: notificacoes, error: notifError } = await supabase
      .from('notificacoes')
      .select('status');

    if (notifError) throw notifError;

    // Buscar templates ativos
    const { data: templates, error: templatesError } = await supabase
      .from('templates_notificacao')
      .select('id, ativo')
      .eq('ativo', true);

    if (templatesError) throw templatesError;

    const totalEnviadas = notificacoes?.filter(n =>
      n.status === 'enviada' || n.status === 'lida'
    ).length || 0;

    const pendentes = notificacoes?.filter(n =>
      n.status === 'pendente'
    ).length || 0;

    const totalNotificacoes = notificacoes?.length || 0;
    const taxaEntrega = totalNotificacoes > 0
      ? (totalEnviadas / totalNotificacoes) * 100
      : 0;

    return {
      totalEnviadas,
      pendentes,
      taxaEntrega: Math.round(taxaEntrega * 10) / 10, // 1 decimal
      templatesAtivos: templates?.length || 0,
    };
  },

  /**
   * Busca estatísticas por tipo de notificação
   */
  async getStatsByTipo(): Promise<NotificacaoTipo[]> {
    const supabase = createClient();

    const { data: notificacoes, error } = await supabase
      .from('notificacoes')
      .select('tipo, status');

    if (error) throw error;

    // Agrupar por tipo
    const tiposMap = new Map<string, {
      total: number;
      enviadas: number;
      pendentes: number;
    }>();

    notificacoes?.forEach(notif => {
      const tipo = notif.tipo || 'outros';
      const stats = tiposMap.get(tipo) || { total: 0, enviadas: 0, pendentes: 0 };

      stats.total++;
      if (notif.status === 'enviada' || notif.status === 'lida') {
        stats.enviadas++;
      } else if (notif.status === 'pendente') {
        stats.pendentes++;
      }

      tiposMap.set(tipo, stats);
    });

    // Converter para array
    const result: NotificacaoTipo[] = [];
    tiposMap.forEach((stats, tipo) => {
      const taxaEntrega = stats.total > 0
        ? (stats.enviadas / stats.total) * 100
        : 0;

      result.push({
        tipo,
        total: stats.total,
        enviadas: stats.enviadas,
        pendentes: stats.pendentes,
        taxaEntrega: Math.round(taxaEntrega * 10) / 10,
      });
    });

    return result.sort((a, b) => b.total - a.total);
  },

  /**
   * Busca estatísticas por canal de comunicação
   */
  async getStatsByCanal(): Promise<NotificacaoCanal[]> {
    const supabase = createClient();

    const { data: notificacoes, error } = await supabase
      .from('notificacoes')
      .select('canal, status');

    if (error) throw error;

    // Agrupar por canal
    const canaisMap = new Map<string, {
      total: number;
      enviadas: number;
      falhas: number;
    }>();

    notificacoes?.forEach(notif => {
      const canal = notif.canal || 'sistema';
      const stats = canaisMap.get(canal) || { total: 0, enviadas: 0, falhas: 0 };

      stats.total++;
      if (notif.status === 'enviada' || notif.status === 'lida') {
        stats.enviadas++;
      } else if (notif.status === 'falha') {
        stats.falhas++;
      }

      canaisMap.set(canal, stats);
    });

    // Converter para array
    const result: NotificacaoCanal[] = [];
    canaisMap.forEach((stats, canal) => {
      const taxaEntrega = stats.total > 0
        ? (stats.enviadas / stats.total) * 100
        : 0;

      result.push({
        canal,
        total: stats.total,
        enviadas: stats.enviadas,
        falhas: stats.falhas,
        taxaEntrega: Math.round(taxaEntrega * 10) / 10,
      });
    });

    return result.sort((a, b) => b.total - a.total);
  },
};
