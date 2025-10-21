-- PostgreSQL gen_random_uuid() is available by default in PG 13+

-- Create custom types/enums
CREATE TYPE user_type AS ENUM ('organizer', 'guest', 'manager', 'both');
CREATE TYPE reservation_type AS ENUM ('single', 'monthly', 'recurring');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'debit_card', 'balance', 'collateral');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'refunded');
CREATE TYPE split_mode AS ENUM ('percentage', 'fixed_value');
CREATE TYPE participant_source AS ENUM ('team', 'invite');
CREATE TYPE invitation_status AS ENUM ('active', 'closed', 'expired');
CREATE TYPE review_rating AS ENUM ('excellent', 'good', 'regular', 'poor');
CREATE TYPE referral_status AS ENUM ('pending', 'completed');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE related_type AS ENUM ('reservation', 'invitation', 'purchase', 'refund');
CREATE TYPE court_status AS ENUM ('active', 'inactive');
CREATE TYPE schedule_status AS ENUM ('active', 'inactive');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Auth
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Personal info
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL, -- RN-049: Must be unique
  rg TEXT UNIQUE, -- RN-049: Must be unique
  birth_date DATE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,

  -- Address (RN-050: CEP with autocomplete)
  cep TEXT,
  address TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,

  -- User classification
  user_type user_type NOT NULL DEFAULT 'organizer',

  -- Financial
  balance DECIMAL(10, 2) DEFAULT 0.00,

  -- Referral
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
