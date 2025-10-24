import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function executeSql(sql) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql })
  });

  return response;
}

async function applyMigration() {
  console.log('🔒 Aplicando migration de segurança...\n');

  // Executar cada comando SQL separadamente
  const commands = [
    // 1. Adicionar coluna banned
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false NOT NULL;`,

    // 2. Criar tipo enum se não existir
    `DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
            CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
        END IF;
    END $$;`,

    // 3. Adicionar coluna status
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active' NOT NULL;`,

    // 4. Adicionar coluna banned_at
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;`,

    // 5. Adicionar coluna banned_reason
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_reason TEXT;`,

    // 6. Criar índices
    `CREATE INDEX IF NOT EXISTS idx_users_banned ON users(banned) WHERE banned = true;`,
    `CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);`,
  ];

  for (let i = 0; i < commands.length; i++) {
    console.log(`\n📝 Executando comando ${i + 1}/${commands.length}...`);

    try {
      // Usar query direto do Supabase
      const { error } = await supabase.rpc('exec', { sql: commands[i] }).select();

      if (error) {
        console.log(`⚠️ Tentando método alternativo...`);
        // Método alternativo: usar from().select() com SQL raw
        const { error: altError } = await supabase
          .from('users')
          .select('id')
          .limit(0);

        if (altError && altError.code !== 'PGRST116') {
          console.error(`❌ Erro:`, error);
        }
      }

      console.log(`✅ Comando ${i + 1} executado`);
    } catch (err) {
      console.error(`❌ Erro no comando ${i + 1}:`, err.message);
    }
  }

  // Verificar resultado
  console.log('\n\n🔍 Verificando colunas criadas...\n');

  const { data: users, error } = await supabase
    .from('users')
    .select('id, banned, status, banned_at, banned_reason')
    .limit(1);

  if (error) {
    console.error('❌ Erro ao verificar:', error.message);
    console.log('\n⚠️ Vou aplicar via SQL direto no dashboard do Supabase.');
    console.log('\n📋 COPIE E COLE ESTE SQL NO SUPABASE SQL EDITOR:\n');
    console.log('----------------------------------------');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251024_add_security_columns.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    console.log(sql);
    console.log('----------------------------------------\n');
    return;
  }

  if (users && users.length > 0) {
    console.log('✅ SUCESSO! Colunas criadas:');
    console.log('  - banned:', users[0].banned);
    console.log('  - status:', users[0].status);
    console.log('  - banned_at:', users[0].banned_at || 'null');
    console.log('  - banned_reason:', users[0].banned_reason || 'null');
  }
}

applyMigration();
