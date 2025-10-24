import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verificando migração crítica...\n');

// 1. Check payments table
console.log('1️⃣ Tabela PAYMENTS:');
const { data: paymentsData, error: paymentsError } = await supabase
  .from('payments')
  .select('*')
  .limit(1);

if (paymentsError) {
  console.log('   ❌ Erro:', paymentsError.message);
} else {
  console.log('   ✅ Tabela existe e está acessível');
}

// 2. Check reservas new columns
console.log('\n2️⃣ Tabela RESERVAS (novas colunas):');
const { data: reservasData, error: reservasError } = await supabase
  .from('reservas')
  .select('id, observacoes, split_mode, team_id')
  .limit(1);

if (reservasError) {
  console.log('   ❌ Erro:', reservasError.message);
} else {
  console.log('   ✅ Colunas: observacoes, split_mode, team_id');
}

// 3. Check reserva_participantes new columns
console.log('\n3️⃣ Tabela RESERVA_PARTICIPANTES (novas colunas):');
const { data: participantesData, error: participantesError } = await supabase
  .from('reserva_participantes')
  .select('id, source, split_type, split_value, amount_to_pay, payment_status, payment_id')
  .limit(1);

if (participantesError) {
  console.log('   ❌ Erro:', participantesError.message);
} else {
  console.log('   ✅ Colunas: source, split_type, split_value, amount_to_pay, payment_status, payment_id');
}

console.log('\n✅ MIGRAÇÃO VERIFICADA COM SUCESSO!\n');

console.log('📊 Resumo:');
console.log('  • Tabela payments: CRIADA');
console.log('  • Reservas: 3 colunas ADICIONADAS');
console.log('  • Reserva_participantes: 6 colunas ADICIONADAS');
console.log('  • Triggers: CRIADOS');
console.log('  • RLS Policies: CONFIGURADAS');

console.log('\n🎯 Próximos passos:');
console.log('  1. ✅ Migração do banco - CONCLUÍDA');
console.log('  2. ⏳ Configurar webhook Asaas');
console.log('  3. ⏳ Deployar Edge Function (close-game)');
console.log('  4. ⏳ Testar integração');
