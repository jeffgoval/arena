# Instruções: Sistema de Autenticação Completo

## 📋 Resumo

Sistema de autenticação nativo Supabase com:
- ✅ Roles: `admin`, `gestor`, `cliente`
- ✅ Formulário completo de cadastro (conforme PRD)
- ✅ Login com **Email ou CPF**
- ✅ Recuperação de senha
- ✅ Validação de CPF e RG únicos
- ✅ Integração automática com ViaCEP
- ✅ Middleware com controle de acesso por role
- ✅ Trigger automático para criar perfil no signup

---

## 🚀 Passo 1: Aplicar Migração SQL

### Opção A: Via Supabase CLI (Recomendado)

```bash
# Executar migração
supabase db execute --file supabase/migrations/create_auth_system.sql
```

### Opção B: Via Dashboard Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Crie uma nova query
4. Cole o conteúdo do arquivo `supabase/migrations/create_auth_system.sql`
5. Execute a query

### Opção C: Via psql

```bash
psql postgresql://postgres:[SUA-SENHA]@[SEU-HOST]:5432/postgres -f supabase/migrations/create_auth_system.sql
```

---

## 🔍 Passo 2: Verificar se a Migração Funcionou

Execute no SQL Editor do Supabase:

```sql
-- 1. Verificar se a coluna 'role' existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name IN ('role', 'data_nascimento');

-- 2. Verificar se o trigger foi criado
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Verificar constraints de unicidade
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users' AND constraint_name LIKE '%unique%';

-- 4. Testar função de busca por CPF
SELECT * FROM get_user_by_cpf('12345678900');
```

---

## 🧪 Passo 3: Testar o Sistema

### Teste 1: Cadastro Completo

1. Acesse `http://localhost:3000/auth`
2. Clique na aba "Cadastrar"
3. Preencha todos os campos:
   - **Nome Completo**: João da Silva
   - **CPF**: 123.456.789-00 (será formatado automaticamente)
   - **RG**: MG-12.345.678 (opcional)
   - **Data de Nascimento**: 01/01/1990
   - **Email**: joao@example.com
   - **WhatsApp**: (33) 99999-9999 (será formatado automaticamente)
   - **CEP**: Digite um CEP válido (ex: 35010-000)
     - Observe o endereço ser preenchido automaticamente via ViaCEP
   - **Senha**: mínimo 6 caracteres
4. Clique em "Criar Conta"
5. Deve ser redirecionado para `/cliente`

### Teste 2: Login com Email

1. Acesse `http://localhost:3000/auth`
2. Aba "Entrar"
3. Digite o email: `joao@example.com`
4. Digite a senha
5. Clique em "Entrar"
6. Deve ser redirecionado para `/cliente` (role padrão)

### Teste 3: Login com CPF

1. Acesse `http://localhost:3000/auth`
2. Aba "Entrar"
3. Digite o CPF: `123.456.789-00` (pode digitar com ou sem formatação)
4. Digite a senha
5. Clique em "Entrar"
6. Deve ser redirecionado para `/cliente`

### Teste 4: Recuperação de Senha

1. Acesse `http://localhost:3000/auth`
2. Clique em "Esqueceu sua senha?"
3. Digite seu email
4. Clique em "Enviar Email"
5. Verifique sua caixa de entrada
6. Clique no link recebido
7. Defina nova senha

### Teste 5: Validações

**CPF Inválido:**
- Tente cadastrar com CPF inválido (ex: 111.111.111-11)
- Deve mostrar erro de validação

**CPF Duplicado:**
- Tente cadastrar novamente com mesmo CPF
- Deve mostrar erro: "CPF já cadastrado"

**RG Duplicado:**
- Tente cadastrar com RG já existente
- Deve mostrar erro: "RG já cadastrado"

**Senhas não coincidem:**
- Digite senhas diferentes
- Deve mostrar erro de validação

---

## 👥 Passo 4: Testar Roles e Middleware

### Criar Usuário Gestor (Via SQL)

```sql
-- 1. Criar conta de gestor via auth (use o dashboard ou API)
-- Depois, atualizar o role:

UPDATE users
SET role = 'gestor'
WHERE email = 'gestor@example.com';
```

### Criar Usuário Admin (Via SQL)

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Testar Redirecionamentos

| Role      | Login em `/auth` → Redireciona para |
|-----------|-------------------------------------|
| `cliente` | `/cliente`                          |
| `gestor`  | `/gestor`                           |
| `admin`   | `/gestor`                           |

### Testar Proteção de Rotas

