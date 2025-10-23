-- =====================================================
-- EXECUTAR TODAS AS MIGRATIONS
-- Execute este arquivo no Supabase SQL Editor
-- =====================================================

-- IMPORTANTE: Execute as migrations na ordem correta!

-- 1. Tabelas base (profiles, courts, schedules, reservations)
\i 20241022000001_create_base_tables.sql

-- 2. Tabela de avaliações (reviews)
\i 20241022000006_create_reviews_table.sql

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'courts',
    'schedules',
    'reservations',
    'reservation_participants',
    'reviews'
  )
ORDER BY table_name;

-- Verificar RLS habilitado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'courts',
    'schedules',
    'reservations',
    'reservation_participants',
    'reviews'
  )
ORDER BY tablename;
