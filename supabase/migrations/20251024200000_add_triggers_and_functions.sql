-- Migration: Add triggers and functions for automatic updates
-- This migration addresses the triggers and functions gaps identified in GAP1.md

-- 1. Function to decrement filled_slots when invitation is accepted
CREATE OR REPLACE FUNCTION decrement_convite_filled_slots()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement filled_slots in convites table when a new acceptance is created
  UPDATE convites 
  SET filled_slots = filled_slots - 1
  WHERE id = NEW.convite_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to update user balance after credit transaction
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user balance when credit transaction is created/updated
  UPDATE users 
  SET balance = balance + NEW.valor
  WHERE id = NEW.usuario_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to calculate rateio automatically
CREATE OR REPLACE FUNCTION calculate_rateio_amount()
RETURNS TRIGGER AS $$
DECLARE
  total_reservation_value DECIMAL(10,2);
  total_paid_amount DECIMAL(10,2);
  remaining_amount DECIMAL(10,2);
BEGIN
  -- Get total reservation value
  SELECT valor_total INTO total_reservation_value
  FROM reservas
  WHERE id = NEW.reserva_id;
  
  -- Get sum of all paid amounts for this reservation
  SELECT COALESCE(SUM(amount_to_pay), 0) INTO total_paid_amount
  FROM reserva_participantes
  WHERE reserva_id = NEW.reserva_id
  AND id != NEW.id
  AND payment_status IN ('paid', 'free');
  
  -- Calculate remaining amount for organizer
  remaining_amount := total_reservation_value - total_paid_amount;
  
  -- If this is the organizer's record, set the remaining amount
  -- (This would need to be adjusted based on your specific logic)
  IF NEW.user_id = (
    SELECT organizador_id 
    FROM reservas 
    WHERE id = NEW.reserva_id
  ) THEN
    NEW.amount_to_pay := remaining_amount;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to decrement filled_slots when invitation is accepted
-- Only create if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_decrement_convite_filled_slots'
  ) THEN
    CREATE TRIGGER trigger_decrement_convite_filled_slots
      AFTER INSERT ON aceites_convite
      FOR EACH ROW
      EXECUTE FUNCTION decrement_convite_filled_slots();
  END IF;
END
$$;

-- 5. Trigger to update user balance after credit transaction
-- Only create if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_user_balance'
  ) THEN
    CREATE TRIGGER trigger_update_user_balance
      AFTER INSERT OR UPDATE ON transacoes_credito
      FOR EACH ROW
      EXECUTE FUNCTION update_user_balance();
  END IF;
END
$$;

-- 6. Trigger to calculate rateio amount automatically
-- This trigger would need to be adjusted based on your specific table structure
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_calculate_rateio_amount'
--   ) THEN
--     CREATE TRIGGER trigger_calculate_rateio_amount
--       BEFORE INSERT OR UPDATE ON reserva_participantes
--       FOR EACH ROW
--       EXECUTE FUNCTION calculate_rateio_amount();
--   END IF;
-- END
-- $$;

-- 7. Additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aceites_convite_convite_id ON aceites_convite(convite_id);
CREATE INDEX IF NOT EXISTS idx_aceites_convite_user_id ON aceites_convite(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_credito_created_at ON transacoes_credito(created_at);
CREATE INDEX IF NOT EXISTS idx_reserva_participantes_reserva_id ON reserva_participantes(reserva_id);
CREATE INDEX IF NOT EXISTS idx_reserva_participantes_user_id ON reserva_participantes(user_id);
CREATE INDEX IF NOT EXISTS idx_reserva_participantes_payment_status ON reserva_participantes(payment_status);

-- 8. Additional RLS policies
ALTER TABLE aceites_convite ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_credito ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own invitation acceptances
CREATE POLICY IF NOT EXISTS "users_select_own_aceites" ON aceites_convite
  FOR SELECT USING (auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'gestor')));

-- Policy: Users can only see their own credit transactions
CREATE POLICY IF NOT EXISTS "users_select_own_transacoes" ON transacoes_credito
  FOR SELECT USING (auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'gestor')));

-- Policy: Users can insert their own invitation acceptances
CREATE POLICY IF NOT EXISTS "users_insert_own_aceites" ON aceites_convite
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: System can insert credit transactions
CREATE POLICY IF NOT EXISTS "system_insert_transacoes" ON transacoes_credito
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'gestor')) OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid())
  );