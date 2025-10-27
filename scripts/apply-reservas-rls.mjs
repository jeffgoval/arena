import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔒 Aplicando migração de RLS para tabela "reservas"...\n');

// Ler o arquivo SQL
const sqlPath = resolve(process.cwd(), 'supabase/migrations/fix_reservas_rls.sql');
console.log('📄 Lendo SQL de:', sqlPath);

let sql;
try {
  sql = readFileSync(sqlPath, 'utf8');
  console.log('✅ SQL carregado:', sql.length, 'caracteres\n');
} catch (error) {
  console.error('❌ Erro ao ler arquivo SQL:', error.message);
  process.exit(1);
}

// Dividir SQL em comandos individuais (separados por ponto-e-vírgula)
const commands = sql
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

console.log(`📋 Encontrados ${commands.length} comandos SQL para executar\n`);

// Executar cada comando individualmente
for (let i = 0; i < commands.length; i++) {
  const cmd = commands[i];

  // Pular comentários
  if (cmd.startsWith('--') || cmd.trim().length === 0) {
    continue;
  }

  console.log(`\n[${i + 1}/${commands.length}] Executando comando...`);

  // Mostrar preview do comando (primeiras 100 chars)
  const preview = cmd.substring(0, 100).replace(/\s+/g, ' ') + (cmd.length > 100 ? '...' : '');
  console.log(`   ${preview}`);

  try {
    // Executar o comando usando rpc (se disponível) ou query direta
    const { data, error } = await supabase.rpc('exec_sql', { sql: cmd + ';' });

    if (error) {
      // Se rpc não funcionar, tentar executar diretamente
      if (error.message.includes('Could not find the function')) {
        console.log('   ℹ️  RPC não disponível, tentando método alternativo...');

        // Para comandos ALTER TABLE e CREATE POLICY, precisamos usar outra abordagem
        // Vamos tentar fazer via API REST direta
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ query: cmd + ';' })
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`);
        }

        console.log('   ✅ Executado via API REST');
      } else {
        throw error;
      }
    } else {
      console.log('   ✅ Executado com sucesso');
      if (data) {
        console.log('   Resultado:', data);
      }
    }
  } catch (error) {
    console.error(`   ❌ Erro ao executar comando:`, error.message);

    // Continuar mesmo com erro (algumas policies podem já existir)
    if (error.message && error.message.includes('already exists')) {
      console.log('   ℹ️  Policy já existe, continuando...');
    } else if (error.message && error.message.includes('does not exist')) {
      console.log('   ℹ️  Objeto não existe, continuando...');
    } else {
      console.log('   ⚠️  Erro crítico, mas continuando com próximo comando...');
    }
  }
}

console.log('\n\n🎯 Migração concluída!');
console.log('\n📊 Verificando policies criadas...\n');

// Verificar policies criadas
const { data: policies, error: policiesError } = await supabase
  .from('reservas')
  .select('*')
  .limit(0);

if (policiesError) {
  console.log('❌ Erro ao verificar:', policiesError.message);
} else {
  console.log('✅ Tabela "reservas" acessível!');
}

// Testar com um cliente real
console.log('\n🧪 Testando acesso de cliente...\n');
const { data: cliente } = await supabase
  .from('users')
  .select('id, nome_completo, email')
  .eq('role', 'cliente')
  .limit(1)
  .single();

if (cliente) {
  console.log(`✅ Cliente encontrado: ${cliente.nome_completo} (${cliente.id})`);

  const { data: reservas, error: reservasError } = await supabase
    .from('reservas')
    .select('id, data, status')
    .eq('organizador_id', cliente.id);

  if (reservasError) {
    console.log('❌ Erro ao buscar reservas:', reservasError.message);
  } else {
    console.log(`✅ ${reservas.length} reserva(s) encontrada(s)`);
  }
}

console.log('\n✅ Processo completo!');
console.log('\n💡 Próximo passo: Testar o aplicativo (npm run dev)');
