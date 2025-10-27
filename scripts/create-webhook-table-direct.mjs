#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local do diretório raiz
config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  asaas_payment_id TEXT,
  payload JSONB NOT NULL,
  signature TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_request_id ON public.webhook_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON public.webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_asaas_payment_id ON public.webhook_logs(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON public.webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role tem acesso total" ON public.webhook_logs;
CREATE POLICY "Service role tem acesso total"
ON public.webhook_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
`;

console.log('🔄 Criando tabela webhook_logs via SQL...\n');

// Extrair database connection info
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Não foi possível extrair project ref');
  process.exit(1);
}

console.log('✅ Project Ref:', projectRef);
console.log('\n📋 SQL a ser executado:\n');
console.log('─'.repeat(80));
console.log(createTableSQL);
console.log('─'.repeat(80));

console.log('\n💡 Para executar este SQL:');
console.log(`   1. Acesse: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
console.log(`   2. Cole o SQL acima`);
console.log(`   3. Clique em "Run"`);
console.log(`\n   OU copie o arquivo: scripts/create-webhook-logs.sql\n`);

console.log('🔄 Tentando criar via API...\n');

// Tentar criar diretamente
try {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  });

  if (response.ok) {
    console.log('✅ Conexão com Supabase estabelecida');
    console.log('\n⚠️  A criação de tabelas via API REST não é suportada');
    console.log('💡 Por favor, execute o SQL manualmente no dashboard do Supabase\n');
  } else {
    console.error('❌ Erro ao conectar com Supabase:', response.statusText);
  }
} catch (error) {
  console.error('❌ Erro:', error.message);
}
