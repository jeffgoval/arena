import { NextRequest, NextResponse } from 'next/server';
import { notificacaoService } from '@/services/notificacaoService';
import { createClient } from '@/lib/supabase/server';

// Endpoint para processar notificações pendentes (chamado por cron job OU admin)
export async function POST(request: NextRequest) {
  try {
    // SEGURANÇA: Verificar autenticação do usuário (admin) OU token de cron
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    // Verificar se é requisição de cron job
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');

      if (token !== expectedToken) {
        return NextResponse.json(
          { error: 'Token de autenticação inválido' },
          { status: 401 }
        );
      }
    } else {
      // Verificar se é admin autenticado
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: 'Não autenticado' },
          { status: 401 }
        );
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Acesso negado - apenas administradores' },
          { status: 403 }
        );
      }
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
