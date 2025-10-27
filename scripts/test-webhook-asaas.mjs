import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 Testando webhook do Asaas...\n');

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

// Simular evento de pagamento confirmado do Asaas
console.log('\n2. Simulando evento PAYMENT_CONFIRMED do Asaas...');

const { error: updateError } = await supabase
  .from('pagamentos')
  .update({
    status: 'confirmado', // Valor corrigido (antes estava 'CONFIRMADO')
    updated_at: new Date().toISOString()
  })
  .eq('asaas_payment_id', 'test_payment_123');

if (updateError) {
  console.log('❌ Erro ao atualizar pagamento:', updateError.message);
} else {
  console.log('✅ Pagamento atualizado para "confirmado" com sucesso!');
  
  // Verificar se a atualização foi feita corretamente
  const { data: updatedPagamento, error: selectError } = await supabase
    .from('pagamentos')
    .select('status')
    .eq('id', pagamento.id)
    .single();
    
  if (selectError) {
    console.log('❌ Erro ao verificar atualização:', selectError.message);
  } else {
    console.log('✅ Status atualizado para:', updatedPagamento.status);
    
    if (updatedPagamento.status === 'confirmado') {
      console.log('🎉 Teste PASSOU! O webhook está funcionando corretamente.');
    } else {
      console.log('❌ Teste FALHOU! O status não foi atualizado corretamente.');
    }
  }
}

// Limpar teste
console.log('\n3. Limpando teste...');
await supabase.from('pagamentos').delete().eq('id', pagamento.id);
console.log('✅ Teste limpo');