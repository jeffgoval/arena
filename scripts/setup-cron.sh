#!/bin/bash

# Script para configurar o cron job de notificações
# Execute com: chmod +x scripts/setup-cron.sh && ./scripts/setup-cron.sh

echo "🔧 Configurando cron job para notificações automáticas..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Obter o caminho absoluto do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CRON_SCRIPT="$SCRIPT_DIR/cron-notificacoes.js"

# Verificar se o script existe
if [ ! -f "$CRON_SCRIPT" ]; then
    echo "❌ Script cron-notificacoes.js não encontrado em $CRON_SCRIPT"
    exit 1
fi

# Tornar o script executável
chmod +x "$CRON_SCRIPT"

# Obter o caminho do Node.js
NODE_PATH=$(which node)

# Criar entrada do cron job
CRON_ENTRY="* * * * * cd $PROJECT_DIR && $NODE_PATH $CRON_SCRIPT >> /var/log/arena-notificacoes.log 2>&1"

echo "📝 Entrada do cron job:"
echo "$CRON_ENTRY"
echo ""

# Verificar se já existe uma entrada similar
if crontab -l 2>/dev/null | grep -q "cron-notificacoes.js"; then
    echo "⚠️  Já existe uma entrada para cron-notificacoes.js"
    echo "Deseja substituir? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        # Remover entrada existente
        crontab -l 2>/dev/null | grep -v "cron-notificacoes.js" | crontab -
        echo "🗑️  Entrada anterior removida"
    else
        echo "❌ Configuração cancelada"
        exit 0
    fi
fi

# Adicionar nova entrada
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

if [ $? -eq 0 ]; then
    echo "✅ Cron job configurado com sucesso!"
    echo ""
    echo "📋 Configuração atual do crontab:"
    crontab -l | grep "cron-notificacoes.js"
    echo ""
    echo "📁 Logs serão salvos em: /var/log/arena-notificacoes.log"
    echo ""
    echo "🔧 Para verificar se está funcionando:"
    echo "   tail -f /var/log/arena-notificacoes.log"
    echo ""
    echo "🗑️  Para remover o cron job:"
    echo "   crontab -e"
    echo "   (remova a linha com cron-notificacoes.js)"
else
    echo "❌ Erro ao configurar cron job"
    exit 1
fi

# Criar arquivo de log se não existir
sudo touch /var/log/arena-notificacoes.log 2>/dev/null || {
    echo "⚠️  Não foi possível criar /var/log/arena-notificacoes.log"
    echo "   Execute manualmente: sudo touch /var/log/arena-notificacoes.log"
    echo "   E configure as permissões: sudo chown $USER:$USER /var/log/arena-notificacoes.log"
}

echo ""
echo "🎯 Próximos passos:"
echo "1. Configure as variáveis de ambiente:"
echo "   - CRON_SECRET_TOKEN (token secreto para autenticação)"
echo "   - NEXT_PUBLIC_APP_URL (URL da aplicação)"
echo ""
echo "2. Teste manualmente:"
echo "   node $CRON_SCRIPT"
echo ""
echo "3. Monitore os logs:"
echo "   tail -f /var/log/arena-notificacoes.log"