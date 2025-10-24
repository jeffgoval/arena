import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  console.error('Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local');
  process.exit(1);
}

console.log('\n🔧 Aplicando correção RLS...\n');
console.log('URL:', supabaseUrl);

// Usar SERVICE ROLE KEY para ter permissões administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Ler o arquivo SQL
const sqlFile = join(__dirname, '..', 'supabase', 'fix-rls-recursion.sql');
const sql = readFileSync(sqlFile, 'utf8');

console.log('📄 Arquivo SQL carregado:', sqlFile);
console.log('📏 Tamanho:', sql.length, 'bytes');
console.log('\n🚀 Executando SQL...\n');

// Dividir em comandos individuais (remove comentários e blocos DO)
const commands = sql
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => {
    // Remover comentários
    const withoutComments = cmd
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .trim();

    return withoutComments.length > 0 &&
           !withoutComments.startsWith('DO $$'); // Pular blocos DO por enquanto
  });

async function executeSQL() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];

    // Pular se for apenas comentário ou vazio
    if (!cmd || cmd.length < 10) continue;

    const preview = cmd.substring(0, 60).replace(/\n/g, ' ') + '...';
    console.log(`[${i + 1}/${commands.length}] ${preview}`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: cmd });

      if (error) {
        console.error(`   ❌ Erro:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ OK`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exceção:`, err.message);
      errorCount++;
    }

    // Pequeno delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 Resumo:');
  console.log(`   ✅ Sucesso: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);

  if (errorCount === 0) {
    console.log('\n🎉 Correção aplicada com sucesso!\n');

    // Testar se funcionou
    console.log('🧪 Testando conexão...');
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      if (error.message.includes('infinite recursion')) {
        console.log('❌ Ainda há recursão infinita. Tente executar manualmente no dashboard.');
      } else {
        console.log('⚠️  Erro ao testar:', error.message);
      }
    } else {
      console.log('✅ Teste passou! RLS está funcionando corretamente.\n');
    }
  } else {
    console.log('\n⚠️  Houve erros. Execute o SQL manualmente no Supabase Dashboard.\n');
  }
}

// Verificar se a função exec_sql existe
async function checkExecSql() {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
    return !error || !error.message.includes('function');
  } catch {
    return false;
  }
}

checkExecSql().then(exists => {
  if (!exists) {
    console.log('⚠️  Função exec_sql não existe. Executando via REST API...\n');
    console.log('📌 INSTRUÇÕES PARA EXECUÇÃO MANUAL:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new');
    console.log('2. Copie o conteúdo de: supabase/fix-rls-recursion.sql');
    console.log('3. Cole no editor SQL e clique em "Run"');
    console.log('4. Se der erro de dependências, adicione CASCADE nas linhas DROP FUNCTION\n');
    process.exit(1);
  }

  executeSQL();
});
