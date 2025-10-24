# Fix: Erro ao Atualizar Perfil no Cadastro

## Problema Identificado

Durante o cadastro de novos usuários, ocorria um erro ao tentar atualizar o perfil:

```
❌ ERRO AO ATUALIZAR PERFIL: {}
```

O objeto de erro estava vazio, dificultando o diagnóstico.

## Causas Possíveis

1. **Trigger não executou**: O trigger do Supabase que deveria criar o perfil básico pode não ter sido executado
2. **Race condition**: O código tentava atualizar o perfil antes dele ser criado
3. **Permissões RLS**: As políticas de Row Level Security podem estar bloqueando o update
4. **Perfil não existe**: O registro na tabela `users` não foi criado

## Solução Implementada

### 1. Verificação de Existência

Antes de tentar atualizar, agora verificamos se o perfil existe:

```typescript
const { data: existingProfile, error: checkError } = await supabase
  .from('users')
  .select('id, email, nome_completo')
  .eq('id', authData.user.id)
  .maybeSingle();
```

### 2. Criar ou Atualizar

Se o perfil não existe, criamos. Se existe, atualizamos:

```typescript
if (!existingProfile) {
  // INSERT
  await supabase.from('users').insert(profilePayload);
} else {
  // UPDATE
  await supabase.from('users').update(profilePayload);
}
```

### 3. Logs Detalhados

Adicionamos logs para facilitar o debug:

- 🔍 Verificando se perfil existe
- 📋 Perfil existente (ou null)
- ➕ Criando perfil
- 🔄 Atualizando perfil
- ✅ Perfil salvo com sucesso
- ❌ Erro detalhado com code, details, hint, message

### 4. Fallback Gracioso

Mesmo se houver erro ao salvar o perfil, permitimos que o usuário faça login:

```typescript
if (profileError) {
  console.error('❌ ERRO AO SALVAR PERFIL:', profileError);
  toast({
    title: "Erro ao completar perfil",
    description: "Tente fazer login e completar seu perfil.",
    variant: "destructive",
  });
  
  // Permitir login mesmo assim
  router.push('/cliente');
  return;
}
```

## Próximos Passos

### 1. Verificar Trigger do Supabase

Execute no SQL Editor do Supabase:

```sql
-- Ver triggers existentes
SELECT * FROM pg_trigger WHERE tgname LIKE '%user%';

-- Ver função do trigger
SELECT prosrc FROM pg_proc WHERE proname LIKE '%user%';
```

### 2. Verificar Políticas RLS

```sql
-- Ver políticas da tabela users
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Habilitar RLS se não estiver
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Criar política para INSERT (se não existir)
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Criar política para UPDATE (se não existir)
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Criar política para SELECT (se não existir)
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

### 3. Verificar Estrutura da Tabela

```sql
-- Ver colunas e constraints
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

## Script de Diagnóstico

Execute o script criado para verificar a estrutura:

```bash
npx tsx scripts/debug-signup.ts
```

Este script verifica:
- Estrutura da tabela users
- Políticas RLS
- Triggers existentes

## Testando a Correção

1. Tente fazer um novo cadastro
2. Observe os logs no console do navegador
3. Verifique se aparece:
   - 🔍 Verificando se perfil existe
   - ➕ Criando perfil OU 🔄 Atualizando perfil
   - ✅ Perfil salvo com sucesso

4. Se ainda houver erro, os logs agora mostrarão detalhes completos

## Melhorias Futuras

1. **Criar migration para garantir trigger**: Adicionar trigger que cria perfil automaticamente
2. **Validar políticas RLS**: Garantir que usuários podem criar/atualizar seus próprios perfis
3. **Adicionar retry logic**: Tentar novamente em caso de falha temporária
4. **Melhorar UX**: Mostrar mensagem mais clara ao usuário sobre o que fazer em caso de erro
