# Recuperação do Schema Supabase

Esta pasta contém scripts SQL para **recriar completamente** o schema do banco de dados Supabase do projeto Arena Dona Santa.

## 🚨 ERRO DE SIGNUP? LEIA ISTO PRIMEIRO!

**Se você está recebendo o erro:** `❌ Erro ao verificar perfil: {}`

**Solução rápida:**
1. Abra: `COMO_EXECUTAR.md` (guia passo a passo)
2. Execute o script: `FIX-ALL-RLS-SIGNUP.sql` no SQL Editor
3. Pronto! Erro resolvido em 1 minuto

**Causa:** Políticas RLS com referência circular impedindo leitura do perfil após signup.

**Documentação técnica completa:** `FIX_RLS_SIGNUP.md`

---

## ⚠️ IMPORTANTE

- **Estes scripts criam as tabelas do zero**
- **Execute apenas se o banco foi substituído ou resetado**
- **Faça backup de dados existentes antes de executar**
- Os scripts estão organizados por ordem de dependência

## 📋 Arquivos

### Scripts Principais

```
schema-recovery/
├── README.md                         # Este arquivo
├── GERAR_TIPOS_TYPESCRIPT.md         # Instruções para gerar tipos TypeScript
├── COMO_EXECUTAR.md                  # ⭐ Guia rápido de correção RLS
├── FIX_RLS_SIGNUP.md                 # Documentação técnica do problema RLS
│
├── complete-schema.sql               # Script consolidado de schema (31 tabelas)
├── FIX-ALL-RLS-SIGNUP.sql            # ⭐⭐⭐ CORREÇÃO RLS (EXECUTE ESTE!)
```

### Scripts de Criação de Schema (01-08)

```
├── 00-execute-all.sql                # Script mestre (executa todos os arquivos)
├── 01-custom-types.sql               # Tipos customizados (ENUMs)
├── 02-base-tables.sql                # Tabelas básicas (8 tabelas)
├── 03-simple-dependencies.sql        # Dependências simples (7 tabelas)
├── 04-medium-dependencies.sql        # Dependências médias (5 tabelas)
├── 05-complex-dependencies.sql       # Dependências complexas (11 tabelas)
├── 06-indexes.sql                    # Índices de performance (50+ índices)
├── 07-rls-policies.sql               # Políticas de Row Level Security
├── 08-verify-indexes.sql             # Verificação de índices
```

### Scripts de Correção e Manutenção (09-13)

```
├── 09-auto-create-user-profile.sql   # Trigger original (substituído por 13)
├── 10-fix-existing-users.sql         # Criar perfis para usuários sem perfil
├── 11-debug-user-creation.sql        # Debug de criação de usuários
├── 12-fix-rls-users-circular.sql     # Corrigir políticas RLS circulares
├── 13-update-trigger-with-jwt-metadata.sql  # Atualizar trigger com JWT
```

### Scripts de Verificação

```
├── verify-schema.sql                 # Verificação do schema criado
└── execute-schema.mjs                # Script Node.js (alternativa)
```

## 🚀 Como Executar

### Opção 1: Executar Script Mestre (Recomendado)

Execute todos os scripts de uma vez usando o arquivo mestre:

```bash
# Certifique-se de estar no diretório correto
cd D:\jogos\arena\scripts\schema-recovery

# Execute o script mestre no Supabase
supabase db execute --file 00-execute-all.sql
```

### Opção 2: Executar Scripts Individualmente

Se preferir mais controle, execute cada script na ordem:

```bash
# 1. Tipos customizados
supabase db execute --file 01-custom-types.sql

# 2. Tabelas básicas
supabase db execute --file 02-base-tables.sql

# 3. Dependências simples
supabase db execute --file 03-simple-dependencies.sql

# 4. Dependências médias
supabase db execute --file 04-medium-dependencies.sql

# 5. Dependências complexas
supabase db execute --file 05-complex-dependencies.sql
```

### Opção 3: Usar Dashboard do Supabase (MAIS FÁCIL ⭐)

Este é o método mais simples e recomendado!

1. **Acesse o SQL Editor do Supabase:**
   ```
   https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/sql/new
   ```

2. **Abra o arquivo consolidado:**
   ```
   scripts/schema-recovery/complete-schema.sql
   ```

3. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)

4. **Cole no SQL Editor** do Supabase

5. **Clique em "Run"** para executar

6. **Aguarde a conclusão** - Deve criar 31 tabelas + 2 tipos customizados

**NOTA:** O arquivo `complete-schema.sql` contém TUDO em um único arquivo. Não precisa executar os arquivos individuais.

## 📦 O Que é Criado

### Etapa 1: Tipos Customizados
- `user_status` - Status do usuário (active, inactive, suspended)
- `notification_priority` - Prioridade de notificações (low, medium, high, urgent)

