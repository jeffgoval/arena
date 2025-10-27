import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 DEBUG: Verificando reserva e usuário...\n');

// 1. Buscar a reserva mais recente
console.log('📋 1. Buscando reserva mais recente...');
const { data: reserva, error: reservaError } = await supabase
  .from('reservas')
  .select(`
    id,
    data,
    status,
    valor_total,
    organizador_id,
    created_at,
    quadra:quadras(nome)
  `)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

if (reservaError) {
  console.log('❌ Erro ao buscar reserva:', reservaError.message);
  process.exit(1);
}

console.log('✅ Reserva encontrada:', {
  id: reserva.id,
  data: reserva.data,
  status: reserva.status,
  valor: reserva.valor_total,
  quadra: reserva.quadra?.nome,
  organizador_id: reserva.organizador_id,
  criada_em: new Date(reserva.created_at).toLocaleString('pt-BR')
});

// 2. Buscar dados do organizador
console.log('\n👤 2. Buscando dados do organizador...');
const { data: organizador, error: orgError } = await supabase
  .from('users')
  .select('id, nome_completo, email, role')
  .eq('id', reserva.organizador_id)
  .single();

if (orgError) {
  console.log('❌ Erro ao buscar organizador:', orgError.message);
} else {
  console.log('✅ Organizador encontrado:', {
    id: organizador.id,
    nome: organizador.nome_completo,
    email: organizador.email,
    role: organizador.role
  });
}

// 3. Buscar todos os usuários com role cliente
console.log('\n👥 3. Listando todos os usuários com role "cliente"...');
const { data: clientes, error: clientesError } = await supabase
  .from('users')
  .select('id, nome_completo, email, role')
  .eq('role', 'cliente');

if (clientesError) {
  console.log('❌ Erro ao buscar clientes:', clientesError.message);
} else {
  console.log(`✅ ${clientes.length} cliente(s) encontrado(s):`);
  clientes.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.nome_completo} (${c.email})`);
    console.log(`      ID: ${c.id}`);
    console.log(`      ${c.id === reserva.organizador_id ? '✅ É O ORGANIZADOR!' : '❌ Não é o organizador'}`);
  });
}

// 4. Verificar RLS policies
console.log('\n🔒 4. Verificando políticas RLS da tabela "reservas"...');
const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
  sql: `
    SELECT
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE tablename = 'reservas'
    ORDER BY policyname;
  `
});

if (policiesError) {
  console.log('❌ Erro ao buscar policies (RPC pode não existir):', policiesError.message);

  // Tentar método alternativo
  console.log('\n🔄 Tentando método alternativo via query direta...');
  const { data: altPolicies, error: altError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'reservas');

  if (altError) {
    console.log('❌ Também falhou:', altError.message);
  } else {
    console.log('✅ Policies encontradas:', altPolicies);
  }
} else {
  console.log('✅ Policies encontradas:');
  if (policies && policies.length > 0) {
    policies.forEach(p => {
      console.log(`\n   Policy: ${p.policyname}`);
      console.log(`   Comando: ${p.cmd}`);
      console.log(`   Roles: ${p.roles}`);
      console.log(`   Condição: ${p.qual || 'N/A'}`);
    });
  } else {
    console.log('   Nenhuma policy encontrada.');
  }
}

// 5. Testar query como seria feita pelo hook (simulando)
console.log('\n🧪 5. Testando query simulada (como o hook faria)...');
console.log(`   Buscando reservas onde organizador_id = ${reserva.organizador_id}`);
const { data: testQuery, error: testError } = await supabase
  .from('reservas')
  .select(`
    id,
    data,
    status,
    valor_total,
    organizador:users!reservas_organizador_id_fkey(id, nome_completo),
    quadra:quadras(id, nome, tipo)
  `)
  .eq('organizador_id', reserva.organizador_id)
  .neq('status', 'cancelada');

if (testError) {
  console.log('❌ Erro na query:', {
    message: testError.message,
    details: testError.details,
    hint: testError.hint,
    code: testError.code
  });
} else {
  console.log(`✅ Query retornou ${testQuery.length} reserva(s):`);
  testQuery.forEach((r, i) => {
    console.log(`   ${i + 1}. ID: ${r.id}`);
    console.log(`      Data: ${r.data}`);
    console.log(`      Status: ${r.status}`);
    console.log(`      Quadra: ${r.quadra?.nome}`);
    console.log(`      Organizador: ${r.organizador?.nome_completo}`);
  });
}

console.log('\n✅ Debug completo!');
