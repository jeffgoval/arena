-- Remove trigger de notificações que estava causando erro no signup
-- As configurações de notificação serão criadas manualmente pelo código da aplicação

-- 1. Remover o trigger
DROP TRIGGER IF EXISTS create_user_notification_settings ON auth.users;

-- 2. Remover a função
DROP FUNCTION IF EXISTS create_default_notification_settings();

-- Comentário explicativo
COMMENT ON TABLE auth.users IS 'Supabase Auth users - notification settings created by application code';
