-- Migration 001: Initial schema with missing tables and columns
-- This migration addresses the critical gaps identified in GAP1.md

-- 1. Create payments table (was missing)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES convites(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK (method IN ('pix', 'credit_card', 'debit_card', 'balance')),
  status TEXT CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing columns to reservas table
ALTER TABLE reservas 
  ADD COLUMN IF NOT EXISTS observacoes TEXT,
  ADD COLUMN IF NOT EXISTS split_mode TEXT CHECK (split_mode IN ('percentual', 'valor_fixo')),
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES turmas(id) ON DELETE SET NULL;

-- 3. Add missing columns to reserva_participantes table
ALTER TABLE reserva_participantes
  ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('team', 'invite')),
  ADD COLUMN IF NOT EXISTS split_type TEXT CHECK (split_type IN ('percentual', 'valor_fixo')),
  ADD COLUMN IF NOT EXISTS split_value DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS amount_to_pay DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'free')) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) ON DELETE SET NULL;

-- 4. Add missing columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS rg TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS cep TEXT,
  ADD COLUMN IF NOT EXISTS number TEXT,
  ADD COLUMN IF NOT EXISTS complement TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('organizer', 'guest', 'both')),
  ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0;

-- 5. Add constraints for unique CPF and RG
ALTER TABLE users
  ADD CONSTRAINT IF NOT EXISTS users_cpf_unique UNIQUE (cpf),
  ADD CONSTRAINT IF NOT EXISTS users_rg_unique UNIQUE (rg);

-- 6. Update invitations table structure
ALTER TABLE convites
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS total_slots INTEGER,
  ADD COLUMN IF NOT EXISTS filled_slots INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_per_slot DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS invite_link TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 7. Verify invitation_acceptances table structure
ALTER TABLE aceites_convite
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'free')) DEFAULT 'pending';

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservas_data ON reservas(data);
CREATE INDEX IF NOT EXISTS idx_reservas_user_id ON reservas(user_id);
CREATE INDEX IF NOT EXISTS idx_convites_reserva_id ON convites(reserva_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes_credito(user_id);

-- 9. Create RLS policies (basic examples)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_participantes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own payments
CREATE POLICY IF NOT EXISTS "users_select_own_payments" ON payments
  FOR SELECT USING (auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'gestor')));

-- Policy: Users can only see participants in their reservations
CREATE POLICY IF NOT EXISTS "users_select_reservation_participants" ON reserva_participantes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reservas r 
      WHERE r.id = reserva_participantes.reserva_id 
      AND (r.user_id = auth.uid() OR 
           auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'gestor')))
    )
  );