import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

console.log('🚀 Iniciando criação da tabela creditos...\n');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Ler o SQL
const sqlFile = 'supabase/migrations/20251024115442_create_creditos_table.sql';
console.log(`📄 Lendo arquivo: ${sqlFile}\n`);

const sql = readFileSync(sqlFile, 'utf-8');

// Dividir o SQL em comandos individuais
const commands = sql
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

console.log(`📋 Total de comandos SQL a executar: ${commands.length}\n`);

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < commands.length; i++) {
  const command = commands[i] + ';';

  // Extrair o tipo de comando para exibição
  const firstLine = command.split('\n')[0].trim();
  console.log(`[${i + 1}/${commands.length}] Executando: ${firstLine}...`);

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: command });

    if (error) {
      // Se o RPC não existe, tentar via query direta
      if (error.code === '42883') {
        console.log('⚠️  RPC não disponível, tentando via HTTP...');

        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ sql_query: command })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log(`⚠️  Comando pode ter sido executado. Status: ${response.status}`);
        } else {
          console.log('✅ Executado com sucesso');
          successCount++;
        }
      } else {
        console.log(`⚠️  Aviso: ${error.message}`);
        // Continuar mesmo com erros de "already exists"
        if (error.message.includes('already exists') || error.message.includes('IF NOT EXISTS')) {
          console.log('✅ Objeto já existe (OK)');
          successCount++;
        } else {
          errorCount++;
        }
      }
    } else {
      console.log('✅ Executado com sucesso');
      successCount++;
    }
  } catch (err) {
    console.log(`⚠️  Erro: ${err.message}`);
    errorCount++;
  }

  console.log('');
}

console.log('\n📊 Resumo da execução:');
console.log(`  ✅ Sucessos: ${successCount}`);
console.log(`  ⚠️  Erros: ${errorCount}`);
console.log(`  📝 Total: ${commands.length}`);

// Verificar se a tabela foi criada
console.log('\n🔍 Verificando se a tabela foi criada...');

try {
  const { count, error } = await supabase
    .from('creditos')
    .select('*', { count: 'exact', head: true });

  if (error) {
    if (error.code === '42P01') {
      console.log('❌ Tabela ainda não existe. Execute o SQL manualmente.');
      console.log('🔗 https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new\n');
      process.exit(1);
    }
    throw error;
  }

  console.log('✅ Tabela "creditos" criada com sucesso!');
  console.log(`📊 Total de registros: ${count || 0}\n`);

  console.log('🎉 Setup concluído! A página de créditos deve funcionar agora.');

} catch (error) {
  console.log(`⚠️  Não foi possível verificar: ${error.message}`);
  console.log('\n📋 Por favor, execute o SQL manualmente:');
  console.log('🔗 https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new\n');
  process.exit(1);
}
