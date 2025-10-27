-- Script para limpar o asaas_customer_id de um usuário específico
-- Isso forçará a criação de um novo cliente no Asaas na próxima transação

-- IMPORTANTE: Substitua 'SEU_EMAIL_AQUI' pelo seu email de usuário

UPDATE users 
SET asaas_customer_id = NULL 
WHERE email = 'SEU_EMAIL_AQUI';

-- Para ver o resultado:
SELECT id, email, nome_completo, asaas_customer_id 
FROM users 
WHERE email = 'SEU_EMAIL_AQUI';
