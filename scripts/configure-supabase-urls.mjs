#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('🔧 Configuração de URLs permitidas no Supabase\n');
console.log('📊 Project Ref:', projectRef);
console.log('\n📋 URLs a serem configuradas:\n');

const urls = {
  siteUrl: 'https://arena.sistemasdigitais.com',
  redirectUrls: [
    'https://arena.sistemasdigitais.com',
    'https://arena.sistemasdigitais.com/auth',
    'https://arena.sistemasdigitais.com/auth/callback',
    'http://localhost:3000',
    'http://localhost:3000/auth',
    'http://localhost:3000/auth/callback'
  ]
};

console.log('✅ Site URL:', urls.siteUrl);
console.log('\n✅ Redirect URLs:');
urls.redirectUrls.forEach(url => console.log(`   - ${url}`));

console.log('\n📝 Para configurar manualmente:');
console.log(`   1. Acesse: https://supabase.com/dashboard/project/${projectRef}/auth/url-configuration`);
console.log(`   2. Em "Site URL", adicione: ${urls.siteUrl}`);
console.log(`   3. Em "Redirect URLs", adicione todas as URLs listadas acima`);
console.log(`   4. Clique em "Save"\n`);

console.log('💡 Isso resolverá o erro de CORS em produção!\n');
