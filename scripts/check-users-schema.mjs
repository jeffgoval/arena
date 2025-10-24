import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsersSchema() {
  console.log('🔍 Verificando schema da tabela users...\n');

  // Buscar um usuário para ver as colunas
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Erro ao buscar users:', error.message);
    return;
  }

  if (users && users.length > 0) {
    console.log('✅ Colunas disponíveis:');
    Object.keys(users[0]).forEach(col => {
      console.log(`  - ${col}: ${typeof users[0][col]}`);
    });

    // Verificar colunas críticas de segurança
    const requiredColumns = ['banned', 'status'];
    console.log('\n🔐 Verificação de colunas de segurança:');

    requiredColumns.forEach(col => {
      if (col in users[0]) {
        console.log(`  ✅ ${col}: EXISTE (valor: ${users[0][col]})`);
      } else {
        console.log(`  ❌ ${col}: NÃO EXISTE - PRECISA SER CRIADA!`);
      }
    });
  } else {
    console.log('⚠️ Nenhum usuário encontrado na tabela');
  }
}

checkUsersSchema();
