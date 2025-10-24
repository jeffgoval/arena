import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllTables() {
  console.log('🔍 LISTANDO TODAS AS TABELAS REAIS NO BANCO:\n');

  // Tentar listar via pg_catalog
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `
  });

  if (error) {
    console.log('Método 1 falhou, tentando método 2...\n');

    // Tentar fazer SELECT em cada tabela conhecida
    const possibleTables = [
      'users',
      'quadras',
      'horarios',
      'reservas',
      'reserva_participantes',
      'turmas',
      'turma_membros',
      'convites',
      'aceites_convite',
      'aceite_convites',
      'convite_aceites',
      'avaliacoes',
      'indicacoes',
      'creditos',
      'notificacoes',
      'mensalistas',
      'court_blocks',
      'rateios'
    ];

    console.log('TABELAS QUE EXISTEM:\n');
    const existing = [];

    for (const table of possibleTables) {
      const { error: checkError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!checkError) {
        existing.push(table);
        console.log(`✅ ${table}`);
      }
    }

    console.log('\n\nTABELAS QUE NÃO EXISTEM:\n');
    for (const table of possibleTables) {
      const { error: checkError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (checkError) {
        console.log(`❌ ${table}`);
      }
    }

    console.log(`\n\nTOTAL: ${existing.length} tabelas encontradas`);

  } else {
    console.log('TABELAS NO BANCO:\n');
    data.forEach(row => console.log(`✅ ${row.tablename}`));
  }
}

listAllTables().catch(console.error);
