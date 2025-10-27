import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verificando constraints da tabela pagamentos...\n');

// Buscar constraints
const { data, error } = await supabase.rpc('exec', {
  sql: `
    SELECT
      conname AS constraint_name,
      pg_get_constraintdef(oid) AS constraint_definition
    FROM pg_constraint
    WHERE conrelid = 'public.pagamentos'::regclass
    AND contype = 'c';
  `
});

if (error) {
  console.log('❌ Erro ao buscar constraints:', error);
} else {
  console.log('📋 Constraints encontrados:\n');
  data.forEach(constraint => {
    console.log(`${constraint.constraint_name}:`);
    console.log(`  ${constraint.constraint_definition}\n`);
  });
}

// Tentar valores diferentes para status
console.log('\n🧪 Testando valores para status:\n');

const valoresTeste = ['pending', 'confirmed', 'paid', 'cancelled', 'failed', 'aprovado', 'pendente'];

for (const valor of valoresTeste) {
  const { error } = await supabase
    .from('pagamentos')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      reserva_id: '00000000-0000-0000-0000-000000000000',
      valor: 50,
      tipo: 'PIX',
      status: valor,
      asaas_payment_id: 'TEST'
    })
    .select();

  if (error) {
    console.log(`❌ "${valor}" - REJEITADO`);
  } else {
    console.log(`✅ "${valor}" - ACEITO`);
    // Limpar
    await supabase.from('pagamentos').delete().eq('status', valor).eq('asaas_payment_id', 'TEST');
  }
}
