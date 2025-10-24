import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Criando tabela via Supabase Service Role...\n');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SQL simplificado - criar tabela diretamente
const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.creditos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  data_expiracao TIMESTAMP WITH TIME ZONE,
  reserva_id UUID,
  indicacao_id UUID,
  metodo_pagamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

try {
  console.log('📝 Tentando criar tabela...\n');

  // Fazer requisição POST direta para o endpoint REST
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'resolution=ignore-duplicates'
    },
    body: JSON.stringify({
      query: createTableSQL
    })
  });

  console.log(`Status: ${response.status}`);

  if (!response.ok) {
    console.log('\n⚠️  Não foi possível criar via REST API\n');
    console.log('📋 INSTRUÇÕES MANUAIS:\n');
    console.log('1. O navegador está aberto no SQL Editor');
    console.log('2. O SQL está copiado no clipboard');
    console.log('3. Cole (Ctrl+V) e clique em RUN');
    console.log('\nOU execute este comando PostgreSQL:\n');
    console.log('psql "postgresql://[USER]:[PASSWORD]@db.mowmpjdgvoeldvrqutvb.supabase.co:5432/postgres" -c "' + createTableSQL.replace(/\n/g, ' ') + '"');
  }

} catch (error) {
  console.error('❌ Erro:', error.message);
  console.log('\n📋 Por favor, execute manualmente no Supabase Dashboard');
  console.log('🔗 Navegador já aberto com SQL copiado');
}
