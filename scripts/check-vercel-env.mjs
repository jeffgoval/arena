#!/usr/bin/env node

/**
 * Script para verificar e configurar variáveis de ambiente no Vercel
 *
 * Uso:
 *   node scripts/check-vercel-env.mjs          # Apenas verifica
 *   node scripts/check-vercel-env.mjs --fix    # Verifica e configura as faltantes
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const envVars = {};

    content.split('\n').forEach(line => {
      // Ignorar comentários e linhas vazias
      if (line.trim().startsWith('#') || !line.trim()) return;

      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remover aspas se existirem
        value = value.replace(/^["']|["']$/g, '');

        envVars[key] = value;
      }
    });

    return envVars;
  } catch (error) {
    log(`Erro ao ler arquivo .env.local: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getVercelEnvVars() {
  try {
    log('\n📋 Buscando variáveis no Vercel...', 'cyan');

    // Executa o comando e captura a saída
    const output = execSync('vercel env ls production', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Parse da saída (formato: nome | valor | ambientes)
    const lines = output.split('\n').filter(line => line.trim());
    const envVars = new Set();

    lines.forEach(line => {
      // Pula headers e linhas vazias
      if (line.includes('Environment Variables') || line.includes('---') || !line.trim()) return;

      const parts = line.split('|').map(p => p.trim());
      if (parts[0]) {
        envVars.add(parts[0]);
      }
    });

    return envVars;
  } catch (error) {
    // Se o comando falhar, pode ser que não esteja logado ou o projeto não esteja linkado
    if (error.message.includes('not found') || error.message.includes('No Project')) {
      log('⚠️  Projeto não está linkado ao Vercel. Execute: vercel link', 'yellow');
      return new Set();
    }
    log(`Erro ao buscar variáveis do Vercel: ${error.message}`, 'red');
    return new Set();
  }
}

async function setVercelEnvVar(key, value, environments = ['production', 'preview', 'development']) {
  try {
    log(`  ⏳ Configurando ${key}...`, 'yellow');

    for (const env of environments) {
      const command = `vercel env add ${key} ${env}`;
      execSync(command, {
        input: value + '\n',
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    }

    log(`  ✓ ${key} configurada com sucesso`, 'green');
    return true;
  } catch (error) {
    log(`  ✗ Erro ao configurar ${key}: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  const shouldFix = process.argv.includes('--fix');

  log('\n🔍 Verificador de Variáveis de Ambiente - Vercel', 'bright');
  log('═'.repeat(60), 'blue');

  // Lê variáveis locais
  const envFilePath = join(dirname(__dirname), '.env.local');
  const localEnvVars = parseEnvFile(envFilePath);

  log(`\n📁 Variáveis encontradas no .env.local: ${Object.keys(localEnvVars).length}`, 'cyan');

  // Variáveis críticas que DEVEM estar no Vercel
  const criticalVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL',
  ];

  // Variáveis opcionais (mas recomendadas)
  const optionalVars = [
    'ASAAS_API_KEY',
    'ASAAS_ENVIRONMENT',
    'ASAAS_WEBHOOK_SECRET',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_VERIFY_TOKEN',
    'CRON_SECRET_TOKEN',
    'DATABASE_URL',
  ];

  // Busca variáveis no Vercel
  const vercelEnvVars = getVercelEnvVars();

  if (vercelEnvVars.size === 0) {
    log('\n⚠️  Não foi possível verificar as variáveis no Vercel', 'yellow');
    log('   Execute: vercel link', 'yellow');
    log('   Ou: vercel login (se não estiver logado)', 'yellow');
    return;
  }

  log(`\n☁️  Variáveis encontradas no Vercel: ${vercelEnvVars.size}`, 'cyan');

  // Verifica variáveis críticas
  log('\n🔴 Variáveis CRÍTICAS:', 'red');
  const missingCritical = [];

  criticalVars.forEach(varName => {
    const existsInVercel = vercelEnvVars.has(varName);
    const existsLocally = localEnvVars.hasOwnProperty(varName);
    const hasValue = existsLocally && localEnvVars[varName] &&
                     !localEnvVars[varName].includes('placeholder') &&
                     !localEnvVars[varName].includes('seu_') &&
                     !localEnvVars[varName].includes('your-');

    if (existsInVercel) {
      log(`  ✓ ${varName}`, 'green');
    } else {
      log(`  ✗ ${varName} ${!hasValue ? '(valor não configurado localmente)' : ''}`, 'red');
      if (hasValue) {
        missingCritical.push(varName);
      }
    }
  });

  // Verifica variáveis opcionais
  log('\n🟡 Variáveis OPCIONAIS:', 'yellow');
  const missingOptional = [];

  optionalVars.forEach(varName => {
    const existsInVercel = vercelEnvVars.has(varName);
    const existsLocally = localEnvVars.hasOwnProperty(varName);
    const hasValue = existsLocally && localEnvVars[varName] &&
                     !localEnvVars[varName].includes('placeholder') &&
                     !localEnvVars[varName].includes('seu_') &&
                     !localEnvVars[varName].includes('your-');

    if (existsInVercel) {
      log(`  ✓ ${varName}`, 'green');
    } else {
      log(`  - ${varName} ${!hasValue ? '(não configurada localmente)' : ''}`, 'yellow');
      if (hasValue) {
        missingOptional.push(varName);
      }
    }
  });

  // Resumo
  log('\n' + '═'.repeat(60), 'blue');
  log('\n📊 RESUMO:', 'bright');
  log(`  Variáveis críticas faltando: ${missingCritical.length}`, missingCritical.length > 0 ? 'red' : 'green');
  log(`  Variáveis opcionais faltando: ${missingOptional.length}`, missingOptional.length > 0 ? 'yellow' : 'green');

  // Se houver variáveis faltando e o modo --fix estiver ativo
  if ((missingCritical.length > 0 || missingOptional.length > 0) && shouldFix) {
    log('\n🔧 Modo de correção ativado. Configurando variáveis faltantes...', 'cyan');

    let successCount = 0;
    let failCount = 0;

    // Configura variáveis críticas
    for (const varName of missingCritical) {
      const value = localEnvVars[varName];
      const success = await setVercelEnvVar(varName, value);
      if (success) successCount++;
      else failCount++;
    }

    // Configura variáveis opcionais
    for (const varName of missingOptional) {
      const value = localEnvVars[varName];
      const success = await setVercelEnvVar(varName, value);
      if (success) successCount++;
      else failCount++;
    }

    log('\n' + '═'.repeat(60), 'blue');
    log(`\n✅ Configuradas com sucesso: ${successCount}`, 'green');
    if (failCount > 0) {
      log(`❌ Falharam: ${failCount}`, 'red');
    }

    log('\n⚠️  IMPORTANTE: Execute um redeploy no Vercel para aplicar as mudanças:', 'yellow');
    log('   vercel --prod', 'cyan');

  } else if (missingCritical.length > 0 || missingOptional.length > 0) {
    log('\n💡 Para configurar automaticamente as variáveis faltantes, execute:', 'yellow');
    log('   node scripts/check-vercel-env.mjs --fix', 'cyan');
    log('\n   Ou configure manualmente em: https://vercel.com/dashboard', 'yellow');
  } else {
    log('\n✅ Todas as variáveis necessárias estão configuradas!', 'green');
  }

  log('');
}

main().catch(error => {
  log(`\n❌ Erro: ${error.message}`, 'red');
  process.exit(1);
});
