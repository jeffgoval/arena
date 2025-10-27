#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const createTableSQL = `
-- Tabela de logs de webhooks
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_webhook_logs_request_id ON public.webhook_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON public.webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_asaas_payment_id ON public.webhook_logs(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON public.webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Política: Apenas service role pode acessar
CREATE POLICY IF NOT EXISTS "Service role tem acesso total"
ON public.webhook_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Comentários
COMMENT ON TABLE public.webhook_logs IS 'Log de webhooks recebidos do Asaas';
COMMENT ON COLUMN public.webhook_logs.request_id IS 'ID único da requisição';
COMMENT ON COLUMN public.webhook_logs.event_type IS 'Tipo de evento (PAYMENT_RECEIVED, PAYMENT_CONFIRMED, etc)';
COMMENT ON COLUMN public.webhook_logs.asaas_payment_id IS 'ID do pagamento no Asaas';
COMMENT ON COLUMN public.webhook_logs.payload IS 'Payload completo do webhook';
COMMENT ON COLUMN public.webhook_logs.signature IS 'Assinatura do webhook para validação';
COMMENT ON COLUMN public.webhook_logs.status IS 'Status do processamento (received, processing, success, failed)';
COMMENT ON COLUMN public.webhook_logs.retry_count IS 'Número de tentativas de processamento';
`;

async function createTable() {
  try {
    console.log('🔄 Criando tabela webhook_logs...');

    const { error } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    }).single();

    if (error) {
      // Se o RPC não existir, tentar criar diretamente
      console.log('⚠️  RPC não disponível, tentando via SQL direto...');

      // Dividir em statements individuais para executar
      const statements = createTableSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        const { error: execError } = await supabase.rpc('exec_sql', {
          sql: statement
        });

        if (execError) {
          console.error(`❌ Erro ao executar statement:`, execError);
          console.log('💡 Execute o SQL manualmente no Supabase SQL Editor:');
          console.log('   https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new');
          console.log('\n📋 SQL a executar:\n');
          console.log(createTableSQL);
          process.exit(1);
        }
      }
    }

    // Verificar se a tabela foi criada
    const { data, error: checkError } = await supabase
      .from('webhook_logs')
      .select('id')
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar tabela:', checkError);
      console.log('\n💡 Execute o SQL manualmente no Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new');
      console.log('\n📋 SQL a executar:\n');
      console.log(createTableSQL);
      process.exit(1);
    }

    console.log('✅ Tabela webhook_logs criada com sucesso!');
    console.log('📊 Estrutura:');
    console.log('   - id (UUID, PK)');
    console.log('   - request_id (TEXT)');
    console.log('   - event_type (TEXT)');
    console.log('   - asaas_payment_id (TEXT)');
    console.log('   - payload (JSONB)');
    console.log('   - signature (TEXT)');
    console.log('   - status (TEXT)');
    console.log('   - error_message (TEXT)');
    console.log('   - retry_count (INTEGER)');
    console.log('   - processed_at (TIMESTAMP)');
    console.log('   - created_at (TIMESTAMP)');
    console.log('   - updated_at (TIMESTAMP)');
    console.log('\n✅ Índices criados para performance');
    console.log('✅ RLS habilitado com política para service role');

  } catch (error) {
    console.error('❌ Erro:', error);
    console.log('\n💡 Execute o SQL manualmente no Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new');
    console.log('\n📋 SQL a executar:\n');
    console.log(createTableSQL);
    process.exit(1);
  }
}

createTable();
