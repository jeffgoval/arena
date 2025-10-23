import { whatsappAPI } from '@/lib/whatsapp';

export interface NotificacaoWhatsApp {
  telefone: string;
  tipo: 'reserva_confirmada' | 'pagamento_recebido' | 'lembrete_jogo' | 'cancelamento' | 'promocao';
  dados: any;
}

export class WhatsAppService {

  // Enviar notificação de reserva confirmada
  async notificarReservaConfirmada(telefone: string, dadosReserva: {
    id: string;
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  }) {
    try {
      const mensagem = `🎾 *Reserva Confirmada!*

Sua reserva foi confirmada com sucesso:

📍 *Quadra:* ${dadosReserva.quadra}
📅 *Data:* ${dadosReserva.data}
⏰ *Horário:* ${dadosReserva.horario}
💰 *Valor:* R$ ${dadosReserva.valor.toFixed(2)}

*ID da Reserva:* ${dadosReserva.id}

Chegue com 15 minutos de antecedência. Bom jogo! 🏆`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar notificação de reserva:', error);
      throw error;
    }
  }

  // Enviar notificação de pagamento recebido
  async notificarPagamentoRecebido(telefone: string, dadosPagamento: {
    id: string;
    valor: number;
    metodo: string;
    referencia?: string;
  }) {
    try {
      const mensagem = `💳 *Pagamento Confirmado!*

Seu pagamento foi processado com sucesso:

💰 *Valor:* R$ ${dadosPagamento.valor.toFixed(2)}
💳 *Método:* ${dadosPagamento.metodo}
🔢 *ID:* ${dadosPagamento.id}

${dadosPagamento.referencia ? `📋 *Referência:* ${dadosPagamento.referencia}` : ''}

Obrigado por escolher o Arena Dona Santa! 🙏`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar notificação de pagamento:', error);
      throw error;
    }
  }

  // Enviar lembrete de jogo
  async enviarLembreteJogo(telefone: string, dadosJogo: {
    quadra: string;
    data: string;
    horario: string;
    participantes: string[];
  }) {
    try {
      const mensagem = `⏰ *Lembrete de Jogo*

Seu jogo é hoje!

📍 *Quadra:* ${dadosJogo.quadra}
📅 *Data:* ${dadosJogo.data}
⏰ *Horário:* ${dadosJogo.horario}
👥 *Participantes:* ${dadosJogo.participantes.length}

Não se esqueça de chegar com antecedência. Nos vemos lá! 🎾`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar lembrete de jogo:', error);
      throw error;
    }
  }

  // Enviar notificação de cancelamento
  async notificarCancelamento(telefone: string, dadosCancelamento: {
    tipo: 'reserva' | 'jogo';
    id: string;
    motivo?: string;
    reembolso?: number;
  }) {
    try {
      const tipoTexto = dadosCancelamento.tipo === 'reserva' ? 'Reserva' : 'Jogo';
      
      let mensagem = `❌ *${tipoTexto} Cancelado*

Sua ${dadosCancelamento.tipo} foi cancelada.

🔢 *ID:* ${dadosCancelamento.id}`;

      if (dadosCancelamento.motivo) {
        mensagem += `\n📝 *Motivo:* ${dadosCancelamento.motivo}`;
      }

      if (dadosCancelamento.reembolso) {
        mensagem += `\n💰 *Reembolso:* R$ ${dadosCancelamento.reembolso.toFixed(2)}`;
        mensagem += `\n\nO reembolso será processado em até 5 dias úteis.`;
      }

      mensagem += `\n\nSe tiver dúvidas, entre em contato conosco. 📞`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar notificação de cancelamento:', error);
      throw error;
    }
  }

