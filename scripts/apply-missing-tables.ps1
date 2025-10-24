# PowerShell script to apply missing tables migration to Supabase
# Reads .env.local and uses psql to execute the migration

Write-Host "📦 Aplicando migration de tabelas faltantes..." -ForegroundColor Cyan

# Read .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Arquivo .env.local não encontrado!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
$supabaseUrl = ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_URL=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value }).Trim()

if (-not $supabaseUrl) {
    Write-Host "❌ NEXT_PUBLIC_SUPABASE_URL não encontrada no .env.local" -ForegroundColor Red
    exit 1
}

# Extract project ID from URL
$supabaseUrl -match "https://([^.]+)\.supabase\.co" | Out-Null
$projectId = $Matches[1]

Write-Host "`n✅ Projeto Supabase: $projectId" -ForegroundColor Green
Write-Host "`n📋 Para aplicar a migration, você tem 3 opções:`n" -ForegroundColor Yellow

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Write-Host "`n🎯 OPÇÃO 1: Via Supabase Dashboard (RECOMENDADO)" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://supabase.com/dashboard/project/$projectId/sql" -ForegroundColor White
Write-Host "   2. Clique em 'New query'" -ForegroundColor White
Write-Host "   3. Cole o conteúdo de: supabase\migrations\20251023000002_add_missing_tables.sql" -ForegroundColor White
Write-Host "   4. Clique em 'Run' (botão verde)" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Write-Host "`n🔧 OPÇÃO 2: Via Supabase CLI" -ForegroundColor Cyan
Write-Host "   supabase db execute --file supabase/migrations/20251023000002_add_missing_tables.sql" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Write-Host "`n🗄️  OPÇÃO 3: Via psql (se tiver instalado)" -ForegroundColor Cyan
Write-Host "   psql '<connection-string>' -f supabase/migrations/20251023000002_add_missing_tables.sql" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Write-Host "`n📊 Tabelas que serão CRIADAS:" -ForegroundColor Yellow
Write-Host "   • rateios" -ForegroundColor Green
Write-Host "   • pagamentos" -ForegroundColor Green
Write-Host "   • transactions" -ForegroundColor Green
Write-Host "   • avaliacoes" -ForegroundColor Green
Write-Host "   • indicacoes" -ForegroundColor Green
Write-Host "   • mensalistas" -ForegroundColor Green
Write-Host "   • system_settings" -ForegroundColor Green
Write-Host "   • notificacoes" -ForegroundColor Green

Write-Host "`n✅ Tabelas que JÁ EXISTEM (não serão alteradas):" -ForegroundColor Yellow
Write-Host "   • users" -ForegroundColor White
Write-Host "   • quadras" -ForegroundColor White
Write-Host "   • horarios" -ForegroundColor White
Write-Host "   • court_blocks" -ForegroundColor White
Write-Host "   • turmas" -ForegroundColor White
Write-Host "   • turma_membros" -ForegroundColor White
Write-Host "   • reservas" -ForegroundColor White
Write-Host "   • reserva_participantes" -ForegroundColor White
Write-Host "   • convites" -ForegroundColor White
Write-Host "   • convite_aceites" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

# Try to open Supabase Dashboard
$response = Read-Host "Deseja abrir o Supabase Dashboard agora? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    Start-Process "https://supabase.com/dashboard/project/$projectId/sql"
    Write-Host "✅ Dashboard aberto no navegador!" -ForegroundColor Green
}

Write-Host "`n💡 Após aplicar a migration, execute:" -ForegroundColor Cyan
Write-Host "   node scripts/check-db-schema.mjs" -ForegroundColor White
Write-Host "   para verificar que todas as tabelas foram criadas!`n" -ForegroundColor White
