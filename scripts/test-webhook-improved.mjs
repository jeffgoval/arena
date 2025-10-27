#!/usr/bin/env node
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

console.log('🧪 Teste do Webhook Melhorado - Asaas\n');

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const WEBHOOK_URL = `${APP_URL}/api/webhooks/asaas`;

console.log(`📍 URL do webhook: ${WEBHOOK_URL}\n`);

// Mock de payload do Asaas
const mockPayloads = {
  PAYMENT_CREATED: {
    event: 'PAYMENT_CREATED',
    payment: {
      id: 'pay_test_created_' + Date.now(),
      customer: 'cus_test_123',
      billingType: 'PIX',
      value: 50.00,
      netValue: 48.50,
      status: 'PENDING',
      dueDate: '2025-10-28',
      externalReference: 'test_reservation_123'
    }
  },
  PAYMENT_AWAITING_PAYMENT: {
    event: 'PAYMENT_AWAITING_PAYMENT',
    payment: {
      id: 'pay_test_awaiting_' + Date.now(),
      customer: 'cus_test_123',
      billingType: 'PIX',
      value: 50.00,
      netValue: 48.50,
      status: 'PENDING',
      dueDate: '2025-10-28',
      externalReference: 'test_reservation_123'
    }
  },
  PAYMENT_RECEIVED: {
    event: 'PAYMENT_RECEIVED',
    payment: {
      id: 'pay_test_received_' + Date.now(),
      customer: 'cus_test_123',
      billingType: 'PIX',
      value: 50.00,
      netValue: 48.50,
      status: 'RECEIVED',
      dueDate: '2025-10-28',
      paymentDate: new Date().toISOString(),
      externalReference: 'test_reservation_123'
    }
  },
  PAYMENT_CONFIRMED: {
    event: 'PAYMENT_CONFIRMED',
    payment: {
      id: 'pay_test_confirmed_' + Date.now(),
      customer: 'cus_test_123',
      billingType: 'PIX',
      value: 50.00,
      netValue: 48.50,
      status: 'CONFIRMED',
      dueDate: '2025-10-28',
      paymentDate: new Date().toISOString(),
      confirmedDate: new Date().toISOString(),
      externalReference: 'test_reservation_123'
    }
  },
  PAYMENT_OVERDUE: {
    event: 'PAYMENT_OVERDUE',
    payment: {
      id: 'pay_test_overdue_' + Date.now(),
      customer: 'cus_test_123',
      billingType: 'PIX',
      value: 50.00,
      netValue: 48.50,
      status: 'OVERDUE',
      dueDate: '2025-10-26',
      externalReference: 'test_reservation_123'
    }
  }
};

async function testWebhook(eventType) {
  const payload = mockPayloads[eventType];

  if (!payload) {
    console.error(`❌ Tipo de evento inválido: ${eventType}`);
    return;
  }

  console.log(`\n📤 Testando evento: ${eventType}`);
  console.log(`   Payment ID: ${payload.payment.id}`);
  console.log(`   Valor: R$ ${payload.payment.value}`);

  try {
    const body = JSON.stringify(payload);

    const headers = {
      'Content-Type': 'application/json'
    };

    const secret = process.env.ASAAS_WEBHOOK_SECRET;
    if (secret) {
      headers['asaas-signature'] = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Resposta:`, result);
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   ❌ Erro:`, result);
    }

  } catch (error) {
    console.error(`   ❌ Erro ao enviar requisição:`, error.message);
  }
}

async function runTests() {
  console.log('⚠️  IMPORTANTE: Para este teste funcionar localmente:');
  console.log('1. O servidor Next.js deve estar rodando (npm run dev)');
  console.log('2. A validação de assinatura está ativa (teste falhará sem assinatura válida)');
  console.log('3. Para teste local, você pode comentar temporariamente a validação\n');

  console.log('🔧 Iniciando testes em 3 segundos...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Testar eventos em sequência
  const events = [
    'PAYMENT_CREATED',
    'PAYMENT_AWAITING_PAYMENT',
    'PAYMENT_RECEIVED',
    'PAYMENT_CONFIRMED',
    'PAYMENT_OVERDUE'
  ];

  for (const event of events) {
    await testWebhook(event);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1s entre requisições
  }

  console.log('\n\n✨ Testes concluídos!');
  console.log('\n📊 Próximos passos:');
  console.log('1. Verificar logs no console do servidor Next.js');
  console.log('2. Consultar tabela webhook_logs:');
  console.log('   SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;');
  console.log('\n💡 Para teste em produção:');
  console.log('1. Use o sandbox do Asaas');
  console.log('2. Configure o webhook URL no painel');
  console.log('3. Faça um pagamento PIX de teste');
  console.log('4. Aguarde o webhook do Asaas');
}

runTests().catch(console.error);
