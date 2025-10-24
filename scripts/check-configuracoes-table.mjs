import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verificando se a tabela "configuracoes" existe...\n');

try {
  // Tentar consultar a tabela
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*')
    .limit(1);

  if (error) {
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      console.log('❌ A tabela "configuracoes" NÃO existe no banco de dados.\n');
      console.log('📝 Para criar a tabela, execute o seguinte SQL no Supabase:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parâmetros do Sistema
  antecedencia_minima INTEGER DEFAULT 2,
  antecedencia_maxima INTEGER DEFAULT 30,
  dia_vencimento INTEGER DEFAULT 25,
  hora_limite_reserva INTEGER DEFAULT 22,

  -- Política de Cancelamento
  cancelamento_gratuito INTEGER DEFAULT 24,
  multa_cancelamento NUMERIC(5,2) DEFAULT 30,
  reembolso_total INTEGER DEFAULT 48,
  permite_cancelamento BOOLEAN DEFAULT true,

  -- Formas de Pagamento
  pagamento_pix BOOLEAN DEFAULT true,
  pagamento_cartao BOOLEAN DEFAULT true,
  pagamento_dinheiro BOOLEAN DEFAULT true,
  pagamento_transferencia BOOLEAN DEFAULT true,
  taxa_conveniencia NUMERIC(5,2) DEFAULT 3.5,
  valor_minimo NUMERIC(10,2) DEFAULT 50,

  -- Notificações
  notif_whatsapp BOOLEAN DEFAULT true,
  notif_email BOOLEAN DEFAULT true,
  notif_sms BOOLEAN DEFAULT false,
  lembrete_antes INTEGER DEFAULT 45,
  lembrete_final INTEGER DEFAULT 10,

  -- Descontos e Bônus
  desconto_mensalista NUMERIC(5,2) DEFAULT 15,
  desconto_primeira_reserva NUMERIC(5,2) DEFAULT 10,
  bonus_indicacao NUMERIC(10,2) DEFAULT 20,
  desconto_recorrente NUMERIC(5,2) DEFAULT 5,
  bonus_aniversario NUMERIC(10,2) DEFAULT 50,
  desconto_grupo NUMERIC(5,2) DEFAULT 8,
  minimo_participantes_desconto INTEGER DEFAULT 10,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO configuracoes (id)
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Garantir que só existe uma linha de configurações
CREATE UNIQUE INDEX IF NOT EXISTS configuracoes_singleton ON configuracoes ((true));

-- RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas: apenas admins podem modificar
CREATE POLICY "Admins podem ver configurações"
  ON configuracoes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'gestor')
    )
  );

CREATE POLICY "Admins podem atualizar configurações"
  ON configuracoes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'gestor')
    )
  );
      `);
    } else {
      console.log('❌ Erro ao verificar tabela:', error);
    }
  } else {
    console.log('✅ A tabela "configuracoes" EXISTE no banco de dados.\n');

    if (data && data.length > 0) {
      console.log('📊 Configurações atuais:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('⚠️  A tabela existe mas está vazia. Execute o INSERT do SQL acima.');
    }
  }
} catch (err) {
  console.error('❌ Erro inesperado:', err);
}
