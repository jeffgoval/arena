#!/usr/bin/env node

/**
 * Script de teste para o sistema de notificações
 * Testa todas as funcionalidades principais
 */

const https = require('https');
const http = require('http');

// Configurações
const config = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  cronToken: process.env.CRON_SECRET_TOKEN || 'test-token',
  telefoneTest: process.env.TELEFONE_TESTE || '5511999999999'
};

console.log('🧪 Iniciando testes do sistema de notificações...\n');

// Função para fazer requisições HTTP
function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: { message: responseData }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Teste 1: Listar templates
async function testarListarTemplates() {
  console.log('📋 Teste 1: Listar templates');
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/notificacoes/templates`);
    
    if (response.statusCode === 200) {
      console.log('✅ Templates listados com sucesso');
      console.log(`   - ${response.data.templates?.length || 0} templates encontrados`);
      
      if (response.data.templates) {
        response.data.templates.forEach(template => {
          console.log(`   - ${template.tipo}: ${template.titulo} (${template.ativo ? 'Ativo' : 'Inativo'})`);
        });
      }
    } else {
      console.log('❌ Erro ao listar templates:', response.data);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }
  
  console.log('');
}

// Teste 2: Testar template
async function testarTemplate() {
  console.log('🧪 Teste 2: Testar template');
  
  try {
    const dadosTeste = {
      tipo: 'lembrete_45min',
      telefone: config.telefoneTest,
      dadosTeste: {
        quadra: 'Quadra A - Teste',
        data: '25/10/2024',
        horario: '20:00',
        participantes: 4
      }
    };

    const response = await makeRequest(
      `${config.baseUrl}/api/notificacoes/testar`,
      'POST',
      dadosTeste
    );
    
    if (response.statusCode === 200) {
      console.log('✅ Template testado com sucesso');
      console.log(`   - Mensagem enviada para: ${config.telefoneTest}`);
    } else {
      console.log('❌ Erro ao testar template:', response.data);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }
  
  console.log('');
}

// Teste 3: Processar notificações (simulando cron job)
async function testarProcessarNotificacoes() {
  console.log('⏰ Teste 3: Processar notificações pendentes');
  
  try {
    const response = await makeRequest(
      `${config.baseUrl}/api/notificacoes/processar`,
      'POST',
      null,
      {
        'Authorization': `Bearer ${config.cronToken}`
      }
    );
    
    if (response.statusCode === 200) {
      console.log('✅ Notificações processadas com sucesso');
      console.log(`   - Timestamp: ${response.data.timestamp}`);
    } else {
      console.log('❌ Erro ao processar notificações:', response.data);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }
  
  console.log('');
}

// Teste 4: Obter estatísticas
async function testarEstatisticas() {
  console.log('📊 Teste 4: Obter estatísticas');
  
  try {
    const dataInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dataFim = new Date().toISOString().split('T')[0];
    
    const response = await makeRequest(
      `${config.baseUrl}/api/notificacoes/estatisticas?dataInicio=${dataInicio}&dataFim=${dataFim}`
    );
    
    if (response.statusCode === 200) {
      console.log('✅ Estatísticas obtidas com sucesso');
      const stats = response.data.estatisticas;
      console.log(`   - Total: ${stats.total}`);
      console.log(`   - Enviadas: ${stats.enviadas}`);
      console.log(`   - Pendentes: ${stats.pendentes}`);
      console.log(`   - Falharam: ${stats.falharam}`);
      
      if (stats.porTipo && Object.keys(stats.porTipo).length > 0) {
        console.log('   - Por tipo:');
        Object.entries(stats.porTipo).forEach(([tipo, dados]) => {
          console.log(`     * ${tipo}: ${dados.enviadas}/${dados.total} (${dados.taxa.toFixed(1)}%)`);
        });
      }
    } else {
      console.log('❌ Erro ao obter estatísticas:', response.data);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }
  
  console.log('');
}

// Teste 5: Verificar conectividade
async function testarConectividade() {
  console.log('🌐 Teste 5: Verificar conectividade');
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/health`);
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      console.log('✅ Servidor está respondendo');
    } else {
      console.log('⚠️  Servidor respondeu com status:', response.statusCode);
    }
  } catch (error) {
    console.log('❌ Erro de conectividade:', error.message);
  }
  
  console.log('');
}

// Executar todos os testes
async function executarTodos() {
  console.log(`🎯 Testando sistema em: ${config.baseUrl}`);
  console.log(`📱 Telefone de teste: ${config.telefoneTest}`);
  console.log(`🔑 Token do cron: ${config.cronToken ? 'Configurado' : 'Não configurado'}\n`);

  await testarConectividade();
  await testarListarTemplates();
  
  // Só testar envio se o telefone estiver configurado
  if (config.telefoneTest && config.telefoneTest !== '5511999999999') {
    await testarTemplate();
  } else {
    console.log('⚠️  Pulando teste de envio - configure TELEFONE_TESTE\n');
  }
  
  await testarProcessarNotificacoes();
  await testarEstatisticas();

  console.log('🏁 Testes concluídos!');
  console.log('\n📝 Para configurar adequadamente:');
  console.log('1. Configure TELEFONE_TESTE com seu número para testar envios');
  console.log('2. Configure CRON_SECRET_TOKEN para autenticação');
  console.log('3. Verifique se o servidor está rodando');
  console.log('4. Execute a migração do banco de dados');
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('🧪 Script de teste do sistema de notificações\n');
  console.log('Uso: node scripts/test-notificacoes.js [opções]\n');
  console.log('Opções:');
  console.log('  --templates     Testar apenas templates');
  console.log('  --envio         Testar apenas envio');
  console.log('  --cron          Testar apenas processamento');
  console.log('  --stats         Testar apenas estatísticas');
  console.log('  --help, -h      Mostrar esta ajuda');
  console.log('\nVariáveis de ambiente:');
  console.log('  NEXT_PUBLIC_APP_URL    URL da aplicação (padrão: http://localhost:3000)');
  console.log('  CRON_SECRET_TOKEN      Token para autenticação do cron');
  console.log('  TELEFONE_TESTE         Número para teste de envio (formato: 5511999999999)');
  process.exit(0);
}

// Executar testes específicos ou todos
if (args.includes('--templates')) {
  testarListarTemplates();
} else if (args.includes('--envio')) {
  testarTemplate();
} else if (args.includes('--cron')) {
  testarProcessarNotificacoes();
} else if (args.includes('--stats')) {
  testarEstatisticas();
} else {
  executarTodos();
}