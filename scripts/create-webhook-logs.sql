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
DROP POLICY IF EXISTS "Service role tem acesso total" ON public.webhook_logs;
CREATE POLICY "Service role tem acesso total"
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
