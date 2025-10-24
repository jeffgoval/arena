import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('🔍 Checking existing tables in database...\n');

  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE')
    .order('table_name');

  if (error) {
    console.error('❌ Error checking tables:', error);
    return;
  }

  console.log('📋 Existing tables:');
  data.forEach(row => {
    console.log(`  - ${row.table_name}`);
  });

  console.log(`\n✅ Total: ${data.length} tables found`);

  // Check for critical tables mentioned in the migration
  const criticalTables = [
    'users',
    'quadras',
    'horarios',
    'reservas',
    'reserva_participantes',
    'turmas',
    'turma_membros',
    'convites',
    'aceites_convite',
    'avaliacoes',
    'indicacoes',
    'creditos',
    'notificacoes',
    'mensalistas',
    'court_blocks'
  ];

  console.log('\n🔍 Critical tables status:');
  criticalTables.forEach(tableName => {
    const exists = data.some(row => row.table_name === tableName);
    console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
  });
}

checkTables().catch(console.error);
