import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const ACCESS_TOKEN = process.env.SUPABASE_MANAGEMENT_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

if (!ACCESS_TOKEN || !PROJECT_REF) {
  console.error('❌ Erro: SUPABASE_MANAGEMENT_TOKEN e SUPABASE_PROJECT_REF devem estar definidos no .env.local');
  process.exit(1);
}

async function executeSql() {
  console.log('🚀 Executando SQL via Management API...\n');

  const sql = `
    ALTER TABLE users
    ADD COLUMN asaas_customer_id TEXT;

    CREATE INDEX idx_users_asaas_customer_id ON users(asaas_customer_id);

    COMMENT ON COLUMN users.asaas_customer_id IS 'ID do cliente no Asaas';
  `;

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Erro:', result);
    } else {
      console.log('✅ SQL executado com sucesso!');
      console.log('📊 Resultado:', result);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

executeSql();
