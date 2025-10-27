import { config } from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

console.log('🔍 Testando criação de cliente Asaas diretamente\n');

const apiKey = process.env.ASAAS_API_KEY;
const environment = process.env.ASAAS_ENVIRONMENT;

console.log('Configuração:');
console.log('  API Key:', apiKey ? `✅ ${apiKey.length} caracteres` : '❌ Não configurada');
console.log('  Ambiente:', environment || '❌ Não definido');
console.log('  Primeiros caracteres:', apiKey?.substring(0, 20) || 'N/A');
console.log();

if (!apiKey) {
  console.log('❌ ASAAS_API_KEY não está configurada!');
  process.exit(1);
}

const baseURL = environment === 'production'
  ? 'https://www.asaas.com/api/v3'
  : 'https://sandbox.asaas.com/api/v3';

console.log('🌐 Base URL:', baseURL);
console.log();

// Dados de teste do cliente (dados mínimos obrigatórios)
const clienteTesteDados = {
  name: 'Cliente Teste Debug ' + Date.now(),
  email: `teste-${Date.now()}@example.com`,
  cpfCnpj: '24971563792' // CPF válido de teste
};

console.log('📝 Tentando criar cliente com dados:');
console.log(JSON.stringify(clienteTesteDados, null, 2));
console.log();

try {
  const response = await axios.post(
    `${baseURL}/customers`,
    clienteTesteDados,
    {
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  console.log('✅ Cliente criado com sucesso!');
  console.log('   ID:', response.data.id);
  console.log('   Nome:', response.data.name);
  console.log('   Email:', response.data.email);
  console.log('   CPF:', response.data.cpfCnpj);
  console.log();
  console.log('📄 Resposta completa:');
  console.log(JSON.stringify(response.data, null, 2));

} catch (error) {
  console.log('❌ Erro ao criar cliente:\n');

  if (error.response) {
    // Erro da API
    console.log('Status:', error.response.status);
    console.log('Dados do erro:');
    console.log(JSON.stringify(error.response.data, null, 2));

    if (error.response.status === 401) {
      console.log('\n⚠️  Erro 401: API Key inválida ou expirada');
      console.log('   - Verifique se a chave está correta');
      console.log('   - Verifique se não está usando uma chave de produção no sandbox');
    } else if (error.response.status === 400) {
      console.log('\n⚠️  Erro 400: Dados inválidos');
      console.log('   - Verifique se o CPF está correto');
      console.log('   - Verifique se o email está no formato correto');
    }
  } else if (error.request) {
    // Erro de rede
    console.log('❌ Erro de rede - sem resposta do servidor');
    console.log('Detalhes:', error.message);
  } else {
    // Outro erro
    console.log('❌ Erro:', error.message);
  }

  console.log('\n📋 Stack trace:');
  console.log(error.stack);
}
