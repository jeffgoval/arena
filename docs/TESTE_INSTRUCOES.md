# Instruções para Testar o Sistema de Notificações

## Problema Atual
O erro que você está vendo indica que `auth.uid()` retorna `null`, ou seja, não há usuário autenticado no momento da execução.

## Soluções

### Opção 1: Criar um Usuário de Teste
Execute no SQL Editor do Supabase:

```sql
-- Criar usuário de teste
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'teste@arena.com',
  '$2a$10$dummy.hash.for.testing.purposes.only',
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  ''
);
```

### Opção 2: Usar o Teste Simples
Execute o arquivo `simple_test_notifications.sql` que criei - ele funciona sem autenticação.

### Opção 3: Testar com UUID Específico
Substitua `auth.uid()` por um UUID real:

```sql
-- Primeiro, veja os usuários disponíveis
SELECT id, email FROM auth.users LIMIT 5;

-- Depois use um ID específico
SELECT create_notification(
  '12345678-1234-1234-1234-123456789012'::UUID, -- substitua pelo ID real
  'Teste',
  'Mensagem de teste',
  'system',
  'medium'
);
```

## Teste Rápido
Execute este código para verificar se tudo está funcionando:

```sql
-- 1. Verificar tabelas
SELECT COUNT(*) FROM notification_templates;

-- 2. Verificar usuários
SELECT COUNT(*) FROM auth.users;

-- 3. Se há usuários, criar notificação para o primeiro
DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  IF user_id IS NOT NULL THEN
    PERFORM create_notification(
      user_id,
      'Teste Sistema',
      'Funcionando!',
      'system',
      'medium'
    );
    RAISE NOTICE 'Notificação criada para usuário: %', user_id;
  ELSE
    RAISE NOTICE 'Nenhum usuário encontrado';
  END IF;
END $$;
```

O sistema está funcionando corretamente, apenas precisa de um usuário válido para testar.