  // Enviar promoção
  async enviarPromocao(telefone: string, dadosPromocao: {
    titulo: string;
    descricao: string;
    desconto: number;
    validadeAte: string;
    codigoCupom?: string;
  }) {
    try {
      let mensagem = `🎉 *${dadosPromocao.titulo}*

${dadosPromocao.descricao}

💸 *Desconto:* ${dadosPromocao.desconto}%
📅 *Válido até:* ${dadosPromocao.validadeAte}`;

      if (dadosPromocao.codigoCupom) {
        mensagem += `\n🎫 *Cupom:* ${dadosPromocao.codigoCupom}`;
      }

      mensagem += `\n\nNão perca essa oportunidade! Reserve já sua quadra. 🏃‍♂️`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar promoção:', error);
      throw error;
    }
  }

  // Enviar QR Code PIX
  async enviarQRCodePix(telefone: string, dadosPix: {
    valor: number;
    qrCode: string;
    pixCopiaECola: string;
    vencimento: string;
  }) {
    try {
      // Primeiro enviar a imagem do QR Code
      await whatsappAPI.enviarImagem(
        telefone,
        dadosPix.qrCode,
        `QR Code PIX - R$ ${dadosPix.valor.toFixed(2)}`
      );

      // Depois enviar o código PIX copia e cola
      const mensagem = `📱 *Pagamento PIX*

💰 *Valor:* R$ ${dadosPix.valor.toFixed(2)}
⏰ *Vence em:* ${dadosPix.vencimento}

*PIX Copia e Cola:*
\`\`\`${dadosPix.pixCopiaECola}\`\`\`

1️⃣ Abra seu app do banco
2️⃣ Escolha PIX
3️⃣ Cole o código acima
4️⃣ Confirme o pagamento

O pagamento é processado instantaneamente! ⚡`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar QR Code PIX:', error);
      throw error;
    }
  }

  // Enviar menu de opções
  async enviarMenuPrincipal(telefone: string) {
    try {
      return await whatsappAPI.enviarBotoes(
        telefone,
        'Como posso ajudá-lo hoje?',
        [
          { id: 'nova_reserva', title: '🎾 Nova Reserva' },
          { id: 'minhas_reservas', title: '📅 Minhas Reservas' },
          { id: 'suporte', title: '🆘 Suporte' }
        ],
        '🏟️ Arena Dona Santa',
        'Escolha uma opção abaixo'
      );
    } catch (error) {
      console.error('Erro ao enviar menu principal:', error);
      throw error;
    }
  }

  // Enviar lista de quadras disponíveis
  async enviarQuadrasDisponiveis(telefone: string, quadras: Array<{
    id: string;
    nome: string;
    tipo: string;
    preco: number;
  }>) {
    try {
      const sections = [{
        title: 'Quadras Disponíveis',
        rows: quadras.map(quadra => ({
          id: `quadra_${quadra.id}`,
          title: quadra.nome,
          description: `${quadra.tipo} - R$ ${quadra.preco.toFixed(2)}/hora`
        }))
      }];

      return await whatsappAPI.enviarLista(
        telefone,
        'Escolha a quadra que deseja reservar:',
        'Ver Quadras',
        sections,
        '🎾 Quadras Disponíveis'
      );
    } catch (error) {
      console.error('Erro ao enviar lista de quadras:', error);
      throw error;
    }
  }

  // Enviar comprovante de pagamento
  async enviarComprovante(telefone: string, comprovanteUrl: string, dadosPagamento: {
    id: string;
    valor: number;
    data: string;
    metodo: string;
  }) {
    try {
      // Enviar o documento do comprovante
      await whatsappAPI.enviarDocumento(
        telefone,
        comprovanteUrl,
        `Comprovante_${dadosPagamento.id}.pdf`,
        'Comprovante de Pagamento'
      );

      // Enviar mensagem de confirmação
      const mensagem = `📄 *Comprovante Enviado*

Seu comprovante de pagamento foi gerado:

🔢 *ID:* ${dadosPagamento.id}
💰 *Valor:* R$ ${dadosPagamento.valor.toFixed(2)}
📅 *Data:* ${dadosPagamento.data}
💳 *Método:* ${dadosPagamento.metodo}

Guarde este comprovante para seus registros. 📁`;

      return await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
    } catch (error) {
      console.error('Erro ao enviar comprovante:', error);
      throw error;
    }
  }

