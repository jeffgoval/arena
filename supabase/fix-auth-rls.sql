-- =====================================================
-- FIX: Autenticação e RLS para tabela users
-- =====================================================

-- 1. Criar função para handle de novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome_completo, cpf, role, saldo_creditos)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    '000.000.000-00', -- CPF temporário, será atualizado depois
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar ou substituir trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Habilitar RLS na tabela users (se não estiver)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.users;

-- 5. Criar políticas RLS corretas
-- Permitir usuários verem o próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Permitir usuários atualizarem o próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- IMPORTANTE: Permitir que o trigger insira (usando SECURITY DEFINER)
-- Não é necessário criar política de INSERT para usuários normais,
-- pois o trigger usa SECURITY DEFINER que bypassa RLS

-- 6. Verificar se funcionou
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger e políticas RLS configurados com sucesso!';
  RAISE NOTICE 'Teste criando um novo usuário via Supabase Auth.';
END $$;
