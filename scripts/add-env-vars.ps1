# Script PowerShell para adicionar variáveis de ambiente no Vercel
# Lê do .env.local e adiciona no Vercel

Write-Host "`n🔧 Adicionando variáveis de ambiente no Vercel...`n" -ForegroundColor Cyan

# Lê as variáveis do .env.local
$envContent = Get-Content .env.local
$vars = @{}

foreach ($line in $envContent) {
    if ($line -match '^([^=]+)=(.+)$') {
        $key = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        $vars[$key] = $value
    }
}

$APP_URL = "https://arena.sistemasdigitais.com"

# Função para adicionar variável
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )

    Write-Host "  ⏳ $Name ($Environment)..." -ForegroundColor Yellow

    try {
        $Value | vercel env add $Name $Environment 2>&1 | Out-Null
        Write-Host "  ✓ $Name ($Environment)" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Erro ao adicionar $Name ($Environment)" -ForegroundColor Red
    }
}

# Variáveis críticas
$criticalVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = $vars["NEXT_PUBLIC_SUPABASE_URL"]
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $vars["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    "SUPABASE_SERVICE_ROLE_KEY" = $vars["SUPABASE_SERVICE_ROLE_KEY"]
    "NEXT_PUBLIC_APP_URL" = $APP_URL
}

# Variáveis opcionais
$optionalVars = @{
    "ASAAS_API_KEY" = $vars["ASAAS_API_KEY"]
    "ASAAS_ENVIRONMENT" = $vars["ASAAS_ENVIRONMENT"]
    "DATABASE_URL" = $vars["DATABASE_URL"]
}

Write-Host "🔴 Adicionando variáveis CRÍTICAS...`n" -ForegroundColor Red

foreach ($key in $criticalVars.Keys) {
    $value = $criticalVars[$key]
    if ($value) {
        Write-Host "➤ $key" -ForegroundColor Cyan
        Add-VercelEnv -Name $key -Value $value -Environment "production"
        Add-VercelEnv -Name $key -Value $value -Environment "preview"
        Add-VercelEnv -Name $key -Value $value -Environment "development"
        Write-Host ""
    }
}

Write-Host "`n🟡 Adicionando variáveis OPCIONAIS...`n" -ForegroundColor Yellow

foreach ($key in $optionalVars.Keys) {
    $value = $optionalVars[$key]
    if ($value) {
        Write-Host "➤ $key" -ForegroundColor Cyan
        Add-VercelEnv -Name $key -Value $value -Environment "production"
        Add-VercelEnv -Name $key -Value $value -Environment "preview"
        Add-VercelEnv -Name $key -Value $value -Environment "development"
        Write-Host ""
    }
}

Write-Host "`n✅ Processo concluído!`n" -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Execute um redeploy para aplicar as mudanças:" -ForegroundColor Yellow
Write-Host "   vercel --prod`n" -ForegroundColor Cyan
