# ✅ Checklist de Deploy - Cloudflare Pages

## Pré-Deploy

- [x] Componente Calendar corrigido
- [x] Build local executado com sucesso
- [x] Tipos TypeScript validados
- [x] Documentação atualizada
- [x] Referências ao Vercel removidas

## Configuração Cloudflare Pages

### 1. Build Settings
- [ ] Framework preset: **Next.js**
- [ ] Build command: `npx @cloudflare/next-on-pages@1`
- [ ] Build output directory: `.vercel/output/static`
- [ ] Node version: **20.19.2**

### 2. Variáveis de Ambiente (Production) ⚠️ OBRIGATÓRIO

⚠️ **CONFIGURE ANTES DO DEPLOY!** O build vai funcionar, mas o app não vai rodar sem essas variáveis.

Acesse: **Settings → Environment Variables → Production**

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://seu-projeto.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sua-chave-anonima`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `sua-service-role-key`

**Onde encontrar as chaves:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

**Nota:** O build usa valores placeholder, mas as variáveis reais são necessárias para o runtime.

### 3. Deploy

- [ ] Commit das mudanças:
  ```bash
  git add .
  git commit -m "fix: corrige Calendar e prepara para Cloudflare Pages"
  git push
  ```

- [ ] Aguardar build automático no Cloudflare (2-3 minutos)
- [ ] Verificar logs de build
- [ ] Testar a aplicação no domínio fornecido

## Verificação Pós-Deploy

### Landing Page (/)
- [ ] Página carrega corretamente
- [ ] Imagens aparecem
- [ ] Animações funcionam
- [ ] Links funcionam

### Autenticação (/auth)
- [ ] Página de login carrega
- [ ] Formulário de cadastro funciona
- [ ] Login funciona
- [ ] Redirecionamento após login funciona

### Dashboard Cliente (/cliente)
- [ ] Dashboard carrega após login
- [ ] Dados do Supabase aparecem
- [ ] Navegação entre páginas funciona
- [ ] Formulários funcionam

### Dashboard Gestor (/gestor)
- [ ] Dashboard carrega para usuário gestor
- [ ] Agenda funciona
- [ ] CRUD de quadras funciona
- [ ] Relatórios carregam

## Troubleshooting

### Build falha com erro de tipos
**Solução:** Verifique se o arquivo `calendar.tsx` está usando a API correta (componente `Chevron`)

### Erro "Supabase URL and API key are required"
**Solução:** Configure as variáveis de ambiente no painel do Cloudflare

### Páginas retornam 404
**Solução:** Verifique se o build output directory está correto: `.vercel/output/static`

### Build muito lento
**Solução:** Normal na primeira vez. Builds subsequentes usam cache e são mais rápidos.

## Monitoramento

Após o deploy, monitore:
- **Analytics** → Web Analytics (tráfego e performance)
- **Functions** → Metrics (uso de Workers)
- **Deployments** → Logs (erros e avisos)

## Suporte

- 📖 [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md) - Configuração detalhada
- 🔧 [docs/FIX_CALENDAR_BUILD.md](docs/FIX_CALENDAR_BUILD.md) - Correção aplicada
- 🚀 [CLOUDFLARE_DEPLOY_READY.md](CLOUDFLARE_DEPLOY_READY.md) - Status do projeto
- 🌐 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 📚 [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
