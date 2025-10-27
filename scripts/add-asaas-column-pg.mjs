import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function addAsaasColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔌 Conectando ao PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado!\n');

    console.log('🔧 Adicionando coluna asaas_customer_id...');

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;
    `);
    console.log('✅ Coluna adicionada!');

    console.log('📊 Criando índice...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_asaas_customer_id ON users(asaas_customer_id);
    `);
    console.log('✅ Índice criado!');

    console.log('\n✅ Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

addAsaasColumn();
