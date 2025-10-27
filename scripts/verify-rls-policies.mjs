import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verificando se as RLS policies foram criadas...\n');

// Method 1: Check if we can query the table
console.log('1️⃣ Verificando acesso à tabela reservas...');
const { data: tableData, error: tableError } = await supabase
  .from('reservas')
  .select('id')
  .limit(1);

if (tableError) {
  console.error('❌ Erro ao acessar tabela:', tableError.message);
} else {
  console.log('✅ Tabela acessível via SERVICE_ROLE_KEY');
}

// Method 2: Try to get policy information via SQL query
console.log('\n2️⃣ Buscando informações sobre RLS da tabela...');

// Check if RLS is enabled
const checkRLSQuery = `
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'reservas';
`;

try {
  // Try raw SQL query
  const { data: rlsInfo, error: rlsError } = await supabase.rpc('exec_sql', { sql: checkRLSQuery });

  if (rlsError) {
    console.log('⚠️  Não foi possível executar SQL via RPC:', rlsError.message);
  } else {
    console.log('RLS Status:', rlsInfo);
  }
} catch (e) {
  console.log('⚠️  RPC exec_sql não disponível');
}

// Method 3: Pull schema from Supabase
console.log('\n3️⃣ Sugestão: Puxar schema remoto para verificar policies');
console.log('   Execute: supabase db pull\n');

// Method 4: Test with a real user
console.log('4️⃣ Testando acesso com usuário real...');

const { data: testUser } = await supabase
  .from('users')
  .select('id, email, role')
  .eq('role', 'cliente')
  .limit(1)
  .single();

if (testUser) {
  console.log(`   Usuário de teste: ${testUser.email} (${testUser.id})`);

  // Try to query as this user would (still with SERVICE_ROLE, but checking the data exists)
  const { data: userReservas, error: userError } = await supabase
    .from('reservas')
    .select('id, status, organizador_id')
    .eq('organizador_id', testUser.id);

  if (userError) {
    console.error('   ❌ Erro ao buscar reservas:', userError.message);
  } else {
    console.log(`   ✅ Usuário tem ${userReservas?.length || 0} reserva(s)`);

    if (userReservas && userReservas.length > 0) {
      console.log('\n   📊 Reservas encontradas:');
      userReservas.forEach((r, i) => {
        console.log(`      ${i + 1}. ID: ${r.id}, Status: ${r.status}`);
      });
    }
  }
}

// Method 5: Check migration history
console.log('\n5️⃣ Verificando histórico de migrações...');
const { data: migrations, error: migError } = await supabase
  .from('supabase_migrations')
  .select('*')
  .order('inserted_at', { ascending: false })
  .limit(5);

if (migError) {
  console.log('   ⚠️  Não foi possível acessar histórico:', migError.message);
} else if (migrations) {
  console.log('   Últimas migrações aplicadas:');
  migrations.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.name} (${new Date(m.inserted_at).toLocaleString('pt-BR')})`);
  });

  const rlsMigration = migrations.find(m => m.name?.includes('fix_reservas_rls'));
  if (rlsMigration) {
    console.log('\n   ✅ Migração fix_reservas_rls ENCONTRADA!');
    console.log('   Aplicada em:', new Date(rlsMigration.inserted_at).toLocaleString('pt-BR'));
  } else {
    console.log('\n   ❌ Migração fix_reservas_rls NÃO encontrada!');
    console.log('   Isso pode significar que o push falhou.');
  }
}

console.log('\n📋 Resumo:');
console.log('   Para confirmar que as policies estão ativas:');
console.log('   1. Execute: supabase db pull');
console.log('   2. Verifique o arquivo gerado em supabase/migrations/');
console.log('   3. Procure por "CREATE POLICY" para "reservas"');
console.log('\n   Se as policies não aparecerem, execute novamente:');
console.log('   echo "Y" | supabase db push --include-all');

console.log('\n✅ Verificação concluída!');
