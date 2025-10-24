import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { exec } from 'child_process';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)/)?.[1];

console.log('🚀 Abrindo SQL Editor com código pré-preenchido...\n');

// Ler o SQL
const sql = readFileSync('scripts/create-creditos-table.sql', 'utf-8');

// Encode para URL
const encodedSql = encodeURIComponent(sql);

// Construir URL com SQL pré-preenchido (se o Supabase suportar)
const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

console.log('📋 SQL copiado para clipboard!\n');
console.log('🌐 Abrindo navegador...\n');

// Copiar SQL para clipboard
import { spawn } from 'child_process';

const clipProcess = spawn('clip', [], { stdio: ['pipe', 'ignore', 'ignore'], shell: true });
clipProcess.stdin.write(sql);
clipProcess.stdin.end();

// Aguardar clipboard
await new Promise(resolve => setTimeout(resolve, 500));

// Abrir navegador
exec(`start ${sqlEditorUrl}`, (error) => {
  if (error) {
    console.error('Erro ao abrir navegador:', error);
  } else {
    console.log('✅ Navegador aberto!\n');
    console.log('📝 Instruções:\n');
    console.log('  1. Cole o SQL no editor (Ctrl+V)');
    console.log('  2. Clique no botão "RUN" no canto inferior direito');
    console.log('  3. Aguarde a confirmação "Success"');
    console.log('  4. Volte aqui e digite "ok" quando terminar\n');
  }
});

// Aguardar confirmação do usuário
console.log('⏳ Aguardando você executar o SQL...\n');
