import { useState, useCallback } from 'react';
import { notificacaoService, AgendamentoNotificacao, TemplateNotificacao } from '@/services/notificacaoService';

export function useNotificacoes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agendarLembretes = useCallback(async (
    reservaId: string,
    dadosReserva: {
      telefone: string;
      quadra: string;
      data: Date;
      horario: string;
      participantes: string[];
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      await notificacaoService.agendarLembretesReserva(reservaId, dadosReserva);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar lembretes';
      setError(errorMessage);
      console.error('Erro ao agendar lembretes:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const notificarAceiteConvite = useCallback(async (dadosConvite: {
    telefoneOrganizador: string;
    nomeConvidado: string;
    quadra: string;
    data: Date;
    horario: string;
    participantesConfirmados: number;
    totalParticipantes: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      await notificacaoService.notificarAceiteConvite(dadosConvite);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao notificar aceite';
      setError(errorMessage);
      console.error('Erro ao notificar aceite:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarNotificacoes = useCallback(async (reservaId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await notificacaoService.cancelarNotificacoesReserva(reservaId);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar notificações';
      setError(errorMessage);
      console.error('Erro ao cancelar notificações:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const processarNotificacoesPendentes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await notificacaoService.processarNotificacoesPendentes();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar notificações';
      setError(errorMessage);
      console.error('Erro ao processar notificações:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    agendarLembretes,
    notificarAceiteConvite,
    cancelarNotificacoes,
    processarNotificacoesPendentes
  };
}

export function useTemplatesNotificacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateNotificacao[]>([]);

  const carregarTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await notificacaoService.carregarTemplatesPersonalizados();
      const templatesCarregados = notificacaoService.getTemplates();
      setTemplates(templatesCarregados);
      
      return templatesCarregados;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar templates';
      setError(errorMessage);
      console.error('Erro ao carregar templates:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarTemplate = useCallback(async (
    tipo: string,
    template: Partial<TemplateNotificacao>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      await notificacaoService.atualizarTemplate(tipo, template);
      
      // Recarregar templates
      const templatesAtualizados = notificacaoService.getTemplates();
      setTemplates(templatesAtualizados);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar template';
      setError(errorMessage);
      console.error('Erro ao atualizar template:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const testarTemplate = useCallback(async (
    tipo: string,
    dadosTeste: any,
    telefone: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const mensagem = await notificacaoService.testarTemplate(tipo, dadosTeste, telefone);
      
      return mensagem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao testar template';
      setError(errorMessage);
      console.error('Erro ao testar template:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const obterEstatisticas = useCallback(async (dataInicio: Date, dataFim: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      const estatisticas = await notificacaoService.obterEstatisticas(dataInicio, dataFim);
      
      return estatisticas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter estatísticas';
      setError(errorMessage);
      console.error('Erro ao obter estatísticas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    templates,
    carregarTemplates,
    atualizarTemplate,
    testarTemplate,
    obterEstatisticas
  };
}