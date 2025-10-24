import { config } from 'dotenv';
import { readFileSync } from 'fs';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)/)?.[1];

console.log('🚀 Executando SQL via Management API do Supabase...\n');
console.log(`📦 Project: ${projectRef}\n`);

// Ler o SQL
const sqlFile = 'scripts/create-creditos-table.sql';
console.log(`📄 Lendo arquivo: ${sqlFile}\n`);

const sql = readFileSync(sqlFile, 'utf-8');

// Dividir em comandos individuais
const commands = sql
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

console.log(`📋 Total de comandos: ${commands.length}\n`);

let successCount = 0;
let skipCount = 0;

// Executar cada comando via fetch direto
for (let i = 0; i < commands.length; i++) {
  const command = commands[i].trim();

  if (!command) continue;

  const firstLine = command.split('\n')[0].substring(0, 60);
  console.log(`[${i + 1}/${commands.length}] ${firstLine}...`);

  try {
    // Tentar executar via endpoint de query direto
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        statement: command + ';'
      })
    });

    if (response.status === 404) {
      // RPC não existe, vamos tentar criar a tabela via uma série de INSERTs
      // que o PostgREST consegue executar
      console.log('  ⚠️  API RPC não disponível, pulando...');
      skipCount++;
    } else if (response.ok) {
      console.log('  ✅ Executado');
      successCount++;
    } else {
      const error = await response.text();
      if (error.includes('already exists')) {
        console.log('  ✅ Já existe');
        successCount++;
      } else {
        console.log(`  ⚠️  ${response.status}: ${error.substring(0, 80)}`);
        skipCount++;
      }
    }

  } catch (error) {
    console.log(`  ❌ Erro: ${error.message}`);
  }
}

console.log(`\n📊 Resumo:`);
console.log(`  ✅ Sucessos: ${successCount}`);
console.log(`  ⚠️  Pulados: ${skipCount}`);
console.log(`  📝 Total: ${commands.length}\n`);

// Método alternativo: criar via curl/psql se disponível
console.log('🔧 Tentando método alternativo via psql...\n');

// Salvar SQL em arquivo temporário
import { writeFileSync } from 'fs';
const tempFile = 'scripts/temp-creditos.sql';
writeFileSync(tempFile, sql);

console.log('💡 Execute este comando no terminal:\n');
console.log(`psql "postgresql://postgres.${projectRef}:[SUA_SENHA]@db.${projectRef}.supabase.co:5432/postgres" -f ${tempFile}\n`);
console.log('OU use o Supabase Dashboard SQL Editor:\n');
console.log(`🔗 https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
