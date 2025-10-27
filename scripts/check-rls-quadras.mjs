import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verificando RLS e estrutura da tabela quadras\n');

try {
  // 1. Verificar se a tabela existe e suas colunas
  const { data: columns, error: columnsError } = await supabase
    .rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'quadras'
        ORDER BY ordinal_position;
      `
    })
    .select();

  if (columnsError) {
    console.log('⚠️  Não foi possível listar colunas (função RPC pode não existir)');
    console.log('Tentando método alternativo...\n');
  } else {
    console.log('📋 Colunas da tabela quadras:');
    console.log(columns);
  }

  // 2. Verificar policies RLS
  console.log('\n🔒 Verificando RLS policies...\n');

  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'quadras');

  if (policiesError) {
    console.log('⚠️  Erro ao verificar policies:', policiesError.message);
  } else if (policies && policies.length > 0) {
    console.log(`✅ Encontradas ${policies.length} policies:`);
    policies.forEach(p => {
      console.log(`  - ${p.policyname} (${p.cmd})`);
    });
  } else {
    console.log('❌ Nenhuma policy encontrada! RLS pode estar bloqueando acesso.');
  }

  // 3. Testar INSERT com service role
  console.log('\n🧪 Testando INSERT com service role key...\n');

  const testQuadra = {
    nome: 'Quadra Teste RLS ' + Date.now(),
    tipo: 'society',
    capacidade_maxima: 10,
    status: 'ativa',
    descricao: 'Teste de permissão'
  };

  const { data: insertData, error: insertError } = await supabase
    .from('quadras')
    .insert(testQuadra)
    .select()
    .single();

  if (insertError) {
    console.log('❌ Erro ao inserir:', insertError.message);
    console.log('Código:', insertError.code);
    console.log('Detalhes:', insertError.details);
  } else {
    console.log('✅ INSERT funcionou com service role!');
    console.log('ID criado:', insertData.id);

    // Limpar teste
    await supabase.from('quadras').delete().eq('id', insertData.id);
    console.log('🧹 Registro de teste removido');
  }

  // 4. Testar SELECT
  console.log('\n🧪 Testando SELECT...\n');

  const { data: quadras, error: selectError } = await supabase
    .from('quadras')
    .select('*')
    .limit(5);

  if (selectError) {
    console.log('❌ Erro ao selecionar:', selectError.message);
  } else {
    console.log(`✅ SELECT funcionou! ${quadras?.length || 0} quadras encontradas`);
  }

} catch (error) {
  console.log('❌ Erro:', error.message);
  console.log(error);
}
