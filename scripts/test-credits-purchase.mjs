import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 TESTE DE COMPRA DE CRÉDITOS\n');
console.log('='.repeat(60));

async function main() {
  try {
    // Step 1: Check users table structure
    console.log('\n📋 PASSO 1: Verificar estrutura da tabela users');
    console.log('-'.repeat(60));

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('❌ Erro ao consultar users:', usersError.message);
      throw usersError;
    }

    if (users && users.length > 0) {
      console.log('✅ Tabela users encontrada');
      console.log('Campos disponíveis:', Object.keys(users[0]).join(', '));
      console.log('\nPrimeiro usuário (sample):');
      console.log('  - ID:', users[0].id);
      console.log('  - Email:', users[0].email);
      console.log('  - Nome:', users[0].nome_completo || 'N/A');
      console.log('  - CPF:', users[0].cpf ? '***' : 'N/A');
      console.log('  - WhatsApp:', users[0].whatsapp ? '***' : 'N/A');
      console.log('  - Has asaas_customer_id?', users[0].asaas_customer_id ? 'SIM' : 'NÃO');
    } else {
      console.log('⚠️  Nenhum usuário encontrado na tabela');
    }

    // Step 2: Check creditos table structure
    console.log('\n📋 PASSO 2: Verificar estrutura da tabela creditos');
    console.log('-'.repeat(60));

    const { data: creditos, error: creditosError } = await supabase
      .from('creditos')
      .select('*')
      .limit(1);

    if (creditosError) {
      console.error('❌ Erro ao consultar creditos:', creditosError.message);
      throw creditosError;
    }

    if (creditos && creditos.length > 0) {
      console.log('✅ Tabela creditos encontrada');
      console.log('Campos disponíveis:', Object.keys(creditos[0]).join(', '));
    } else {
      console.log('⚠️  Tabela creditos vazia (esperado em primeiro uso)');

      // Try to get table structure by describing it
      const { data: tableInfo } = await supabase
        .from('creditos')
        .select('*')
        .limit(0);

      console.log('Estrutura da tabela creditos existe');
    }

    // Step 3: Test creating a credit record manually
    console.log('\n📋 PASSO 3: Testar criação de registro de crédito');
    console.log('-'.repeat(60));

    if (users && users.length > 0) {
      const testUserId = users[0].id;
      const dataExpiracao = new Date();
      dataExpiracao.setMonth(dataExpiracao.getMonth() + 6);

      console.log('Tentando inserir crédito de teste...');

      const { data: creditoTeste, error: insertError } = await supabase
        .from('creditos')
        .insert({
          usuario_id: testUserId,
          tipo: 'compra',
          valor: 50.00,
          descricao: 'TESTE - Compra de créditos - Pacote Básico (R$ 50.00)',
          status: 'ativo',
          data_expiracao: dataExpiracao.toISOString(),
          metodo_pagamento: 'PIX'
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao inserir crédito:', insertError.message);
        console.error('Detalhes:', insertError);
        throw insertError;
      }

      console.log('✅ Crédito de teste criado com sucesso!');
      console.log('ID:', creditoTeste.id);

      // Clean up - delete test record
      await supabase
        .from('creditos')
        .delete()
        .eq('id', creditoTeste.id);

      console.log('✅ Registro de teste removido');
    }

    // Step 4: Test API endpoint directly
    console.log('\n📋 PASSO 4: Testar endpoint /api/creditos/comprar');
    console.log('-'.repeat(60));

    if (users && users.length > 0) {
      const testUserId = users[0].id;

      console.log('Fazendo requisição para API local...');
      console.log('UserID:', testUserId);
      console.log('Pacote: basico');
      console.log('Método: PIX\n');

      const apiUrl = 'http://localhost:3000/api/creditos/comprar';
      const payload = {
        usuarioId: testUserId,
        pacote: 'basico',
        metodoPagamento: 'PIX'
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const responseText = await response.text();

        if (!response.ok) {
          console.error(`❌ API retornou erro ${response.status}`);
          console.error('Resposta:', responseText);

          try {
            const errorData = JSON.parse(responseText);
            console.error('Erro estruturado:', errorData);
          } catch {
            console.error('Resposta não é JSON válido');
          }
        } else {
          console.log('✅ API respondeu com sucesso!');
          const result = JSON.parse(responseText);
          console.log('Resposta:', result);
        }
      } catch (fetchError) {
        console.error('❌ Erro ao fazer requisição:', fetchError.message);
        console.log('\n⚠️  Nota: Certifique-se de que o servidor Next.js está rodando (npm run dev)');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTE CONCLUÍDO\n');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
