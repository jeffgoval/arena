import { NextRequest, NextResponse } from 'next/server';
import { notificacaoService } from '@/services/notificacaoService';

// Testar template
export async function POST(request: NextRequest) {
  try {
    const { tipo, dadosTeste, telefone } = await request.json();
    
    if (!tipo || !dadosTeste || !telefone) {
      return NextResponse.json(
        { error: 'Tipo, dados de teste e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato do telefone
    const telefoneRegex = /^55\d{10,11}$/;
    if (!telefoneRegex.test(telefone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Formato de telefone inválido. Use: 5511999999999' },
        { status: 400 }
      );
    }

    const mensagem = await notificacaoService.testarTemplate(tipo, dadosTeste, telefone);
    
    return NextResponse.json({
      success: true,
      message: 'Template testado com sucesso',
      mensagemEnviada: mensagem
    });

  } catch (error) {
    console.error('Erro ao testar template:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}