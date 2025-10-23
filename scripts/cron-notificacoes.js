#!/usr/bin/env node

/**
 * Script para processar notificações pendentes
 * Deve ser executado a cada minuto via cron job
 * 
 * Configuração do cron (crontab -e):
 * * * * * * /usr/bin/node /path/to/scripts/cron-notificacoes.js
 */

const https = require('https');
const http = require('http');

// Configurações
const config = {
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  token: process.env.CRON_SECRET_TOKEN || 'your-secret-token',
  timeout: 30000 // 30 segundos
};

function makeRequest(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Arena-Cron-Job/1.0'
      },
      timeout: config.timeout
    };

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: response
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: { message: data }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function processarNotificacoes() {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] Iniciando processamento de notificações...`);

  try {
    const url = `${config.url}/api/notificacoes/processar`;
    const response = await makeRequest(url, config.token);

    if (response.statusCode === 200) {
      console.log(`[${timestamp}] ✅ Notificações processadas com sucesso`);
      if (response.data.message) {
        console.log(`[${timestamp}] Detalhes: ${response.data.message}`);
      }
    } else {
      console.error(`[${timestamp}] ❌ Erro HTTP ${response.statusCode}:`, response.data);
      process.exit(1);
    }

  } catch (error) {
    console.error(`[${timestamp}] ❌ Erro ao processar notificações:`, error.message);
    
    // Log adicional para debugging
    if (error.code) {
      console.error(`[${timestamp}] Código do erro: ${error.code}`);
    }
    
    process.exit(1);
  }
}

// Verificar se as variáveis de ambiente estão configuradas
if (!config.token || config.token === 'your-secret-token') {
  console.error('❌ CRON_SECRET_TOKEN não configurado corretamente');
  console.error('Configure a variável de ambiente CRON_SECRET_TOKEN');
  process.exit(1);
}

if (!config.url) {
  console.error('❌ NEXT_PUBLIC_APP_URL não configurado');
  console.error('Configure a variável de ambiente NEXT_PUBLIC_APP_URL');
  process.exit(1);
}

// Executar o processamento
processarNotificacoes()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });