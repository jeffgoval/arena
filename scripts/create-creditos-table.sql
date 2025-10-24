-- Criar tabela de créditos se não existir
CREATE TABLE IF NOT EXISTS public.creditos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('compra', 'bonus', 'indicacao', 'promocao', 'uso', 'expiracao')),
  valor DECIMAL(10, 2) NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'usado', 'expirado')),
  data_expiracao TIMESTAMP WITH TIME ZONE,
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE SET NULL,
  indicacao_id UUID REFERENCES public.indicacoes(id) ON DELETE SET NULL,
  metodo_pagamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_creditos_usuario_id ON public.creditos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_creditos_status ON public.creditos(status);
CREATE INDEX IF NOT EXISTS idx_creditos_tipo ON public.creditos(tipo);
CREATE INDEX IF NOT EXISTS idx_creditos_data_expiracao ON public.creditos(data_expiracao);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_creditos_updated_at ON public.creditos;
CREATE TRIGGER update_creditos_updated_at
  BEFORE UPDATE ON public.creditos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.creditos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Política para leitura (usuário pode ver apenas seus próprios créditos)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios créditos" ON public.creditos;
CREATE POLICY "Usuários podem ver seus próprios créditos"
  ON public.creditos
  FOR SELECT
  USING (auth.uid() = usuario_id);

-- Política para inserção (apenas service role pode inserir diretamente)
DROP POLICY IF EXISTS "Service role pode inserir créditos" ON public.creditos;
CREATE POLICY "Service role pode inserir créditos"
  ON public.creditos
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Política para atualização (apenas service role pode atualizar)
DROP POLICY IF EXISTS "Service role pode atualizar créditos" ON public.creditos;
CREATE POLICY "Service role pode atualizar créditos"
  ON public.creditos
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Comentários
COMMENT ON TABLE public.creditos IS 'Tabela para gerenciar sistema de créditos dos usuários';
COMMENT ON COLUMN public.creditos.tipo IS 'Tipo de transação: compra, bonus, indicacao, promocao, uso, expiracao';
COMMENT ON COLUMN public.creditos.valor IS 'Valor da transação em reais (positivo para entrada, negativo para saída)';
COMMENT ON COLUMN public.creditos.status IS 'Status do crédito: ativo, usado, expirado';
COMMENT ON COLUMN public.creditos.data_expiracao IS 'Data de expiração do crédito (null se não expira)';
