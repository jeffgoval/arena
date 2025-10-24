# 🚀 Guia Rápido: Configurar Variáveis no Vercel

## Problema
Seu site no Vercel mostra erro **"invalid api key"** ao fazer login porque as variáveis de ambiente do Supabase não estão configuradas.

## Solução Rápida (5 minutos)

### Opção 1: Automatizada (Recomendada) ⚡

```bash
# 1. Login no Vercel
vercel login

# 2. Linkar o projeto
vercel link

# 3. Verificar o que está faltando
npm run vercel:check

# 4. Configurar automaticamente
npm run vercel:fix

# 5. Fazer redeploy
vercel --prod
```

### Opção 2: Manual (Dashboard) 🖱️

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione seu projeto**
3. **Vá em:** Settings → Environment Variables
4. **Adicione estas variáveis:**

#### Variáveis Obrigatórias:

```env
NEXT_PUBLIC_SUPABASE_URL
https://mowmpjdgvoeldvrqutvb.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vd21wamRndm9lbGR2cnF1dHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzk0MTMsImV4cCI6MjA3NjY1NTQxM30.JIv56I3nWGbkBFSd8ksuFuTtJmYP8pC3jyD96W8oT0M

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vd21wamRndm9lbGR2cnF1dHZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA3OTQxMywiZXhwIjoyMDc2NjU1NDEzfQ.hjFWIKiyIsoeMteP-0DSMS0s2LkXEfBl2vt8gLIQ0K0

NEXT_PUBLIC_APP_URL
https://SEU-DOMINIO.vercel.app
```

**IMPORTANTE:**
- Marque **Production, Preview, e Development** para cada variável
- Substitua `SEU-DOMINIO` pela URL real do seu projeto no Vercel

5. **Após adicionar as variáveis:**
   - Vá em **Deployments**
   - Clique nos **3 pontos** do último deployment
   - Selecione **Redeploy**

## ✅ Verificar se Funcionou

Após o redeploy:
1. Acesse seu site: `https://seu-dominio.vercel.app`
2. Tente fazer login
3. ✅ Deve funcionar normalmente!

## 🔍 Comandos Úteis

```bash
# Verificar variáveis
npm run vercel:check

# Configurar variáveis automaticamente
npm run vercel:fix

# Ver logs do Vercel
vercel logs

# Status do projeto
vercel ls

# Fazer deploy em produção
vercel --prod
```

## 📚 Documentação Completa

Para mais detalhes, veja: `scripts/README-VERCEL-ENV.md`

## ⚠️ Troubleshooting

### Erro: "No existing credentials found"
```bash
vercel login
```

### Erro: "No Project linked"
```bash
vercel link
```

### Login ainda não funciona
1. Verifique os **logs do Vercel**: https://vercel.com/seu-projeto/logs
2. Verifique o **console do navegador** (F12)
3. Certifique-se de que fez o **redeploy** após adicionar as variáveis

---

**Precisa de ajuda?** Abra uma issue no GitHub ou verifique a documentação completa.
