#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

// Ler o arquivo SQL
const sqlFile = path.join(__dirname, 'create-webhook-logs.sql');
const sql = fs.readFileSync(sqlFile, 'utf-8');

console.log('🔄 Executando SQL para criar tabela webhook_logs...');
console.log('📁 Arquivo:', sqlFile);

// Usar a API REST do Supabase para executar SQL
const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`;
const headers = {
  'Content-Type': 'application/json',
  'apikey': supabaseServiceKey,
  'Authorization': `Bearer ${supabaseServiceKey}`,
  'Prefer': 'return=minimal'
};

// Se exec_sql não existir, vamos usar PostgREST diretamente
// Mas primeiro, vamos tentar criar a tabela usando pg-admin style
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Não foi possível extrair project ref da URL');
  process.exit(1);
}

console.log('📊 Project Ref:', projectRef);
console.log('\n💡 Como executar o SQL:');
console.log('   1. Acesse: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
console.log('   2. Cole o conteúdo do arquivo: scripts/create-webhook-logs.sql');
console.log('   3. Clique em "Run"');
console.log('\n📋 Conteúdo do SQL:\n');
console.log('─'.repeat(80));
console.log(sql);
console.log('─'.repeat(80));
console.log('\n✅ Após executar o SQL no dashboard, rode novamente o build');