| Role      | Acesso `/cliente` | Acesso `/gestor` |
|-----------|-------------------|------------------|
| `cliente` | ✅ Permitido      | ❌ Redireciona para `/cliente` |
| `gestor`  | ✅ Permitido      | ✅ Permitido     |
| `admin`   | ✅ Permitido      | ✅ Permitido     |

---

## 📊 Passo 5: Verificar RLS (Row Level Security)

Execute no SQL Editor:

```sql
-- Ver todas as policies da tabela users
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';
```

Você deve ver as seguintes policies:
- ✅ `Users can view own profile` - SELECT
- ✅ `Users can update own profile` - UPDATE
- ✅ `Admins can view all users` - SELECT
- ✅ `Gestores can view clients` - SELECT
- ✅ `Enable insert for authentication` - INSERT

---

## 🐛 Troubleshooting

### Erro: "CPF não encontrado" no login com CPF

**Causa:** Função `get_user_by_cpf` não existe ou CPF não está salvo sem formatação.

**Solução:**
```sql
-- Verificar se função existe
SELECT * FROM pg_proc WHERE proname = 'get_user_by_cpf';

-- Se não existir, executar novamente a migração

-- Verificar se CPFs estão salvos sem formatação
SELECT id, cpf FROM users LIMIT 5;
-- CPF deve estar como '12345678900' (apenas números)
```

### Erro: "User not authenticated" após signup

**Causa:** Trigger não está criando perfil automaticamente.

**Solução:**
```sql
-- Verificar se trigger existe
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Se não existir, executar a parte do trigger da migração novamente
```

### Erro: Unique constraint violation (CPF/RG)

**Causa:** CPF ou RG já cadastrado.

**Solução:**
```sql
-- Encontrar usuário com CPF duplicado
SELECT * FROM users WHERE cpf = '12345678900';

-- Se necessário, deletar registro de teste
DELETE FROM users WHERE cpf = '12345678900';
```

### ViaCEP não está preenchendo endereço

**Causa:** CEP inválido ou API indisponível.

**Solução:**
- Teste com CEPs reais de Governador Valadares:
  - `35010-000` (Centro)
  - `35020-000` (Lourdes)
  - `35030-000` (Esplanada)
- Verifique no console do navegador se há erros de CORS ou rede

---

## ✅ Checklist Final

- [ ] Migração SQL aplicada com sucesso
- [ ] Trigger `on_auth_user_created` ativo
- [ ] Constraints de unicidade (CPF e RG) criados
- [ ] Função `get_user_by_cpf` funcionando
- [ ] Cadastro completo funcionando
- [ ] Login com Email funcionando
- [ ] Login com CPF funcionando
- [ ] Integração ViaCEP funcionando
- [ ] Recuperação de senha funcionando
- [ ] Middleware redirecionando por role
- [ ] RLS policies ativas
- [ ] Validações Zod funcionando

---

## 📚 Arquivos Criados/Modificados

### Novos Arquivos

1. **`supabase/migrations/create_auth_system.sql`**
   - Schema completo de autenticação
   - Trigger para auto-criar perfil
   - Função de busca por CPF
   - RLS policies

2. **`src/lib/validations/auth.schema.ts`**
   - Schemas Zod para login, signup, recuperação de senha
   - Validações completas conforme PRD

3. **`src/services/auth/auth.service.ts`**
   - Serviço de autenticação
   - Login com email ou CPF
   - Signup completo
   - Recuperação de senha

### Arquivos Modificados

1. **`src/app/(auth)/auth/page.tsx`**
   - Formulário completo com React Hook Form
   - 3 modos: login, cadastro, recuperação
   - Integração com componentes customizados
   - Auto-preenchimento via ViaCEP

2. **`middleware.ts`**
   - Verificação de role
   - Redirecionamento inteligente por role
   - Proteção de rotas `/cliente` e `/gestor`

---

## 🎯 Próximos Passos

1. **Testar em ambiente de produção** com dados reais
2. **Configurar email personalizado** no Supabase (SMTP)
3. **Adicionar página de redefinição de senha** (`/auth/reset-password`)
4. **Implementar atualização de perfil** para usuários editarem seus dados
5. **Adicionar tela de verificação de email** (se necessário)
6. **Criar tela de primeiro acesso** para gestores configurarem arena
7. **Implementar sistema de convites** conforme PRD

---

## 📞 Suporte

Em caso de dúvidas:
1. Verifique os arquivos de documentação em `/docs`
2. Consulte o PRD em `/SETUP/PRD.md`
3. Revise o CLAUDE.md para arquitetura geral

---

**✨ Sistema de autenticação completo implementado com sucesso!**
