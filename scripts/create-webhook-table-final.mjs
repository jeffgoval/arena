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

console.log('✅ Configuração detectada');
console.log('📊 Project Ref:', projectRef);
console.log('\n📋 Opções para criar a tabela webhook_logs:\n');

console.log('OPÇÃO 1 - Manual (Recomendado):');
console.log('─'.repeat(80));
console.log(`1. Acesse: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
console.log(`2. Cole o conteúdo abaixo:`);
console.log(`3. Clique em "Run"\n`);
console.log(sql);
console.log('─'.repeat(80));

console.log('\nOPÇÃO 2 - Via CLI do Supabase:');
console.log('─'.repeat(80));
console.log('1. Primeiro, sincronize as migrations:');
console.log('   supabase db pull\n');
console.log('2. Depois, faça push da nova migration:');
console.log('   supabase db push --linked');
console.log('─'.repeat(80));

console.log('\n💡 Após criar a tabela, execute:');
console.log('   npm run build');
console.log('\nPara verificar se está tudo ok!');
