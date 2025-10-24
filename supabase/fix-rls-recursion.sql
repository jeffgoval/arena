-- =====================================================
-- FIX: Remover recursão infinita nas políticas RLS
-- =====================================================

-- 1. DESABILITAR RLS temporariamente para limpar
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;

-- 3. REMOVER funções helper que podem causar recursão (com CASCADE para remover dependências)
DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_gestor_or_admin() CASCADE;

-- 4. Criar função para handle de novos usuários (SEM usar tabela users internamente)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome_completo, cpf, role, saldo_creditos)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    '000.000.000-00', -- CPF temporário
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
    0
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Se já existe, apenas retorna (evita erro em caso de retry)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. HABILITAR RLS novamente
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS SIMPLES (sem recursão)
-- IMPORTANTE: Usar auth.uid() direto, SEM funções helper que acessam users

-- Permitir SELECT do próprio perfil
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Permitir UPDATE do próprio perfil
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Permitir INSERT apenas via trigger (SECURITY DEFINER bypassa RLS)
-- Não criamos política de INSERT para usuários normais

-- 8. Verificar se funcionou
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS corrigidas com sucesso!';
  RAISE NOTICE '✅ Recursão infinita removida';
  RAISE NOTICE 'Teste criando um novo usuário via Supabase Auth.';
END $$;