  // Processar mensagem recebida (para chatbot)
  async processarMensagemRecebida(telefone: string, mensagem: string, tipo: string) {
    try {
      const mensagemLower = mensagem.toLowerCase();

      // Respostas automáticas baseadas em palavras-chave
      if (mensagemLower.includes('oi') || mensagemLower.includes('olá') || mensagemLower.includes('ola')) {
        return await this.enviarMenuPrincipal(telefone);
      }

      if (mensagemLower.includes('reserva')) {
        return await whatsappAPI.enviarBotoes(
          telefone,
          'O que você gostaria de fazer com suas reservas?',
          [
            { id: 'nova_reserva', title: '➕ Nova Reserva' },
            { id: 'ver_reservas', title: '👀 Ver Reservas' },
            { id: 'cancelar_reserva', title: '❌ Cancelar' }
          ]
        );
      }

      if (mensagemLower.includes('pagamento') || mensagemLower.includes('pagar')) {
        return await whatsappAPI.enviarMensagemTexto(
          telefone,
          'Para informações sobre pagamentos, acesse sua área do cliente ou entre em contato conosco.\n\n📱 Site: https://arena.com/cliente\n📞 Telefone: (11) 99999-9999'
        );
      }

      if (mensagemLower.includes('horario') || mensagemLower.includes('funcionamento')) {
        return await whatsappAPI.enviarMensagemTexto(
          telefone,
          '🕐 *Horário de Funcionamento*\n\n📅 Segunda a Sexta: 06:00 às 23:00\n📅 Sábado e Domingo: 07:00 às 22:00\n\n📍 Endereço: Rua das Flores, 123 - Centro'
        );
      }

      // Resposta padrão
      return await whatsappAPI.enviarMensagemTexto(
        telefone,
        'Desculpe, não entendi sua mensagem. Digite "menu" para ver as opções disponíveis ou entre em contato conosco:\n\n📞 (11) 99999-9999\n📧 contato@arena.com'
      );

    } catch (error) {
      console.error('Erro ao processar mensagem recebida:', error);
      throw error;
    }
  }

  // Enviar notificação em massa
  async enviarNotificacaoMassa(telefones: string[], mensagem: string, intervalo = 1000) {
    const resultados = [];

    for (const telefone of telefones) {
      try {
        const resultado = await whatsappAPI.enviarMensagemTexto(telefone, mensagem);
        resultados.push({ telefone, sucesso: true, resultado });
        
        // Aguardar intervalo entre envios para evitar rate limiting
        if (intervalo > 0) {
          await new Promise(resolve => setTimeout(resolve, intervalo));
        }
      } catch (error) {
        console.error(`Erro ao enviar para ${telefone}:`, error);
        resultados.push({ telefone, sucesso: false, erro: error.message });
      }
    }

    return resultados;
  }

  // Validar número de telefone brasileiro
  validarTelefone(telefone: string): boolean {
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Verificar se tem 10 ou 11 dígitos (sem código do país)
    // ou 12 ou 13 dígitos (com código do país 55)
    if (numeroLimpo.length === 10 || numeroLimpo.length === 11) {
      return true;
    }
    
    if ((numeroLimpo.length === 12 || numeroLimpo.length === 13) && numeroLimpo.startsWith('55')) {
      return true;
    }
    
    return false;
  }

  // Formatar telefone para exibição
  formatarTelefone(telefone: string): string {
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    if (numeroLimpo.length === 11) {
      return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
    }
    
    if (numeroLimpo.length === 10) {
      return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 6)}-${numeroLimpo.slice(6)}`;
    }
    
    return telefone;
  }
}

export const whatsappService = new WhatsAppService();