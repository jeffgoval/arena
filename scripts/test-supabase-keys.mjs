import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔑 Testando chaves do Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não encontrada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Erro: Variáveis de ambiente não configuradas corretamente\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📡 Testando conexão...');

    // Teste 1: Verificar se consegue fazer uma query simples
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('\n❌ Erro ao conectar:', error.message);

      if (error.message.includes('Invalid API key')) {
        console.log('\n💡 Solução: Verifique se as chaves no .env.local estão corretas');
        console.log('   Acesse: https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/settings/api');
      }

      return false;
    }

    console.log('✅ Conexão estabelecida com sucesso!');

    // Teste 2: Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.log('\n⚠️  Nenhum usuário autenticado (normal em testes)');
    } else if (user) {
      console.log('✅ Usuário autenticado:', user.email);
    } else {
      console.log('ℹ️  Sem usuário autenticado (esperado)');
    }

    return true;

  } catch (err) {
    console.error('\n❌ Erro inesperado:', err.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n✅ Todas as chaves estão funcionando corretamente!\n');
  } else {
    console.log('\n❌ Há problemas com as chaves do Supabase\n');
    process.exit(1);
  }
});
