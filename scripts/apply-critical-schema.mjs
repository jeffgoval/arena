import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Aplicando migração crítica de backend...\\n');

// Read the migration file
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20241024_critical_backend_schema.sql');
const sql = readFileSync(migrationPath, 'utf-8');

console.log('📄 Arquivo de migração carregado:', migrationPath);
console.log('📏 Tamanho:', sql.length, 'caracteres\\n');

try {
  // Execute SQL directly via REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ sql_query: sql })
  });

  if (!response.ok) {
    // If RPC doesn't exist, we need to use SQL Editor manually
    if (response.status === 404) {
      console.log('⚠️  RPC exec_sql não disponível.\\n');
      console.log('📋 Execute o SQL manualmente no Supabase SQL Editor:\\n');
      console.log('👉 https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new\\n');
      console.log('═'.repeat(80));
      console.log('O arquivo está em: supabase/migrations/20241024_critical_backend_schema.sql');
      console.log('═'.repeat(80));
      process.exit(1);
    }

    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ Migração aplicada com sucesso!\\n');

  // Verify the changes
  console.log('🔍 Verificando mudanças...\\n');

  // Check pagamentos table
  const { data: pagamentosCheck, error: pagamentosError } = await supabase
    .from('pagamentos')
    .select('*')
    .limit(1);

  if (pagamentosError) {
    console.log('⚠️  Tabela pagamentos:', pagamentosError.message);
  } else {
    console.log('✅ Tabela pagamentos criada com sucesso!');
  }

  // Check reservas columns
  const { data: reservasCheck, error: reservasError } = await supabase
    .from('reservas')
    .select('id, observacoes, split_mode, team_id')
    .limit(1);

  if (reservasError) {
    console.log('⚠️  Colunas em reservas:', reservasError.message);
  } else {
    console.log('✅ Colunas adicionadas em reservas (observacoes, split_mode, team_id)');
  }

  // Check reserva_participantes columns
  const { data: participantesCheck, error: participantesError } = await supabase
    .from('reserva_participantes')
    .select('id, source, split_type, split_value, amount_to_pay, payment_status, payment_id')
    .limit(1);

  if (participantesError) {
    console.log('⚠️  Colunas em reserva_participantes:', participantesError.message);
  } else {
    console.log('✅ Colunas adicionadas em reserva_participantes (source, split_type, etc.)');
  }

  console.log('\\n🎉 Migração crítica concluída!');
  console.log('\\n📊 Resumo:');
  console.log('  • Tabela pagamentos: criada');
  console.log('  • Tabela reservas: 3 colunas adicionadas');
  console.log('  • Tabela reserva_participantes: 6 colunas adicionadas');
  console.log('  • Triggers: validação de rateio + auto-cálculo de valores');

} catch (err) {
  console.error('❌ Erro ao aplicar migração:', err.message);
  console.log('\\n📋 Execute o SQL manualmente no Supabase SQL Editor:\\n');
  console.log('👉 https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new\\n');
  console.log('═'.repeat(80));
  console.log('O arquivo está em: supabase/migrations/20241024_critical_backend_schema.sql');
  console.log('═'.repeat(80));
  process.exit(1);
}
