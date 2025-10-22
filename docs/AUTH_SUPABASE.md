# Arquitetura de Autenticação - Supabase Auth Nativo

## 📋 Visão Geral

Utilizaremos **Supabase Auth nativo** para toda a gestão de autenticação, aproveitando todas as funcionalidades built-in.

---

## 🏗️ Estrutura de Dados

### 1. Tabela `auth.users` (Supabase)
**Gerenciada automaticamente pelo Supabase**

```sql
-- Tabela do Supabase (não criamos manualmente)
auth.users
  - id (UUID, PK)
  - email (unique)
  - encrypted_password
  - email_confirmed_at
  - last_sign_in_at
  - raw_app_meta_data (jsonb)
  - raw_user_meta_data (jsonb)  -- Aqui armazenamos role e nome
  - created_at
  - updated_at
```

**Metadata que armazenaremos**:
```json
{
  "role": "cliente",
  "nome_completo": "João Silva"
}
```

### 2. Tabela `public.users` (Nossa)
**Perfil estendido do usuário**

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT UNIQUE,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  whatsapp TEXT NOT NULL,
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gestor', 'cliente')),
  saldo_creditos DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome_completo, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nome_completo',
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔐 Fluxos de Autenticação

### 1. Cadastro (Sign Up)

**Frontend**:
```typescript
// app/(auth)/cadastro/page.tsx
import { createClient } from '@/lib/supabase/client';

const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      nome_completo: formData.nome_completo,
      role: 'cliente', // Default
    },
  },
});

// Depois do signup, completar perfil
await supabase.from('users').update({
  cpf: formData.cpf,
  rg: formData.rg,
  data_nascimento: formData.data_nascimento,
  whatsapp: formData.whatsapp,
  // ... outros campos
}).eq('id', data.user.id);
```

**Fluxo**:
1. Usuário preenche formulário completo
2. `signUp()` cria registro em `auth.users`
3. Trigger automático cria registro básico em `public.users`
4. Frontend completa dados adicionais (CPF, RG, etc)
5. Email de confirmação enviado (opcional)

---

### 2. Login (Sign In)

**Opção A - Login com Email**:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});
```

**Opção B - Login com CPF**:
```typescript
// 1. Buscar email pelo CPF
const { data: userData } = await supabase
  .from('users')
  .select('email')
  .eq('cpf', formData.cpf)
  .single();

// 2. Fazer login com email encontrado
const { data, error } = await supabase.auth.signInWithPassword({
  email: userData.email,
  password: formData.password,
});
```

---

### 3. Recuperação de Senha

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`,
});
```

---

### 4. Logout

```typescript
const { error } = await supabase.auth.signOut();
```

---

## 🔑 Clients do Supabase

### Client-Side (Browser)
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server-Side (Server Components)
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

### Middleware (Route Protection)
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Proteger rotas de dashboard
  if (request.nextUrl.pathname.startsWith('/cliente') ||
      request.nextUrl.pathname.startsWith('/gestor') ||
      request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger rotas de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/cliente', request.url));
    }
  }

  // Proteger rotas de gestor
  if (request.nextUrl.pathname.startsWith('/gestor')) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'gestor' && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/cliente', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/cliente/:path*', '/gestor/:path*', '/admin/:path*'],
};
```

---

## 🛡️ Row Level Security (RLS)

### Helper Functions

```sql
-- Obter ID do usuário autenticado
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL STABLE;

-- Obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Verificar se é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Verificar se é gestor ou admin
CREATE OR REPLACE FUNCTION is_gestor_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('gestor', 'admin')
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

### Políticas RLS

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Teams
CREATE POLICY "Users can manage own teams"
  ON public.teams FOR ALL
  USING (auth.uid() = user_id);

-- Reservations
CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  USING (
    auth.uid() = user_id OR
    is_gestor_or_admin() OR
    EXISTS (
      SELECT 1 FROM reservation_participants
      WHERE reservation_id = reservations.id AND user_id = auth.uid()
    )
  );
```

---

## 🎣 Custom Hooks

### useAuth
```typescript
// hooks/auth/useAuth.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### useUser (com perfil completo)
```typescript
// hooks/auth/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useUser() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return { ...user, profile };
    },
  });
}
```

---

## 📦 Dependências Necessárias

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## 🔧 Configuração .env

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Para server-side (opcional, se precisar de service role)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## ✅ Vantagens do Supabase Auth Nativo

1. ✅ Gerenciamento automático de sessões
2. ✅ Tokens JWT automáticos (access + refresh)
3. ✅ Email de confirmação built-in
4. ✅ Recuperação de senha built-in
5. ✅ Rate limiting automático
6. ✅ Proteção contra brute force
7. ✅ Cookies seguros (httpOnly, secure, sameSite)
8. ✅ SSR/SSG compatible
9. ✅ Integração perfeita com RLS
10. ✅ Suporte a OAuth (futuro)

---

## 🚀 Próximos Passos

1. Criar projeto no Supabase
2. Configurar variáveis de ambiente
3. Criar migration para tabela `users` + trigger
4. Implementar páginas de auth (login, cadastro, recuperação)
5. Configurar middleware de proteção de rotas
6. Criar hooks customizados (useAuth, useUser)
7. Implementar RLS policies

---

**Documento criado em**: 2025-10-21
**Versão**: 1.0
