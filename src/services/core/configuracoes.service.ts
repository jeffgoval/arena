import { createClient } from '@/lib/supabase/client';

export interface Configuracoes {
  // Parâmetros do Sistema
  antecedencia_minima: number; // horas
  antecedencia_maxima: number; // dias
  dia_vencimento: number; // dia do mês
  hora_limite_reserva: number; // hora do dia

  // Política de Cancelamento
  cancelamento_gratuito: number; // horas antes
  multa_cancelamento: number; // percentual
  reembolso_total: number; // horas antes
  permite_cancelamento: boolean;

  // Formas de Pagamento
  pagamento_pix: boolean;
  pagamento_cartao: boolean;
  pagamento_dinheiro: boolean;
  pagamento_transferencia: boolean;
  taxa_conveniencia: number; // percentual
  valor_minimo: number; // reais

  // Notificações
  notif_whatsapp: boolean;
  notif_email: boolean;
  notif_sms: boolean;
  lembrete_antes: number; // minutos
  lembrete_final: number; // minutos

  // Descontos e Bônus
  desconto_mensalista: number; // percentual
  desconto_primeira_reserva: number; // percentual
  bonus_indicacao: number; // reais
  desconto_recorrente: number; // percentual
  bonus_aniversario: number; // reais
  desconto_grupo: number; // percentual
  minimo_participantes_desconto: number; // número de pessoas

  // Metadata
  id?: string;
  updated_at?: string;
}

export interface ConfiguracoesTemplate {
  // Templates WhatsApp
  template_confirmacao: string;
  template_lembrete: string;
  template_convite: string;
  template_cancelamento: string;
  template_avaliacao: string;
}

const CONFIGURACOES_PADRAO: Configuracoes = {
  antecedencia_minima: 2,
  antecedencia_maxima: 30,
  dia_vencimento: 25,
  hora_limite_reserva: 22,
  cancelamento_gratuito: 24,
  multa_cancelamento: 30,
  reembolso_total: 48,
  permite_cancelamento: true,
  pagamento_pix: true,
  pagamento_cartao: true,
  pagamento_dinheiro: true,
  pagamento_transferencia: true,
  taxa_conveniencia: 3.5,
  valor_minimo: 50,
  notif_whatsapp: true,
  notif_email: true,
  notif_sms: false,
  lembrete_antes: 45,
  lembrete_final: 10,
  desconto_mensalista: 15,
  desconto_primeira_reserva: 10,
  bonus_indicacao: 20,
  desconto_recorrente: 5,
  bonus_aniversario: 50,
  desconto_grupo: 8,
  minimo_participantes_desconto: 10,
};

const TEMPLATES_PADRAO: ConfiguracoesTemplate = {
  template_confirmacao: "✅ Reserva confirmada!\n\n📍 {quadra}\n📅 {data} às {horario}\n💰 Valor: {valor}\n\nNos vemos lá! ⚽",
  template_lembrete: "⏰ Oi {nome}! Seu jogo começa em {tempo}.\n\n📍 {quadra}\n🕐 {horario}\n\nNão esqueça da chuteira! 🏟️",
  template_convite: "🎉 {organizador} te convidou para jogar!\n\n📍 {quadra}\n📅 {data} às {horario}\n👥 {participantes} confirmados\n\nAceitar: {link}",
  template_cancelamento: "❌ Reserva cancelada\n\n📍 {quadra}\n📅 {data} às {horario}\n\nMotivo: {motivo}\n💰 Reembolso: {valor}",
  template_avaliacao: "⭐ Como foi o jogo de hoje?\n\nSua opinião é importante!\nAvalie: {link}",
};

/**
 * Serviço para gerenciar configurações do sistema
 *
 * Nota: Como a tabela 'configuracoes' pode não existir ainda,
 * vamos usar localStorage como fallback temporário até o schema ser criado
 */
export const configuracoesService = {
  /**
   * Busca configurações do sistema
   */
  async getConfiguracoes(): Promise<Configuracoes> {
    const supabase = createClient();

    try {
      // Tentar buscar do banco primeiro
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        // Se a tabela não existir, usar localStorage como fallback
        console.warn('Tabela configuracoes não encontrada, usando localStorage');
        return this.getConfiguracoesFromLocalStorage();
      }

      return data || CONFIGURACOES_PADRAO;
    } catch (err) {
      // Fallback para localStorage
      return this.getConfiguracoesFromLocalStorage();
    }
  },

  /**
   * Salva configurações do sistema
   */
  async saveConfiguracoes(config: Partial<Configuracoes>): Promise<void> {
    const supabase = createClient();

    try {
      // Primeiro, buscar o ID da configuração existente
      const { data: existing, error: fetchError } = await supabase
        .from('configuracoes')
        .select('id')
        .limit(1)
        .single();

      if (fetchError || !existing) {
        console.warn('Erro ao buscar configuração existente, usando localStorage');
        this.saveConfiguracoesToLocalStorage(config);
        return;
      }

      // Atualizar usando o ID específico
      const { error } = await supabase
        .from('configuracoes')
        .update({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Erro ao salvar no banco:', error);
        // Se falhar, salvar em localStorage
        this.saveConfiguracoesToLocalStorage(config);
        throw error; // Propagar erro para o hook mostrar toast
      }
    } catch (err) {
      // Fallback para localStorage
      console.error('Exceção ao salvar:', err);
      this.saveConfiguracoesToLocalStorage(config);
      throw err;
    }
  },

  /**
   * Restaura configurações padrão
   */
  async restaurarPadrao(): Promise<void> {
    await this.saveConfiguracoes(CONFIGURACOES_PADRAO);
  },

  /**
   * Busca templates de mensagens
   */
  async getTemplates(): Promise<ConfiguracoesTemplate> {
    // Por enquanto, retornar templates padrão
    // No futuro, buscar do banco ou da tabela templates_notificacao
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('config_templates');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return TEMPLATES_PADRAO;
  },

  /**
   * Salva templates de mensagens
   */
  async saveTemplates(templates: Partial<ConfiguracoesTemplate>): Promise<void> {
    if (typeof window !== 'undefined') {
      const current = await this.getTemplates();
      localStorage.setItem('config_templates', JSON.stringify({ ...current, ...templates }));
    }
  },

  // Helpers para localStorage
  getConfiguracoesFromLocalStorage(): Configuracoes {
    if (typeof window === 'undefined') return CONFIGURACOES_PADRAO;

    const stored = localStorage.getItem('arena_configuracoes');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return CONFIGURACOES_PADRAO;
      }
    }
    return CONFIGURACOES_PADRAO;
  },

  saveConfiguracoesToLocalStorage(config: Partial<Configuracoes>): void {
    if (typeof window === 'undefined') return;

    const current = this.getConfiguracoesFromLocalStorage();
    const updated = { ...current, ...config };
    localStorage.setItem('arena_configuracoes', JSON.stringify(updated));
  },
};
