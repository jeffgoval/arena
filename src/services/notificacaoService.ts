import { whatsappService } from './whatsappService';
import { createClient } from '@/lib/supabase/client';

export interface AgendamentoNotificacao {
  id?: string;
  reservaId: string;
  tipo: 'lembrete_45min' | 'lembrete_10min' | 'aceite_convite' | 'avaliacao_pos_jogo';
  telefone: string;
  dataEnvio: Date;
  enviado: boolean;
  tentativas: number;
  dadosTemplate: any;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export interface TemplateNotificacao {
  tipo: string;
  titulo: string;
  template: string;
  variaveis: string[];
  ativo: boolean;
}

export class NotificacaoService {
  private templates: Map<string, TemplateNotificacao> = new Map();

  constructor() {
    this.inicializarTemplates();
  }

  // Inicializar templates padrão
  private inicializarTemplates() {
    const templatesDefault: TemplateNotificacao[] = [
      {
        tipo: 'lembrete_45min',
        titulo: 'Lembrete - 45 minutos',
        template: `⏰ *Lembrete de Jogo*

Seu jogo é em 45 minutos!

📍 *Quadra:* {{quadra}}
📅 *Data:* {{data}}
⏰ *Horário:* {{horario}}
👥 *Participantes:* {{participantes}}

Prepare-se e chegue com antecedência. Nos vemos lá! 🎾`,
        variaveis: ['quadra', 'data', 'horario', 'participantes'],
        ativo: true
      },
      {
        tipo: 'lembrete_10min',
        titulo: 'Lembrete - 10 minutos',
        template: `🚨 *ÚLTIMO LEMBRETE*

Seu jogo é em 10 minutos!

📍 *Quadra:* {{quadra}}
⏰ *Horário:* {{horario}}

Venha rapidamente! O jogo está prestes a começar! 🏃‍♂️🎾`,
        variaveis: ['quadra', 'horario'],
        ativo: true
      },
      {
        tipo: 'aceite_convite',
        titulo: 'Convite Aceito',
        template: `✅ *Convite Aceito!*

{{nomeConvidado}} aceitou seu convite para jogar!

📍 *Quadra:* {{quadra}}
📅 *Data:* {{data}}
⏰ *Horário:* {{horario}}
👥 *Participantes confirmados:* {{participantesConfirmados}}/{{totalParticipantes}}

{{#temVagas}}
🔄 *Ainda há vagas disponíveis!* Convide mais amigos.
{{/temVagas}}

Prepare-se para um ótimo jogo! 🎾`,
        variaveis: ['nomeConvidado', 'quadra', 'data', 'horario', 'participantesConfirmados', 'totalParticipantes', 'temVagas'],
        ativo: true
      },
      {
        tipo: 'avaliacao_pos_jogo',
        titulo: 'Avaliação Pós-Jogo',
        template: `🏆 *Como foi seu jogo?*

Esperamos que tenha se divertido na {{quadra}}!

⭐ *Avalie sua experiência:*
• Qualidade da quadra
• Atendimento
• Facilidades

📝 *Deixe seu feedback:*
{{linkAvaliacao}}

Sua opinião é muito importante para melhorarmos sempre! 🙏

*Próximo jogo:* Reserve já sua próxima partida!
{{linkReserva}}`,
        variaveis: ['quadra', 'linkAvaliacao', 'linkReserva'],
        ativo: true
      }
    ];

    templatesDefault.forEach(template => {
      this.templates.set(template.tipo, template);
    });
  }

