import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 Testando inserção na tabela pagamentos...\n');

// Tentar inserir um pagamento de teste
const testData = {
  user_id: '00000000-0000-0000-0000-000000000000', // UUID fake
  reserva_id: '00000000-0000-0000-0000-000000000000', // UUID fake
  valor: 50.00,
  tipo: 'SALDO',
  status: 'aprovado',
  asaas_payment_id: 'TEST-123',
  metadata: {
    test: true
  }
};

console.log('Tentando inserir:', testData);
console.log();

const { data, error } = await supabase
  .from('pagamentos')
  .insert(testData)
  .select();

if (error) {
  console.log('❌ ERRO ao inserir:');
  console.log('   Código:', error.code);
  console.log('   Mensagem:', error.message);
  console.log('   Detalhes:', error.details);
  console.log('   Hint:', error.hint);
  console.log();
} else {
  console.log('✅ Inserção bem sucedida!');
  console.log('   ID:', data[0].id);
  console.log();

  // Limpar teste
  await supabase.from('pagamentos').delete().eq('id', data[0].id);
  console.log('🧹 Teste removido');
}
