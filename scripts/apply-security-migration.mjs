import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log('🔒 Aplicando migration de segurança...\n');

  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251024_add_security_columns.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ Erro ao aplicar migration:', error);
      return;
    }

    console.log('✅ Migration aplicada com sucesso!\n');

    // Verificar se as colunas foram criadas
    const { data: users, error: checkError } = await supabase
      .from('users')
      .select('banned, status')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar colunas:', checkError.message);
      return;
    }

    console.log('✅ Colunas criadas:');
    if (users && users.length > 0) {
      console.log(`  - banned: ${users[0].banned}`);
      console.log(`  - status: ${users[0].status}`);
    }

  } catch (err) {
    console.error('❌ Erro crítico:', err.message);
  }
}

applyMigration();
