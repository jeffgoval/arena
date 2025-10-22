# Migrations - Arena Dona Santa

## Como Executar as Migrations no Supabase

### Opção 1: Arquivo Consolidado (RECOMENDADO)

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Copie e cole todo o conteúdo do arquivo `EXECUTAR_TODAS.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)

Este arquivo consolida todas as 3 migrations e é **idempotente** (pode ser executado múltiplas vezes sem causar erros).

---

### Opção 2: Arquivos Individuais

Se preferir executar migration por migration na ordem:

#### 1. Migration: Create Users Table
- Arquivo: `20250101000001_create_users_table.sql`
- Cria a tabela `public.users` (perfil estendido)
- Cria triggers para auto-criar perfil após signup
- Cria função `update_updated_at_column()`

#### 2. Migration: Create RLS Policies
- Arquivo: `20250101000002_create_rls_policies.sql`
- Habilita Row Level Security na tabela users
- Cria helper functions: `get_user_role()`, `is_admin()`, `is_gestor_or_admin()`
- Cria políticas de acesso para users

#### 3. Migration: Create Courts and Schedules
- Arquivo: `20250101000003_create_courts_and_schedules.sql`
- Cria tabelas: `courts`, `schedules`, `court_blocks`
- Cria índices para otimização
- Cria políticas RLS para quadras e horários

**IMPORTANTE:** Execute nesta ordem exata!

---

## Estrutura das Tabelas Criadas

### public.users
Perfil estendido dos usuários (complementa auth.users)
- CPF e RG únicos
- Role: admin, gestor, cliente
- Endereço completo (CEP, logradouro, etc)
- Saldo de créditos

### public.courts
Quadras esportivas
- Tipos: society, beach_tennis, volei, futvolei, futsal
- Status ativa/inativa
- Capacidade máxima de pessoas

### public.schedules
Grade horária com preços
- Horários por dia da semana (0=Domingo, 6=Sábado)
- Valores: avulsa e mensalista
- Vínculo com court_id

### public.court_blocks
Bloqueios de horários
- Período de bloqueio (data_inicio até data_fim)
- Horários específicos (opcional)
- Motivo do bloqueio

---

## Permissões (RLS)

### Usuários (public.users)
- ✅ Todos podem ver seu próprio perfil
- ✅ Admin pode ver todos os perfis
- ✅ Todos podem atualizar seu próprio perfil
- ✅ Admin pode gerenciar todos

### Quadras (public.courts)
- ✅ Todos podem ver quadras ativas
- ✅ Gestor e Admin podem ver todas
- ✅ Gestor e Admin podem criar/editar/deletar

### Horários (public.schedules)
- ✅ Todos podem ver horários ativos de quadras ativas
- ✅ Gestor e Admin podem ver todos
- ✅ Gestor e Admin podem gerenciar

### Bloqueios (public.court_blocks)
- ✅ Apenas Gestor e Admin podem ver e gerenciar

---

## Verificar se Migrations Foram Aplicadas

Execute no SQL Editor:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'courts', 'schedules', 'court_blocks');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar funções helper
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_role', 'is_admin', 'is_gestor_or_admin', 'handle_new_user');
```

---

## Troubleshooting

### Erro: "relation already exists"
✅ Não se preocupe! As migrations são idempotentes (usam IF NOT EXISTS).
Execute novamente e os erros serão ignorados.

### Erro: "permission denied"
❌ Certifique-se de estar usando o SQL Editor do Supabase (não o psql direto).
O SQL Editor tem permissões especiais para criar tabelas e políticas RLS.

### Trigger não está criando perfil automaticamente
1. Verifique se o trigger existe:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Se não existir, execute apenas a parte do trigger da migration 1

---

## Próximos Passos Após Aplicar Migrations

1. ✅ Criar um usuário gestor manualmente no Supabase Dashboard:
   - Vá em Authentication > Users > Add User
   - Preencha email e senha
   - Em User Metadata, adicione: `{"role": "gestor", "nome_completo": "Seu Nome"}`

2. ✅ Faça login no sistema com esse usuário

3. ✅ Acesse `/gestor/quadras` e comece a cadastrar quadras

4. ✅ Configure os horários de cada quadra

---

## Reverter Migrations (Rollback)

⚠️ **CUIDADO:** Isso apagará TODOS os dados!

```sql
-- Remover políticas RLS
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.users;
-- ... (repita para todas as políticas)

-- Remover tabelas
DROP TABLE IF EXISTS public.court_blocks CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.courts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Remover funções
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_gestor_or_admin() CASCADE;

-- Remover triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```
