import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Verificando tabela configuracoes...\n');

// Tentar buscar diretamente
const { data, error } = await supabase
  .from('configuracoes')
  .select('*')
  .limit(1);

if (error) {
  if (error.code === 'PGRST205') {
    console.log('⏳ Tabela criada mas schema cache não atualizou.\n');
    console.log('Aguarde 1-2 minutos ou reinicie a API no Supabase.');
  } else {
    console.log('❌ Erro:', error);
  }
} else {
  console.log('✅ Tabela "configuracoes" acessível!\n');
  
  if (data && data.length > 0) {
    console.log('📊 Configurações no banco:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('⚠️  Tabela vazia, inserindo padrões...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('configuracoes')
      .insert({
        antecedencia_minima: 2,
        antecedencia_maxima: 30,
        dia_vencimento: 25,
        hora_limite_reserva: 22,
        cancelamento_gratuito: 24,
        multa_cancelamento: 30,
        reembolso_total: 48,
        permite_cancelamento: true,
        pagamento_pix: true,
        pagamento_cartao: true,
        pagamento_dinheiro: true,
        pagamento_transferencia: true,
        taxa_conveniencia: 3.5,
        valor_minimo: 50,
        notif_whatsapp: true,
        notif_email: true,
        notif_sms: false,
        lembrete_antes: 45,
        lembrete_final: 10,
        desconto_mensalista: 15,
        desconto_primeira_reserva: 10,
        bonus_indicacao: 20,
        desconto_recorrente: 5,
        bonus_aniversario: 50,
        desconto_grupo: 8,
        minimo_participantes_desconto: 10
      })
      .select();

    if (insertError) {
      console.log('❌ Erro ao inserir:', insertError);
    } else {
      console.log('✅ Configurações padrão inseridas!');
      console.log(JSON.stringify(insertData[0], null, 2));
    }
  }
}
