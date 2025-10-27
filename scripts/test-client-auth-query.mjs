import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

console.log('🧪 Testando query como cliente autenticado (usando ANON_KEY)...\n');

// Create client with ANON_KEY (same as browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // NOT SERVICE_ROLE_KEY!
);

console.log('1️⃣ Tentando login como cliente...');

// Login as the test client
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'cliente@gmail.com',
  password: 'cliente123' // Assuming this is the password
});

if (authError) {
  console.error('❌ Erro ao fazer login:', authError.message);
  console.log('\n💡 Dica: Você precisa saber a senha do cliente@gmail.com');
  console.log('   Ou use outro email/senha que você conheça.\n');
  process.exit(1);
}

console.log('✅ Login bem-sucedido!');
console.log('   User ID:', authData.user.id);
console.log('   Email:', authData.user.email);

console.log('\n2️⃣ Buscando reservas (como o hook faz)...');

const userId = authData.user.id;

// Exact same query as the hook
const { data, error } = await supabase
  .from('reservas')
  .select(`
    id,
    data,
    status,
    valor_total,
    observacoes,
    created_at,
    organizador:users!reservas_organizador_id_fkey(id, nome_completo),
    quadra:quadras(id, nome, tipo),
    horario:horarios(id, hora_inicio, hora_fim),
    turma:turmas(id, nome),
    reserva_participantes(id)
  `)
  .eq('organizador_id', userId)
  .neq('status', 'cancelada')
  .order('data', { ascending: true });

if (error) {
  console.error('❌ Erro na query:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    statusCode: error.statusCode,
    statusText: error.statusText
  });
  console.error('\nErro completo:', error);

  console.log('\n🔍 Possíveis causas:');
  console.log('   1. RLS policies ainda não foram aplicadas');
  console.log('   2. Schema cache precisa ser atualizado');
  console.log('   3. Alguma foreign key constraint está falhando');

  console.log('\n💡 Soluções:');
  console.log('   1. Espere alguns segundos e tente novamente (cache)');
  console.log('   2. Verifique se as policies foram criadas:');
  console.log('      supabase db pull');
  console.log('   3. Teste query mais simples (sem joins)');

  process.exit(1);
}

console.log('✅ Query executada com sucesso!');
console.log(`\n📊 Resultados: ${data?.length || 0} reserva(s) encontrada(s)\n`);

if (data && data.length > 0) {
  data.forEach((r, i) => {
    console.log(`${i + 1}. Reserva ID: ${r.id}`);
    console.log(`   Data: ${r.data}`);
    console.log(`   Status: ${r.status}`);
    console.log(`   Valor: R$ ${r.valor_total}`);
    console.log(`   Quadra: ${r.quadra?.nome || 'N/A'}`);
    console.log(`   Horário: ${r.horario?.hora_inicio} - ${r.horario?.hora_fim}`);
    console.log(`   Organizador: ${r.organizador?.nome_completo || 'N/A'}`);
    console.log(`   Participantes: ${r.reserva_participantes?.length || 0}`);
    console.log();
  });
} else {
  console.log('⚠️  Nenhuma reserva encontrada para este usuário');
  console.log('\n🔍 Verificando se existem reservas no banco...');

  // Check with service role
  const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: allReservas } = await supabaseService
    .from('reservas')
    .select('id, organizador_id, status')
    .eq('organizador_id', userId);

  if (allReservas && allReservas.length > 0) {
    console.log(`✅ Existem ${allReservas.length} reserva(s) no banco para este usuário`);
    console.log('❌ Mas RLS está bloqueando o acesso!');
    console.log('\n💡 Isso significa que as policies NÃO estão funcionando corretamente.');
  } else {
    console.log('❌ Não existem reservas no banco para este usuário');
    console.log('   User ID buscado:', userId);
  }
}

console.log('\n✅ Teste completo!');

// Logout
await supabase.auth.signOut();
