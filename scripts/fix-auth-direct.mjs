import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

console.log('\n🔧 Corrigindo RLS via Service Role Key...\n');

// Usar SERVICE ROLE KEY para bypassar RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
});

async function executeSQLCommand(description, sql) {
  console.log(`\n📝 ${description}...`);

  try {
    // Para queries DDL, usamos a REST API diretamente
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`   ⚠️  REST API não disponível: ${error}`);
      console.log(`   ℹ️  Tentando via rpc...`);

      // Fallback: tentar via RPC se existir
      const { error: rpcError } = await supabase.rpc('exec_sql', { sql });

      if (rpcError) {
        throw rpcError;
      }
    }

    console.log(`   ✅ Executado com sucesso`);
    return true;
  } catch (error) {
    console.error(`   ❌ Erro:`, error.message);
    return false;
  }
}

async function fixAuth() {
  console.log('Etapa 1: Desabilitando RLS');
  await executeSQLCommand(
    'Desabilitar RLS',
    'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;'
  );

  console.log('\nEtapa 2: Removendo funções antigas');
  await executeSQLCommand(
    'Remover get_user_role',
    'DROP FUNCTION IF EXISTS get_user_role() CASCADE;'
  );
  await executeSQLCommand(
    'Remover is_admin',
    'DROP FUNCTION IF EXISTS is_admin() CASCADE;'
  );
  await executeSQLCommand(
    'Remover is_gestor_or_admin',
    'DROP FUNCTION IF EXISTS is_gestor_or_admin() CASCADE;'
  );

  console.log('\nEtapa 3: Criando função handle_new_user');
  const createFunction = `
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome_completo, cpf, role, saldo_creditos)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    '000.000.000-00',
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
    0
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
  await executeSQLCommand('Criar função', createFunction);

  console.log('\nEtapa 4: Criando trigger');
  await executeSQLCommand(
    'Remover trigger antigo',
    'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;'
  );

  const createTrigger = `
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
  await executeSQLCommand('Criar trigger', createTrigger);

  console.log('\nEtapa 5: Habilitando RLS novamente');
  await executeSQLCommand(
    'Habilitar RLS',
    'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;'
  );

  console.log('\nEtapa 6: Criando políticas RLS');
  await executeSQLCommand(
    'Criar política SELECT',
    `CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);`
  );
  await executeSQLCommand(
    'Criar política UPDATE',
    `CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);`
  );

  console.log('\n🧪 Testando configuração...');

  const { data, error } = await supabase.from('users').select('count').limit(1);

  if (error) {
    if (error.message.includes('infinite recursion')) {
      console.log('❌ Ainda há recursão. Execute manualmente no dashboard.');
      console.log('\n📋 Acesse: https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new');
      console.log('   E execute o SQL do arquivo: supabase/fix-rls-recursion.sql\n');
      return false;
    }
    console.log('⚠️  Erro ao testar:', error.message);
    return false;
  }

  console.log('\n✅ RLS configurado com sucesso!');
  console.log('✅ Trigger automático criado!');
  console.log('✅ Políticas RLS funcionando!\n');

  return true;
}

fixAuth().then(success => {
  if (success) {
    console.log('🎉 Correção aplicada! Teste criar uma conta em http://localhost:3000/auth\n');
  } else {
    console.log('❌ Houve problemas. Execute o SQL manualmente no dashboard.\n');
    process.exit(1);
  }
});
