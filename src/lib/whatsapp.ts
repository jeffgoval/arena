import axios, { AxiosInstance } from 'axios';

// Tipos para WhatsApp Business API
export interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'template' | 'image' | 'document' | 'interactive';
  text?: {
    body: string;
    preview_url?: boolean;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: 'header' | 'body' | 'button';
      parameters?: Array<{
        type: 'text' | 'currency' | 'date_time' | 'image' | 'document';
        text?: string;
        currency?: {
          fallback_value: string;
          code: string;
          amount_1000: number;
        };
        date_time?: {
          fallback_value: string;
        };
        image?: {
          link: string;
        };
        document?: {
          link: string;
          filename: string;
        };
      }>;
    }>;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    caption?: string;
    filename: string;
  };
  interactive?: {
    type: 'button' | 'list';
    header?: {
      type: 'text' | 'image' | 'document';
      text?: string;
      image?: {
        link: string;
      };
      document?: {
        link: string;
        filename: string;
      };
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: {
          id: string;
          title: string;
        };
      }>;
      button?: string;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description?: string;
        }>;
      }>;
    };
  };
}

export interface WhatsAppContact {
  input: string;
  wa_id: string;
}

export interface WhatsAppMessageStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message: string;
    error_data?: {
      details: string;
    };
  }>;
}

export interface WhatsAppWebhook {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: WhatsAppContact[];
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
          context?: {
            from: string;
            id: string;
          };
          button?: {
            payload: string;
            text: string;
          };
          interactive?: {
            type: string;
            button_reply?: {
              id: string;
              title: string;
            };
            list_reply?: {
              id: string;
              title: string;
              description: string;
            };
          };
        }>;
        statuses?: WhatsAppMessageStatus[];
      };
      field: string;
    }>;
  }>;
}

