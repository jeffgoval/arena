import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
  }
);

console.log('🔧 Aplicando RLS policies para tabela quadras\n');

const sql = readFileSync('supabase/migrations/fix_quadras_rls.sql', 'utf8');

// Executar SQL raw
const { data, error } = await supabase.rpc('exec_sql', { query: sql });

if (error) {
  console.log('❌ Erro ao executar SQL via RPC:', error.message);
  console.log('\nTentando método alternativo...\n');

  // Método alternativo: executar statement por statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (const statement of statements) {
    console.log(`Executando: ${statement.substring(0, 60)}...`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: statement })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.log(`  ⚠️  Status ${response.status}:`, error);
    } else {
      console.log('  ✅ Sucesso');
    }
  }
} else {
  console.log('✅ SQL executado com sucesso!');
  console.log(data);
}

console.log('\n🔍 Verificando policies criadas...\n');

// Testar INSERT como gestor
console.log('Testando se gestor pode criar quadra...\n');

const { data: testInsert, error: insertError } = await supabase
  .from('quadras')
  .insert({
    nome: 'Teste RLS Gestor ' + Date.now(),
    tipo: 'society',
    capacidade_maxima: 10,
    status: 'ativa'
  })
  .select()
  .single();

if (insertError) {
  console.log('❌ Gestor não consegue criar:', insertError.message);
} else {
  console.log('✅ Gestor consegue criar quadras!');
  console.log('ID criado:', testInsert.id);

  // Limpar
  await supabase.from('quadras').delete().eq('id', testInsert.id);
  console.log('🧹 Teste removido');
}
