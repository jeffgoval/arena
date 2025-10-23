-- =====================================================
-- MIGRATION: Criar tabela de avaliações (reviews)
-- Depende de: 20241022000001_create_base_tables.sql
-- =====================================================

-- Criar tabela de avaliações (reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que cada usuário só pode avaliar uma reserva uma vez
  UNIQUE(reserva_id, user_id)
);

-- Índices para melhor performance
CREATE INDEX idx_reviews_reserva_id ON reviews(reserva_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
-- Usuários podem ver todas as avaliações
CREATE POLICY "Usuários podem ver avaliações"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

-- Usuários podem criar avaliações para suas próprias reservas
CREATE POLICY "Usuários podem criar avaliações"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND (
      -- É o organizador da reserva
      EXISTS (
        SELECT 1 FROM reservations
        WHERE id = reserva_id AND organizador_id = auth.uid()
      )
      OR
      -- É participante da reserva
      EXISTS (
        SELECT 1 FROM reservation_participants
        WHERE reserva_id = reviews.reserva_id AND user_id = auth.uid()
      )
    )
  );

-- Usuários podem atualizar suas próprias avaliações
CREATE POLICY "Usuários podem atualizar suas avaliações"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar suas próprias avaliações
CREATE POLICY "Usuários podem deletar suas avaliações"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comentários
COMMENT ON TABLE reviews IS 'Avaliações de reservas pelos usuários';
COMMENT ON COLUMN reviews.rating IS 'Avaliação de 1 a 5 estrelas';
COMMENT ON COLUMN reviews.comentario IS 'Comentário opcional sobre a experiência';
