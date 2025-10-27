import axios from 'axios';

console.log('🔍 Testando API local do Next.js\n');

const baseURL = 'http://localhost:3000';

try {
  console.log('1️⃣ Testando endpoint de ambiente (/api/test-env)...\n');

  const envResponse = await axios.get(`${baseURL}/api/test-env`, {
    timeout: 10000
  });

  console.log('📋 Variáveis de ambiente no servidor Next.js:');
  console.log(JSON.stringify(envResponse.data, null, 2));
  console.log();

  // Verificar se ASAAS_API_KEY está carregada
  if (!envResponse.data.asaas_api_key_exists) {
    console.log('❌ PROBLEMA IDENTIFICADO!');
    console.log('   A variável ASAAS_API_KEY não está carregada no Next.js');
    console.log('\n🔧 SOLUÇÃO:');
    console.log('   1. Pare o servidor Next.js (Ctrl+C)');
    console.log('   2. Execute: npm run dev');
    console.log('   3. Aguarde o servidor iniciar completamente');
    console.log('   4. Tente comprar créditos novamente');
    process.exit(1);
  }

  if (envResponse.data.asaas_api_key_length !== 166) {
    console.log('⚠️  AVISO: Tamanho da API key diferente do esperado');
    console.log(`   Esperado: 166 caracteres`);
    console.log(`   Recebido: ${envResponse.data.asaas_api_key_length} caracteres`);
    console.log('   A chave pode estar truncada ou incorreta');
  } else {
    console.log('✅ ASAAS_API_KEY está carregada corretamente!');
    console.log(`   Comprimento: ${envResponse.data.asaas_api_key_length} caracteres`);
    console.log(`   Prefixo: ${envResponse.data.asaas_api_key_prefix}`);
    console.log(`   Ambiente: ${envResponse.data.asaas_environment}`);
  }

  console.log('\n✅ Servidor Next.js está configurado corretamente!');
  console.log('   Se ainda houver erro, verifique:');
  console.log('   - Se o usuário tem CPF cadastrado');
  console.log('   - Se o usuário tem email válido');
  console.log('   - Os logs do servidor Next.js para mais detalhes');

} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.log('❌ Servidor Next.js não está rodando!');
    console.log('\n🔧 SOLUÇÃO:');
    console.log('   Execute: npm run dev');
    console.log('   Depois execute este script novamente');
  } else {
    console.log('❌ Erro ao testar API:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
    }
  }
  process.exit(1);
}
