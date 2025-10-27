#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

// Extrair project ref
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Não foi possível extrair project ref');
  process.exit(1);
}

// Construir connection string
// Formato: postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
const connectionString = `postgresql://postgres.${projectRef}:${supabaseServiceKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

// Ler SQL
const sqlFile = resolve(__dirname, '..', 'supabase', 'migrations', '20251027_create_webhook_logs_table.sql');
const sql = readFileSync(sqlFile, 'utf-8');

console.log('🔄 Conectando ao banco de dados do Supabase...');
console.log('📊 Project:', projectRef);

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function executeSQLAsync() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    console.log('🔄 Executando SQL para criar tabela webhook_logs...');

    await client.query(sql);

    console.log('✅ Tabela webhook_logs criada com sucesso!');
    console.log('\n📊 Estrutura criada:');
    console.log('   - Tabela: webhook_logs');
    console.log('   - Índices: 5 índices para performance');
    console.log('   - RLS: Habilitado');
    console.log('   - Policy: Service role tem acesso total');

    // Verificar se a tabela foi criada
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'webhook_logs'
      ORDER BY ordinal_position
    `);

    console.log('\n✅ Colunas da tabela:');
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });

    console.log('\n✅ Pronto! Agora execute:');
    console.log('   npm run build');

  } catch (error) {
    console.error('\n❌ Erro ao executar SQL:', error.message);
    console.error('\n💡 Detalhes:', error);
    console.error('\n📋 Tente executar manualmente em:');
    console.error(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeSQLAsync();
