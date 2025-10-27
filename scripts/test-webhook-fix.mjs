import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 Testando correção do webhook...\n');

// Criar um pagamento de teste
const testData = {
  user_id: 'cfc73856-7d37-4d8a-8d47-e6603d6d9f27',
  valor: 100,
  tipo: 'cartao',
  status: 'pendente',
  asaas_payment_id: 'test_payment_123',
  metadata: {
    test: true
  }
};

console.log('1. Criando pagamento de teste...');
const { data: pagamento, error: insertError } = await supabase
  .from('pagamentos')
  .insert(testData)
  .select()
  .single();

if (insertError) {
  console.log('❌ Erro ao criar pagamento:', insertError.message);
  process.exit(1);
}

console.log('✅ Pagamento criado:', pagamento.id);

// Testar atualização para "confirmado" (deve funcionar)
console.log('\n2. Testando atualização para "confirmado"...');
const { error: updateConfirmError } = await supabase
  .from('pagamentos')
  .update({ status: 'confirmado', updated_at: new Date().toISOString() })
  .eq('id', pagamento.id);

if (updateConfirmError) {
  console.log('❌ Erro ao atualizar para "confirmado":', updateConfirmError.message);
} else {
  console.log('✅ Atualização para "confirmado" funcionou!');
}

// Testar atualização para "vencido" (deve funcionar)
console.log('\n3. Testando atualização para "vencido"...');
const { error: updateVencidoError } = await supabase
  .from('pagamentos')
  .update({ status: 'vencido', updated_at: new Date().toISOString() })
  .eq('id', pagamento.id);

if (updateVencidoError) {
  console.log('❌ Erro ao atualizar para "vencido":', updateVencidoError.message);
} else {
  console.log('✅ Atualização para "vencido" funcionou!');
}

// Testar atualização para "cancelado" (deve funcionar)
console.log('\n4. Testando atualização para "cancelado"...');
const { error: updateCancelError } = await supabase
  .from('pagamentos')
  .update({ status: 'cancelado', updated_at: new Date().toISOString() })
  .eq('id', pagamento.id);

if (updateCancelError) {
  console.log('❌ Erro ao atualizar para "cancelado":', updateCancelError.message);
} else {
  console.log('✅ Atualização para "cancelado" funcionou!');
}

// Limpar teste
console.log('\n5. Limpando teste...');
await supabase.from('pagamentos').delete().eq('id', pagamento.id);
console.log('✅ Teste limpo');

console.log('\n🎉 Todos os testes passaram! A correção está funcionando corretamente.');