// Simula como o Next.js lê variáveis de ambiente
import { config } from 'dotenv';
import { resolve } from 'path';

// Next.js lê .env.local primeiro, depois .env
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

console.log('🔍 Testando leitura de variáveis de ambiente como o Next.js faz:\n');
console.log('ASAAS_API_KEY:', process.env.ASAAS_API_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('Comprimento:', process.env.ASAAS_API_KEY?.length || 0);
console.log('Primeiros 20 caracteres:', process.env.ASAAS_API_KEY?.substring(0, 20) || 'N/A');
console.log('ASAAS_ENVIRONMENT:', process.env.ASAAS_ENVIRONMENT || '❌ Não configurada');
console.log('\nNext Public vars:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada');
