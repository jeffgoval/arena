import { NextRequest, NextResponse } from 'next/server';
import { notificacaoService } from '@/services/notificacaoService';

// Obter estatísticas de notificações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataInicioParam = searchParams.get('dataInicio');
    const dataFimParam = searchParams.get('dataFim');
    
    // Definir período padrão (últimos 30 dias)
    const dataFim = dataFimParam ? new Date(dataFimParam) : new Date();
    const dataInicio = dataInicioParam ? new Date(dataInicioParam) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const estatisticas = await notificacaoService.obterEstatisticas(dataInicio, dataFim);
    
    return NextResponse.json({
      success: true,
      estatisticas,
      periodo: {
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString()
      }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}