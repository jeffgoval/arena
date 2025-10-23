# Migrations - Arena Dona Santa

## 📋 Ordem de Execução

Execute as migrations **na ordem correta**:

1. `20241022000001_create_base_tables.sql` - Tabelas base (profiles, courts, schedules, reservations)
2. `20241022000006_create_reviews_table.sql` - Tabela de avaliações

## 🚀 Como Executar

### Opção 1: Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo de cada migration
6. Execute na ordem correta
7. Verifique se não há erros

### Opção 2: Supabase CLI

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login
supabase login

# Link com seu projeto
supabase link --project-ref seu-project-ref

# Executar migrations
supabase db push
```

## ✅ Verificação

Após executar as migrations, verifique se tudo está correto:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar RLS habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 📊 Estrutura das Tabelas

### profiles
- Perfis de usuários (estende auth.users)
- CPF e RG únicos
- Endereço completo
- Role (cliente, gestor, admin)

### courts
- Quadras esportivas
- Tipos: society, beach_tennis, volei, futvolei
- Status ativa/inativa

### schedules
- Horários disponíveis por quadra
- Dia da semana (0-6)
- Valores para avulsa e mensalista

### reservations
- Reservas de quadras
- Tipos: avulsa, mensalista, recorrente
- Status: pendente, confirmada, cancelada
- Suporte a rateio

### reservation_participants
- Participantes de cada reserva
- Origem: turma ou convite
- Status de pagamento

### reviews
- Avaliações de reservas
- Rating de 1 a 5 estrelas
- Comentário opcional
- Uma avaliação por usuário por reserva

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com policies específicas:

- **profiles**: Usuários veem apenas seu próprio perfil
- **courts**: Todos veem quadras ativas, apenas gestores gerenciam
- **schedules**: Todos veem horários ativos, apenas gestores gerenciam
- **reservations**: Usuários veem suas reservas e participações
- **reviews**: Todos veem avaliações, apenas participantes podem avaliar

## 🐛 Troubleshooting

### Erro: "relation already exists"
- A tabela já foi criada anteriormente
- Você pode ignorar ou usar `DROP TABLE IF EXISTS` antes

### Erro: "permission denied"
- Verifique se você tem permissões de admin no projeto
- Tente executar via Supabase Dashboard

### Erro: "foreign key constraint"
- Execute as migrations na ordem correta
- Tabelas dependentes precisam das tabelas base primeiro

## 📝 Notas

- Sempre faça backup antes de executar migrations em produção
- Teste as migrations em ambiente de desenvolvimento primeiro
- Use transações para poder fazer rollback se necessário
- Documente qualquer alteração manual no banco
