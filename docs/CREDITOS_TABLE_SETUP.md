# Setup da Tabela Créditos

## Problema Identificado

A página "Meus Créditos" está apresentando erro porque a tabela `creditos` não existe no banco de dados.

## Solução

Execute o SQL abaixo no Supabase SQL Editor para criar a tabela.

### Acesse o SQL Editor

🔗 [Abrir Supabase SQL Editor](https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new)

### SQL para Executar

```sql
-- Criar tabela de créditos
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_creditos_usuario_id ON public.creditos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_creditos_status ON public.creditos(status);
CREATE INDEX IF NOT EXISTS idx_creditos_tipo ON public.creditos(tipo);
CREATE INDEX IF NOT EXISTS idx_creditos_data_expiracao ON public.creditos(data_expiracao);

-- Criar função para atualizar updated_at automaticamente
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

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.creditos ENABLE ROW LEVEL SECURITY;

-- Política RLS: Usuários podem ver apenas seus próprios créditos
DROP POLICY IF EXISTS "Usuários podem ver seus próprios créditos" ON public.creditos;
CREATE POLICY "Usuários podem ver seus próprios créditos"
  ON public.creditos
  FOR SELECT
  USING (auth.uid() = usuario_id);

-- Política RLS: Apenas service role pode inserir créditos
DROP POLICY IF EXISTS "Service role pode inserir créditos" ON public.creditos;
CREATE POLICY "Service role pode inserir créditos"
  ON public.creditos
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Política RLS: Apenas service role pode atualizar créditos
DROP POLICY IF EXISTS "Service role pode atualizar créditos" ON public.creditos;
CREATE POLICY "Service role pode atualizar créditos"
  ON public.creditos
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Adicionar comentários para documentação
COMMENT ON TABLE public.creditos IS 'Sistema de créditos dos usuários';
COMMENT ON COLUMN public.creditos.tipo IS 'Tipo: compra, bonus, indicacao, promocao, uso, expiracao';
COMMENT ON COLUMN public.creditos.valor IS 'Valor em reais (positivo=entrada, negativo=saída)';
COMMENT ON COLUMN public.creditos.status IS 'Status: ativo, usado, expirado';
COMMENT ON COLUMN public.creditos.data_expiracao IS 'Data de expiração (null se não expira)';
```

### Após Executar

1. Verifique se a tabela foi criada com sucesso
2. Recarregue a página "Meus Créditos"
3. O erro deve estar resolvido

## Estrutura da Tabela

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único do registro |
| usuario_id | UUID | ID do usuário (FK para users) |
| tipo | TEXT | Tipo de transação |
| valor | DECIMAL | Valor em reais |
| descricao | TEXT | Descrição da transação |
| status | TEXT | Status do crédito |
| data_expiracao | TIMESTAMP | Data de expiração |
| reserva_id | UUID | ID da reserva relacionada (opcional) |
| indicacao_id | UUID | ID da indicação relacionada (opcional) |
| metodo_pagamento | TEXT | Método de pagamento (opcional) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

## Tipos de Transação

- `compra`: Compra de créditos
- `bonus`: Bônus recebido
- `indicacao`: Crédito por indicação
- `promocao`: Crédito promocional
- `uso`: Uso de créditos (valor negativo)
- `expiracao`: Expiração de créditos

## Status

- `ativo`: Crédito disponível para uso
- `usado`: Crédito já utilizado
- `expirado`: Crédito expirado

## Segurança (RLS)

- Usuários podem ver apenas seus próprios créditos
- Apenas o service role (API) pode inserir/atualizar créditos
- Proteção contra manipulação direta pelos usuários
