import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔌 Conectando ao Supabase...');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('');

// Teste 1: SELECT direto
console.log('📊 Teste 1: SELECT na tabela aceites_convite');
const { data: d1, error: e1, count } = await supabase
  .from('aceites_convite')
  .select('*', { count: 'exact' })
  .limit(5);

if (e1) {
  console.log('❌ ERRO:', e1.message);
  console.log('Código:', e1.code);
  console.log('');
  console.log('A TABELA NÃO EXISTE!');
} else {
  console.log('✅ Sucesso! Tabela existe');
  console.log('Total de registros:', count);
  console.log('Dados:', d1);
}
