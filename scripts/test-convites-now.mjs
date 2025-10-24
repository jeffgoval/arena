import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔌 Testando tabelas de convites...\n');

// Teste convites
console.log('📊 Teste 1: Tabela CONVITES');
const { data: d1, error: e1 } = await supabase
  .from('convites')
  .select('*', { count: 'exact', head: true });

if (e1) {
  console.log('❌ ERRO:', e1.message);
  console.log('>>> convites NÃO EXISTE\n');
} else {
  console.log('✅ convites EXISTE\n');
}

// Teste aceites_convite
console.log('📊 Teste 2: Tabela ACEITES_CONVITE');
const { data: d2, error: e2 } = await supabase
  .from('aceites_convite')
  .select('*', { count: 'exact', head: true });

if (e2) {
  console.log('❌ ERRO:', e2.message);
  console.log('>>> aceites_convite NÃO EXISTE\n');
} else {
  console.log('✅ aceites_convite EXISTE\n');
}

console.log('='.repeat(50));
console.log('CONCLUSÃO: Preciso criar essas tabelas no Supabase!');
