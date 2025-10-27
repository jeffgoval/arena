import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAPICompra() {
  console.log('🧪 Testando API de compra de créditos...\n');

  // 1. Fazer login como cliente
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'cliente@gmail.com',
    password: 'cliente123' // Ajuste a senha
  });

  if (authError) {
    console.error('❌ Erro no login:', authError.message);
    console.log('\n⚠️ Crie um usuário ou ajuste email/senha no script');
    return;
  }

  console.log('✅ Login realizado com sucesso!');
  console.log(`  - User ID: ${authData.user.id}`);

  // 2. Chamar API de compra
  console.log('\n💳 Testando compra de créditos (pacote básico)...');

  const payload = {
    pacoteId: 'basico',
    metodoPagamento: 'PIX'
  };

  try {
    const response = await fetch('http://localhost:3000/api/creditos/comprar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.session.access_token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ ERRO na API:');
      console.error(`  - Status: ${response.status}`);
      console.error(`  - Error: ${data.error}`);
      console.error(`  - Detalhes:`, data.detalhes || 'N/A');
      console.error(`  - Debug:`, data.debug || 'N/A');
      console.log('\n🔍 Este é o erro que aparece no frontend!');
    } else {
      console.log('✅ SUCESSO! Compra processada!');
      console.log('  - Créditos:', data.compra);
      console.log('  - Pagamento:', data.pagamento);
      console.log('\n✅ O problema foi RESOLVIDO!');
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testAPICompra();
