# Arena Dona Santa - Landing Page

Landing page moderna e high-performance para a plataforma Arena Dona Santa, focada em gestão de quadras esportivas.

## Características

- ✅ **Performance otimizada** - Sem bibliotecas pesadas de animação
- ✅ **Animações nativas** - CSS animations + Intersection Observer API
- ✅ **Responsivo** - Mobile-first design
- ✅ **SEO otimizado** - Metadata e estrutura semântica
- ✅ **Acessível** - Contraste adequado (WCAG AA)

## Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Intersection Observer API** - Animações ao scroll (nativo)

## Estrutura da Landing Page

1. **Hero Section** - Seção principal com imagem de fundo e CTA
2. **Problem/Solution** - Problemas que a plataforma resolve
3. **Features** - 6 funcionalidades principais em cards
4. **How It Works** - Timeline de 4 passos
5. **Testimonials** - Depoimentos com slider automático
6. **Pricing** - Plano gratuito
7. **FAQ** - Perguntas frequentes com accordion
8. **Final CTA** - Chamada para ação final
9. **Footer** - Links e informações

## Instalação e Uso

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passos

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Rodar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar no navegador:**
   ```
   http://localhost:3000
   ```

4. **Build para produção:**
   ```bash
   npm run build
   npm start
   ```

## Performance

### Otimizações Implementadas

- ✅ Lazy loading de imagens com Next.js Image
- ✅ CSS animations com GPU acceleration (transform/opacity)
- ✅ Intersection Observer para animações ao scroll
- ✅ Sem bibliotecas pesadas (Framer Motion, GSAP)
- ✅ Parallax suave (apenas 5% de movimento)
- ✅ Mobile-first approach

### Métricas Esperadas

- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## Customização

### Cores

Edite `tailwind.config.ts`:

```typescript
colors: {
  primary: "#2D9F5D",    // Verde esportivo
  secondary: "#4F9CFF",  // Azul energia
  accent: "#FF6B35",     // Laranja ação
  dark: "#1A1A1A",       // Preto profundo
  light: "#FFFFFF",      // Branco puro
  gray: "#F5F5F5",       // Cinza claro
}
```

### Espaçamentos

Seções usam a classe `section-padding`:
- Desktop: `8rem` (128px) vertical
- Mobile: `4rem` (64px) vertical

### Animações

Adicione classes aos elementos:
- `.fade-in` - Fade in ao scroll
- `.slide-in-left` - Slide da esquerda
- `.slide-in-right` - Slide da direita

## Componentes

### AnimationObserver
Componente cliente que inicializa:
- Intersection Observer para animações ao scroll
- Parallax effect no hero

### FAQ
Accordion com perguntas frequentes. Adicione/edite em `components/FAQ.tsx`.

### Testimonials
Slider automático de depoimentos (5s). Customize em `components/Testimonials.tsx`.

## Deploy

### Cloudflare Pages (Recomendado)

1. Conecte seu repositório no Cloudflare Pages
2. Configure o build:
   - Framework preset: Next.js
   - Build command: `npx @cloudflare/next-on-pages@1`
   - Build output directory: `.vercel/output/static`
   - Node version: `20.19.2`

3. Adicione as variáveis de ambiente necessárias no painel do Cloudflare

Para mais detalhes, consulte `docs/CLOUDFLARE_SETUP.md`

### Outros

A aplicação pode ser deployada em qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Estrutura de Arquivos

```
arena-dona-santa/
├── app/
│   ├── globals.css          # Estilos globais e animações
│   ├── layout.tsx            # Layout raiz
│   └── page.tsx              # Landing page principal
├── components/
│   ├── AnimationObserver.tsx # Controle de animações
│   ├── FAQ.tsx               # Accordion de perguntas
│   └── Testimonials.tsx      # Slider de depoimentos
├── lib/
│   └── utils.ts              # Utilitários (cn)
├── public/
│   └── hero-arena.jpg        # Imagem hero
├── SETUP/
│   ├── PRD.md                # Product Requirements Document
│   └── PROMPT_LANDING.md     # Especificações da landing
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Próximos Passos

- [ ] Conectar CTAs com sistema de autenticação
- [ ] Integrar formulário de contato
- [ ] Adicionar Google Analytics
- [ ] Implementar testes com Lighthouse CI
- [ ] Otimizar imagens para WebP
- [ ] Adicionar mais idiomas (i18n)

## Suporte

Para dúvidas ou problemas, consulte:
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- Arquivo `SETUP/PRD.md` - Requisitos completos do produto
- Arquivo `SETUP/PROMPT_LANDING.md` - Especificações da landing

## Licença

© 2025 Arena Dona Santa. Todos os direitos reservados.
