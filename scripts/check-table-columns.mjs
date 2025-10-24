import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
  console.log('🔍 Verificando colunas das tabelas críticas...\n');

  const tables = [
    'turma_membros',
    'aceites_convite',
    'avaliacoes',
    'notificacoes',
    'mensalistas',
    'creditos'
  ];

  for (const tableName of tables) {
    console.log(`\n📋 Tabela: ${tableName}`);
    console.log('='.repeat(50));

    // Tentar pegar uma linha para ver as colunas
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      continue;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`   ✅ Colunas encontradas (${columns.length}):`);
      columns.forEach(col => {
        console.log(`      - ${col}`);
      });

      // Verificar se tem user_id ou usuario_id
      if (columns.includes('user_id')) {
        console.log(`   ⚠️  Usa: user_id`);
      } else if (columns.includes('usuario_id')) {
        console.log(`   ⚠️  Usa: usuario_id`);
      } else {
        console.log(`   ℹ️  Não tem coluna de usuário`);
      }
    } else {
      console.log(`   ⚠️  Tabela vazia, não é possível verificar colunas`);
      console.log(`   💡 Tentando schema inspection...`);

      // Tentar INSERT vazio para forçar erro e ver estrutura
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({})
        .select();

      if (insertError) {
        console.log(`   Erro de INSERT: ${insertError.message}`);
      }
    }
  }

  console.log('\n\n' + '='.repeat(50));
  console.log('✅ Verificação concluída!');
}

checkColumns().catch(console.error);
