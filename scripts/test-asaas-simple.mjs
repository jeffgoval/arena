import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function testAsaasSimple() {
  console.log('🔍 Testando integração com API Asaas (teste simples)...\n');
  
  // Verificar se as variáveis de ambiente estão configuradas
  const requiredEnvVars = [
    'ASAAS_API_KEY',
    'ASAAS_ENVIRONMENT'
  ];
  
  let allEnvVarsPresent = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`❌ Variável de ambiente ${envVar} não configurada`);
      allEnvVarsPresent = false;
    } else {
      console.log(`✅ Variável de ambiente ${envVar} configurada`);
    }
  }
  
  if (!allEnvVarsPresent) {
    console.log('\n⚠️  Configure todas as variáveis de ambiente antes de continuar');
    return;
  }
  
  console.log('\n💳 Testando criação de cliente no Asaas...');
  
  try {
    // Importar o serviço de pagamento
    const { pagamentoService } = await import('../src/services/pagamentoService.ts');
    
    // Dados de teste do cliente
    const clienteData = {
      nome: 'Cliente Teste Asaas',
      email: `teste-${Date.now()}@asaas.com`,
      cpf: '24971563792', // CPF de teste válido do Asaas
      telefone: '(11) 99999-9999',
      celular: '(11) 99999-9999',
      cep: '01001000',
      endereco: 'Praça da Sé',
      numero: '123',
      bairro: 'Sé',
      cidade: 'São Paulo',
      estado: 'SP'
    };
    
    console.log('Dados do cliente:', clienteData);
    
    const customerId = await pagamentoService.criarOuAtualizarCliente(clienteData);
    console.log(`✅ Cliente criado no Asaas com ID: ${customerId}`);
    console.log('\n✅ Teste de integração concluído com sucesso!');
    
  } catch (error) {
    console.log('❌ Erro na integração com Asaas:', error.message);
    console.log('Stack:', error.stack);
  }
}

testAsaasSimple().catch(console.error);