/**
 * Script de diagnóstico para debug do cadastro
 * Execute: npx tsx scripts/debug-signup.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSignup() {
  console.log('🔍 Verificando estrutura da tabela users...\n');

  // 1. Verificar estrutura da tabela
  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_name', 'users')
    .eq('table_schema', 'public');

  if (columnsError) {
    console.error('❌ Erro ao buscar colunas:', columnsError);
  } else {
    console.log('📋 Colunas da tabela users:');
    console.table(columns);
  }

  // 2. Verificar políticas RLS
  console.log('\n🔒 Verificando políticas RLS...\n');
  
  const { data: policies, error: policiesError } = await supabase
    .rpc('pg_policies')
    .eq('tablename', 'users');

  if (policiesError) {
    console.error('❌ Erro ao buscar políticas:', policiesError);
  } else {
    console.log('📜 Políticas RLS:');
    console.table(policies);
  }

  // 3. Verificar triggers
  console.log('\n⚡ Verificando triggers...\n');
  
  const { data: triggers, error: triggersError } = await supabase
    .rpc('pg_trigger')
    .eq('tgrelid', 'users');

  if (triggersError) {
    console.error('❌ Erro ao buscar triggers:', triggersError);
  } else {
    console.log('🔔 Triggers:');
    console.table(triggers);
  }
}

debugSignup().catch(console.error);
