import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Verificando tabela codigos_indicacao...\n');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTable() {
  try {
    // Tentar fazer uma query simples na tabela
    const { data, error } = await supabase
      .from('codigos_indicacao')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tabela codigos_indicacao NÃO EXISTE');
        console.log('\n📝 SQL para criar a tabela:\n');
        console.log(createTableSQL);
        return false;
      }
      console.error('❌ Erro ao verificar tabela:', error);
      return false;
    }

    console.log('✅ Tabela codigos_indicacao EXISTE');
    return true;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.codigos_indicacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT codigos_indicacao_codigo_length CHECK (char_length(codigo) >= 4)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_codigos_indicacao_usuario_id ON public.codigos_indicacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_codigos_indicacao_codigo ON public.codigos_indicacao(codigo) WHERE ativo = true;

-- RLS Policies
ALTER TABLE public.codigos_indicacao ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver apenas seu próprio código
CREATE POLICY "Usuários podem ver seu próprio código"
  ON public.codigos_indicacao
  FOR SELECT
  USING (auth.uid() = usuario_id);

-- Usuário pode criar seu próprio código (se não existir)
CREATE POLICY "Usuários podem criar seu próprio código"
  ON public.codigos_indicacao
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Comentários
COMMENT ON TABLE public.codigos_indicacao IS 'Códigos de indicação únicos para cada usuário';
COMMENT ON COLUMN public.codigos_indicacao.codigo IS 'Código único de 4-12 caracteres alfanuméricos';
`;

checkTable();
