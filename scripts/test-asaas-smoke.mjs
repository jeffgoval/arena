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

// Cliente Axios configurado
const asaasClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': ASAAS_API_KEY
  },
  timeout: 30000
});

console.log('🚀 TESTE DE SMOKE - Asaas Payment Gateway\n');
console.log(`📍 Ambiente: ${ASAAS_ENVIRONMENT}`);
console.log(`🔗 Base URL: ${BASE_URL}\n`);
console.log('='.repeat(60) + '\n');

// ============================================================
// TESTE 1: Verificar Credenciais
// ============================================================
async function test1_verificarCredenciais() {
  console.log('📋 TESTE 1: Verificar Credenciais');
  console.log('-'.repeat(60));

  try {
    // Verificar se variáveis estão configuradas
    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY não configurada');
    }

    if (!process.env.ASAAS_WEBHOOK_SECRET) {
      throw new Error('ASAAS_WEBHOOK_SECRET não configurada');
    }

    console.log('✅ ASAAS_API_KEY: Configurada');
    console.log(`✅ ASAAS_ENVIRONMENT: ${ASAAS_ENVIRONMENT}`);
    console.log('✅ ASAAS_WEBHOOK_SECRET: Configurada');

    // Tentar fazer uma requisição simples para validar API key
    const response = await asaasClient.get('/customers?limit=1');
    console.log(`✅ Conexão com API estabelecida (Status: ${response.status})`);
    console.log(`✅ Total de clientes no sistema: ${response.data.totalCount || 0}\n`);

    return { success: true };
  } catch (error) {
    console.log('❌ FALHA:', error.response?.data?.errors?.[0]?.description || error.message);
    console.log('');
    return { success: false, error };
  }
}

// ============================================================
// TESTE 2: Criar Cliente
// ============================================================
async function test2_criarCliente() {
  console.log('👤 TESTE 2: Criar Cliente de Teste');
  console.log('-'.repeat(60));

  try {
    const customerData = {
      name: `Cliente Teste Smoke ${Date.now()}`,
      cpfCnpj: '24971563792', // CPF válido para teste
      email: `teste-${Date.now()}@asaas.com`,
      phone: '4738010919',
      mobilePhone: '47998781877',
      postalCode: '01310-000',
      address: 'Av. Paulista',
      addressNumber: '1000',
      complement: 'Apto 123',
      province: 'Bela Vista'
    };

    console.log(`📝 Criando cliente: ${customerData.name}`);

    const response = await asaasClient.post('/customers', customerData);
    const customer = response.data;

    console.log(`✅ Cliente criado com sucesso!`);
    console.log(`   ID: ${customer.id}`);
    console.log(`   Nome: ${customer.name}`);
    console.log(`   CPF: ${customer.cpfCnpj}`);
    console.log(`   Email: ${customer.email}\n`);

    return { success: true, customerId: customer.id };
  } catch (error) {
    console.log('❌ FALHA:', error.response?.data?.errors?.[0]?.description || error.message);
    console.log('');
    return { success: false, error };
  }
}

// ============================================================
// TESTE 3: Criar Pagamento PIX
// ============================================================
async function test3_criarPagamentoPix(customerId) {
  console.log('💳 TESTE 3: Criar Pagamento PIX');
  console.log('-'.repeat(60));

  try {
    const paymentData = {
      customer: customerId,
      billingType: 'PIX',
      value: 10.00,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Teste de pagamento PIX - Smoke Test',
      externalReference: `SMOKE-PIX-${Date.now()}`
    };

    console.log(`📝 Criando cobrança PIX de R$ ${paymentData.value}`);

    // Criar pagamento
    const response = await asaasClient.post('/payments', paymentData);
    const payment = response.data;

    console.log(`✅ Cobrança PIX criada!`);
    console.log(`   ID: ${payment.id}`);
    console.log(`   Valor: R$ ${payment.value}`);
    console.log(`   Status: ${payment.status}`);
    console.log(`   Vencimento: ${payment.dueDate}`);

    // Gerar QR Code
    console.log('\n📱 Gerando QR Code PIX...');
    const qrResponse = await asaasClient.get(`/payments/${payment.id}/pixQrCode`);
    const pixData = qrResponse.data;

    console.log('✅ QR Code gerado!');
    console.log(`   Copia e cola disponível: SIM`);
    console.log(`   Payload PIX: ${pixData.payload.substring(0, 50)}...`);
    console.log(`   Validade: ${pixData.expirationDate || 'Padrão'}\n`);

    return { success: true, paymentId: payment.id, pixPayload: pixData.payload };
  } catch (error) {
    console.log('❌ FALHA:', error.response?.data?.errors?.[0]?.description || error.message);
    console.log('');
    return { success: false, error };
  }
}

// ============================================================
// TESTE 4: Criar Pagamento com Cartão
// ============================================================
async function test4_criarPagamentoCartao(customerId) {
  console.log('💳 TESTE 4: Criar Pagamento com Cartão');
  console.log('-'.repeat(60));

  try {
    const paymentData = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: 50.00,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Teste de pagamento com cartão - Smoke Test',
      externalReference: `SMOKE-CARD-${Date.now()}`,
      creditCard: {
        holderName: 'JOAO DA SILVA',
        number: '5162306219378829', // Cartão de teste Asaas (aprovado)
        expiryMonth: '12',
        expiryYear: '2030',
        ccv: '318'
      },
      creditCardHolderInfo: {
        name: 'JOAO DA SILVA',
        email: `teste-card-${Date.now()}@asaas.com`,
        cpfCnpj: '24971563792',
        postalCode: '01310-000',
        addressNumber: '1000',
        phone: '4738010919'
      },
      remoteIp: '192.168.1.1'
    };

    console.log(`📝 Processando pagamento de R$ ${paymentData.value}`);
    console.log(`   Cartão: **** **** **** 8829`);

    const response = await asaasClient.post('/payments', paymentData);
    const payment = response.data;

    console.log(`✅ Pagamento processado!`);
    console.log(`   ID: ${payment.id}`);
    console.log(`   Valor: R$ ${payment.value}`);
    console.log(`   Status: ${payment.status}`);
    console.log(`   Tipo: ${payment.billingType}\n`);

    return { success: true, paymentId: payment.id };
  } catch (error) {
    console.log('❌ FALHA:', error.response?.data?.errors?.[0]?.description || error.message);
    console.log('');
    return { success: false, error };
  }
}

