import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

console.log('🔍 Simulando fluxo completo de compra de créditos\n');

// Verificar variáveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const asaasKey = process.env.ASAAS_API_KEY;

console.log('✅ Variáveis de ambiente:');
console.log('   Supabase URL:', supabaseUrl ? '✅' : '❌');
console.log('   Supabase Key:', supabaseKey ? '✅' : '❌');
console.log('   Asaas Key:', asaasKey ? `✅ (${asaasKey.length} chars)` : '❌');
console.log();

if (!supabaseUrl || !supabaseKey || !asaasKey) {
  console.log('❌ Variáveis de ambiente faltando!');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('📋 Buscando usuários para testar...\n');

try {
  // Buscar primeiro usuário com CPF
  const { data: usuarios, error: usuariosError } = await supabase
    .from('users')
    .select('*')
    .not('cpf', 'is', null)
    .limit(5);

  if (usuariosError) {
    console.log('❌ Erro ao buscar usuários:', usuariosError.message);
    process.exit(1);
  }

  console.log(`✅ Encontrados ${usuarios.length} usuários com CPF\n`);

  if (usuarios.length === 0) {
    console.log('⚠️  Nenhum usuário com CPF cadastrado');
    console.log('   Adicione um CPF a um usuário para testar');
    process.exit(0);
  }

  // Testar com primeiro usuário
  const usuario = usuarios[0];
  console.log('👤 Usuário de teste:');
  console.log('   ID:', usuario.id);
  console.log('   Nome:', usuario.nome_completo || 'N/A');
  console.log('   Email:', usuario.email || 'N/A');
  console.log('   CPF:', usuario.cpf || 'N/A');
  console.log('   WhatsApp:', usuario.whatsapp || 'N/A');
  console.log('   Endereço:', usuario.logradouro || 'N/A');
  console.log('   CEP:', usuario.cep || 'N/A');
  console.log('   Asaas Customer ID:', usuario.asaas_customer_id || 'N/A');
  console.log();

  // Verificar campos obrigatórios
  const camposFaltando = [];
  if (!usuario.cpf) camposFaltando.push('CPF');
  if (!usuario.email) camposFaltando.push('Email');
  if (!usuario.nome_completo && !usuario.email) camposFaltando.push('Nome');

  if (camposFaltando.length > 0) {
    console.log('⚠️  Campos obrigatórios faltando:', camposFaltando.join(', '));
    console.log('   Erro esperado na compra de créditos!');
  } else {
    console.log('✅ Todos os campos obrigatórios estão preenchidos');
  }

  // Verificar campos opcionais
  console.log('\n📋 Campos opcionais:');
  const opcionais = {
    'WhatsApp': usuario.whatsapp,
    'CEP': usuario.cep,
    'Logradouro': usuario.logradouro,
    'Número': usuario.numero,
    'Bairro': usuario.bairro,
    'Cidade': usuario.cidade,
    'Estado': usuario.estado
  };

  for (const [campo, valor] of Object.entries(opcionais)) {
    console.log(`   ${campo}: ${valor ? '✅ ' + valor : '⚠️  Não preenchido'}`);
  }

  console.log('\n💡 Recomendações:');
  if (!usuario.whatsapp) {
    console.log('   - Adicione WhatsApp para melhor comunicação');
  }
  if (!usuario.cep || !usuario.logradouro) {
    console.log('   - Complete o endereço para pagamentos com cartão');
  }

  console.log('\n🎯 Status do usuário:');
  if (camposFaltando.length === 0) {
    console.log('   ✅ Pronto para comprar créditos!');
  } else {
    console.log('   ❌ Precisa completar o perfil antes de comprar');
  }

} catch (error) {
  console.log('❌ Erro:', error.message);
  console.log(error.stack);
}
