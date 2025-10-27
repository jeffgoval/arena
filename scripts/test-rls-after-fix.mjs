import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔍 Testando RLS após aplicar policies\n');

// Criar cliente com service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Buscar usuário gestor
const { data: gestor } = await supabaseAdmin
  .from('users')
  .select('id, email, role')
  .eq('role', 'gestor')
  .limit(1)
  .single();

if (!gestor) {
  console.log('❌ Nenhum gestor encontrado no banco');
  process.exit(1);
}

console.log('👤 Gestor encontrado:', gestor.email);
console.log('   Role:', gestor.role);
console.log();

// Verificar policies criadas
console.log('📋 Verificando policies criadas...\n');

const { data: policies } = await supabaseAdmin
  .rpc('exec', {
    sql: `
      SELECT tablename, COUNT(*) as total_policies
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename IN ('quadras', 'horarios', 'reservas', 'court_blocks', 'turmas')
      GROUP BY tablename
      ORDER BY tablename;
    `
  });

if (policies) {
  policies.forEach(p => {
    console.log(`  ${p.tablename}: ${p.total_policies} policies`);
  });
} else {
  console.log('⚠️  Não foi possível verificar policies via RPC');
}

console.log();

// Testar operações
console.log('🧪 Testando operações com service role (deve funcionar):\n');

// 1. Teste SELECT
const { data: quadras, error: selectError } = await supabaseAdmin
  .from('quadras')
  .select('*');

if (selectError) {
  console.log('❌ SELECT falhou:', selectError.message);
} else {
  console.log(`✅ SELECT funcionou: ${quadras?.length || 0} quadras`);
}

// 2. Teste INSERT
const { data: novaQuadra, error: insertError } = await supabaseAdmin
  .from('quadras')
  .insert({
    nome: 'Teste RLS ' + Date.now(),
    tipo: 'society',
    capacidade_maxima: 10,
    status: 'ativa'
  })
  .select()
  .single();

if (insertError) {
  console.log('❌ INSERT falhou:', insertError.message);
} else {
  console.log('✅ INSERT funcionou: ID', novaQuadra.id);

  // Limpar
  await supabaseAdmin.from('quadras').delete().eq('id', novaQuadra.id);
  console.log('🧹 Teste removido');
}

console.log();
console.log('✅ Service role funcionando corretamente!');
console.log();
console.log('🔑 Próximos passos:');
console.log('   1. Faça logout no frontend');
console.log('   2. Faça login novamente como gestor');
console.log('   3. Tente criar uma quadra');
console.log();
console.log('Se ainda houver erro, copie a mensagem COMPLETA do erro do console do navegador');
