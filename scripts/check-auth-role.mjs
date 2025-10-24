import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('👤 Verificando usuários com role gestor/admin...\n');

const { data: users, error } = await supabase
  .from('users')
  .select('id, email, nome_completo, role')
  .in('role', ['admin', 'gestor']);

if (error) {
  console.log('❌ Erro:', error);
} else if (users.length === 0) {
  console.log('⚠️  NENHUM usuário com role admin/gestor encontrado!');
  console.log('\nVocê precisa ter um usuário com role=gestor ou role=admin');
  console.log('para poder modificar configurações.');
} else {
  console.log(`✅ Encontrados ${users.length} usuário(s) com permissão:\n`);
  users.forEach(u => {
    console.log(`- ${u.email} (${u.role})`);
  });
}
