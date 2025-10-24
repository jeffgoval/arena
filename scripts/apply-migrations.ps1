# Script para aplicar migrações do Supabase
# Execute: .\scripts\apply-migrations.ps1

Write-Host "=== Aplicando Migrações do Supabase ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se Supabase CLI está instalado
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale via npm:" -ForegroundColor Yellow
    Write-Host "  npm install -g supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou via Scoop:" -ForegroundColor Yellow
    Write-Host "  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git" -ForegroundColor White
    Write-Host "  scoop install supabase" -ForegroundColor White
    exit 1
}

Write-Host "✅ Supabase CLI encontrado" -ForegroundColor Green
Write-Host ""

# Verificar se está logado
Write-Host "Verificando autenticação..." -ForegroundColor Yellow
$loginCheck = supabase projects list 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não autenticado no Supabase" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute:" -ForegroundColor Yellow
    Write-Host "  supabase login" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Autenticado no Supabase" -ForegroundColor Green
Write-Host ""

# Verificar se está linkado a um projeto
Write-Host "Verificando link com projeto..." -ForegroundColor Yellow
$linkCheck = Test-Path ".\.supabase\config.toml"

if (-not $linkCheck) {
    Write-Host "❌ Projeto não linkado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute:" -ForegroundColor Yellow
    Write-Host "  supabase link --project-ref SEU_PROJECT_REF" -ForegroundColor White
    Write-Host ""
    Write-Host "Para encontrar o project-ref:" -ForegroundColor Cyan
    Write-Host "  1. Acesse https://app.supabase.com" -ForegroundColor White
    Write-Host "  2. Selecione seu projeto" -ForegroundColor White
    Write-Host "  3. Vá em Settings > General" -ForegroundColor White
    Write-Host "  4. Copie o 'Reference ID'" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Projeto linkado" -ForegroundColor Green
Write-Host ""

# Listar migrações
Write-Host "Migrações disponíveis:" -ForegroundColor Cyan
Get-ChildItem -Path ".\supabase\migrations" -Filter "*.sql" | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}
Write-Host ""

# Confirmar aplicação
$confirm = Read-Host "Deseja aplicar as migrações? (S/N)"

if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "❌ Operação cancelada" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Aplicando migrações..." -ForegroundColor Yellow
Write-Host ""

# Aplicar migrações
supabase db push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrações aplicadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Verifique as tabelas no Supabase Dashboard" -ForegroundColor White
    Write-Host "  2. Teste a funcionalidade de convites" -ForegroundColor White
    Write-Host "  3. Verifique as políticas RLS" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Erro ao aplicar migrações" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique os logs acima para mais detalhes" -ForegroundColor Yellow
    exit 1
}
