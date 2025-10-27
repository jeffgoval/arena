import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 Testando valores para pagamentos.status...\n');

// Valores comuns em sistemas de pagamento
const valoresTeste = [
  // Português
  'pendente', 'processando', 'confirmado', 'cancelado', 'estornado', 'expirado'
];

async function testarValores() {
  // Obter um usuário real
  const { data: users, error: userError } = await supabase.from('users').select('id').limit(1);
  if (userError || !users || users.length === 0) {
    console.log('❌ Erro ao obter usuário:', userError?.message);
    return;
  }
  
  const userId = users[0].id;
  console.log('✅ Usuário encontrado:', userId);

  for (const valor of valoresTeste) {
    const { error } = await supabase
      .from('pagamentos')
      .insert({
        user_id: userId,
        valor: 50,
        tipo: 'pix',
        status: valor
      })
      .select();

    if (error) {
      console.log(`❌ ${JSON.stringify(valor)} - REJEITADO (${error.code})`);
    } else {
      console.log(`✅ ${JSON.stringify(valor)} - ACEITO!`);
      // Limpar
      await supabase.from('pagamentos').delete().eq('status', valor).eq('tipo', 'PIX');
    }
  }
}

testarValores();