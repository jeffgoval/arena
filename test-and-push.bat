@echo off
REM Script para testar build localmente antes de fazer push (Windows)
REM Uso: test-and-push.bat "mensagem do commit"

setlocal enabledelayedexpansion

echo.
echo ^[33m🔍 Testando build local antes de fazer push...^[0m
echo.

REM Verificar se há mensagem de commit
if "%~1"=="" (
  echo ^[31m❌ Erro: Forneça uma mensagem de commit^[0m
  echo Uso: test-and-push.bat "sua mensagem de commit"
  exit /b 1
)

set "COMMIT_MESSAGE=%~1"

REM Verificar se há mudanças
git diff --quiet
if %errorlevel%==0 (
  git diff --cached --quiet
  if !errorlevel!==0 (
    echo ^[33m⚠️  Nenhuma mudança para commitar^[0m
    exit /b 0
  )
)

REM Mostrar arquivos modificados
echo ^[33m📝 Arquivos modificados:^[0m
git status --short
echo.

REM Executar build
echo ^[33m🏗️  Executando build local...^[0m
call npm run build
if %errorlevel% neq 0 (
  echo.
  echo ^[31m❌ Build falhou! Corrija os erros antes de fazer push.^[0m
  exit /b 1
)

echo.
echo ^[32m✅ Build passou com sucesso!^[0m
echo.

REM Stage all changes
echo ^[33m📦 Staging arquivos...^[0m
git add -A

REM Commit
echo ^[33m💾 Criando commit...^[0m
git commit -m "%COMMIT_MESSAGE%

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

REM Push
echo ^[33m🚀 Fazendo push para GitHub...^[0m
git push origin main

echo.
echo ^[32m✅ Push concluído com sucesso!^[0m
echo ^[32m🎉 Build testado localmente e código enviado para produção^[0m
