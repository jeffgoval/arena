import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('\n🧪 Testando fluxo de signup...\n');

async function testSignup() {
  const testEmail = `teste_${Date.now()}@exemplo.com`;
  const testPassword = 'teste123456';

  console.log('📧 Email de teste:', testEmail);
  console.log('🔑 Senha de teste:', testPassword);

  console.log('\n1️⃣ Criando usuário no Supabase Auth...');

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        nome_completo: 'Teste Usuario',
        role: 'cliente',
      }
    }
  });

  if (authError) {
    console.log('❌ Erro no signup:', authError.message);
    return false;
  }

  if (!authData.user) {
    console.log('❌ Usuário não foi criado');
    return false;
  }

  console.log('✅ Usuário criado no Auth:', authData.user.id);

  // Aguardar trigger executar
  console.log('\n⏳ Aguardando trigger criar perfil...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n2️⃣ Verificando se o perfil foi criado na tabela users...');

  // Usar Service Role Key para verificar
  const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.log('❌ Erro ao buscar perfil:', profileError.message);
    console.log('\n⚠️  O trigger pode não estar configurado!');
    console.log('   Execute o SQL manualmente no Supabase Dashboard.');
    return false;
  }

  if (!profile) {
    console.log('❌ Perfil não foi criado automaticamente');
    console.log('\n⚠️  O trigger NÃO está funcionando!');
    return false;
  }

  console.log('✅ Perfil criado automaticamente:', profile);

  console.log('\n3️⃣ Limpando usuário de teste...');

  // Deletar usuário de teste
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    authData.user.id
  );

  if (deleteError) {
    console.log('⚠️  Não foi possível deletar usuário de teste:', deleteError.message);
  } else {
    console.log('✅ Usuário de teste removido');
  }

  console.log('\n🎉 SUCESSO! O fluxo de signup está funcionando!\n');
  return true;
}

testSignup().then(success => {
  if (!success) {
    console.log('\n❌ Há problemas no fluxo de signup.');
    console.log('📋 Execute o SQL manualmente em:');
    console.log('   https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new\n');
    process.exit(1);
  }
});
