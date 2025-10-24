import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAsaasIntegration() {
  console.log('🔍 Testando integração com API Asaas...\n');
  
  // Verificar se as variáveis de ambiente estão configuradas
  const requiredEnvVars = [
    'ASAAS_API_KEY',
    'ASAAS_ENVIRONMENT',
    'ASAAS_WEBHOOK_SECRET'
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
  
  // Testar criação de cliente de teste
  console.log('\n🧪 Testando criação de cliente...');
  
  try {
    // Criar um usuário de teste no banco
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .insert({
        nome_completo: 'Cliente Teste Asaas',
        email: 'teste@asaas.com',
        cpf: '12345678901',
        telefone: '(11) 99999-9999',
        cep: '01001000',
        endereco: 'Praça da Sé',
        numero: '123',
        bairro: 'Sé',
        cidade: 'São Paulo',
        estado: 'SP'
      })
      .select()
      .single();
      
    if (userError) {
      console.log('❌ Erro ao criar usuário de teste:', userError.message);
      return;
    }
    
    console.log(`✅ Usuário de teste criado: ${testUser.nome_completo}`);
    
    // Testar integração com pagamentoService
    const { pagamentoService } = await import('../src/services/pagamentoService.ts');
    
    // Criar cliente no Asaas
    const clienteData = {
      nome: testUser.nome_completo,
      email: testUser.email,
      cpf: testUser.cpf,
      telefone: testUser.telefone,
      cep: testUser.cep,
      endereco: testUser.endereco,
      numero: testUser.numero,
      bairro: testUser.bairro,
      cidade: testUser.cidade,
      estado: testUser.estado
    };
    
    console.log('\n💳 Testando criação de cliente no Asaas...');
    
    try {
      const customerId = await pagamentoService.criarOuAtualizarCliente(clienteData);
      console.log(`✅ Cliente criado no Asaas com ID: ${customerId}`);
      
      // Testar criação de pagamento PIX
      console.log('\n📱 Testando criação de pagamento PIX...');
      
      const dadosPagamento = {
        clienteId: customerId,
        valor: 10.00,
        dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vence amanhã
        descricao: 'Pagamento de teste - Integração Asaas',
        referencia: `TESTE_${Date.now()}`
      };
      
      const resultadoPix = await pagamentoService.criarPagamentoPix(dadosPagamento);
      
      if (resultadoPix.sucesso) {
        console.log('✅ Pagamento PIX criado com sucesso');
        console.log(`   ID: ${resultadoPix.dados.id}`);
        console.log(`   Valor: R$ ${resultadoPix.dados.valor}`);
        console.log(`   Status: ${resultadoPix.dados.status}`);
        console.log(`   Link: ${resultadoPix.dados.linkPagamento}`);
      } else {
        console.log('❌ Erro ao criar pagamento PIX:', resultadoPix.erro);
      }
      
      // Testar criação de pré-autorização (caução)
      console.log('\n🔒 Testando criação de pré-autorização (caução)...');
      
      const dadosPreAuth = {
        clienteId: customerId,
        valor: 50.00,
        descricao: 'Pré-autorização de teste - Caução',
        referencia: `PREAUTH_TESTE_${Date.now()}`,
        dadosCartao: {
          nomePortador: 'CLIENTE TESTE',
          numero: '4111111111111111', // Cartão de teste da Cielo
          mesVencimento: '12',
          anoVencimento: '2027',
          codigoSeguranca: '123'
        },
        dadosPortadorCartao: {
          nome: testUser.nome_completo,
          email: testUser.email,
          cpf: testUser.cpf,
          cep: testUser.cep,
          numero: testUser.numero,
          complemento: testUser.complemento || '',
          telefone: testUser.telefone,
          celular: testUser.telefone
        }
      };
      
      const resultadoPreAuth = await pagamentoService.criarPreAutorizacao(dadosPreAuth);
      
      if (resultadoPreAuth.sucesso) {
        console.log('✅ Pré-autorização criada com sucesso');
        console.log(`   ID: ${resultadoPreAuth.dados.id}`);
        console.log(`   Valor: R$ ${resultadoPreAuth.dados.valor}`);
        console.log(`   Status: ${resultadoPreAuth.dados.status}`);
      } else {
        console.log('❌ Erro ao criar pré-autorização:', resultadoPreAuth.erro);
      }
      
      // Limpar usuário de teste
      await supabase
        .from('users')
        .delete()
        .eq('id', testUser.id);
        
      console.log('\n✅ Usuário de teste removido');
      
    } catch (error) {
      console.log('❌ Erro na integração com Asaas:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Erro no teste de integração:', error.message);
  }
  
  console.log('\n🏁 Teste de integração concluído');
}

testAsaasIntegration().catch(console.error);