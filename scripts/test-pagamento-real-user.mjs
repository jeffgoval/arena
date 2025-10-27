import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 Testando inserção com usuário e reserva reais...\n');

// 1. Buscar um usuário real
const { data: user } = await supabase
  .from('users')
  .select('id, nome_completo, role')
  .limit(1)
  .single();

if (!user) {
  console.log('❌ Nenhum usuário encontrado');
  process.exit(1);
}

console.log(`✅ Usuário encontrado: ${user.nome_completo} (${user.role})`);
console.log(`   ID: ${user.id}\n`);

// 2. Tentar inserir pagamento SEM reserva (reserva_id = null)
console.log('Teste 1: Pagamento sem reserva_id');
const { data: pag1, error: err1 } = await supabase
  .from('pagamentos')
  .insert({
    user_id: user.id,
    reserva_id: null,
    valor: 50,
    tipo: 'PIX',
    status: null
  })
  .select();

if (err1) {
  console.log(`❌ Erro: ${err1.message}\n`);
} else {
  console.log(`✅ Sucesso! ID: ${pag1[0].id}\n`);
  // Limpar
  await supabase.from('pagamentos').delete().eq('id', pag1[0].id);
  console.log('🧹 Removido\n');
}

//3. Buscar uma reserva real
const { data: reserva } = await supabase
  .from('reservas')
  .select('id')
  .limit(1)
  .single();

if (!reserva) {
  console.log('⚠️  Nenhuma reserva encontrada, pulando teste com reserva');
  process.exit(0);
}

console.log(`Teste 2: Pagamento com reserva_id = ${reserva.id}`);
const { data: pag2, error: err2 } = await supabase
  .from('pagamentos')
  .insert({
    user_id: user.id,
    reserva_id: reserva.id,
    valor: 50,
    tipo: 'PIX',
    status: 'pending'
  })
  .select();

if (err2) {
  console.log(`❌ Erro: ${err2.message}`);
  console.log(`   Código: ${err2.code}`);
} else {
  console.log(`✅ Sucesso! ID: ${pag2[0].id}`);
  // Limpar
  await supabase.from('pagamentos').delete().eq('id', pag2[0].id);
  console.log('🧹 Removido');
}
