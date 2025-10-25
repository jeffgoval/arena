-- Script para corrigir políticas RLS que causam recursão infinita

-- Desabilitar RLS temporariamente para verificar
ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE convites DISABLE ROW LEVEL SECURITY;
ALTER TABLE convite_aceites DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes que podem estar causando recursão
DROP POLICY IF EXISTS "Users can view own reservas" ON reservas;
DROP POLICY IF EXISTS "Users can view own convites" ON convites;
DROP POLICY IF EXISTS "Users can view own aceites" ON convite_aceites;

-- Recriar políticas mais simples sem recursão
CREATE POLICY "Users can view own reservas" ON reservas
    FOR SELECT USING (auth.uid() = organizador_id);

CREATE POLICY "Users can view own convites" ON convites
    FOR SELECT USING (auth.uid() = criado_por);

CREATE POLICY "Users can view own aceites" ON convite_aceites
    FOR SELECT USING (auth.uid() = user_id);

-- Política separada para criadores de convites verem aceites
CREATE POLICY "Convite creators can view aceites" ON convite_aceites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM convites 
            WHERE convites.id = convite_aceites.convite_id 
            AND convites.criado_por = auth.uid()
        )
    );

-- Reabilitar RLS
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE convite_aceites ENABLE ROW LEVEL SECURITY;