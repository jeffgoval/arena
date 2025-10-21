# Deploy no Cloudflare Pages

## Configurações do Build

No painel do Cloudflare Pages, configure:

### Build Settings

**Framework preset:** Next.js (Static HTML Export)

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
out
```

**Root directory:**
```
/
```

### Environment Variables

Nenhuma variável de ambiente necessária para a landing page básica.

### Node.js version

Node.js 20 (configurado via `.node-version`)

## Comandos Locais

### Desenvolvimento
```bash
npm run dev
```

### Build Local
```bash
npm run build
```

### Testar Build
A pasta `out/` conterá os arquivos estáticos após o build.

## Estrutura do Projeto

- **Framework:** Next.js 15 com static export
- **Styling:** Tailwind CSS
- **Components:** React Server Components + Client Components
- **Animations:** CSS + Intersection Observer (sem bibliotecas pesadas)
- **Images:** Otimizadas e com lazy loading

## Troubleshooting

### Build Failures

Se o build falhar:

1. Verifique se o `next.config.js` tem `output: 'export'`
2. Certifique-se de não usar features que requerem servidor (API routes, ISR, etc)
3. Use `npm run build` localmente primeiro para testar

### Erros de Dependências

Se houver erros de dependências:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance

A landing page foi otimizada para:

- ✅ Lighthouse Score 90+
- ✅ First Contentful Paint < 1.5s
- ✅ Sem bibliotecas de animação pesadas
- ✅ CSS animations nativas
- ✅ Lazy loading de imagens
- ✅ Static export (Edge-optimized)

## Deploy Automático

Cada push para a branch `main` irá automaticamente:

1. Triggerar build no Cloudflare Pages
2. Gerar static export na pasta `/out`
3. Deploy para o Edge Network global
4. Disponibilizar em < 1 minuto

## URL de Preview

Cloudflare Pages gera automaticamente:
- **Production:** `arena-dona-santa.pages.dev`
- **Preview:** `[commit-hash].arena-dona-santa.pages.dev`

## Custom Domain

Para adicionar domínio customizado:

1. Acesse Cloudflare Pages > Custom Domains
2. Adicione seu domínio
3. Configure DNS records automaticamente
4. SSL/TLS automático via Cloudflare

## Suporte

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Next.js Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
