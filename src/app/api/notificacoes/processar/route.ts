import { NextRequest, NextResponse } from 'next/server';
import { notificacaoService } from '@/services/notificacaoService';

// Endpoint para processar notificações pendentes (chamado por cron job)
export async function POST(request: NextRequest) {
  try {
    // Verificar token de autorização para segurança
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    console.log('Iniciando processamento de notificações pendentes...');
    
    await notificacaoService.processarNotificacoesPendentes();
    
    return NextResponse.json({
      success: true,
      message: 'Notificações processadas com sucesso',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao processar notificações:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para processar manualmente (apenas em desenvolvimento)
export async function GET(request: NextRequest) {
  try {
    // Apenas permitir em desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Endpoint não disponível em produção' },
        { status: 403 }
      );
    }

    console.log('Processamento manual de notificações...');
    
    await notificacaoService.processarNotificacoesPendentes();
    
    return NextResponse.json({
      success: true,
      message: 'Notificações processadas manualmente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao processar notificações manualmente:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}