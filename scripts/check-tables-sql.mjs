import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('🔍 Checking existing tables in database...\n');

  // Try to query each critical table directly
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

  console.log('📋 Checking critical tables:\n');

  for (const tableName of criticalTables) {
    const { error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log(`  ❌ ${tableName} - NOT FOUND`);
      } else {
        console.log(`  ⚠️  ${tableName} - Error: ${error.message}`);
      }
    } else {
      console.log(`  ✅ ${tableName} - exists`);
    }
  }
}

checkTables().catch(console.error);
