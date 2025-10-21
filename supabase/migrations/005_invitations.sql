-- Invitations table (public invitations - RN-024 to RN-032)
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Name of invitation batch
  total_slots INTEGER NOT NULL CHECK (total_slots > 0),
  filled_slots INTEGER DEFAULT 0 CHECK (filled_slots >= 0),
  price_per_slot DECIMAL(10, 2) NOT NULL CHECK (price_per_slot >= 0), -- RN-020: Can be 0
  invite_link TEXT UNIQUE NOT NULL, -- RN-029: Unique link
  status invitation_status DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- RN-027: Auto-close 2h before game

  CONSTRAINT valid_filled_slots CHECK (filled_slots <= total_slots)
);

CREATE INDEX idx_invitations_reservation_id ON invitations(reservation_id);
CREATE INDEX idx_invitations_link ON invitations(invite_link);
CREATE INDEX idx_invitations_status ON invitations(status);

-- Invitation acceptances table (RN-030: Guests get full profile)
CREATE TABLE invitation_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- Guest who accepted
  payment_id UUID, -- Reference to payments table
  payment_status payment_status DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invitation_acceptances_invitation_id ON invitation_acceptances(invitation_id);
CREATE INDEX idx_invitation_acceptances_user_id ON invitation_acceptances(user_id);
CREATE INDEX idx_invitation_acceptances_payment_status ON invitation_acceptances(payment_status);

-- Unique constraint: user can only accept same invitation once
CREATE UNIQUE INDEX idx_invitation_acceptances_unique ON invitation_acceptances(invitation_id, user_id);

-- Function to generate unique invitation link
CREATE OR REPLACE FUNCTION generate_invite_link()
RETURNS TEXT AS $$
DECLARE
  link TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 12-character code
    link := encode(gen_random_bytes(9), 'base64');
    link := REPLACE(link, '/', '_');
    link := REPLACE(link, '+', '-');
    link := SUBSTRING(link, 1, 12);

    -- Check if link already exists
    SELECT COUNT(*) > 0 INTO exists FROM invitations WHERE invite_link = link;
    EXIT WHEN NOT exists;
  END LOOP;

  RETURN link;
END;
$$ LANGUAGE plpgsql;
