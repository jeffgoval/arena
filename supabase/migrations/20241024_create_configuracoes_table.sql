-- Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parâmetros do Sistema
  antecedencia_minima INTEGER DEFAULT 2,
  antecedencia_maxima INTEGER DEFAULT 30,
  dia_vencimento INTEGER DEFAULT 25,
  hora_limite_reserva INTEGER DEFAULT 22,

  -- Política de Cancelamento
  cancelamento_gratuito INTEGER DEFAULT 24,
  multa_cancelamento NUMERIC(5,2) DEFAULT 30,
  reembolso_total INTEGER DEFAULT 48,
  permite_cancelamento BOOLEAN DEFAULT true,

  -- Formas de Pagamento
  pagamento_pix BOOLEAN DEFAULT true,
  pagamento_cartao BOOLEAN DEFAULT true,
  pagamento_dinheiro BOOLEAN DEFAULT true,
  pagamento_transferencia BOOLEAN DEFAULT true,
  taxa_conveniencia NUMERIC(5,2) DEFAULT 3.5,
  valor_minimo NUMERIC(10,2) DEFAULT 50,

  -- Notificações
  notif_whatsapp BOOLEAN DEFAULT true,
  notif_email BOOLEAN DEFAULT true,
  notif_sms BOOLEAN DEFAULT false,
  lembrete_antes INTEGER DEFAULT 45,
  lembrete_final INTEGER DEFAULT 10,

  -- Descontos e Bônus
  desconto_mensalista NUMERIC(5,2) DEFAULT 15,
  desconto_primeira_reserva NUMERIC(5,2) DEFAULT 10,
  bonus_indicacao NUMERIC(10,2) DEFAULT 20,
  desconto_recorrente NUMERIC(5,2) DEFAULT 5,
  bonus_aniversario NUMERIC(10,2) DEFAULT 50,
  desconto_grupo NUMERIC(5,2) DEFAULT 8,
  minimo_participantes_desconto INTEGER DEFAULT 10,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garantir que só existe uma linha de configurações (singleton pattern)
CREATE UNIQUE INDEX IF NOT EXISTS configuracoes_singleton ON configuracoes ((true));

-- Inserir configurações padrão (se não existir)
INSERT INTO configuracoes (
  antecedencia_minima,
  antecedencia_maxima,
  dia_vencimento,
  hora_limite_reserva,
  cancelamento_gratuito,
  multa_cancelamento,
  reembolso_total,
  permite_cancelamento,
  pagamento_pix,
  pagamento_cartao,
  pagamento_dinheiro,
  pagamento_transferencia,
  taxa_conveniencia,
  valor_minimo,
  notif_whatsapp,
  notif_email,
  notif_sms,
  lembrete_antes,
  lembrete_final,
  desconto_mensalista,
  desconto_primeira_reserva,
  bonus_indicacao,
  desconto_recorrente,
  bonus_aniversario,
  desconto_grupo,
  minimo_participantes_desconto
)
VALUES (
  2, 30, 25, 22,
  24, 30, 48, true,
  true, true, true, true, 3.5, 50,
  true, true, false, 45, 10,
  15, 10, 20, 5, 50, 8, 10
)
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas: apenas admins/gestores podem ver e modificar
CREATE POLICY "Admins podem ver configurações"
  ON configuracoes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'gestor')
    )
  );

CREATE POLICY "Admins podem atualizar configurações"
  ON configuracoes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'gestor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'gestor')
    )
  );
