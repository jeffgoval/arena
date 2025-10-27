import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env' });

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Configurada' : '✗ Não configurada');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ Configurada' : '✗ Não configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAsaasIntegration() {
  console.log('🔍 Testando integração com API Asaas...\n');
  
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
  
  // Testar criação de cliente de teste
  console.log('\n🧪 Testando criação de cliente...');
  
  try {
    // Criar um usuário de teste no banco
    const testUserId = randomUUID();
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        nome_completo: 'Cliente Teste Asaas',
        email: `teste-${Date.now()}@asaas.com`,
        cpf: '24971563792', // CPF de teste válido do Asaas
        whatsapp: '(11) 99999-9999',
        cep: '01001000',
        logradouro: 'Praça da Sé',
        numero: '123',
        bairro: 'Sé',
        cidade: 'São Paulo',
        estado: 'SP',
        role: 'cliente'
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
      telefone: testUser.whatsapp,
      celular: testUser.whatsapp,
      cep: testUser.cep,
      endereco: testUser.logradouro,
      numero: testUser.numero,
      bairro: testUser.bairro,
      cidade: testUser.cidade,
      estado: testUser.estado
    };
    
    console.log('\n💳 Testando criação de cliente no Asaas...');
    
    try {
      const customerId = await pagamentoService.criarOuAtualizarCliente(clienteData);
      console.log(`✅ Cliente criado no Asaas com ID: ${customerId}`);
      
      // Limpar usuário de teste
      await supabase
        .from('users')
        .delete()
        .eq('id', testUser.id);
        
      console.log('\n✅ Usuário de teste removido');
      console.log('\n✅ Teste de integração concluído com sucesso!');
      
    } catch (error) {
      console.log('❌ Erro na integração com Asaas:', error.message);
      console.log('Stack:', error.stack);
      
      // Limpar usuário de teste mesmo em caso de erro
      await supabase
        .from('users')
        .delete()
        .eq('id', testUser.id);
    }
    
  } catch (error) {
    console.log('❌ Erro no teste de integração:', error.message);
  }
}

testAsaasIntegration().catch(console.error);