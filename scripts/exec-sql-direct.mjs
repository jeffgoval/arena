import { config } from 'dotenv';
import pg from 'pg';
import { readFileSync } from 'fs';

config({ path: '.env.local' });

const { Client } = pg;

// Construir connection string a partir das variáveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)/)?.[1];

// Connection string do pooler
const connectionString = `postgresql://postgres.${projectRef}:X8a9QvCFqxqF8WzS@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`;

console.log('🚀 Conectando ao banco de dados PostgreSQL...\n');
console.log(`📦 Project: ${projectRef}\n`);

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

try {
  await client.connect();
  console.log('✅ Conectado com sucesso!\n');

  // Ler o arquivo SQL
  const sqlFile = 'scripts/create-creditos-table.sql';
  console.log(`📄 Lendo arquivo: ${sqlFile}\n`);

  const sql = readFileSync(sqlFile, 'utf-8');

  console.log('📝 Executando SQL...\n');
  console.log('─'.repeat(60));

  // Executar o SQL completo
  await client.query(sql);

  console.log('─'.repeat(60));
  console.log('\n✅ SQL executado com sucesso!\n');

  // Verificar se a tabela foi criada
  console.log('🔍 Verificando tabela criada...\n');

  const checkTable = await client.query(`
    SELECT
      table_name,
      (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'creditos') as column_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'creditos'
  `);

  if (checkTable.rows.length > 0) {
    console.log('✅ Tabela "creditos" criada com sucesso!');
    console.log(`📊 Total de colunas: ${checkTable.rows[0].column_count}\n`);

    // Verificar políticas RLS
    const checkPolicies = await client.query(`
      SELECT policyname
      FROM pg_policies
      WHERE tablename = 'creditos'
    `);

    console.log('🔒 Políticas RLS criadas:');
    checkPolicies.rows.forEach(row => {
      console.log(`   ✓ ${row.policyname}`);
    });

    // Verificar índices
    const checkIndexes = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'creditos'
    `);

    console.log('\n📇 Índices criados:');
    checkIndexes.rows.forEach(row => {
      console.log(`   ✓ ${row.indexname}`);
    });

    console.log('\n🎉 Setup completo! A página de créditos deve funcionar agora.');

  } else {
    console.log('❌ Tabela não foi criada. Verifique os erros acima.');
  }

} catch (error) {
  console.error('\n❌ Erro ao executar SQL:', error.message);

  if (error.message.includes('already exists')) {
    console.log('\n✅ A tabela já existe! Verificando estrutura...\n');

    try {
      const checkTable = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'creditos'
        ORDER BY ordinal_position
      `);

      console.log('📋 Estrutura da tabela:');
      checkTable.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type}`);
      });

      console.log('\n✅ Tabela creditos está OK!');

    } catch (checkError) {
      console.error('Erro ao verificar:', checkError.message);
    }
  }

} finally {
  await client.end();
  console.log('\n🔌 Conexão encerrada.');
}
