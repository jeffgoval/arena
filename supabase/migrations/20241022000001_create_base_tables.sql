-- =====================================================
-- MIGRATION: Criar tabelas base do sistema
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: profiles (perfis de usuários)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT,
  data_nascimento DATE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  whatsapp TEXT NOT NULL,
  cep TEXT NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('cliente', 'gestor', 'admin')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_profiles_cpf ON profiles(cpf);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- TABELA: courts (quadras)
-- =====================================================
CREATE TABLE IF NOT EXISTS courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('society', 'beach_tennis', 'volei', 'futvolei')),
  descricao TEXT,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_courts_tipo ON courts(tipo);
CREATE INDEX idx_courts_ativa ON courts(ativa);

-- RLS
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver quadras ativas"
  ON courts FOR SELECT
  TO authenticated
  USING (ativa = true);

CREATE POLICY "Apenas gestores podem gerenciar quadras"
  ON courts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('gestor', 'admin')
    )
  );

-- =====================================================
-- TABELA: schedules (horários das quadras)
-- =====================================================
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadra_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  valor_avulsa DECIMAL(10, 2) NOT NULL,
  valor_mensalista DECIMAL(10, 2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quadra_id, dia_semana, hora_inicio)
);

-- Índices
CREATE INDEX idx_schedules_quadra_id ON schedules(quadra_id);
CREATE INDEX idx_schedules_dia_semana ON schedules(dia_semana);
CREATE INDEX idx_schedules_ativo ON schedules(ativo);

-- RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver horários ativos"
  ON schedules FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Apenas gestores podem gerenciar horários"
  ON schedules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('gestor', 'admin')
    )
  );

-- =====================================================
-- TABELA: reservations (reservas)
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizador_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quadra_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  horario_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('avulsa', 'mensalista', 'recorrente')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
  valor_total DECIMAL(10, 2) NOT NULL,
  observacoes TEXT,
  turma_id UUID,
  rateio_modo TEXT CHECK (rateio_modo IN ('percentual', 'fixo')),
  rateio_configurado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quadra_id, horario_id, data)
);

-- Índices
CREATE INDEX idx_reservations_organizador_id ON reservations(organizador_id);
CREATE INDEX idx_reservations_quadra_id ON reservations(quadra_id);
CREATE INDEX idx_reservations_data ON reservations(data);
CREATE INDEX idx_reservations_status ON reservations(status);

-- RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias reservas"
  ON reservations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = organizador_id OR
    EXISTS (
      SELECT 1 FROM reservation_participants
      WHERE reserva_id = reservations.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar reservas"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizador_id);

CREATE POLICY "Organizador pode atualizar suas reservas"
  ON reservations FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizador_id)
  WITH CHECK (auth.uid() = organizador_id);

CREATE POLICY "Gestores podem ver todas as reservas"
  ON reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('gestor', 'admin')
    )
  );

-- =====================================================
-- TABELA: reservation_participants (participantes)
-- =====================================================
CREATE TABLE IF NOT EXISTS reservation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  origem TEXT NOT NULL CHECK (origem IN ('turma', 'convite')),
  convite_id UUID,
  valor_rateio DECIMAL(10, 2),
  percentual_rateio DECIMAL(5, 2),
  status_pagamento TEXT NOT NULL DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago', 'reembolsado')),
  valor_pago DECIMAL(10, 2),
  data_pagamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_reservation_participants_reserva_id ON reservation_participants(reserva_id);
CREATE INDEX idx_reservation_participants_user_id ON reservation_participants(user_id);
CREATE INDEX idx_reservation_participants_status_pagamento ON reservation_participants(status_pagamento);

-- RLS
ALTER TABLE reservation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participantes podem ver suas participações"
  ON reservation_participants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM reservations
      WHERE id = reserva_id AND organizador_id = auth.uid()
    )
  );

-- =====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courts_updated_at
  BEFORE UPDATE ON courts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTÁRIOS
-- =====================================================
COMMENT ON TABLE profiles IS 'Perfis de usuários do sistema';
COMMENT ON TABLE courts IS 'Quadras esportivas disponíveis';
COMMENT ON TABLE schedules IS 'Horários disponíveis para cada quadra';
COMMENT ON TABLE reservations IS 'Reservas de quadras';
COMMENT ON TABLE reservation_participants IS 'Participantes de cada reserva';
