import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verificando pagamentos existentes...\n');

const { data, error, count } = await supabase
  .from('pagamentos')
  .select('*', { count: 'exact' })
  .limit(10);

if (error) {
  console.log('❌ Erro:', error.message);
} else {
  console.log(`Total de pagamentos: ${count || 0}\n`);

  if (data && data.length > 0) {
    console.log('📋 Exemplos de pagamentos:\n');
    data.forEach((p, i) => {
      console.log(`${i + 1}. ID: ${p.id}`);
      console.log(`   Status: "${p.status}"`);
      console.log(`   Tipo: "${p.tipo}"`);
      console.log(`   Valor: R$ ${p.valor}`);
      console.log(`   Criado: ${p.created_at}`);
      console.log();
    });
  } else {
    console.log('⚠️  Nenhum pagamento encontrado na tabela');
    console.log('   A tabela está vazia, então não conseguimos ver exemplos de valores válidos.\n');
  }
}
