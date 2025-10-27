import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public'
    }
  }
);

async function addColumn() {
  console.log('🔧 Adicionando coluna asaas_customer_id diretamente...\n');

  // Primeiro, vamos tentar fazer um update de teste
  const { data: users, error: selectError } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (selectError) {
    console.error('❌ Erro ao buscar users:', selectError);
    return;
  }

  if (users && users.length > 0) {
    const userId = users[0].id;

    // Tentar fazer update com a nova coluna
    const { error: updateError } = await supabase
      .from('users')
      .update({ asaas_customer_id: null })
      .eq('id', userId);

    if (updateError) {
      if (updateError.message.includes('asaas_customer_id')) {
        console.log('❌ Coluna asaas_customer_id NÃO existe');
        console.log('\n📝 Execute este SQL no Supabase Dashboard (SQL Editor):');
        console.log('=' .repeat(60));
        console.log(`
ALTER TABLE users
ADD COLUMN asaas_customer_id TEXT;

CREATE INDEX idx_users_asaas_customer_id ON users(asaas_customer_id);

COMMENT ON COLUMN users.asaas_customer_id IS 'ID do cliente no Asaas';
        `);
        console.log('=' .repeat(60));
        console.log('\n🔗 Link: https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/sql/new');
      } else {
        console.error('❌ Erro desconhecido:', updateError);
      }
    } else {
      console.log('✅ Coluna asaas_customer_id já existe!');
    }
  }
}

addColumn();
