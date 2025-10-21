-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  invitation_id UUID REFERENCES invitations(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',

  -- External payment gateway reference
  transaction_id TEXT, -- Asaas transaction ID
  pix_qr_code TEXT, -- For Pix payments
  pix_copy_paste TEXT, -- For Pix payments

  -- Collateral (pre-authorization)
  is_collateral BOOLEAN DEFAULT false, -- RN-033
  collateral_amount DECIMAL(10, 2), -- Full amount pre-authorized
  captured_amount DECIMAL(10, 2) DEFAULT 0, -- Actually charged amount

  -- Metadata
  metadata JSONB, -- Additional payment data

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX idx_payments_invitation_id ON payments(invitation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Transactions table (financial ledger)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL, -- 'credit' or 'debit'
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  description TEXT NOT NULL,

  -- Related entity
  related_type related_type,
  related_id UUID,

  -- Balance after this transaction
  balance_after DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'credit' THEN
    UPDATE users SET balance = balance + NEW.amount WHERE id = NEW.user_id;
  ELSE
    UPDATE users SET balance = balance - NEW.amount WHERE id = NEW.user_id;
  END IF;

  -- Set balance_after to current balance
  SELECT balance INTO NEW.balance_after FROM users WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update balance when transaction is created
CREATE TRIGGER trigger_update_user_balance
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance();
