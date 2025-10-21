-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user ID from users table
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    (SELECT id FROM users WHERE auth_id = auth.uid()),
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function to check if user is manager
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
    AND user_type = 'manager'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- USERS policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth_id = auth.uid() OR is_manager());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth_id = auth.uid());

CREATE POLICY "Anyone can create user during signup"
  ON users FOR INSERT
  WITH CHECK (true);

-- COURTS policies (public read, manager write)
CREATE POLICY "Anyone can view active courts"
  ON courts FOR SELECT
  USING (status = 'active' OR is_manager());

CREATE POLICY "Only managers can manage courts"
  ON courts FOR ALL
  USING (is_manager());

-- SCHEDULES policies (public read, manager write)
CREATE POLICY "Anyone can view active schedules"
  ON schedules FOR SELECT
  USING (status = 'active' OR is_manager());

CREATE POLICY "Only managers can manage schedules"
  ON schedules FOR ALL
  USING (is_manager());

-- TEAMS policies
CREATE POLICY "Users can view their own teams"
  ON teams FOR SELECT
  USING (user_id = get_current_user_id() OR is_manager());

CREATE POLICY "Users can create their own teams"
  ON teams FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can update their own teams"
  ON teams FOR UPDATE
  USING (user_id = get_current_user_id());

CREATE POLICY "Users can delete their own teams"
  ON teams FOR DELETE
  USING (user_id = get_current_user_id());

-- TEAM MEMBERS policies
CREATE POLICY "Users can view members of their teams"
  ON team_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM teams WHERE teams.id = team_members.team_id AND teams.user_id = get_current_user_id())
    OR is_manager()
  );

CREATE POLICY "Users can manage members of their teams"
  ON team_members FOR ALL
  USING (
    EXISTS (SELECT 1 FROM teams WHERE teams.id = team_members.team_id AND teams.user_id = get_current_user_id())
  );

-- RESERVATIONS policies
CREATE POLICY "Users can view their own reservations"
  ON reservations FOR SELECT
  USING (user_id = get_current_user_id() OR is_manager());

CREATE POLICY "Users can view reservations they're participating in"
  ON reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reservation_participants
      WHERE reservation_participants.reservation_id = reservations.id
      AND reservation_participants.user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can update their own reservations"
  ON reservations FOR UPDATE
  USING (user_id = get_current_user_id() OR is_manager());

-- INVITATIONS policies
CREATE POLICY "Anyone can view active invitations"
  ON invitations FOR SELECT
  USING (status = 'active' OR is_manager());

CREATE POLICY "Organizers can manage their reservation invitations"
  ON invitations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM reservations
      WHERE reservations.id = invitations.reservation_id
      AND reservations.user_id = get_current_user_id()
    )
    OR is_manager()
  );

-- INVITATION ACCEPTANCES policies
CREATE POLICY "Users can view their own acceptances"
  ON invitation_acceptances FOR SELECT
  USING (user_id = get_current_user_id() OR is_manager());

CREATE POLICY "Users can accept invitations"
  ON invitation_acceptances FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- PAYMENTS policies
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (user_id = get_current_user_id() OR is_manager());

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- TRANSACTIONS policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (user_id = get_current_user_id() OR is_manager());

-- REVIEWS policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their reservations"
  ON reviews FOR INSERT
  WITH CHECK (
    user_id = get_current_user_id() AND
    EXISTS (
      SELECT 1 FROM reservation_participants
      WHERE reservation_participants.reservation_id = reviews.reservation_id
      AND reservation_participants.user_id = get_current_user_id()
    )
  );
