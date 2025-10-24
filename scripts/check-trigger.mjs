import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTrigger() {
  console.log('\n🔍 Verificando trigger handle_new_user...\n');

  // Verificar se a função existe
  const { data: functions, error: funcError } = await supabase
    .rpc('pg_catalog.pg_get_functiondef', { funcoid: 'public.handle_new_user'::regproc });

  if (funcError) {
    console.log('❌ Função handle_new_user NÃO existe');
    console.log('Erro:', funcError.message);
    return false;
  }

  console.log('✅ Função handle_new_user existe');

  // Verificar se o trigger existe
  const { data: triggers, error: trigError } = await supabase
    .from('pg_trigger')
    .select('*')
    .eq('tgname', 'on_auth_user_created');

  if (trigError || !triggers || triggers.length === 0) {
    console.log('❌ Trigger on_auth_user_created NÃO existe');
    return false;
  }

  console.log('✅ Trigger on_auth_user_created existe');
  return true;
}

async function checkRLSPolicies() {
  console.log('\n🔍 Verificando políticas RLS na tabela users...\n');

  const { data: policies, error } = await supabase
    .rpc('pg_policies');

  if (error) {
    console.log('❌ Erro ao verificar políticas:', error.message);
    return;
  }

  const usersPolicies = policies?.filter(p => p.tablename === 'users');

  if (!usersPolicies || usersPolicies.length === 0) {
    console.log('❌ Nenhuma política RLS encontrada para tabela users');
    return;
  }

  console.log('Políticas encontradas:');
  usersPolicies.forEach(policy => {
    console.log(`  - ${policy.policyname} (${policy.cmd})`);
  });

  const hasInsertPolicy = usersPolicies.some(p => p.cmd === 'INSERT');
  if (!hasInsertPolicy) {
    console.log('\n⚠️  PROBLEMA: Não há política RLS para INSERT na tabela users');
    console.log('   Isso impede criação manual de perfis durante o signup');
  }
}

checkTrigger().then(() => checkRLSPolicies());
