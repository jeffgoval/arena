-- Tabela para configurações do sistema de indicação
CREATE TABLE configuracao_indicacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creditos_por_indicacao INTEGER NOT NULL DEFAULT 50,
  dias_expiracao_convite INTEGER NOT NULL DEFAULT 30,
  bonus_multiplas_indicacoes JSONB DEFAULT '[]'::jsonb,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para códigos de indicação dos usuários
CREATE TABLE codigos_indicacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  total_indicacoes INTEGER DEFAULT 0,
  total_creditos_recebidos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para indicações
CREATE TABLE indicacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_indicador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usuario_indicado_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  codigo_indicacao VARCHAR(20) NOT NULL REFERENCES codigos_indicacao(codigo),
  email_indicado VARCHAR(255),
  nome_indicado VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'expirada')),
  creditos_concedidos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_aceite TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL,
  
  CONSTRAINT indicacoes_email_ou_usuario CHECK (
    (usuario_indicado_id IS NOT NULL) OR (email_indicado IS NOT NULL)
  )
);

-- Tabela para créditos de indicação
CREATE TABLE creditos_indicacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  indicacao_id UUID NOT NULL REFERENCES indicacoes(id) ON DELETE CASCADE,
  valor_credito INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('indicacao_aceita', 'bonus_multiplas_indicacoes')),
  descricao TEXT NOT NULL,
  usado BOOLEAN DEFAULT false,
  data_uso TIMESTAMP WITH TIME ZONE,
  reserva_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_codigos_indicacao_usuario ON codigos_indicacao(usuario_id);
CREATE INDEX idx_codigos_indicacao_codigo ON codigos_indicacao(codigo);
CREATE INDEX idx_indicacoes_indicador ON indicacoes(usuario_indicador_id);
CREATE INDEX idx_indicacoes_indicado ON indicacoes(usuario_indicado_id);
CREATE INDEX idx_indicacoes_codigo ON indicacoes(codigo_indicacao);
CREATE INDEX idx_indicacoes_status ON indicacoes(status);
CREATE INDEX idx_creditos_usuario ON creditos_indicacao(usuario_id);
CREATE INDEX idx_creditos_usado ON creditos_indicacao(usado);

-- Função para gerar código de indicação único
CREATE OR REPLACE FUNCTION gerar_codigo_indicacao()
RETURNS TEXT AS $$
DECLARE
  codigo TEXT;
  existe BOOLEAN;
BEGIN
  LOOP
    -- Gera código de 8 caracteres (letras maiúsculas e números)
    codigo := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Verifica se já existe
    SELECT EXISTS(SELECT 1 FROM codigos_indicacao WHERE codigo = codigo) INTO existe;
    
    IF NOT existe THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar código de indicação automaticamente para novos usuários
CREATE OR REPLACE FUNCTION criar_codigo_indicacao_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO codigos_indicacao (usuario_id, codigo)
  VALUES (NEW.id, gerar_codigo_indicacao());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_criar_codigo_indicacao
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION criar_codigo_indicacao_usuario();

-- Função para processar indicação aceita
CREATE OR REPLACE FUNCTION processar_indicacao_aceita()
RETURNS TRIGGER AS $$
DECLARE
  config_creditos INTEGER;
  codigo_record RECORD;
BEGIN
  -- Só processa se o status mudou para 'aceita'
  IF NEW.status = 'aceita' AND (OLD.status IS NULL OR OLD.status != 'aceita') THEN
    -- Busca configuração de créditos
    SELECT creditos_por_indicacao INTO config_creditos 
    FROM configuracao_indicacao 
    WHERE ativo = true 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    IF config_creditos IS NULL THEN
      config_creditos := 50; -- Valor padrão
    END IF;
    
    -- Atualiza créditos concedidos na indicação
    NEW.creditos_concedidos := config_creditos;
    NEW.data_aceite := NOW();
    
    -- Cria crédito para o usuário indicador
    INSERT INTO creditos_indicacao (
      usuario_id, 
      indicacao_id, 
      valor_credito, 
      tipo, 
      descricao
    ) VALUES (
      NEW.usuario_indicador_id,
      NEW.id,
      config_creditos,
      'indicacao_aceita',
      'Crédito recebido por indicação aceita'
    );
    
    -- Atualiza estatísticas do código de indicação
    UPDATE codigos_indicacao 
    SET 
      total_indicacoes = total_indicacoes + 1,
      total_creditos_recebidos = total_creditos_recebidos + config_creditos,
      updated_at = NOW()
    WHERE codigo = NEW.codigo_indicacao;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_processar_indicacao_aceita
  BEFORE UPDATE ON indicacoes
  FOR EACH ROW
  EXECUTE FUNCTION processar_indicacao_aceita();

-- Função para expirar indicações antigas
CREATE OR REPLACE FUNCTION expirar_indicacoes_antigas()
RETURNS void AS $$
BEGIN
  UPDATE indicacoes 
  SET status = 'expirada'
  WHERE status = 'pendente' 
    AND data_expiracao < NOW();
END;
$$ LANGUAGE plpgsql;

-- Inserir configuração padrão
INSERT INTO configuracao_indicacao (
  creditos_por_indicacao,
  dias_expiracao_convite,
  bonus_multiplas_indicacoes,
  ativo
) VALUES (
  50,
  30,
  '[
    {"quantidade": 5, "creditos_bonus": 25},
    {"quantidade": 10, "creditos_bonus": 50},
    {"quantidade": 20, "creditos_bonus": 100}
  ]'::jsonb,
  true
);

-- RLS (Row Level Security) policies
ALTER TABLE codigos_indicacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE creditos_indicacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracao_indicacao ENABLE ROW LEVEL SECURITY;

-- Políticas para codigos_indicacao
CREATE POLICY "Usuários podem ver seus próprios códigos" ON codigos_indicacao
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seus próprios códigos" ON codigos_indicacao
  FOR UPDATE USING (auth.uid() = usuario_id);

-- Políticas para indicacoes
CREATE POLICY "Usuários podem ver suas indicações" ON indicacoes
  FOR SELECT USING (
    auth.uid() = usuario_indicador_id OR 
    auth.uid() = usuario_indicado_id
  );

CREATE POLICY "Usuários podem criar indicações" ON indicacoes
  FOR INSERT WITH CHECK (auth.uid() = usuario_indicador_id);

CREATE POLICY "Usuários podem atualizar suas indicações" ON indicacoes
  FOR UPDATE USING (
    auth.uid() = usuario_indicador_id OR 
    auth.uid() = usuario_indicado_id
  );

-- Políticas para creditos_indicacao
CREATE POLICY "Usuários podem ver seus próprios créditos" ON creditos_indicacao
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Sistema pode criar créditos" ON creditos_indicacao
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar seus próprios créditos" ON creditos_indicacao
  FOR UPDATE USING (auth.uid() = usuario_id);

-- Políticas para configuracao_indicacao (apenas leitura para usuários)
CREATE POLICY "Todos podem ver configurações ativas" ON configuracao_indicacao
  FOR SELECT USING (ativo = true);