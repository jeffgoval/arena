import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllTables() {
  console.log('🔍 Verificando TODAS as tabelas para user_id vs usuario_id...\n');

  const tables = [
    'users',
    'quadras',
    'horarios',
    'reservas',
    'reserva_participantes',
    'turmas',
    'turma_membros',
    'convites',
    'avaliacoes',
    'indicacoes',
    'creditos',
    'mensalistas',
    'court_blocks',
    'rateios'
  ];

  const results = {};

  for (const tableName of tables) {
    // Fazer um INSERT vazio e capturar erro para ver estrutura
    const { error } = await supabase
      .from(tableName)
      .insert({})
      .select();

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes('user_id')) {
        results[tableName] = 'user_id';
      } else if (msg.includes('usuario_id')) {
        results[tableName] = 'usuario_id';
      } else if (msg.includes('cliente_id')) {
        results[tableName] = 'cliente_id';
      } else if (msg.includes('organizador_id')) {
        results[tableName] = 'organizador_id';
      } else {
        results[tableName] = 'sem coluna de usuário';
      }
    }
  }

  console.log('📊 RESULTADO:\n');
  console.log('Tabela'.padEnd(25) + 'Coluna de Usuário');
  console.log('='.repeat(50));

  Object.keys(results).sort().forEach(table => {
    console.log(table.padEnd(25) + results[table]);
  });

  console.log('\n\n💡 RESUMO para RLS policies:');
  console.log('='.repeat(50));

  const userIdTables = Object.entries(results).filter(([_, v]) => v === 'user_id').map(([k]) => k);
  const usuarioIdTables = Object.entries(results).filter(([_, v]) => v === 'usuario_id').map(([k]) => k);

  console.log('\n✅ Usam user_id:');
  userIdTables.forEach(t => console.log(`   - ${t}`));

  console.log('\n✅ Usam usuario_id:');
  usuarioIdTables.forEach(t => console.log(`   - ${t}`));
}

checkAllTables().catch(console.error);