// ============================================================
// TESTE 5: Criar Pré-Autorização (Caução)
// ============================================================
async function test5_criarPreAutorizacao(customerId) {
  console.log('🔒 TESTE 5: Criar Pré-Autorização (Caução)');
  console.log('-'.repeat(60));

  try {
    const preAuthData = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: 100.00,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Caução - Smoke Test',
      externalReference: `SMOKE-PREAUTH-${Date.now()}`,
      authorizeOnly: true, // Esta flag cria a pré-autorização
      creditCard: {
        holderName: 'JOAO DA SILVA',
        number: '5162306219378829',
        expiryMonth: '12',
        expiryYear: '2030',
        ccv: '318'
      },
      creditCardHolderInfo: {
        name: 'JOAO DA SILVA',
        email: `teste-preauth-${Date.now()}@asaas.com`,
        cpfCnpj: '24971563792',
        postalCode: '01310-000',
        addressNumber: '1000',
        phone: '4738010919'
      }
    };

    console.log(`📝 Criando pré-autorização de R$ ${preAuthData.value}`);

    const response = await asaasClient.post('/payments', preAuthData);
    const preAuth = response.data;

    console.log(`✅ Pré-autorização criada!`);
    console.log(`   ID: ${preAuth.id}`);
    console.log(`   Valor reservado: R$ ${preAuth.value}`);
    console.log(`   Status: ${preAuth.status}`);
    console.log(`   Tipo: Pré-autorização (não cobrado ainda)\n`);

    return { success: true, preAuthId: preAuth.id };
  } catch (error) {
    console.log('❌ FALHA:', error.response?.data?.errors?.[0]?.description || error.message);
    console.log('');
    return { success: false, error };
  }
}

// ============================================================
// TESTE 6: Consultar Pagamento
// ============================================================
async function test6_consultarPagamento(paymentId) {
  console.log('🔍 TESTE 6: Consultar Pagamento');
  console.log('-'.repeat(60));

  try {
    console.log(`📝 Consultando pagamento: ${paymentId}`);

    const response = await asaasClient.get(`/payments/${paymentId}`);
    const payment = response.data;

    console.log(`✅ Pagamento encontrado!`);
    console.log(`   ID: ${payment.id}`);
    console.log(`   Status: ${payment.status}`);
    console.log(`   Valor: R$ ${payment.value}`);
    console.log(`   Tipo: ${payment.billingType}`);
    console.log(`   Data de criação: ${new Date(payment.dateCreated).toLocaleString('pt-BR')}\n`);

    return { success: true, payment };
  } catch (error) {
    console.log('❌ FALHA:', error.response?.data?.errors?.[0]?.description || error.message);
    console.log('');
    return { success: false, error };
  }
}

// ============================================================
// EXECUTAR TODOS OS TESTES
// ============================================================
async function runAllTests() {
  console.log('🧪 Iniciando bateria de testes...\n');

  const results = {
    total: 6,
    passed: 0,
    failed: 0
  };

  // TESTE 1
  const test1 = await test1_verificarCredenciais();
  if (test1.success) results.passed++;
  else { results.failed++; return results; } // Se falhar, parar aqui

  // TESTE 2
  const test2 = await test2_criarCliente();
  if (test2.success) results.passed++;
  else { results.failed++; return results; }

  const customerId = test2.customerId;

  // TESTE 3
  const test3 = await test3_criarPagamentoPix(customerId);
  if (test3.success) results.passed++;
  else results.failed++;

  const pixPaymentId = test3.paymentId;

  // TESTE 4
  const test4 = await test4_criarPagamentoCartao(customerId);
  if (test4.success) results.passed++;
  else results.failed++;

  const cardPaymentId = test4.paymentId;

  // TESTE 5
  const test5 = await test5_criarPreAutorizacao(customerId);
  if (test5.success) results.passed++;
  else results.failed++;

  // TESTE 6 (consultar o pagamento PIX)
  if (pixPaymentId) {
    const test6 = await test6_consultarPagamento(pixPaymentId);
    if (test6.success) results.passed++;
    else results.failed++;
  } else {
    results.failed++;
  }

  return results;
}

// ============================================================
// MAIN
// ============================================================
runAllTests()
  .then((results) => {
    console.log('='.repeat(60));
    console.log('\n📊 RESULTADO DOS TESTES\n');
    console.log(`✅ Testes aprovados: ${results.passed}/${results.total}`);
    console.log(`❌ Testes falhados: ${results.failed}/${results.total}`);

    if (results.failed === 0) {
      console.log('\n🎉 SUCESSO! Todos os testes passaram!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  ATENÇÃO! Alguns testes falharam. Verifique os logs acima.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 ERRO CRÍTICO:', error.message);
    console.error('');
    process.exit(1);
  });
