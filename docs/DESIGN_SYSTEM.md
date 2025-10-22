# Design System - Arena Dona Santa

## 🎨 Visão Geral

O design system foi completamente modernizado seguindo as melhores práticas atuais de desenvolvimento frontend. As principais melhorias incluem:

### ✅ Melhorias Implementadas

- **CSS Variables**: Sistema baseado em CSS custom properties para temas dinâmicos
- **Dark Mode**: Suporte nativo a modo escuro
- **Design Tokens**: Tokens padronizados para spacing, typography, colors e shadows
- **Componentes Acessíveis**: Foco em acessibilidade e usabilidade
- **Animações Otimizadas**: Animações performáticas com `will-change` e GPU acceleration
- **Sistema de Cores Semântico**: Cores com significado (success, warning, error)

## 🚀 Como Usar

### Tokens de Design

```tsx
import { designTokens } from '@/lib/design-tokens';

// Spacing
<div className="p-md" /> // 1rem padding
<div className="m-lg" />  // 1.5rem margin

// Typography
<h1 className="heading-1">Título Principal</h1>
<p className="body-large">Texto de destaque</p>
```

### Classes Utilitárias

```tsx
// Layout
<div className="container-custom section-padding">
  <div className="stagger-animation">
    {/* Elementos com animação escalonada */}
  </div>
</div>

// Cards Interativos
<Card className="card-interactive card-glass">
  {/* Card com hover effects e glass morphism */}
</Card>

// Texto com Gradiente
<h1 className="gradient-text">Título com Gradiente</h1>
```

### Componentes Atualizados

Todos os componentes UI foram atualizados para usar o novo sistema:

- `Button` - Variantes consistentes com focus states
- `Card` - Suporte a glass morphism e hover effects
- `Input` - Estados de foco melhorados
- `Badge` - Cores semânticas

## 🎯 Tokens Principais

### Cores
- **Primary**: Verde Arena (`hsl(142, 76%, 36%)`)
- **Secondary**: Azul Arena (`hsl(217, 91%, 60%)`)
- **Accent**: Laranja Arena (`hsl(24, 95%, 53%)`)
- **Success/Warning/Error**: Cores semânticas padronizadas

### Espaçamento
Baseado em grid de 4px: `xs(4px)`, `sm(8px)`, `md(16px)`, `lg(24px)`, `xl(32px)`

### Tipografia
Escala harmônica com line-heights otimizados para legibilidade

### Sombras
- `shadow-soft`: Elementos sutis
- `shadow-medium`: Cards e modais  
- `shadow-strong`: Elementos flutuantes

## 🌙 Dark Mode

O sistema suporta automaticamente dark mode através de CSS variables:

```tsx
// Automático baseado na preferência do sistema
<html className="dark"> // ou sem classe para light mode
```

## 📱 Responsividade

Breakpoints padronizados:
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔧 Configuração

### Tailwind Config
O `tailwind.config.ts` foi atualizado com:
- CSS variables para temas
- Tokens de design padronizados
- Plugin `tailwindcss-animate`
- Breakpoints e spacing customizados

### CSS Global
O `globals.css` agora inclui:
- CSS variables para light/dark themes
- Componentes reutilizáveis com `@layer components`
- Utilitários otimizados com `@layer utilities`
- Animações performáticas

## 📋 Checklist de Migração

- [x] Atualizar Tailwind config com CSS variables
- [x] Implementar sistema de cores semântico
- [x] Criar design tokens centralizados
- [x] Adicionar suporte a dark mode
- [x] Otimizar animações e transições
- [x] Atualizar componentes UI base
- [x] Criar documentação e showcase

## 🎪 Demo

Acesse `/design-system` para ver todos os componentes e tokens em ação.

## 📚 Próximos Passos

1. **Migrar componentes existentes** para usar os novos tokens
2. **Implementar theme switcher** na interface
3. **Adicionar mais variantes** de componentes conforme necessário
4. **Criar testes visuais** para garantir consistência
5. **Documentar padrões de uso** específicos do projeto