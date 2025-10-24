#!/bin/bash

# Script para adicionar variáveis de ambiente no Vercel
# Lê do .env.local e adiciona no Vercel

echo "🔧 Adicionando variáveis de ambiente no Vercel..."
echo ""

# Lê as variáveis do .env.local
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
SUPABASE_ANON=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)
SUPABASE_SERVICE=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d '=' -f2)
ASAAS_KEY=$(grep ASAAS_API_KEY .env.local | cut -d '=' -f2)
ASAAS_ENV=$(grep ASAAS_ENVIRONMENT .env.local | cut -d '=' -f2)
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2)

APP_URL="https://arena.sistemasdigitais.com"

# Adiciona NEXT_PUBLIC_SUPABASE_URL
echo "➤ Adicionando NEXT_PUBLIC_SUPABASE_URL..."
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL development

# Adiciona NEXT_PUBLIC_SUPABASE_ANON_KEY
echo "➤ Adicionando NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "$SUPABASE_ANON" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "$SUPABASE_ANON" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo "$SUPABASE_ANON" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Adiciona SUPABASE_SERVICE_ROLE_KEY
echo "➤ Adicionando SUPABASE_SERVICE_ROLE_KEY..."
echo "$SUPABASE_SERVICE" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "$SUPABASE_SERVICE" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview
echo "$SUPABASE_SERVICE" | vercel env add SUPABASE_SERVICE_ROLE_KEY development

# Adiciona NEXT_PUBLIC_APP_URL
echo "➤ Adicionando NEXT_PUBLIC_APP_URL..."
echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production
echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL preview
echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL development

# Adiciona ASAAS_API_KEY
echo "➤ Adicionando ASAAS_API_KEY..."
echo "$ASAAS_KEY" | vercel env add ASAAS_API_KEY production
echo "$ASAAS_KEY" | vercel env add ASAAS_API_KEY preview
echo "$ASAAS_KEY" | vercel env add ASAAS_API_KEY development

# Adiciona ASAAS_ENVIRONMENT
echo "➤ Adicionando ASAAS_ENVIRONMENT..."
echo "$ASAAS_ENV" | vercel env add ASAAS_ENVIRONMENT production
echo "$ASAAS_ENV" | vercel env add ASAAS_ENVIRONMENT preview
echo "$ASAAS_ENV" | vercel env add ASAAS_ENVIRONMENT development

# Adiciona DATABASE_URL
echo "➤ Adicionando DATABASE_URL..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$DATABASE_URL" | vercel env add DATABASE_URL preview
echo "$DATABASE_URL" | vercel env add DATABASE_URL development

echo ""
echo "✅ Variáveis adicionadas com sucesso!"
echo ""
echo "⚠️  IMPORTANTE: Execute um redeploy para aplicar as mudanças:"
echo "   vercel --prod"
