import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testando CRUD da tabela configuracoes...\n');

// 1. SELECT
console.log('1️⃣ Testando SELECT...');
const { data: selectData, error: selectError } = await supabase
  .from('configuracoes')
  .select('*')
  .limit(1)
  .single();

if (selectError) {
  console.log('❌ SELECT falhou:', selectError);
} else {
  console.log('✅ SELECT OK - ID:', selectData.id);
}

// 2. UPDATE
console.log('\n2️⃣ Testando UPDATE...');
const { data: updateData, error: updateError } = await supabase
  .from('configuracoes')
  .update({ antecedencia_minima: 3 })
  .eq('id', selectData.id)
  .select();

if (updateError) {
  console.log('❌ UPDATE falhou:', updateError);
  console.log('\nDetalhes do erro:');
  console.log('- Code:', updateError.code);
  console.log('- Message:', updateError.message);
  console.log('- Details:', updateError.details);
  console.log('- Hint:', updateError.hint);
} else {
  console.log('✅ UPDATE OK');
  console.log('Valor atualizado:', updateData);
}

// 3. Verificar políticas RLS
console.log('\n3️⃣ Verificando políticas RLS...');
const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
  sql_query: `
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'configuracoes';
  `
}).catch(() => ({ data: null, error: null }));

if (policies) {
  console.log('Políticas encontradas:');
  console.log(JSON.stringify(policies, null, 2));
} else {
  console.log('⚠️  Não foi possível buscar políticas via RPC');
}

console.log('\n📝 Resumo:');
console.log('- SELECT:', selectError ? '❌ FALHOU' : '✅ OK');
console.log('- UPDATE:', updateError ? '❌ FALHOU' : '✅ OK');