  // Agendar notificação
  async agendarNotificacao(agendamento: Omit<AgendamentoNotificacao, 'id' | 'enviado' | 'tentativas' | 'criadoEm' | 'atualizadoEm'>) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notificacoes_agendadas')
        .insert({
          reserva_id: agendamento.reservaId,
          tipo: agendamento.tipo,
          telefone: agendamento.telefone,
          data_envio: agendamento.dataEnvio.toISOString(),
          enviado: false,
          tentativas: 0,
          dados_template: agendamento.dadosTemplate,
          criado_em: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`Notificação agendada: ${agendamento.tipo} para ${agendamento.telefone} em ${agendamento.dataEnvio}`);
      return data;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  // Agendar lembretes para uma reserva
  async agendarLembretesReserva(reservaId: string, dadosReserva: {
    telefone: string;
    quadra: string;
    data: Date;
    horario: string;
    participantes: string[];
  }) {
    try {
      const dataJogo = new Date(dadosReserva.data);
      
      // Lembrete 45 minutos antes
      const lembrete45min = new Date(dataJogo.getTime() - 45 * 60 * 1000);
      await this.agendarNotificacao({
        reservaId,
        tipo: 'lembrete_45min',
        telefone: dadosReserva.telefone,
        dataEnvio: lembrete45min,
        dadosTemplate: {
          quadra: dadosReserva.quadra,
          data: this.formatarData(dadosReserva.data),
          horario: dadosReserva.horario,
          participantes: dadosReserva.participantes.length
        }
      });

      // Lembrete 10 minutos antes
      const lembrete10min = new Date(dataJogo.getTime() - 10 * 60 * 1000);
      await this.agendarNotificacao({
        reservaId,
        tipo: 'lembrete_10min',
        telefone: dadosReserva.telefone,
        dataEnvio: lembrete10min,
        dadosTemplate: {
          quadra: dadosReserva.quadra,
          horario: dadosReserva.horario
        }
      });

      // Avaliação pós-jogo (2 horas depois)
      const avaliacaoPosJogo = new Date(dataJogo.getTime() + 2 * 60 * 60 * 1000);
      await this.agendarNotificacao({
        reservaId,
        tipo: 'avaliacao_pos_jogo',
        telefone: dadosReserva.telefone,
        dataEnvio: avaliacaoPosJogo,
        dadosTemplate: {
          quadra: dadosReserva.quadra,
          linkAvaliacao: `${process.env.NEXT_PUBLIC_APP_URL}/avaliacao/${reservaId}`,
          linkReserva: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/nova`
        }
      });

      console.log(`Lembretes agendados para reserva ${reservaId}`);
    } catch (error) {
      console.error('Erro ao agendar lembretes:', error);
      throw error;
    }
  }

  // Processar notificações pendentes
  async processarNotificacoesPendentes() {
    try {
      const agora = new Date();
      const supabase = createClient();
      
      const { data: notificacoesPendentes, error } = await supabase
        .from('notificacoes_agendadas')
        .select('*')
        .eq('enviado', false)
        .lte('data_envio', agora.toISOString())
        .lt('tentativas', 3) // Máximo 3 tentativas
        .order('data_envio', { ascending: true });

      if (error) throw error;

      console.log(`Processando ${notificacoesPendentes?.length || 0} notificações pendentes`);

      for (const notificacao of notificacoesPendentes || []) {
        try {
          await this.enviarNotificacao(notificacao);
        } catch (error) {
          console.error(`Erro ao enviar notificação ${notificacao.id}:`, error);
          
          // Incrementar tentativas
          await supabase
            .from('notificacoes_agendadas')
            .update({ 
              tentativas: notificacao.tentativas + 1,
              atualizado_em: new Date().toISOString()
            })
            .eq('id', notificacao.id);
        }
      }
    } catch (error) {
      console.error('Erro ao processar notificações pendentes:', error);
      throw error;
    }
  }

  // Enviar notificação individual
  private async enviarNotificacao(notificacao: any) {
    try {
      const template = this.templates.get(notificacao.tipo);
      if (!template || !template.ativo) {
        throw new Error(`Template não encontrado ou inativo: ${notificacao.tipo}`);
      }

      const mensagem = this.processarTemplate(template.template, notificacao.dados_template);
      
      // Enviar mensagem via WhatsApp (implementar método apropriado)
      console.log(`Enviando notificação para ${notificacao.telefone}: ${mensagem}`);

      // Marcar como enviado
      const supabase = createClient();
      await supabase
        .from('notificacoes_agendadas')
        .update({ 
          enviado: true,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', notificacao.id);

      console.log(`Notificação ${notificacao.tipo} enviada para ${notificacao.telefone}`);
    } catch (error) {
      console.error(`Erro ao enviar notificação ${notificacao.id}:`, error);
      throw error;
    }
  }

  // Processar template com variáveis
  private processarTemplate(template: string, dados: any): string {
    let mensagem = template;

    // Substituir variáveis simples {{variavel}}
    Object.keys(dados).forEach(chave => {
      const regex = new RegExp(`{{${chave}}}`, 'g');
      mensagem = mensagem.replace(regex, dados[chave]);
    });

    // Processar condicionais {{#condicao}} ... {{/condicao}}
    const regexCondicional = /{{#(\w+)}}(.*?){{\/\1}}/g;
    mensagem = mensagem.replace(regexCondicional, (match, condicao, conteudo) => {
      return dados[condicao] ? conteudo : '';
    });

    return mensagem;
  }

  // Notificar aceite de convite
  async notificarAceiteConvite(dadosConvite: {
    telefoneOrganizador: string;
    nomeConvidado: string;
    quadra: string;
    data: Date;
    horario: string;
    participantesConfirmados: number;
    totalParticipantes: number;
  }) {
    try {
      const template = this.templates.get('aceite_convite');
      if (!template || !template.ativo) return;

      const temVagas = dadosConvite.participantesConfirmados < dadosConvite.totalParticipantes;

      const mensagem = this.processarTemplate(template.template, {
        nomeConvidado: dadosConvite.nomeConvidado,
        quadra: dadosConvite.quadra,
        data: this.formatarData(dadosConvite.data),
        horario: dadosConvite.horario,
        participantesConfirmados: dadosConvite.participantesConfirmados,
        totalParticipantes: dadosConvite.totalParticipantes,
        temVagas: temVagas
      });

      console.log(`Notificação de aceite para ${dadosConvite.telefoneOrganizador}: ${mensagem}`);
      
      console.log(`Notificação de aceite enviada para ${dadosConvite.telefoneOrganizador}`);
    } catch (error) {
      console.error('Erro ao notificar aceite de convite:', error);
      throw error;
    }
  }

  // Cancelar notificações de uma reserva
  async cancelarNotificacoesReserva(reservaId: string) {
    try {
      const supabase = createClient();
      await supabase
        .from('notificacoes_agendadas')
        .delete()
        .eq('reserva_id', reservaId)
        .eq('enviado', false);

      console.log(`Notificações canceladas para reserva ${reservaId}`);
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
      throw error;
    }
  }

  // Obter templates disponíveis
  getTemplates(): TemplateNotificacao[] {
    return Array.from(this.templates.values());
  }

  // Atualizar template
  async atualizarTemplate(tipo: string, template: Partial<TemplateNotificacao>) {
    const templateExistente = this.templates.get(tipo);
    if (!templateExistente) {
      throw new Error(`Template não encontrado: ${tipo}`);
    }

    const templateAtualizado = { ...templateExistente, ...template };
    this.templates.set(tipo, templateAtualizado);

    // Salvar no banco de dados
    const supabase = createClient();
    await supabase
      .from('templates_notificacao')
      .upsert({
        tipo,
        titulo: templateAtualizado.titulo,
        template: templateAtualizado.template,
        variaveis: templateAtualizado.variaveis,
        ativo: templateAtualizado.ativo
      });

    console.log(`Template ${tipo} atualizado`);
  }

  // Carregar templates do banco
  async carregarTemplatesPersonalizados() {
    try {
      const supabase = createClient();
      const { data: templates, error } = await supabase
        .from('templates_notificacao')
        .select('*');

      if (error) throw error;

      templates?.forEach(template => {
        this.templates.set(template.tipo, {
          tipo: template.tipo,
          titulo: template.titulo,
          template: template.template,
          variaveis: template.variaveis,
          ativo: template.ativo
        });
      });

      console.log(`${templates?.length || 0} templates personalizados carregados`);
    } catch (error) {
      console.error('Erro ao carregar templates personalizados:', error);
    }
  }

  // Testar template
  async testarTemplate(tipo: string, dadosTeste: any, telefone: string) {
    try {
      const template = this.templates.get(tipo);
      if (!template) {
        throw new Error(`Template não encontrado: ${tipo}`);
      }

      const mensagem = this.processarTemplate(template.template, dadosTeste);
      
      // Adicionar prefixo de teste
      const mensagemTeste = `🧪 *TESTE DE TEMPLATE*\n\n${mensagem}\n\n---\n*Esta é uma mensagem de teste*`;
      
      console.log(`Teste de template para ${telefone}: ${mensagemTeste}`);
      
      console.log(`Template ${tipo} testado para ${telefone}`);
      return mensagem;
    } catch (error) {
      console.error('Erro ao testar template:', error);
      throw error;
    }
  }

  // Estatísticas de notificações
  async obterEstatisticas(dataInicio: Date, dataFim: Date) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notificacoes_agendadas')
        .select('tipo, enviado, tentativas')
        .gte('criado_em', dataInicio.toISOString())
        .lte('criado_em', dataFim.toISOString());

      if (error) throw error;

      const estatisticas = {
        total: data?.length || 0,
        enviadas: data?.filter(n => n.enviado).length || 0,
        pendentes: data?.filter(n => !n.enviado && n.tentativas < 3).length || 0,
        falharam: data?.filter(n => !n.enviado && n.tentativas >= 3).length || 0,
        porTipo: {} as Record<string, { total: number; enviadas: number; taxa: number }>
      };

      // Estatísticas por tipo
      const tipos = [...new Set(data?.map(n => n.tipo) || [])];
      tipos.forEach(tipo => {
        const notificacoesTipo = data?.filter(n => n.tipo === tipo) || [];
        const enviadasTipo = notificacoesTipo.filter(n => n.enviado);
        
        estatisticas.porTipo[tipo] = {
          total: notificacoesTipo.length,
          enviadas: enviadasTipo.length,
          taxa: notificacoesTipo.length > 0 ? (enviadasTipo.length / notificacoesTipo.length) * 100 : 0
        };
      });

      return estatisticas;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // Utilitários
  private formatarData(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  }
}

export const notificacaoService = new NotificacaoService();