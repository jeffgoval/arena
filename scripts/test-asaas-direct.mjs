import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env' });

async function testAsaasDirect() {
  console.log('🔍 Testando integração com API Asaas (teste direto)...\n');
  
  // Verificar se as variáveis de ambiente estão configuradas
  const apiKey = process.env.ASAAS_API_KEY;
  const environment = process.env.ASAAS_ENVIRONMENT;
  
  if (!apiKey) {
    console.log('❌ Variável de ambiente ASAAS_API_KEY não configurada');
    return;
  }
  
  if (!environment) {
    console.log('❌ Variável de ambiente ASAAS_ENVIRONMENT não configurada');
    return;
  }
  
  console.log(`✅ Variável de ambiente ASAAS_API_KEY configurada (tamanho: ${apiKey.length} caracteres)`);
  console.log(`✅ Variável de ambiente ASAAS_ENVIRONMENT configurada: ${environment}`);
  
  const baseURL = environment === 'production' 
    ? 'https://www.asaas.com/api/v3' 
    : 'https://sandbox.asaas.com/api/v3';
    
  console.log(`\n🌐 URL da API: ${baseURL}`);
  
  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'access_token': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });
  
  console.log('\n💳 Testando criação de cliente no Asaas...');
  
  try {
    // Dados de teste do cliente
    const clienteData = {
      name: 'Cliente Teste Asaas',
      email: `teste-${Date.now()}@asaas.com`,
      cpfCnpj: '24971563792', // CPF de teste válido do Asaas
      phone: '(11) 99999-9999',
      mobilePhone: '(11) 99999-9999',
      postalCode: '01001000',
      address: 'Praça da Sé',
      addressNumber: '123',
      province: 'Sé',
      city: 'São Paulo',
      state: 'SP'
    };
    
    console.log('Dados do cliente:', JSON.stringify(clienteData, null, 2));
    
    const response = await api.post('/customers', clienteData);
    console.log(`\n✅ Cliente criado no Asaas com ID: ${response.data.id}`);
    console.log('\n✅ Teste de integração concluído com sucesso!');
    
  } catch (error) {
    console.log('❌ Erro na integração com Asaas:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Mensagem:', error.message);
      console.log('Stack:', error.stack);
    }
  }
}

testAsaasDirect().catch(console.error);