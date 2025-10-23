import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsappService';

export async function POST(request: NextRequest) {
  try {
    const { telefones, mensagem, intervalo = 1000 } = await request.json();

    if (!telefones || !Array.isArray(telefones) || telefones.length === 0) {
      return NextResponse.json(
        { erro: 'Lista de telefones é obrigatória e deve ser um array não vazio' },
        { status: 400 }
      );
    }

    if (!mensagem) {
      return NextResponse.json(
        { erro: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Validar telefones
    const telefonesInvalidos = telefones.filter(tel => !whatsappService.validarTelefone(tel));
    if (telefonesInvalidos.length > 0) {
      return NextResponse.json(
        { 
          erro: 'Telefones inválidos encontrados',
          telefonesInvalidos: telefonesInvalidos.map(tel => whatsappService.formatarTelefone(tel))
        },
        { status: 400 }
      );
    }

    // Limitar quantidade para evitar spam
    if (telefones.length > 100) {
      return NextResponse.json(
        { erro: 'Máximo de 100 telefones por envio' },
        { status: 400 }
      );
    }

    console.log(`Iniciando envio em massa para ${telefones.length} telefones`);

    const resultados = await whatsappService.enviarNotificacaoMassa(
      telefones,
      mensagem,
      intervalo
    );

    const sucessos = resultados.filter(r => r.sucesso).length;
    const falhas = resultados.filter(r => !r.sucesso).length;

    console.log(`Envio em massa concluído: ${sucessos} sucessos, ${falhas} falhas`);

    return NextResponse.json({
      sucesso: true,
      total: telefones.length,
      sucessos,
      falhas,
      resultados: resultados.map(r => ({
        telefone: whatsappService.formatarTelefone(r.telefone),
        sucesso: r.sucesso,
        erro: r.sucesso ? undefined : r.erro
      }))
    });

  } catch (error: any) {
    console.error('Erro no envio em massa:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor', detalhes: error.message },
      { status: 500 }
    );
  }
}