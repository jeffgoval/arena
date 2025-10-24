# Guia: Verificar e Configurar Variáveis de Ambiente no Vercel

## 📋 O que este script faz?

O script `check-vercel-env.mjs` automatiza a verificação e configuração de variáveis de ambiente no Vercel, comparando com seu arquivo `.env.local`.

**Recursos:**
- ✅ Verifica quais variáveis estão configuradas no Vercel
- 🔍 Compara com as variáveis locais do `.env.local`
- 🚨 Identifica variáveis críticas faltantes
- 🔧 Pode configurar automaticamente as variáveis faltantes
- 📊 Gera relatório detalhado

## 🚀 Como Usar

### Passo 1: Login no Vercel CLI

Primeiro, faça login no Vercel:

```bash
vercel login
```

Isso abrirá o navegador para autenticação. Siga as instruções.

### Passo 2: Linkar o Projeto

Conecte o projeto local ao projeto no Vercel:

```bash
vercel link
```

Selecione:
1. Seu **scope** (sua conta ou organização)
2. O **projeto** existente no Vercel
3. Confirme o diretório

### Passo 3: Verificar Variáveis

Execute o script em modo de **verificação apenas**:

```bash
node scripts/check-vercel-env.mjs
```

Você verá um relatório como:

```
🔍 Verificador de Variáveis de Ambiente - Vercel
════════════════════════════════════════════════════════════

📁 Variáveis encontradas no .env.local: 15
☁️  Variáveis encontradas no Vercel: 3

🔴 Variáveis CRÍTICAS:
  ✗ NEXT_PUBLIC_SUPABASE_URL
  ✗ NEXT_PUBLIC_SUPABASE_ANON_KEY
  ✗ SUPABASE_SERVICE_ROLE_KEY
  ✓ NEXT_PUBLIC_APP_URL

🟡 Variáveis OPCIONAIS:
  - ASAAS_API_KEY
  - ASAAS_ENVIRONMENT
  ...

📊 RESUMO:
  Variáveis críticas faltando: 3
  Variáveis opcionais faltando: 5
```

### Passo 4: Configurar Automaticamente (Opcional)

Se houver variáveis faltando, você pode configurá-las automaticamente:

```bash
node scripts/check-vercel-env.mjs --fix
```

Isso irá:
1. Ler os valores do `.env.local`
2. Adicionar cada variável faltante no Vercel
3. Configurar para **todos os ambientes** (Production, Preview, Development)
4. Mostrar o progresso de cada variável

### Passo 5: Fazer Redeploy

**IMPORTANTE:** Após adicionar variáveis, você DEVE fazer um redeploy:

```bash
vercel --prod
```

Ou manualmente no dashboard: https://vercel.com/dashboard

## 📝 Variáveis Verificadas

### Críticas (Obrigatórias)
- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave privada do Supabase
- `NEXT_PUBLIC_APP_URL` - URL do app em produção

### Opcionais (Recomendadas)
- `ASAAS_API_KEY` - Chave da API Asaas
- `ASAAS_ENVIRONMENT` - Ambiente Asaas (sandbox/production)
- `ASAAS_WEBHOOK_SECRET` - Secret para webhooks Asaas
- `WHATSAPP_ACCESS_TOKEN` - Token WhatsApp Business
- `WHATSAPP_PHONE_NUMBER_ID` - ID do telefone WhatsApp
- `WHATSAPP_VERIFY_TOKEN` - Token de verificação WhatsApp
- `CRON_SECRET_TOKEN` - Token para cron jobs
- `DATABASE_URL` - URL do PostgreSQL

## ⚠️ Importante

1. **Nunca commite o `.env.local`** - Ele contém credenciais sensíveis
2. **Use valores diferentes em produção** - Especialmente para tokens e secrets
3. **Revise antes de usar `--fix`** - Certifique-se que os valores locais estão corretos
4. **Redeploy é obrigatório** - Variáveis só são aplicadas após redeploy

## 🔧 Solução de Problemas

### Erro: "No existing credentials found"
```bash
vercel login
```

### Erro: "No Project linked"
```bash
vercel link
```

### Erro: "Project not found"
Verifique se o projeto existe no dashboard do Vercel e se você tem permissão de acesso.

### Variáveis não aplicadas após configurar
Faça um redeploy:
```bash
vercel --prod
```

## 🎯 Exemplo Completo

```bash
# 1. Login
vercel login

# 2. Linkar projeto
vercel link

# 3. Verificar o que está faltando
node scripts/check-vercel-env.mjs

# 4. Configurar automaticamente
node scripts/check-vercel-env.mjs --fix

# 5. Redeploy
vercel --prod

# 6. Verificar novamente
node scripts/check-vercel-env.mjs
```

## 📚 Recursos Adicionais

- [Documentação Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Supabase + Vercel Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

**Dica Pro:** Você pode adicionar este script ao `package.json`:

```json
{
  "scripts": {
    "vercel:check": "node scripts/check-vercel-env.mjs",
    "vercel:fix": "node scripts/check-vercel-env.mjs --fix"
  }
}
```

E executar com:
```bash
npm run vercel:check
npm run vercel:fix
```
