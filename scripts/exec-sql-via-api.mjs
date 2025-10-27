#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

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

// Ler SQL
const sqlFile = resolve(__dirname, '..', 'supabase', 'migrations', '20251027_create_webhook_logs_table.sql');
const sql = readFileSync(sqlFile, 'utf-8');

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('🔄 Executando SQL via Supabase Management API...');
console.log('📊 Project:', projectRef);

async function executeSQLViaAPI() {
  try {
    // Usar PostgREST para executar via function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ SQL executado com sucesso!');
    console.log('✅ Tabela webhook_logs criada!');

    // Verificar se a tabela existe
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/webhook_logs?limit=0`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (checkResponse.ok || checkResponse.status === 404) {
      console.log('\n✅ Verificação concluída!');
      console.log('\n💡 Agora execute:');
      console.log('   npm run build');
    }

  } catch (error) {
    console.error('\n❌ Erro ao executar via API:', error.message);

    // Tentar abordagem alternativa - executar statements um por um
    console.log('\n🔄 Tentando executar statements individualment...');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n[${i+1}/${statements.length}] Executando...`);

      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: statement })
        });

        if (response.ok) {
          successCount++;
          console.log('  ✅ Sucesso');
        } else {
          failCount++;
          console.log(`  ⚠️  Falhou: ${response.statusText}`);
        }
      } catch (err) {
        failCount++;
        console.log(`  ❌ Erro: ${err.message}`);
      }
    }

    console.log(`\n📊 Resultado: ${successCount} sucesso, ${failCount} falhas`);

    if (failCount > 0) {
      console.log('\n💡 A API PostgREST não tem função exec_sql habilitada.');
      console.log('📋 Execute o SQL manualmente em:');
      console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
      console.log('\nOu copie o arquivo:');
      console.log('   supabase/migrations/20251027_create_webhook_logs_table.sql');
    }
  }
}

executeSQLViaAPI();
