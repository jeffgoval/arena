import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addAsaasColumn() {
  console.log('🔧 Adicionando coluna asaas_customer_id...\n');

  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;

      CREATE INDEX IF NOT EXISTS idx_users_asaas_customer_id ON users(asaas_customer_id);
    `
  });

  if (error) {
    console.error('❌ Erro ao adicionar coluna:', error.message);

    // Tentar alternativa via update
    console.log('\n🔄 Tentando adicionar via query direta...');

    // Teste: fazer um select para ver se a coluna existe
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('asaas_customer_id')
      .limit(1);

    if (testError && testError.message.includes('asaas_customer_id')) {
      console.error('❌ Coluna não existe e não foi possível criar');
      console.log('\n⚠️  Solução: Execute manualmente no Supabase Dashboard > SQL Editor:');
      console.log(`
ALTER TABLE users
ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;

CREATE INDEX IF NOT EXISTS idx_users_asaas_customer_id ON users(asaas_customer_id);
      `);
    } else {
      console.log('✅ Coluna asaas_customer_id já existe ou foi criada!');
    }
  } else {
    console.log('✅ Coluna asaas_customer_id adicionada com sucesso!');
  }
}

addAsaasColumn();
