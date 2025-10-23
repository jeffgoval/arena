# Configuração Cloudflare Pages - Arena Dona Santa

## Arquitetura

Este projeto usa **Next.js 15 com SSR (Server-Side Rendering)** no Cloudflare Pages:

- **Landing page (`/`)**: Static (SSG) - otimizada para SEO e performance
- **Dashboard e Auth**: Dynamic (SSR) - dados sempre atualizados do Supabase
- **Runtime**: Cloudflare Workers (Edge Computing)

## Configuração no Painel Cloudflare Pages

### 1. Build Settings

Acesse seu projeto no Cloudflare Pages Dashboard e configure:

```
Framework preset: Next.js
Build command: npx @cloudflare/next-on-pages@1
Build output directory: .vercel/output/static
Node version: 20.19.2
```

**Importante:** 
- Use `npx @cloudflare/next-on-pages@1` para compatibilidade com Next.js 15
- Certifique-se de que o Node.js 20.19.2 está configurado

### 2. Variáveis de Ambiente (Production)

Configure as seguintes variáveis em **Settings → Environment Variables → Production**:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

**Onde encontrar:**
- Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
- Vá em **Settings → API**
- Copie as credenciais

### 3. Node.js Version

O projeto usa **Node.js 20**. O Cloudflare detecta automaticamente via `.node-version`:

```
20
```

## Build Local

Para testar localmente:

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Servidor local
npm start
```

## Troubleshooting

### Erro: "Supabase URL and API key are required"

**Causa:** Variáveis de ambiente não configuradas no Cloudflare Pages.

**Solução:**
1. Configure as variáveis no painel (veja seção 2 acima)
2. Faça um novo deploy (Deployments → Retry deployment)

### Erro: "Command 'npx @cloudflare/next-on-pages@1' failed"

**Causa:** Versão deprecated do adaptador.

**Solução:**
- Use `npx @cloudflare/next-on-pages` (sem `@1`)
- Ou migre para `@cloudflare/next-on-pages@latest`

### Build travando em "Generating static pages"

**Causa:** Páginas dinâmicas tentando fazer SSG.

**Solução:**
- Todas as páginas do dashboard já têm `export const dynamic = 'force-dynamic'`
- Se ainda falhar, verifique se novos arquivos foram adicionados sem essa diretiva

## Estrutura de Deploy

```
arena-dona-santa/
├── .vercel/output/static/     ← Build output (Cloudflare lê daqui)
├── src/app/
│   ├── page.tsx               ← Landing (SSG)
│   ├── (dashboard)/           ← Dashboard (SSR)
│   └── (auth)/                ← Login/Cadastro (SSR)
├── next.config.js             ← Sem 'output: export' (SSR habilitado)
└── CLOUDFLARE_SETUP.md        ← Este arquivo
```

## Performance

- **Landing page**: ~100-200ms (CDN global)
- **Dashboard**: ~300-500ms (SSR + Supabase)
- **Cold start**: ~1-2s (primeira requisição após inatividade)

## Monitoramento

Acompanhe os deployments em:
- **Cloudflare Pages Dashboard** → Deployments
- **Analytics** → Web Analytics (métricas de performance)
- **Functions** → Metrics (uso de Workers)

## Suporte

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Supabase Docs](https://supabase.com/docs)
