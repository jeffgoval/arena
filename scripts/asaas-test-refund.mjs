import dotenv from 'dotenv';
import axios from 'axios';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração da API Asaas
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || 'sandbox';
const BASE_URL = ASAAS_ENVIRONMENT === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3';

const asaasClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': ASAAS_API_KEY
  },
  timeout: 30000
});

console.log('💸 TESTE DE CANCELAMENTO E ESTORNO\n');
console.log('='.repeat(60));
console.log('\nEste script demonstra:\n');
console.log('1. Cancelar pagamento pendente');
console.log('2. Criar pagamento confirmado');
console.log('3. Estornar parcialmente');
console.log('4. Criar novo pagamento');
console.log('5. Estornar totalmente\n');
console.log('='.repeat(60) + '\n');

async function main() {
  try {
    // ============================================================
    // CRIAR CLIENTE
    // ============================================================
    console.log('👤 Criar Cliente de Teste');
    console.log('-'.repeat(60));

    const customerData = {
      name: `Cliente Estorno ${Date.now()}`,
      cpfCnpj: '24971563792',
      email: `estorno-${Date.now()}@asaas.com`
    };

    const customerResponse = await asaasClient.post('/customers', customerData);
    const customerId = customerResponse.data.id;

    console.log(`✅ Cliente criado: ${customerId}\n`);

    // ============================================================
    // TESTE 1: Cancelar Pagamento Pendente (PIX)
    // ============================================================
    console.log('🚫 TESTE 1: Cancelar Pagamento Pendente');
    console.log('-'.repeat(60));

    // Criar pagamento pendente (PIX sem pagar)
    const pixPaymentData = {
      customer: customerId,
      billingType: 'PIX',
      value: 25.00,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Pagamento para cancelar',
      externalReference: `CANCEL-${Date.now()}`
    };

    const pixResponse = await asaasClient.post('/payments', pixPaymentData);
    const pixPaymentId = pixResponse.data.id;

    console.log(`📝 Pagamento criado: ${pixPaymentId}`);
    console.log(`   Status: ${pixResponse.data.status}`);
    console.log(`   Valor: R$ ${pixResponse.data.value}`);

    console.log('\n🗑️  Cancelando pagamento pendente...');

    const cancelResponse = await asaasClient.delete(`/payments/${pixPaymentId}`);

    console.log(`✅ Pagamento cancelado!`);
    console.log(`   ID: ${cancelResponse.data.id}`);
    console.log(`   Status: ${cancelResponse.data.status || 'DELETED'}`);
    console.log(`   ⚠️  Este pagamento não pode mais ser pago\n`);

    // ============================================================
    // TESTE 2: Estorno Parcial
    // ============================================================
    console.log('💳 TESTE 2: Estorno Parcial');
    console.log('-'.repeat(60));

    // Criar pagamento com cartão (é aprovado imediatamente)
    const cardPaymentData1 = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: 100.00,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Pagamento para estorno parcial',
      externalReference: `PARTIAL-REFUND-${Date.now()}`,
      creditCard: {
        holderName: 'JOAO DA SILVA',
        number: '5162306219378829',
        expiryMonth: '12',
        expiryYear: '2030',
        ccv: '318'
      },
      creditCardHolderInfo: {
        name: 'JOAO DA SILVA',
        email: `card-${Date.now()}@asaas.com`,
        cpfCnpj: '24971563792',
        postalCode: '01310-000',
        addressNumber: '1000',
        phone: '4738010919'
      },
      remoteIp: '192.168.1.1'
    };

    const cardResponse1 = await asaasClient.post('/payments', cardPaymentData1);
    const cardPaymentId1 = cardResponse1.data.id;

    console.log(`📝 Pagamento criado: ${cardPaymentId1}`);
    console.log(`   Status: ${cardResponse1.data.status}`);
    console.log(`   Valor: R$ ${cardResponse1.data.value}`);

    console.log('\n⏳ Aguardando processamento (2 segundos)...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('💸 Estornando R$ 40,00 (40% do valor)...');

    const refundPartialData = {
      value: 40.00,
      description: 'Estorno parcial - Cliente solicitou reembolso'
    };

    const refundPartialResponse = await asaasClient.post(
      `/payments/${cardPaymentId1}/refund`,
      refundPartialData
    );

    console.log(`✅ Estorno parcial realizado!`);
    console.log(`   ID: ${refundPartialResponse.data.id}`);
    console.log(`   Valor estornado: R$ ${refundPartialResponse.data.value || 40.00}`);
    console.log(`   Valor restante: R$ ${100.00 - 40.00}`);
    console.log(`   Status: ${refundPartialResponse.data.status || 'REFUNDED'}\n`);

    // ============================================================
    // TESTE 3: Estorno Total
    // ============================================================
    console.log('💸 TESTE 3: Estorno Total');
    console.log('-'.repeat(60));

    // Criar outro pagamento
    const cardPaymentData2 = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: 50.00,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Pagamento para estorno total',
      externalReference: `FULL-REFUND-${Date.now()}`,
      creditCard: {
        holderName: 'JOAO DA SILVA',
        number: '5162306219378829',
        expiryMonth: '12',
        expiryYear: '2030',
        ccv: '318'
      },
      creditCardHolderInfo: {
        name: 'JOAO DA SILVA',
        email: `card2-${Date.now()}@asaas.com`,
        cpfCnpj: '24971563792',
        postalCode: '01310-000',
        addressNumber: '1000',
        phone: '4738010919'
      },
      remoteIp: '192.168.1.1'
    };

    const cardResponse2 = await asaasClient.post('/payments', cardPaymentData2);
    const cardPaymentId2 = cardResponse2.data.id;

    console.log(`📝 Pagamento criado: ${cardPaymentId2}`);
    console.log(`   Status: ${cardResponse2.data.status}`);
    console.log(`   Valor: R$ ${cardResponse2.data.value}`);

    console.log('\n⏳ Aguardando processamento (2 segundos)...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('💸 Estornando valor total...');

    // Estorno total (sem especificar valor)
    const refundFullResponse = await asaasClient.post(
      `/payments/${cardPaymentId2}/refund`,
      { description: 'Estorno total - Reembolso completo' }
    );

    console.log(`✅ Estorno total realizado!`);
    console.log(`   ID: ${refundFullResponse.data.id}`);
    console.log(`   Valor estornado: R$ ${cardResponse2.data.value}`);
    console.log(`   Status: ${refundFullResponse.data.status || 'REFUNDED'}\n`);

    // ============================================================
    // RESUMO
    // ============================================================
    console.log('='.repeat(60));
    console.log('\n📋 RESUMO DOS TESTES:\n');
    console.log(`✅ Cliente criado: ${customerId}`);
    console.log(`✅ Pagamento PIX cancelado: ${pixPaymentId}`);
    console.log(`✅ Estorno parcial realizado: R$ 40,00 de R$ 100,00 (${cardPaymentId1})`);
    console.log(`✅ Estorno total realizado: R$ 50,00 (${cardPaymentId2})`);
    console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!\n');
    console.log('💡 Casos de uso testados:\n');
    console.log('   1. Cancelar reserva antes do pagamento');
    console.log('   2. Cliente solicitou reembolso parcial');
    console.log('   3. Cliente solicitou reembolso total\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO:', error.response?.data?.errors?.[0]?.description || error.message);
    console.error('');
    process.exit(1);
  }
}

main();
