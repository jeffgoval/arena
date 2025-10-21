-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- Organizer
  court_id UUID REFERENCES courts(id) ON DELETE RESTRICT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type reservation_type NOT NULL DEFAULT 'single',
  status reservation_status DEFAULT 'pending',
  total_value DECIMAL(10, 2) NOT NULL,
  observations TEXT, -- RN-007: Max 500 characters (enforced in app)

  -- Team linking (RN-009: Max 1 team per reservation)
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,

  -- Cost splitting configuration (RN-016: Per reservation)
  split_mode split_mode,

  -- Recurring reservation settings
  parent_reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE, -- For recurring reservations
  recurrence_end_date DATE, -- When to stop recurring

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE, -- RN-022: Game closes 2h before

  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_observations_length CHECK (LENGTH(observations) <= 500) -- RN-007
);

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_court_id ON reservations(court_id);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_team_id ON reservations(team_id);
CREATE INDEX idx_reservations_parent_id ON reservations(parent_reservation_id);

-- Reservation participants table (from team or invitations)
CREATE TABLE reservation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Null if guest not registered yet
  player_name TEXT NOT NULL,
  source participant_source NOT NULL, -- 'team' or 'invite'

  -- Cost splitting
  split_type split_mode,
  split_value DECIMAL(10, 2), -- Can be percentage or fixed value
  amount_to_pay DECIMAL(10, 2), -- Calculated amount in BRL

  -- Payment
  payment_status payment_status DEFAULT 'pending',
  payment_id UUID, -- Reference to payments table

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reservation_participants_reservation_id ON reservation_participants(reservation_id);
CREATE INDEX idx_reservation_participants_user_id ON reservation_participants(user_id);
CREATE INDEX idx_reservation_participants_source ON reservation_participants(source);
CREATE INDEX idx_reservation_participants_payment_status ON reservation_participants(payment_status);
