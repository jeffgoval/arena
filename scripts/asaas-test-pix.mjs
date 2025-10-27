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

console.log('💸 TESTE COMPLETO DE PAGAMENTO PIX\n');
console.log('='.repeat(60));
console.log('\nEste script demonstra o fluxo completo de PIX:\n');
console.log('1. Criar cliente');
console.log('2. Gerar cobrança PIX');
console.log('3. Obter QR Code e copia-e-cola');
console.log('4. Simular pagamento (manual no painel)');
console.log('5. Consultar status\n');
console.log('='.repeat(60) + '\n');

async function main() {
  try {
    // ============================================================
    // PASSO 1: Criar Cliente
    // ============================================================
    console.log('👤 PASSO 1: Criar Cliente de Teste');
    console.log('-'.repeat(60));

    const customerData = {
      name: `Cliente PIX ${Date.now()}`,
      cpfCnpj: '24971563792',
      email: `pix-${Date.now()}@asaas.com`,
      mobilePhone: '47998781877'
    };

    const customerResponse = await asaasClient.post('/customers', customerData);
    const customerId = customerResponse.data.id;

    console.log(`✅ Cliente criado: ${customerId}`);
    console.log(`   Nome: ${customerResponse.data.name}\n`);

    // ============================================================
    // PASSO 2: Criar Cobrança PIX
    // ============================================================
    console.log('💳 PASSO 2: Criar Cobrança PIX');
    console.log('-'.repeat(60));

    const paymentData = {
      customer: customerId,
      billingType: 'PIX',
      value: 75.50,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Reserva de Quadra - Society',
      externalReference: `PIX-${Date.now()}`
    };

    console.log(`📝 Criando cobrança PIX de R$ ${paymentData.value}`);
    console.log(`   Descrição: ${paymentData.description}`);
    console.log(`   Vencimento: ${paymentData.dueDate}\n`);

    const paymentResponse = await asaasClient.post('/payments', paymentData);
    const paymentId = paymentResponse.data.id;

    console.log(`✅ Cobrança criada com sucesso!`);
    console.log(`   ID: ${paymentId}`);
    console.log(`   Status: ${paymentResponse.data.status}`);
    console.log(`   Valor: R$ ${paymentResponse.data.value}\n`);

    // ============================================================
    // PASSO 3: Gerar QR Code PIX
    // ============================================================
    console.log('📱 PASSO 3: Gerar QR Code PIX');
    console.log('-'.repeat(60));

    const qrCodeResponse = await asaasClient.get(`/payments/${paymentId}/pixQrCode`);
    const pixData = qrCodeResponse.data;

    console.log(`✅ QR Code PIX gerado!`);
    console.log(`   Validade: ${pixData.expirationDate}`);
    console.log(`\n📋 PIX COPIA E COLA:`);
    console.log('-'.repeat(60));
    console.log(pixData.payload);
    console.log('-'.repeat(60));

    console.log(`\n🎨 QR Code Base64 (primeiros 100 caracteres):`);
    console.log(pixData.encodedImage.substring(0, 100) + '...\n');

    // ============================================================
    // PASSO 4: Instruções para Simular Pagamento
    // ============================================================
    console.log('🔄 PASSO 4: Simular Pagamento');
    console.log('-'.repeat(60));
    console.log('\n⚠️  IMPORTANTE: Simule o pagamento no painel Asaas:\n');
    console.log('1. Acesse: https://sandbox.asaas.com');
    console.log('2. Vá em: Cobranças > Listar');
    console.log(`3. Busque o ID: ${paymentId}`);
    console.log('4. Clique em "Simular pagamento"');
    console.log('5. Confirme a simulação\n');

    console.log('💡 Ou use o payload PIX acima em um app bancário sandbox\n');

    // ============================================================
    // PASSO 5: Aguardar e Consultar Status
    // ============================================================
    console.log('⏳ PASSO 5: Monitorar Status do Pagamento');
    console.log('-'.repeat(60));
    console.log('\nConsultando status a cada 5 segundos...\n');

    let isPaid = false;
    let attempts = 0;
    const maxAttempts = 12; // 1 minuto total

    while (!isPaid && attempts < maxAttempts) {
      attempts++;

      // Aguardar 5 segundos
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Consultar status
      const statusResponse = await asaasClient.get(`/payments/${paymentId}`);
      const currentStatus = statusResponse.data.status;

      console.log(`[${attempts}/${maxAttempts}] Status: ${currentStatus}`);

      if (currentStatus === 'RECEIVED' || currentStatus === 'CONFIRMED') {
        isPaid = true;
        console.log('\n✅ PAGAMENTO RECEBIDO!\n');

        console.log('📊 Detalhes do Pagamento:');
        console.log('-'.repeat(60));
        console.log(`   ID: ${statusResponse.data.id}`);
        console.log(`   Status: ${currentStatus}`);
        console.log(`   Valor: R$ ${statusResponse.data.value}`);
        console.log(`   Valor Líquido: R$ ${statusResponse.data.netValue}`);
        console.log(`   Data Pagamento: ${statusResponse.data.paymentDate || 'Aguardando confirmação'}`);
        console.log(`   Data Confirmação: ${statusResponse.data.confirmedDate || 'Aguardando confirmação'}\n`);
      }
    }

    if (!isPaid) {
      console.log('\n⏰ Tempo limite atingido (1 minuto)');
      console.log('   Pagamento ainda não foi recebido\n');
      console.log('💡 Continue monitorando no painel Asaas ou execute o script novamente\n');
    }

    // ============================================================
    // RESUMO
    // ============================================================
    console.log('='.repeat(60));
    console.log('\n📋 RESUMO DO TESTE PIX:\n');
    console.log(`✅ Cliente criado: ${customerId}`);
    console.log(`✅ Cobrança PIX criada: ${paymentId}`);
    console.log(`✅ QR Code gerado: SIM`);
    console.log(`✅ Payload PIX: Disponível para cópia`);
    console.log(`${isPaid ? '✅' : '⏳'} Status do pagamento: ${isPaid ? 'PAGO' : 'PENDENTE'}\n`);

    if (isPaid) {
      console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!\n');
      console.log('💡 O webhook seria disparado neste momento em produção\n');
    } else {
      console.log('⚠️  Pagamento ainda pendente\n');
      console.log('💡 Simule o pagamento no painel e execute novamente para validar\n');
    }

    console.log('📚 Casos de uso validados:\n');
    console.log('   - Criar cobrança PIX');
    console.log('   - Gerar QR Code e copia-e-cola');
    console.log('   - Consultar status em tempo real');
    if (isPaid) {
      console.log('   - Receber confirmação de pagamento');
    }
    console.log('');

    process.exit(isPaid ? 0 : 1);
  } catch (error) {
    console.error('\n❌ ERRO:', error.response?.data?.errors?.[0]?.description || error.message);
    console.error('');
    process.exit(1);
  }
}

main();
