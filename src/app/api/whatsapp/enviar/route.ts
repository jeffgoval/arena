import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsappService';

export async function POST(request: NextRequest) {
  try {
    const { telefone, tipo, dados } = await request.json();

    if (!telefone || !tipo) {
      return NextResponse.json(
        { erro: 'Telefone e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar telefone
    if (!whatsappService.validarTelefone(telefone)) {
      return NextResponse.json(
        { erro: 'Número de telefone inválido' },
        { status: 400 }
      );
    }

    let resultado;

    switch (tipo) {
      case 'reserva_confirmada':
        if (!dados.id || !dados.quadra || !dados.data || !dados.horario || !dados.valor) {
          return NextResponse.json(
            { erro: 'Dados da reserva incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.notificarReservaConfirmada(telefone, dados);
        break;

      case 'pagamento_recebido':
        if (!dados.id || !dados.valor || !dados.metodo) {
          return NextResponse.json(
            { erro: 'Dados do pagamento incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.notificarPagamentoRecebido(telefone, dados);
        break;

      case 'lembrete_jogo':
        if (!dados.quadra || !dados.data || !dados.horario) {
          return NextResponse.json(
            { erro: 'Dados do jogo incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.enviarLembreteJogo(telefone, dados);
        break;

      case 'cancelamento':
        if (!dados.tipo || !dados.id) {
          return NextResponse.json(
            { erro: 'Dados do cancelamento incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.notificarCancelamento(telefone, dados);
        break;

      case 'promocao':
        if (!dados.titulo || !dados.descricao || !dados.desconto || !dados.validadeAte) {
          return NextResponse.json(
            { erro: 'Dados da promoção incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.enviarPromocao(telefone, dados);
        break;

      case 'qr_code_pix':
        if (!dados.valor || !dados.qrCode || !dados.pixCopiaECola || !dados.vencimento) {
          return NextResponse.json(
            { erro: 'Dados do PIX incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.enviarQRCodePix(telefone, dados);
        break;

      case 'comprovante':
        if (!dados.comprovanteUrl || !dados.id || !dados.valor || !dados.data || !dados.metodo) {
          return NextResponse.json(
            { erro: 'Dados do comprovante incompletos' },
            { status: 400 }
          );
        }
        resultado = await whatsappService.enviarComprovante(telefone, dados.comprovanteUrl, {
          id: dados.id,
          valor: dados.valor,
          data: dados.data,
          metodo: dados.metodo
        });
        break;

      case 'menu':
        resultado = await whatsappService.enviarMenuPrincipal(telefone);
        break;

      case 'texto':
        if (!dados.mensagem) {
          return NextResponse.json(
            { erro: 'Mensagem é obrigatória' },
            { status: 400 }
          );
        }
        const { whatsappAPI } = await import('@/lib/whatsapp');
        resultado = await whatsappAPI.enviarMensagemTexto(telefone, dados.mensagem);
        break;

      default:
        return NextResponse.json(
          { erro: 'Tipo de notificação não suportado' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      sucesso: true,
      resultado,
      telefone: whatsappService.formatarTelefone(telefone)
    });

  } catch (error: any) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor', detalhes: error.message },
      { status: 500 }
    );
  }
}