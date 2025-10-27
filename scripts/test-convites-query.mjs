import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testando criação de cliente Asaas direto...\n');

const API_KEY = process.env.ASAAS_API_KEY;
const BASE_URL = process.env.ASAAS_ENVIRONMENT === 'production'
  ? 'https://www.asaas.com/api/v3'
  : 'https://sandbox.asaas.com/api/v3';

console.log('📋 Configuração:');
console.log(`  - Environment: ${process.env.ASAAS_ENVIRONMENT || 'sandbox'}`);
console.log(`  - Base URL: ${BASE_URL}`);
console.log(`  - API Key: ${API_KEY ? '✅ Configurada' : '❌ Não configurada'}\n`);

async function testCreateCustomer() {
  const customerData = {
    name: 'Cliente Teste Arena',
    email: `teste-${Date.now()}@arena.com`,
    cpfCnpj: '24971563792'
    // Campos opcionais removidos para teste mínimo
  };

  try {
    console.log('💳 Criando cliente no Asaas...');
    console.log('Dados:', JSON.stringify(customerData, null, 2), '\n');

    const response = await axios.post(`${BASE_URL}/customers`, customerData, {
      headers: {
        'access_token': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SUCESSO! Cliente criado!');
    console.log(`  - ID: ${response.data.id}`);
    console.log(`  - Nome: ${response.data.name}`);
    console.log(`  - Email: ${response.data.email}`);
    console.log(`  - CPF: ${response.data.cpfCnpj}`);
    console.log('\n✅ O problema foi RESOLVIDO! A API Asaas está funcionando corretamente.');
    console.log('\n📝 Agora teste a compra de créditos na aplicação!');

    return response.data;
  } catch (error) {
    console.error('❌ ERRO ao criar cliente:');
    if (error.response) {
      console.error(`  - Status: ${error.response.status}`);
      console.error(`  - Dados:`, error.response.data);
    } else {
      console.error(`  - Mensagem: ${error.message}`);
    }
    throw error;
  }
}

testCreateCustomer();
