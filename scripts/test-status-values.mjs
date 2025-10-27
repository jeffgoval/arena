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
  for (const valor of valoresTeste) {
    const { error } = await supabase
      .from('pagamentos')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        valor: 50,
        tipo: 'PIX',
        status: valor
      })
      .select();

    if (error) {
      console.log(`❌ ${JSON.stringify(valor)} - REJEITADO (${error.code})`);
    } else {
      console.log(`✅ ${JSON.stringify(valor)} - ACEITO!`);
      // Limpar
      if (valor === null) {
        await supabase.from('pagamentos').delete().is('status', null).eq('tipo', 'PIX');
      } else {
        await supabase.from('pagamentos').delete().eq('status', valor).eq('tipo', 'PIX');
      }
    }
  }
}

testarValores();