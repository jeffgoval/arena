import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function investigateTable() {
  console.log('🔍 Investigando tabela aceites_convite...\n');

  // 1. Tentar acessar diretamente
  console.log('1️⃣ Tentando acesso direto à tabela:');
  const { data, error, count } = await supabase
    .from('aceites_convite')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    console.log(`   Código: ${error.code}`);
    console.log(`   Detalhes: ${error.details || 'N/A'}`);
    console.log(`   Dica: ${error.hint || 'N/A'}`);
  } else {
    console.log(`   ✅ Tabela acessível via Supabase client`);
    console.log(`   📊 Contagem de linhas: ${count}`);
  }

  // 2. Verificar estrutura da tabela
  console.log('\n2️⃣ Verificando estrutura da tabela:');
  const { data: sample } = await supabase
    .from('aceites_convite')
    .select('*')
    .limit(1);

  if (sample) {
    if (sample.length > 0) {
      console.log(`   📋 Colunas encontradas:`, Object.keys(sample[0]));
    } else {
      console.log(`   📋 Tabela existe mas está vazia`);
    }
  }

  // 3. Listar todas as tabelas disponíveis
  console.log('\n3️⃣ Listando todas as tabelas começando com "aceites":');
  const tables = ['aceites_convite', 'aceite_convite', 'aceites', 'convite_aceites'];

  for (const tableName of tables) {
    const { error: err } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!err) {
      console.log(`   ✅ ${tableName} - existe`);
    }
  }

  console.log('\n4️⃣ Testando variações do nome:');
  const variations = [
    'aceites_convite',
    'aceites_convites',
    'aceite_convite',
    'aceite_convites'
  ];

  for (const name of variations) {
    const { error: err } = await supabase
      .from(name)
      .select('*', { head: true });

    console.log(`   ${err ? '❌' : '✅'} ${name}`);
  }

  console.log('\n💡 Diagnóstico:');
  console.log('Se a tabela é acessível via client mas o COMMENT falha, então:');
  console.log('');
  console.log('Possibilidades:');
  console.log('1. O comando COMMENT só funciona no SQL Editor do Supabase Dashboard');
  console.log('2. A tabela existe mas em um contexto diferente');
  console.log('3. Pode ser necessário aplicar a migration pelo dashboard');
  console.log('');
  console.log('📝 Próximo passo:');
  console.log('Tente aplicar APENAS os COMMENT via dashboard, ou remova os COMMENT');
  console.log('e aplique o resto da migration (triggers, RLS, indexes).');
}

investigateTable().catch(console.error);
