# Arena Dona Santa - Landing Page

Landing page estática completa e autocontida.

## 🚀 Como Usar

### 1. Instalar
```bash
cd HOME
npm install
```

### 2. Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### 3. Build Estático
```bash
npm run build
```
Site gerado em: `out/`

## 📦 Deploy

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
Arraste `out/` para [netlify.com/drop](https://app.netlify.com/drop)

### Qualquer Servidor
Upload da pasta `out/` para qualquer hospedagem

## 📁 Estrutura

```
HOME/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/          # 11 seções da landing
│   ├── landing/       # Componente principal
│   └── ui/            # 7 componentes essenciais
├── lib/
│   └── utils.ts
├── public/
│   └── hero-arena.jpg
└── out/               # Site estático (após build)
```

## ✨ Inclui

- ✅ Todas as 11 seções
- ✅ Animações Framer Motion
- ✅ Design responsivo
- ✅ Footer + Logo inline
- ✅ Apenas 160 pacotes npm
- ✅ Total: 1.6MB

## 🎯 Pronto para Deploy!

Este é um projeto autocontido. Tudo que você precisa está aqui.
