import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔍 Verificando se a tabela creditos existe...\n');

try {
  // Verificar se a tabela existe
  const { data: tables, error: tablesError } = await supabase
    .from('creditos')
    .select('id')
    .limit(1);

  if (tablesError) {
    if (tablesError.code === '42P01') { // Tabela não existe
      console.log('❌ Tabela "creditos" não existe');
      console.log('📝 Criando tabela...\n');

      // Ler o arquivo SQL
      const sql = readFileSync('scripts/create-creditos-table.sql', 'utf-8');

      console.log('⚠️  ATENÇÃO: O Supabase JS Client não suporta execução de SQL DDL diretamente.');
      console.log('📋 Por favor, execute o seguinte SQL manualmente no Supabase SQL Editor:\n');
      console.log('🔗 https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new\n');
      console.log('--- SQL para executar ---');
      console.log(sql);
      console.log('--- Fim do SQL ---\n');

      process.exit(1);
    } else {
      throw tablesError;
    }
  }

  console.log('✅ Tabela "creditos" existe!\n');

  // Verificar estrutura
  const { count, error: countError } = await supabase
    .from('creditos')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw countError;
  }

  console.log(`📊 Total de registros na tabela: ${count || 0}\n`);

  // Tentar fazer uma query de teste
  const { data: testData, error: testError } = await supabase
    .from('creditos')
    .select('*')
    .limit(5);

  if (testError) {
    throw testError;
  }

  console.log('✅ Query de teste bem-sucedida!');
  console.log(`📝 Registros retornados: ${testData?.length || 0}\n`);

  if (testData && testData.length > 0) {
    console.log('📋 Exemplo de registro:');
    console.log(JSON.stringify(testData[0], null, 2));
  }

} catch (error) {
  console.error('❌ Erro:', error.message);
  if (error.details) console.error('Detalhes:', error.details);
  if (error.hint) console.error('Dica:', error.hint);
  process.exit(1);
}
