import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🧪 Testando criação de cliente Asaas (modo simples)...\n');

async function test() {
  const { pagamentoService } = await import('../src/services/pagamentoService.ts');

  const clienteData = {
    nome: 'Cliente Teste Arena',
    email: `teste-${Date.now()}@arena.com`,
    cpf: '24971563792', // CPF válido de teste
    telefone: '(31) 99999-9999',
    celular: '(31) 99999-9999',
    cep: '30130-100',
    endereco: 'Av Afonso Pena',
    numero: '1000',
    bairro: 'Centro',
    cidade: 'Belo Horizonte',
    estado: 'MG'
  };

  try {
    console.log('📋 Dados do cliente:', clienteData);
    console.log('\n💳 Criando cliente no Asaas...');

    const customerId = await pagamentoService.criarOuAtualizarCliente(clienteData);

    console.log(`\n✅ SUCESSO! Cliente criado com ID: ${customerId}`);
    console.log('\n✅ O erro "Erro ao criar cliente no sistema de pagamento" foi RESOLVIDO!');
  } catch (error) {
    console.error('\n❌ Erro ao criar cliente:', error.message);
    console.error('\nDetalhes:', error);
  }
}

test();
