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

console.log('🔒 TESTE DE CAPTURA DE PRÉ-AUTORIZAÇÃO (CAUÇÃO)\n');
console.log('='.repeat(60));
console.log('\nEste script demonstra o fluxo completo de caução:\n');
console.log('1. Criar cliente');
console.log('2. Criar pré-autorização (reservar valor)');
console.log('3. Capturar parcialmente (cobrar danos)');
console.log('4. Verificar saldo liberado\n');
console.log('='.repeat(60) + '\n');

async function main() {
  try {
    // ============================================================
    // PASSO 1: Criar Cliente
    // ============================================================
    console.log('👤 PASSO 1: Criar Cliente de Teste');
    console.log('-'.repeat(60));

    const customerData = {
      name: `Cliente Caução ${Date.now()}`,
      cpfCnpj: '24971563792',
      email: `caucao-${Date.now()}@asaas.com`,
      mobilePhone: '47998781877'
    };

    const customerResponse = await asaasClient.post('/customers', customerData);
    const customerId = customerResponse.data.id;

    console.log(`✅ Cliente criado: ${customerId}`);
    console.log(`   Nome: ${customerResponse.data.name}\n`);

    // ============================================================
    // PASSO 2: Criar Pré-Autorização
    // ============================================================
    console.log('🔐 PASSO 2: Criar Pré-Autorização (Reservar R$ 100,00)');
    console.log('-'.repeat(60));

    const preAuthData = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: 100.00,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Caução - Reserva de Quadra',
      externalReference: `PREAUTH-${Date.now()}`,
      authorizeOnly: true, // IMPORTANTE: Apenas pré-autoriza, não cobra
      creditCard: {
        holderName: 'JOAO DA SILVA',
        number: '5162306219378829', // Cartão de teste Asaas
        expiryMonth: '12',
        expiryYear: '2030',
        ccv: '318'
      },
      creditCardHolderInfo: {
        name: 'JOAO DA SILVA',
        email: `holder-${Date.now()}@asaas.com`,
        cpfCnpj: '24971563792',
        postalCode: '01310-000',
        addressNumber: '1000',
        phone: '4738010919'
      }
    };

    const preAuthResponse = await asaasClient.post('/payments', preAuthData);
    const preAuthId = preAuthResponse.data.id;
    const preAuthStatus = preAuthResponse.data.status;

    console.log(`✅ Pré-autorização criada: ${preAuthId}`);
    console.log(`   Status: ${preAuthStatus}`);
    console.log(`   Valor reservado: R$ ${preAuthResponse.data.value}`);
    console.log(`   ⚠️  Cliente NÃO foi cobrado ainda!\n`);

    // Aguardar um pouco para garantir processamento
    console.log('⏳ Aguardando processamento (2 segundos)...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ============================================================
    // PASSO 3: Capturar Parcialmente
    // ============================================================
    console.log('💰 PASSO 3: Capturar Parcialmente (R$ 30,00 - Danos)');
    console.log('-'.repeat(60));
    console.log('Cenário: Cliente causou R$ 30,00 em danos.');
    console.log('Vamos capturar apenas esse valor e liberar o resto.\n');

    const captureData = {
      value: 30.00 // Capturar apenas R$ 30 dos R$ 100 pré-autorizados
    };

    const captureResponse = await asaasClient.post(
      `/payments/${preAuthId}/captureAuthorizedPayment`,
      captureData
    );

    const capturedPayment = captureResponse.data;

    console.log(`✅ Captura realizada com sucesso!`);
    console.log(`   ID do pagamento: ${capturedPayment.id}`);
    console.log(`   Valor COBRADO: R$ ${capturedPayment.value}`);
    console.log(`   Valor LIBERADO: R$ ${100.00 - capturedPayment.value}`);
    console.log(`   Status: ${capturedPayment.status}`);
    console.log(`   Tipo: ${capturedPayment.billingType}\n`);

    // ============================================================
    // PASSO 4: Consultar Status Final
    // ============================================================
    console.log('🔍 PASSO 4: Consultar Status Final');
    console.log('-'.repeat(60));

    const statusResponse = await asaasClient.get(`/payments/${capturedPayment.id}`);
    const finalPayment = statusResponse.data;

    console.log(`📊 Status Final do Pagamento:`);
    console.log(`   ID: ${finalPayment.id}`);
    console.log(`   Status: ${finalPayment.status}`);
    console.log(`   Valor: R$ ${finalPayment.value}`);
    console.log(`   Valor Líquido: R$ ${finalPayment.netValue}`);
    console.log(`   Data Confirmação: ${finalPayment.confirmedDate || 'Aguardando'}`);
    console.log(`   Cliente: ${finalPayment.customer}\n`);

    // ============================================================
    // RESUMO
    // ============================================================
    console.log('='.repeat(60));
    console.log('\n📋 RESUMO DO FLUXO DE CAUÇÃO:\n');
    console.log(`✅ Cliente criado: ${customerId}`);
    console.log(`✅ Pré-autorização criada: ${preAuthId} (R$ 100,00 reservados)`);
    console.log(`✅ Captura parcial: ${capturedPayment.id} (R$ 30,00 cobrados)`);
    console.log(`✅ Valor liberado: R$ 70,00`);
    console.log(`✅ Status final: ${finalPayment.status}`);
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!\n');
    console.log('💡 Este fluxo simula:\n');
    console.log('   - Reserva de quadra com caução de R$ 100');
    console.log('   - Cliente causou R$ 30 em danos');
    console.log('   - Arena cobrou os R$ 30 e liberou R$ 70');
    console.log('   - Cliente pagou apenas o que danificou\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO:', error.response?.data?.errors?.[0]?.description || error.message);
    console.error('');
    process.exit(1);
  }
}

main();
