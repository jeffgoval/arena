import 'dotenv/config';
import pg from 'pg';

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.mowmpjdgvoeldvrqutvb:X8a9QvCFqxqF8WzS@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

try {
  await client.connect();
  console.log('✅ Conectado ao banco de dados\n');

  // Verificar se a tabela existe
  const checkTable = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'creditos'
    );
  `);

  if (!checkTable.rows[0].exists) {
    console.log('❌ Tabela "creditos" não existe!');
    process.exit(1);
  }

  console.log('✅ Tabela "creditos" existe\n');

  // Verificar colunas
  const columns = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'creditos'
    ORDER BY ordinal_position
  `);

  console.log('📋 Colunas da tabela creditos:');
  columns.rows.forEach(row => {
    console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
  });

  // Verificar foreign keys
  const fkeys = await client.query(`
    SELECT
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'creditos';
  `);

  console.log('\n🔗 Foreign Keys:');
  if (fkeys.rows.length === 0) {
    console.log('  Nenhuma foreign key encontrada');
  } else {
    fkeys.rows.forEach(row => {
      console.log(`  - ${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`);
    });
  }

  // Tentar query simples
  console.log('\n🔍 Testando query simples...');
  const testQuery = await client.query(`
    SELECT COUNT(*) as total FROM creditos
  `);
  console.log(`  Total de registros: ${testQuery.rows[0].total}`);

} catch (error) {
  console.error('❌ Erro:', error.message);
  console.error(error);
} finally {
  await client.end();
}
