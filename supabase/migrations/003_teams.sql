-- Teams table (autonomous teams - RN-008 to RN-015)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- Team owner
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teams_user_id ON teams(user_id);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  player_name TEXT NOT NULL,
  player_phone TEXT NOT NULL,
  player_email TEXT,
  is_fixed BOOLEAN DEFAULT false, -- RN-013: Fixed members auto-included
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_is_fixed ON team_members(is_fixed);

-- Add constraint to ensure team name is unique per user
CREATE UNIQUE INDEX idx_teams_user_name ON teams(user_id, LOWER(name));
