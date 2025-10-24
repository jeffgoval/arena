import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔄 Atualizando cache do schema do Supabase...\n');

try {
  // Fazer requisição para recarregar o schema
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Accept': 'application/json',
      'Prefer': 'return=representation'
    }
  });

  console.log(`Status: ${response.status} ${response.statusText}`);

  if (response.ok) {
    console.log('\n✅ Cache atualizado! Aguarde alguns segundos e tente novamente.\n');

    // Aguardar 5 segundos
    console.log('⏳ Aguardando 5 segundos para sincronização...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Tentar query na tabela creditos
    console.log('\n🔍 Testando acesso à tabela creditos...');

    const testResponse = await fetch(`${supabaseUrl}/rest/v1/creditos?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Accept': 'application/json'
      }
    });

    console.log(`Status: ${testResponse.status} ${testResponse.statusText}`);

    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log('✅ Tabela creditos está acessível!');
      console.log(`📊 Registros: ${data.length}`);
    } else {
      const error = await testResponse.text();
      console.log('❌ Erro ao acessar tabela:');
      console.log(error);
    }

  } else {
    const error = await response.text();
    console.log('⚠️  Resposta:', error);
  }

} catch (error) {
  console.error('❌ Erro:', error.message);
}
