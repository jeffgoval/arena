import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCompraFlow() {
  console.log('🧪 Testando fluxo completo de compra de créditos...\n');

  // 1. Buscar um usuário real
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'cliente')
    .limit(1);

  if (userError || !users || users.length === 0) {
    console.error('❌ Erro ao buscar usuário:', userError?.message || 'Nenhum cliente encontrado');
    return;
  }

  const usuario = users[0];
  console.log('👤 Usuário encontrado:', {
    id: usuario.id,
    nome: usuario.nome_completo,
    email: usuario.email,
    cpf: usuario.cpf,
    whatsapp: usuario.whatsapp,
    asaas_customer_id: usuario.asaas_customer_id
  });

  // 2. Testar criação de cliente (igual ao código da API)
  console.log('\n💳 Testando criação de cliente Asaas...');

  const { pagamentoService } = await import('../src/services/pagamentoService.ts');

  try {
    const asaasCustomerId = usuario.asaas_customer_id || undefined;

    const clienteAsaasId = await pagamentoService.criarOuAtualizarCliente({
      id: asaasCustomerId,
      nome: usuario.nome_completo || usuario.email,
      email: usuario.email,
      telefone: '',
      celular: '',
      cpf: usuario.cpf,
      cep: usuario.cep || '',
      endereco: usuario.logradouro || '',
      numero: usuario.numero || '',
      complemento: usuario.complemento || '',
      bairro: usuario.bairro || '',
      cidade: usuario.cidade || '',
      estado: usuario.estado || ''
    });

    console.log('✅ Cliente criado/atualizado com sucesso!');
    console.log(`  - ID: ${clienteAsaasId}`);

    // 3. Salvar ID se for novo
    if (!asaasCustomerId && clienteAsaasId) {
      console.log('\n💾 Salvando ID do cliente no banco...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ asaas_customer_id: clienteAsaasId })
        .eq('id', usuario.id);

      if (updateError) {
        console.error('❌ Erro ao salvar ID:', updateError.message);
      } else {
        console.log('✅ ID salvo com sucesso!');
      }
    }

    console.log('\n✅ TUDO FUNCIONANDO! O erro foi resolvido.');
    console.log('📝 Tente comprar créditos novamente na aplicação.');

  } catch (error) {
    console.error('\n❌ ERRO ao criar cliente:');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('\n🔍 Este é o erro que está aparecendo na aplicação!');
  }
}

testCompraFlow();
