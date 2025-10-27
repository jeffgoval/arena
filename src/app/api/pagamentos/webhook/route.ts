import { NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

const body = {
  erro: 'Endpoint descontinuado',
  detalhe: 'Atualize o webhook do Asaas para /api/webhooks/asaas',
};

export async function POST(): Promise<NextResponse> {
  logger.warn(
    'Webhook:PagamentosLegacy',
    'Chamada recebida no endpoint antigo /api/pagamentos/webhook. Atualize a URL do Asaas para /api/webhooks/asaas.'
  );

  return NextResponse.json(body, {
    status: 410,
    headers: {
      'X-Webhook-Migrate-To': '/api/webhooks/asaas',
    },
  });
}
