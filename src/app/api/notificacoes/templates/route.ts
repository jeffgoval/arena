import { NextRequest, NextResponse } from 'next/server';
import { notificacaoService } from '@/services/notificacaoService';

// Listar templates
export async function GET() {
  try {
    await notificacaoService.carregarTemplatesPersonalizados();
    const templates = notificacaoService.getTemplates();
    
    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Erro ao listar templates:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Atualizar template
export async function PUT(request: NextRequest) {
  try {
    const { tipo, template } = await request.json();
    
    if (!tipo || !template) {
      return NextResponse.json(
        { error: 'Tipo e template são obrigatórios' },
        { status: 400 }
      );
    }

    await notificacaoService.atualizarTemplate(tipo, template);
    
    return NextResponse.json({
      success: true,
      message: 'Template atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}