### Etapa 2: Tabelas Básicas (8 tabelas)
- `users` - Perfis de usuários
- `quadras` - Quadras esportivas
- `courts` - Quadras (versão alternativa)
- `planos_mensalista` - Planos mensais
- `configuracoes` - Configurações do sistema
- `system_settings` - Configurações alternativas
- `templates_notificacao` - Templates de notificação
- `notification_templates` - Templates alternativos

### Etapa 3: Dependências Simples (7 tabelas)
- `turmas` - Turmas/Equipes
- `turma_membros` - Membros das turmas
- `horarios` - Horários das quadras
- `schedules` - Horários alternativos
- `court_blocks` - Bloqueios de quadras
- `codigos_indicacao` - Códigos de indicação
- `transactions` - Transações financeiras

### Etapa 4: Dependências Médias (5 tabelas)
- `indicacoes` - Sistema de indicações
- `reservas` - Reservas de quadras
- `assinaturas_mensalista` - Assinaturas mensais
- `mensalistas` - Clientes mensalistas
- `reservas_recorrentes` - Reservas recorrentes

### Etapa 5: Dependências Complexas (11 tabelas)
- `convites` - Convites para reservas
- `rateios` - Divisão de custos
- `pagamentos` - Pagamentos (Asaas)
- `payments` - Pagamentos alternativos
- `reserva_participantes` - Participantes de reservas
- `convite_aceites` - Aceites de convites
- `avaliacoes` - Avaliações de reservas
- `creditos` - Sistema de créditos
- `cobrancas_mensalista` - Cobranças mensais
- `reservas_geradas` - Reservas geradas automaticamente
- `notificacoes_agendadas` - Notificações agendadas

**Total: 31 tabelas + 2 tipos customizados**

## 🔐 Próximos Passos Após Execução

Após executar o script de criação do schema, siga estes passos na ordem:

### ✅ PASSO 1: Gerar Tipos TypeScript

**OBRIGATÓRIO para o projeto funcionar!**

Leia o guia completo em: **`GERAR_TIPOS_TYPESCRIPT.md`**

**Método Rápido (Dashboard):**
1. Acesse: https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/api
2. Clique na aba "TypeScript"
3. Copie todo o código gerado
4. Cole em `src/types/database.types.ts`

**Alternativa (CLI):**
```bash
# Obter access token: https://supabase.com/dashboard/account/tokens
npx supabase gen types typescript --project-id iplcyrszecovmdtalwmv --token SEU_TOKEN > src/types/database.types.ts
```

### ✅ PASSO 2: Criar Índices para Performance

**Execute o script de índices:**

```bash
# Via Dashboard do Supabase (RECOMENDADO)
```
1. Acesse: https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/sql/new
2. Copie e cole o conteúdo de `06-indexes.sql`
3. Clique em "Run"

Este script cria **50+ índices** otimizados para as queries mais comuns:
- Reservas por data, quadra, organizador
- Convites por token
- Usuários por email, CPF
- Créditos por usuário e status
- Pagamentos por usuário e status
- E muito mais...

**Verificar índices criados:**
```bash
# Execute verify-indexes.sql para ver relatórios detalhados
```
Acesse: https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/sql/new
Cole o conteúdo de `08-verify-indexes.sql`

### ✅ PASSO 3: Configurar Row Level Security (RLS)

**Execute o script de RLS:**

```bash
# Via Dashboard do Supabase
```
1. Acesse: https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/sql/new
2. Copie e cole o conteúdo de `07-rls-policies.sql`
3. Clique em "Run"

Este script configura **~60 políticas RLS** cobrindo:
- **Usuários:** podem ler/editar próprio perfil
- **Turmas:** organizador gerencia, membros leem
- **Reservas:** organizador e participantes veem, gestor vê todas
- **Convites:** público pode aceitar, criador gerencia
- **Créditos:** usuário vê apenas próprios
- **Pagamentos:** usuário vê apenas próprios
- **Quadras/Horários:** leitura pública, escrita gestor+
- E muito mais...

**IMPORTANTE:** RLS é crucial para segurança. Sem ele, todos os dados ficam acessíveis!

### ✅ PASSO 4: Configurar Triggers de Auto-Criação de Perfil

**⚠️ CRÍTICO: Execute este passo para evitar erros no signup!**

**Execute o script consolidado de correção:**

```bash
# Via Dashboard do Supabase (RECOMENDADO)
```
1. Acesse: https://supabase.com/dashboard/project/iplcyrszecovmdtalwmv/sql/new
2. Copie e cole o conteúdo de `FIX-ALL-RLS-SIGNUP.sql`
3. Clique em "Run"

