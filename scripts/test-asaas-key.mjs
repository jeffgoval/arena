import dotenv from 'dotenv';
import axios from 'axios';

// Carregar .env.local primeiro (prioridade do Next.js)
dotenv.config({ path: '.env.local' });

async function testAsaasKey() {
  console.log('🔍 Testando chave de API do Asaas...\n');
  
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
  
  // Testar autenticação
  console.log('\n🔐 Testando autenticação...');
  
  try {
    const response = await axios.get(`${baseURL}/customers`, {
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log(`✅ Autenticação bem-sucedida!`);
    console.log(`Total de clientes: ${response.data.totalCount || 0}`);
    
  } catch (error) {
    console.log('❌ Erro na autenticação:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Mensagem:', error.message);
    }
  }
}

testAsaasKey().catch(console.error);