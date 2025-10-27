import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('📊 Verificando schema da tabela creditos\n');

async function checkSchema() {
  // Query to get table column information from Supabase/PostgreSQL
  const { data, error } = await supabase.rpc('get_creditos_columns', {});

  if (error) {
    console.log('Método RPC não disponível, tentando query direta...\n');

    // Alternative: Try to insert with minimal fields to see what's required
    const testData = {
      usuario_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
      tipo: 'compra',
      valor: 50.00,
      descricao: 'Test',
      status: 'pendente'
    };

    const { error: insertError } = await supabase
      .from('creditos')
      .insert(testData)
      .select();

    if (insertError) {
      console.log('Erro ao inserir (esperado):');
      console.log('  Mensagem:', insertError.message);
      console.log('  Código:', insertError.code);
      console.log('  Detalhes:', insertError.details);

      // Now try without invalid columns to infer structure
      console.log('\n📋 Campos que podem existir baseado no código:');
      console.log('  - id (auto)');
      console.log('  - usuario_id');
      console.log('  - tipo');
      console.log('  - valor');
      console.log('  - descricao');
      console.log('  - status');
      console.log('  - data_expiracao');
      console.log('  - metodo_pagamento');
      console.log('  - asaas_payment_id');
      console.log('  - credito_origem_id');
      console.log('  - created_at');
      console.log('  - updated_at');
      console.log('\n❓ Campo problemático identificado:');
      console.log('  - pacote_info (JSONB) - NÃO EXISTE NA TABELA');
    }
  }

  // Try to get existing records to see structure
  const { data: existing, error: selectError } = await supabase
    .from('creditos')
    .select('*')
    .limit(1);

  if (!selectError && existing && existing.length > 0) {
    console.log('\n✅ Estrutura real da tabela (baseada em registro existente):');
    console.log('Campos:', Object.keys(existing[0]).join(', '));
  } else {
    console.log('\n⚠️  Tabela está vazia, não foi possível inferir estrutura completa');
  }
}

checkSchema().catch(console.error);