**O que este script faz:**
- ✅ Cria trigger `handle_new_user()` que cria perfil automaticamente no signup
- ✅ Corrige políticas RLS que causavam referência circular
- ✅ Atualiza JWT metadata com role do usuário
- ✅ Cria perfis para usuários existentes sem perfil
- ✅ Elimina erro: `❌ Erro ao verificar perfil: {}`

**Alternativa (Scripts Individuais):**
Se preferir executar passo a passo:
1. Execute `13-update-trigger-with-jwt-metadata.sql` (atualiza trigger)
2. Execute `12-fix-rls-users-circular.sql` (corrige RLS)
3. Execute `10-fix-existing-users.sql` (corrige usuários existentes)

**Guia completo:** Leia `COMO_EXECUTAR.md` ou `FIX_RLS_SIGNUP.md`

### ✅ PASSO 5: Verificar Tudo Funcionando

```bash
# 1. Verificar schema
```
Execute `verify-schema.sql` para confirmar que todas as 31 tabelas foram criadas

```bash
# 2. Verificar tipos TypeScript
npm run lint
```

```bash
# 3. Testar autenticação básica
npm run dev
```
Acesse http://localhost:3000 e teste login/cadastro

**Teste completo de signup:**
1. Acesse http://localhost:3000/auth
2. Preencha formulário de cadastro
3. Clique em "Cadastrar"
4. **Deve funcionar SEM erro vazio!**
5. Deve redirecionar para `/cliente` automaticamente

### 📦 PASSO 6: Popular Dados Iniciais (Opcional)

Você pode precisar popular:
- ✅ Configurações padrão na tabela `configuracoes`
- ✅ Templates de notificação
- ✅ Quadras iniciais
- ✅ Horários das quadras

**Sugestão:** Crie um script `09-seed-data.sql` com os dados iniciais do seu negócio

## 🔍 Verificação

Para verificar se tudo foi criado corretamente:

```bash
# Listar todas as tabelas criadas
supabase db execute --file - <<EOF
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
EOF
```

Você deve ver 31 tabelas listadas.

## ⚙️ Troubleshooting

### Erro: "relation already exists"
**Solução:** Algumas tabelas já existem. Você pode:
1. Dropar as tabelas existentes primeiro (cuidado com dados!)
2. Pular os scripts das tabelas que já existem

### Erro: "foreign key constraint"
**Solução:** Execute os scripts na ordem correta (1 → 5)

### Erro: "extension uuid-ossp does not exist"
**Solução:** O script `00-execute-all.sql` já cria a extensão. Se persistir:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Erro: "type already exists"
**Solução:** Os tipos customizados já foram criados. Pode pular o script 01.

## 📝 Notas

- O schema original está em: `docs/GAPS/SCHEMA SUPABASE.md`
- Estes scripts foram gerados automaticamente a partir do schema documentado
- Algumas tabelas têm versões duplicadas (ex: `quadras` e `courts`) - isso é intencional e reflete o schema original
- As constraints ON DELETE foram ajustadas para CASCADE ou SET NULL conforme lógica de negócio

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de erro do Supabase
2. Confirme que a versão do PostgreSQL é compatível (14+)
3. Verifique se há dados conflitantes no banco
4. Consulte a documentação do Supabase: https://supabase.com/docs

## 📊 Resumo do Que Foi Criado

### Scripts de Migração:
- ✅ **31 tabelas** organizadas por dependência
- ✅ **2 tipos customizados** (user_status, notification_priority)
- ✅ **50+ índices** para otimização de performance
- ✅ **~60 políticas RLS** para segurança
- ✅ Scripts de verificação e troubleshooting

### Próximos Passos em Ordem:
1. ✅ Executar `complete-schema.sql` (criar tabelas)
2. ✅ Gerar tipos TypeScript (`GERAR_TIPOS_TYPESCRIPT.md`)
3. ✅ Executar `06-indexes.sql` (criar índices)
4. ✅ Executar `07-rls-policies.sql` (configurar segurança)
5. ✅ Executar `verify-schema.sql` (verificar tudo)
6. ✅ Executar `08-verify-indexes.sql` (verificar índices)
7. ✅ Testar aplicação (`npm run dev`)

### Recursos Disponíveis:
- 📄 **complete-schema.sql** - Schema completo consolidado
- 📄 **GERAR_TIPOS_TYPESCRIPT.md** - Guia completo para gerar tipos
- 📄 **06-indexes.sql** - Índices de performance
- 📄 **07-rls-policies.sql** - Políticas de segurança
- 📄 **08-verify-indexes.sql** - Verificação de índices
- 📄 **verify-schema.sql** - Verificação do schema

---

**Última atualização:** 2025-10-25
**Versão do Schema:** v2.0 (Phase 2 - Full Application)
**Total de Scripts:** 12 arquivos (schema + índices + RLS + verificação)
