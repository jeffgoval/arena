-- Criar tabela codigos_indicacao
CREATE TABLE IF NOT EXISTS public.codigos_indicacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT codigos_indicacao_codigo_length CHECK (char_length(codigo) >= 4)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_codigos_indicacao_usuario_id ON public.codigos_indicacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_codigos_indicacao_codigo ON public.codigos_indicacao(codigo) WHERE ativo = true;

-- RLS Policies
ALTER TABLE public.codigos_indicacao ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver apenas seu próprio código
CREATE POLICY "Usuários podem ver seu próprio código"
  ON public.codigos_indicacao
  FOR SELECT
  USING (auth.uid() = usuario_id);

-- Usuário pode criar seu próprio código (se não existir)
CREATE POLICY "Usuários podem criar seu próprio código"
  ON public.codigos_indicacao
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Comentários
COMMENT ON TABLE public.codigos_indicacao IS 'Códigos de indicação únicos para cada usuário';
COMMENT ON COLUMN public.codigos_indicacao.codigo IS 'Código único de 4-12 caracteres alfanuméricos';
