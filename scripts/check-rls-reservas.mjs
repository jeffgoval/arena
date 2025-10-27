import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔒 Verificando RLS policies da tabela "reservas"...\n');

// Tentar via query SQL direta
const { data, error } = await supabase
  .from('reservas')
  .select('*')
  .limit(0); // Não precisamos de dados, só queremos ver se a tabela existe

console.log('1. Verificação de acesso à tabela:', error ? '❌ Erro' : '✅ OK');

if (error) {
  console.log('   Erro:', error.message);
}

// Verificar configuração do RLS
console.log('\n2. Tentando verificar se RLS está habilitado...');

// Criar query SQL para verificar RLS
const sqlQuery = `
  SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
  FROM pg_tables
  WHERE tablename = 'reservas';
`;

const { data: rlsStatus, error: rlsError } = await supabase.rpc('exec_sql', { sql: sqlQuery });

if (rlsError) {
  console.log('❌ Não foi possível executar SQL via RPC:', rlsError.message);
  console.log('   Isso pode significar que a função exec_sql não existe.');
} else {
  console.log('✅ Status do RLS:', rlsStatus);
}

// Tentar método alternativo: verificar se conseguimos selecionar policies
console.log('\n3. Buscando informações sobre as policies...');

// Usar informações do information_schema
const schemaQuery = `
  SELECT
    table_catalog,
    table_schema,
    table_name,
    privilege_type
  FROM information_schema.table_privileges
  WHERE table_name = 'reservas'
  AND grantee = 'authenticated'
  LIMIT 10;
`;

const { data: privileges, error: privError } = await supabase.rpc('exec_sql', { sql: schemaQuery });

if (privError) {
  console.log('❌ Não foi possível buscar privilégios:', privError.message);
} else {
  console.log('✅ Privilégios da role "authenticated":', privileges);
}

// Verificação prática: tentar selecionar reservas como um usuário autenticado
console.log('\n4. Teste prático: buscar reservas como organizador...');

// Buscar um usuário cliente real
const { data: cliente } = await supabase
  .from('users')
  .select('id, nome_completo, email, role')
  .eq('role', 'cliente')
  .limit(1)
  .single();

if (cliente) {
  console.log(`   Usando cliente: ${cliente.nome_completo} (${cliente.id})`);

  // Tentar buscar reservas desse cliente
  const { data: reservasCliente, error: reservasError } = await supabase
    .from('reservas')
    .select('*')
    .eq('organizador_id', cliente.id);

  if (reservasError) {
    console.log('   ❌ Erro ao buscar reservas:', reservasError.message);
    console.log('   Code:', reservasError.code);
    console.log('   Details:', reservasError.details);
    console.log('   Hint:', reservasError.hint);
  } else {
    console.log(`   ✅ Encontradas ${reservasCliente?.length || 0} reservas`);
  }
} else {
  console.log('   ❌ Nenhum cliente encontrado para teste');
}

console.log('\n5. Recomendação:');
console.log('   Se o RLS está bloqueando SELECTs, você precisa criar uma policy:');
console.log('   ');
console.log('   CREATE POLICY "Clientes podem ver suas próprias reservas"');
console.log('   ON reservas FOR SELECT');
console.log('   TO authenticated');
console.log('   USING (organizador_id = auth.uid());');
console.log('   ');
console.log('   Ou para permitir que participantes também vejam:');
console.log('   ');
console.log('   CREATE POLICY "Usuarios podem ver reservas que participam"');
console.log('   ON reservas FOR SELECT');
console.log('   TO authenticated');
console.log('   USING (');
console.log('     organizador_id = auth.uid()');
console.log('     OR EXISTS (');
console.log('       SELECT 1 FROM reserva_participantes');
console.log('       WHERE reserva_id = reservas.id');
console.log('       AND user_id = auth.uid()');
console.log('     )');
console.log('   );');

console.log('\n✅ Verificação concluída!');
