# Como Aplicar a Migration no Supabase

## Opção 1: Via Dashboard (RECOMENDADO)

1. Acesse o SQL Editor do Supabase:
   - URL: https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql

2. Cole o conteúdo do arquivo:
   - `supabase/migrations/20251023000001_schema_completo.sql`

3. Clique em **"Run"**

4. Aguarde a confirmação de sucesso

---

## Opção 2: Via Script Node

```bash
node scripts/apply-migration.mjs
```

**Nota:** Este método pode falhar devido a limitações da API. Use a Opção 1 se houver problemas.

---

## Verificar se Funcionou

Execute este SQL no Dashboard para ver as tabelas criadas:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver estas tabelas:
- avaliacoes
- convite_aceites
- convites
- court_blocks
- horarios
- indicacoes
- mensalistas
- notificacoes
- pagamentos
- quadras
- rateios
- reserva_participantes
- reservas
- system_settings
- transactions
- turma_membros
- turmas
- users

---

## Próximo Passo

Depois de aplicar a migration, execute:

```bash
npx supabase gen types typescript --linked > src/types/database.types.ts
```

Isso irá gerar os types TypeScript baseados no schema do banco.
