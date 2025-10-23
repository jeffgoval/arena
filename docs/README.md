# Supabase Migrations

## Como aplicar as migrations

### Opção 1: Via Dashboard do Supabase (Recomendado para início)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo de cada migration na ordem:
   - `20250101000001_create_users_table.sql`
   - `20250101000002_create_rls_policies.sql`
5. Execute cada uma clicando em **RUN**

### Opção 2: Via Supabase CLI (Recomendado para produção)

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Linkar projeto (primeira vez apenas)
supabase link --project-ref seu-project-ref

# Aplicar migrations
supabase db push

# Ou aplicar uma migration específica
supabase db push --file supabase/migrations/20250101000001_create_users_table.sql
```

## Migrations Criadas

### 1. `20250101000001_create_users_table.sql`
- Cria tabela `public.users` (perfil estendido)
- Trigger automático para criar perfil ao fazer signup
- Índices para otimização
- Função `update_updated_at_column()`

### 2. `20250101000002_create_rls_policies.sql`
- Habilita RLS na tabela `users`
- Helper functions: `get_user_role()`, `is_admin()`, `is_gestor_or_admin()`
- Políticas RLS para proteger dados

## Verificar se foi aplicado corretamente

Execute no SQL Editor:

```sql
-- Ver se a tabela foi criada
SELECT * FROM public.users LIMIT 1;

-- Ver funções criadas
SELECT proname FROM pg_proc WHERE proname LIKE '%user%';

-- Ver políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## Próximas Migrations

As próximas migrations incluirão:
- Tabelas de quadras (courts)
- Tabelas de reservas (reservations)
- Tabelas de turmas (teams, team_members)
- Tabelas de convites (invitations)
- Tabelas de pagamentos (payments, transactions)
