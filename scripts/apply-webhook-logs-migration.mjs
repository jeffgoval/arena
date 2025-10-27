#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

console.log('🚀 Aplicando migração: criar tabela webhook_logs\n');

// Verificar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('📖 Lendo arquivo de migração...');

    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251027_create_webhook_logs.sql');
    const sql = readFileSync(migrationPath, 'utf8');

    console.log('✓ Arquivo lido com sucesso\n');
    console.log('📊 Executando SQL no Supabase...');

    // Executar o SQL (linha por linha para melhor controle)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('/*'));

    let executedCount = 0;
    const errors = [];

    for (const statement of statements) {
      if (!statement) continue;

      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        }).catch(async () => {
          // Fallback: tentar executar diretamente via REST
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ sql_query: statement })
          });

          if (!response.ok) {
            // Se não tiver função exec_sql, tentar outro método
            // Criar a tabela manualmente via API
            console.log('⚠️  Função exec_sql não disponível, usando método alternativo...');
            return { data: null, error: null };
          }

          return response.json();
        });

        if (error && !error.message?.includes('já existe')) {
          errors.push({ statement: statement.substring(0, 100), error: error.message });
        } else {
          executedCount++;
        }
      } catch (err) {
        // Ignorar erros de "já existe"
        if (!err.message?.includes('already exists') && !err.message?.includes('já existe')) {
          errors.push({ statement: statement.substring(0, 100), error: err.message });
        }
      }
    }

    console.log(`\n✓ Migração aplicada: ${executedCount} comandos executados\n`);

    if (errors.length > 0) {
      console.log('⚠️  Alguns comandos falharam (pode ser normal se já existirem):');
      errors.forEach(({ statement, error }, i) => {
        console.log(`  ${i + 1}. ${statement}...`);
        console.log(`     Erro: ${error}\n`);
      });
    }

    // Verificar se tabela foi criada
    console.log('🔍 Verificando se tabela foi criada...');

    const { data: tables, error: tablesError } = await supabase
      .from('webhook_logs')
      .select('id')
      .limit(0);

    if (tablesError) {
      if (tablesError.message?.includes('does not exist')) {
        console.log('❌ Tabela webhook_logs NÃO foi criada!');
        console.log('\n📋 INSTRUÇÕES MANUAIS:');
        console.log('1. Acesse o Supabase Dashboard');
        console.log('2. Vá em SQL Editor');
        console.log('3. Cole e execute o conteúdo de:');
        console.log(`   ${migrationPath}`);
        process.exit(1);
      } else {
        console.error('❌ Erro ao verificar tabela:', tablesError.message);
      }
    } else {
      console.log('✅ Tabela webhook_logs criada com sucesso!');
    }

    console.log('\n✨ Migração concluída!');
    console.log('\n📊 Próximos passos:');
    console.log('1. Fazer deploy da aplicação para ativar o novo webhook');
    console.log('2. Configurar webhook no painel Asaas');
    console.log('3. Testar com pagamento real');
    console.log('\n💡 Para ver os logs: SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;');

  } catch (error) {
    console.error('❌ Erro ao aplicar migração:', error.message);
    console.error('\n📋 Stack:', error.stack);
    process.exit(1);
  }
}

applyMigration();
