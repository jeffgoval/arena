#!/bin/bash

# Script para testar build localmente antes de fazer push
# Uso: ./test-and-push.sh "mensagem do commit"

set -e  # Para na primeira falha

echo "🔍 Testando build local antes de fazer push..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se há mensagem de commit
if [ -z "$1" ]; then
  echo -e "${RED}❌ Erro: Forneça uma mensagem de commit${NC}"
  echo "Uso: ./test-and-push.sh \"sua mensagem de commit\""
  exit 1
fi

COMMIT_MESSAGE="$1"

# Verificar se há mudanças para commitar
if git diff --quiet && git diff --cached --quiet; then
  echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar${NC}"
  exit 0
fi

# Mostrar arquivos modificados
echo -e "${YELLOW}📝 Arquivos modificados:${NC}"
git status --short
echo ""

# Executar build
echo -e "${YELLOW}🏗️  Executando build local...${NC}"
if npm run build; then
  echo ""
  echo -e "${GREEN}✅ Build passou com sucesso!${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Build falhou! Corrija os erros antes de fazer push.${NC}"
  exit 1
fi

# Stage all changes
echo -e "${YELLOW}📦 Staging arquivos...${NC}"
git add -A

# Commit
echo -e "${YELLOW}💾 Criando commit...${NC}"
git commit -m "$COMMIT_MESSAGE

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
echo -e "${YELLOW}🚀 Fazendo push para GitHub...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✅ Push concluído com sucesso!${NC}"
echo -e "${GREEN}🎉 Build testado localmente e código enviado para produção${NC}"
