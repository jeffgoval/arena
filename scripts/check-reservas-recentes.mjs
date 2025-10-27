import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verificando reservas recentes...\n');

const { data: reservas, error } = await supabase
  .from('reservas')
  .select(`
    id,
    data,
    status,
    valor_total,
    created_at,
    organizador:users!reservas_organizador_id_fkey(nome_completo, email),
    quadra:quadras(nome)
  `)
  .order('created_at', { ascending: false })
  .limit(5);

if (error) {
  console.log('❌ Erro:', error.message);
} else {
  console.log(`Total: ${reservas.length} reservas recentes\n`);

  reservas.forEach((r, i) => {
    console.log(`${i + 1}. ${r.quadra?.nome || 'Sem quadra'}`);
    console.log(`   Data: ${r.data}`);
    console.log(`   Status: ${r.status}`);
    console.log(`   Valor: R$ ${r.valor_total}`);
    console.log(`   Cliente: ${r.organizador?.nome_completo || 'Desconhecido'}`);
    console.log(`   Criado: ${new Date(r.created_at).toLocaleString('pt-BR')}`);
    console.log();
  });
}

// Verificar pagamentos recentes
console.log('💳 Verificando pagamentos recentes...\n');

const { data: pagamentos, error: pagError } = await supabase
  .from('pagamentos')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5);

if (pagError) {
  console.log('❌ Erro:', pagError.message);
} else {
  console.log(`Total: ${pagamentos.length} pagamentos recentes\n`);

  pagamentos.forEach((p, i) => {
    console.log(`${i + 1}. ID: ${p.id}`);
    console.log(`   Tipo: ${p.tipo}`);
    console.log(`   Valor: R$ ${p.valor}`);
    console.log(`   Status: ${p.status || 'null'}`);
    console.log(`   Asaas ID: ${p.asaas_payment_id || 'null'}`);
    console.log(`   Reserva ID: ${p.reserva_id || 'null'}`);
    console.log(`   Criado: ${new Date(p.created_at).toLocaleString('pt-BR')}`);
    console.log();
  });
}
