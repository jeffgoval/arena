-- Migração: Criar tabela de logs de webhook
-- Data: 27/10/2025
-- Objetivo: Rastrear todas as requisições do webhook Asaas para debug

-- Criar tabela webhook_logs
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  asaas_payment_id TEXT,
  payload JSONB NOT NULL,
  signature TEXT,
  status TEXT NOT NULL CHECK (status IN ('received', 'success', 'error', 'invalid_signature', 'processing')),
  error_message TEXT,
  error_stack TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_webhook_logs_request_id ON webhook_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_payment_id ON webhook_logs(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- Comentários
COMMENT ON TABLE webhook_logs IS 'Log de todas as requisições do webhook Asaas para auditoria e debug';
COMMENT ON COLUMN webhook_logs.request_id IS 'ID único da requisição gerado pelo sistema';
COMMENT ON COLUMN webhook_logs.event_type IS 'Tipo do evento (PAYMENT_CREATED, PAYMENT_CONFIRMED, etc)';
COMMENT ON COLUMN webhook_logs.asaas_payment_id IS 'ID do pagamento no Asaas';
COMMENT ON COLUMN webhook_logs.payload IS 'Payload JSON completo recebido do Asaas';
COMMENT ON COLUMN webhook_logs.signature IS 'Assinatura enviada no header asaas-signature';
COMMENT ON COLUMN webhook_logs.status IS 'Status do processamento (received, success, error, invalid_signature)';
COMMENT ON COLUMN webhook_logs.error_message IS 'Mensagem de erro caso tenha falhado';
COMMENT ON COLUMN webhook_logs.error_stack IS 'Stack trace do erro';
COMMENT ON COLUMN webhook_logs.processing_time_ms IS 'Tempo de processamento em milissegundos';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_webhook_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webhook_logs_updated_at
  BEFORE UPDATE ON webhook_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_logs_updated_at();

-- Função para limpar logs antigos (manter apenas 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM webhook_logs
  WHERE created_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_webhook_logs IS 'Remove logs de webhook com mais de 90 dias. Retorna quantidade deletada.';

-- RLS: Permitir insert/select sem autenticação (é um webhook externo)
-- Mas apenas a API interna pode acessar
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policy para service role (API interna) ter acesso total
CREATE POLICY "Service role tem acesso total a webhook_logs"
  ON webhook_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy para permitir insert anônimo (webhook do Asaas)
CREATE POLICY "Permitir insert de webhook externo"
  ON webhook_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Tabela webhook_logs criada com sucesso!';
  RAISE NOTICE '✅ Índices criados para otimização';
  RAISE NOTICE '✅ Função de limpeza automática configurada';
  RAISE NOTICE '✅ RLS configurado para segurança';
END $$;
