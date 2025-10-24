import { config } from 'dotenv';
import { readFileSync } from 'fs';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const projectId = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];

console.log('🚀 Criando tabela creditos via API SQL...\n');
console.log(`📦 Project ID: ${projectId}\n`);

const sql = readFileSync('supabase/migrations/20251024115442_create_creditos_table.sql', 'utf-8');

// Tentar via PostgREST admin
try {
  console.log('📝 Tentando criar tabela via API...\n');

  // Endpoint para executar SQL customizado
  const endpoint = `${supabaseUrl}/rest/v1/rpc/exec`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  });

  console.log(`Status: ${response.status} ${response.statusText}`);

  if (response.ok) {
    const result = await response.json();
    console.log('✅ SQL executado com sucesso!');
    console.log(result);
  } else {
    const error = await response.text();
    console.log('❌ Erro na execução:');
    console.log(error);

    // Tentar alternativa: criar via SQL direto
    console.log('\n⚠️  Não foi possível criar automaticamente.');
    console.log('\n📋 Por favor, execute o SQL manualmente:');
    console.log('\n🔗 Abra este link:');
    console.log(`https://supabase.com/dashboard/project/${projectId}/sql/new`);
    console.log('\n📄 Cole o conteúdo do arquivo:');
    console.log('supabase/migrations/20251024115442_create_creditos_table.sql');
    console.log('\n💡 Ou copie diretamente:');
    console.log('---'.repeat(20));
    console.log(sql);
    console.log('---'.repeat(20));
  }

} catch (error) {
  console.error('❌ Erro:', error.message);

  console.log('\n📋 Execute o SQL manualmente no Supabase Dashboard:');
  console.log(`🔗 https://supabase.com/dashboard/project/${projectId}/sql/new\n`);
}