class WhatsAppAPI {
  private api: AxiosInstance;
  private accessToken: string;
  private phoneNumberId: string;
  private baseURL: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.baseURL = `https://graph.facebook.com/v18.0/${this.phoneNumberId}`;

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Interceptors para logs
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[WhatsApp API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[WhatsApp API] Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`[WhatsApp API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[WhatsApp API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Enviar mensagem de texto simples
  async enviarMensagemTexto(telefone: string, mensagem: string, previewUrl = false) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatarTelefone(telefone),
        type: 'text',
        text: {
          body: mensagem,
          preview_url: previewUrl
        }
      };

      const response = await this.api.post('/messages', message);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao enviar mensagem de texto');
    }
  }

  // Enviar template de mensagem
  async enviarTemplate(
    telefone: string, 
    templateName: string, 
    languageCode = 'pt_BR',
    components?: WhatsAppMessage['template']['components']
  ) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatarTelefone(telefone),
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components
        }
      };

      const response = await this.api.post('/messages', message);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao enviar template');
    }
  }

  // Enviar imagem
  async enviarImagem(telefone: string, imageUrl: string, caption?: string) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatarTelefone(telefone),
        type: 'image',
        image: {
          link: imageUrl,
          caption
        }
      };

      const response = await this.api.post('/messages', message);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao enviar imagem');
    }
  }

  // Enviar documento
  async enviarDocumento(telefone: string, documentUrl: string, filename: string, caption?: string) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatarTelefone(telefone),
        type: 'document',
        document: {
          link: documentUrl,
          filename,
          caption
        }
      };

      const response = await this.api.post('/messages', message);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao enviar documento');
    }
  }

  // Enviar mensagem interativa com botões
  async enviarBotoes(
    telefone: string,
    texto: string,
    botoes: Array<{ id: string; title: string }>,
    header?: string,
    footer?: string
  ) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatarTelefone(telefone),
        type: 'interactive',
        interactive: {
          type: 'button',
          header: header ? {
            type: 'text',
            text: header
          } : undefined,
          body: {
            text: texto
          },
          footer: footer ? {
            text: footer
          } : undefined,
          action: {
            buttons: botoes.map(botao => ({
              type: 'reply',
              reply: {
                id: botao.id,
                title: botao.title
              }
            }))
          }
        }
      };

      const response = await this.api.post('/messages', message);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao enviar botões');
    }
  }

  // Enviar lista interativa
  async enviarLista(
    telefone: string,
    texto: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>,
    header?: string,
    footer?: string
  ) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatarTelefone(telefone),
        type: 'interactive',
        interactive: {
          type: 'list',
          header: header ? {
            type: 'text',
            text: header
          } : undefined,
          body: {
            text: texto
          },
          footer: footer ? {
            text: footer
          } : undefined,
          action: {
            button: buttonText,
            sections
          }
        }
      };

      const response = await this.api.post('/messages', message);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao enviar lista');
    }
  }

  // Marcar mensagem como lida
  async marcarComoLida(messageId: string) {
    try {
      const response = await this.api.post('/messages', {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao marcar mensagem como lida');
    }
  }

  // Validar webhook
  validarWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || '';
    
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    
    return null;
  }

  // Processar webhook recebido
  processarWebhook(webhookData: WhatsAppWebhook) {
    const { entry } = webhookData;

    entry.forEach(entryItem => {
      entryItem.changes.forEach(change => {
        const { value } = change;

        // Processar mensagens recebidas
        if (value.messages) {
          value.messages.forEach(message => {
            this.processarMensagemRecebida(message, value.metadata);
          });
        }

        // Processar status de mensagens enviadas
        if (value.statuses) {
          value.statuses.forEach(status => {
            this.processarStatusMensagem(status);
          });
        }
      });
    });
  }

  // Processar mensagem recebida
  private processarMensagemRecebida(message: any, metadata: any) {
    console.log('Mensagem recebida:', {
      from: message.from,
      id: message.id,
      type: message.type,
      timestamp: message.timestamp
    });

    // Aqui você pode implementar a lógica para processar diferentes tipos de mensagem
    switch (message.type) {
      case 'text':
        this.processarMensagemTexto(message);
        break;
      case 'button':
        this.processarBotaoPressionado(message);
        break;
      case 'interactive':
        this.processarInteracao(message);
        break;
      default:
        console.log(`Tipo de mensagem não tratado: ${message.type}`);
    }
  }

  // Processar status de mensagem
  private processarStatusMensagem(status: WhatsAppMessageStatus) {
    console.log('Status da mensagem:', {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
      recipient: status.recipient_id
    });

    // Implementar lógica para atualizar status no banco de dados
    // await updateMessageStatus(status.id, status.status);
  }

  // Processar mensagem de texto
  private processarMensagemTexto(message: any) {
    const texto = message.text.body.toLowerCase();
    
    // Implementar lógica de resposta automática baseada no texto
    if (texto.includes('oi') || texto.includes('olá')) {
      this.enviarMensagemTexto(
        message.from,
        'Olá! Bem-vindo ao Arena Dona Santa. Como posso ajudá-lo?'
      );
    } else if (texto.includes('reserva')) {
      this.enviarBotoes(
        message.from,
        'Que tipo de informação sobre reservas você precisa?',
        [
          { id: 'nova_reserva', title: 'Nova Reserva' },
          { id: 'minhas_reservas', title: 'Minhas Reservas' },
          { id: 'cancelar_reserva', title: 'Cancelar Reserva' }
        ]
      );
    }
  }

  // Processar botão pressionado
  private processarBotaoPressionado(message: any) {
    const buttonId = message.button.payload;
    
    switch (buttonId) {
      case 'nova_reserva':
        this.enviarMensagemTexto(
          message.from,
          'Para fazer uma nova reserva, acesse: https://arena.com/reservas'
        );
        break;
      case 'minhas_reservas':
        this.enviarMensagemTexto(
          message.from,
          'Suas reservas: https://arena.com/cliente/reservas'
        );
        break;
      case 'cancelar_reserva':
        this.enviarMensagemTexto(
          message.from,
          'Para cancelar uma reserva, entre em contato conosco ou acesse sua área do cliente.'
        );
        break;
    }
  }

  // Processar interação (lista ou botão)
  private processarInteracao(message: any) {
    if (message.interactive.type === 'button_reply') {
      const buttonId = message.interactive.button_reply.id;
      // Processar resposta do botão
      console.log(`Botão pressionado: ${buttonId}`);
    } else if (message.interactive.type === 'list_reply') {
      const listId = message.interactive.list_reply.id;
      // Processar resposta da lista
      console.log(`Item da lista selecionado: ${listId}`);
    }
  }

  // Utilitários
  private formatarTelefone(telefone: string): string {
    // Remover caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Adicionar código do país se não tiver
    if (!numeroLimpo.startsWith('55')) {
      return `55${numeroLimpo}`;
    }
    
    return numeroLimpo;
  }

  private handleError(error: any, defaultMessage: string) {
    if (error.response?.data?.error) {
      const errorData = error.response.data.error;
      return new Error(`${defaultMessage}: ${errorData.message || errorData.error_user_msg}`);
    }
    
    return new Error(`${defaultMessage}: ${error.message}`);
  }
}

export const whatsappAPI = new WhatsAppAPI();