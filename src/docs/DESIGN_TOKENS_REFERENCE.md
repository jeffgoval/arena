# 🎨 Design Tokens - Referência Rápida

## 📖 Guia de Referência Completo

Este documento é um guia prático para usar os design tokens do Arena Dona Santa.

---

## 📝 Typography

### Font Sizes

| Token | Size | Pixels | Uso Recomendado |
|-------|------|--------|-----------------|
| `--text-xs` | 0.75rem | 12px | Legendas, labels pequenos |
| `--text-sm` | 0.875rem | 14px | Texto secundário, helper text |
| `--text-base` | 1rem | 16px | Texto corpo (padrão) |
| `--text-lg` | 1.125rem | 18px | Subtítulos, destaque |
| `--text-xl` | 1.25rem | 20px | Títulos de seção |
| `--text-2xl` | 1.5rem | 24px | Títulos de página (h1) |
| `--text-3xl` | 1.875rem | 30px | Títulos grandes |
| `--text-4xl` | 2.25rem | 36px | Hero titles |
| `--text-5xl` | 3rem | 48px | Display titles |

### Line Heights

| Token | Value | Uso Recomendado |
|-------|-------|-----------------|
| `--leading-none` | 1 | Títulos, números grandes |
| `--leading-tight` | 1.25 | Títulos de cards |
| `--leading-snug` | 1.375 | Subtítulos |
| `--leading-normal` | 1.5 | Texto corpo (padrão) |
| `--leading-relaxed` | 1.625 | Texto longo, artigos |
| `--leading-loose` | 2 | Poesia, espaçamento extra |

### Exemplos

```tsx
// Tailwind
<h1 className="text-2xl">Título da Página</h1>
<p className="text-base leading-relaxed">Parágrafo de texto.</p>
<span className="text-sm text-muted-foreground">Legenda</span>

// CSS
.hero-title {
  font-size: var(--text-5xl);
  line-height: var(--leading-tight);
}

// Inline style
<h2 style={{ fontSize: 'var(--text-xl)', lineHeight: 'var(--leading-snug)' }}>
  Subtítulo
</h2>
```

---

## 📏 Spacing (4pt Grid)

### Scale

| Token | Size | Pixels | Uso Comum |
|-------|------|--------|-----------|
| `--spacing-0` | 0 | 0px | Reset |
| `--spacing-1` | 0.25rem | 4px | Espaçamento mínimo |
| `--spacing-2` | 0.5rem | 8px | Padding interno pequeno |
| `--spacing-3` | 0.75rem | 12px | Gap entre elementos |
| `--spacing-4` | 1rem | 16px | Padding padrão |
| `--spacing-5` | 1.25rem | 20px | Espaçamento médio |
| `--spacing-6` | 1.5rem | 24px | Margin entre seções |
| `--spacing-8` | 2rem | 32px | Espaçamento grande |
| `--spacing-10` | 2.5rem | 40px | Separação de blocos |
| `--spacing-12` | 3rem | 48px | Margin entre seções |
| `--spacing-16` | 4rem | 64px | Espaçamento XL |
| `--spacing-20` | 5rem | 80px | Separação major |
| `--spacing-24` | 6rem | 96px | Hero spacing |

### Exemplos

```tsx
// Tailwind (usa os tokens automaticamente)
<div className="p-4">           {/* padding: 16px */}
<div className="mt-8">          {/* margin-top: 32px */}
<div className="gap-6">         {/* gap: 24px */}
<div className="space-y-4">    {/* vertical spacing: 16px */}

// CSS
.card {
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

// Inline
<div style={{ padding: 'var(--spacing-4)', marginTop: 'var(--spacing-8)' }}>
```

### Quando Usar Cada Tamanho

| Spacing | Quando Usar |
|---------|-------------|
| `1-2` | Dentro de botões, badges, gaps mínimos |
| `3-4` | Cards, inputs, elementos de formulário |
| `5-6` | Seções de conteúdo, grupos de elementos |
| `8-10` | Entre componentes diferentes |
| `12-16` | Entre seções de página |
| `20-24` | Hero sections, grandes espaçamentos |

---

## 🌑 Shadows

### Light Mode

| Token | Uso Recomendado |
|-------|-----------------|
| `--shadow-xs` | Borders sutis, separadores |
| `--shadow-sm` | Cards em repouso, inputs |
| `--shadow-md` | Cards hover, dropdowns |
| `--shadow-lg` | Modals, sidebars, navigation |
| `--shadow-xl` | Overlays importantes |
| `--shadow-2xl` | Hero images, featured content |

### Dark Mode

Automaticamente mais suave (opacity 0.3 vs 0.1).

### Exemplos

```tsx
// Tailwind
<Card className="shadow-md hover:shadow-lg transition-shadow">

// CSS
.dropdown {
  box-shadow: var(--shadow-lg);
}

// Com transição
.card {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-base) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

### Hierarquia de Elevação

```
Hero/Featured    →  shadow-2xl  (highest)
Modals/Dialogs   →  shadow-xl
Dropdowns/Menus  →  shadow-lg
Hover States     →  shadow-md
Cards/Inputs     →  shadow-sm
Subtle Borders   →  shadow-xs   (lowest)
```

---

## ⚡ Animations

### Easing Functions

| Token | Bezier | Quando Usar |
|-------|--------|-------------|
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | Saída de tela, fade out |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Entrada em tela, hover (recomendado) |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Mudanças suaves, transições |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bounce effects, playful |

### Durations

| Token | Time | Quando Usar |
|-------|------|-------------|
| `--duration-fast` | 150ms | Hover states, pequenas mudanças |
| `--duration-base` | 200ms | Transições padrão (recomendado) |
| `--duration-slow` | 300ms | Transições complexas, modals |
| `--duration-slower` | 500ms | Grandes mudanças, page transitions |

### Exemplos

```css
/* Hover suave (recomendado) */
.button {
  transition: all var(--duration-base) var(--ease-out);
}

/* Modal entrance */
.modal {
  animation: slideIn var(--duration-slow) var(--ease-out);
}

/* Playful bounce */
.notification {
  animation: bounce var(--duration-slow) var(--ease-spring);
}

/* Multiple properties */
.card {
  transition: 
    transform var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out),
    opacity var(--duration-fast) var(--ease-in-out);
}
```

### Combinações Recomendadas

| Efeito | Duration + Easing |
|--------|-------------------|
| Hover | `--duration-base` + `--ease-out` |
| Modal | `--duration-slow` + `--ease-out` |
| Fade | `--duration-fast` + `--ease-in-out` |
| Bounce | `--duration-slow` + `--ease-spring` |
| Transform | `--duration-base` + `--ease-out` |

---

## 📊 Z-Index

### Scale

| Token | Value | Uso |
|-------|-------|-----|
| `--z-dropdown` | 1000 | Dropdowns, select menus |
| `--z-sticky` | 1020 | Sticky headers |
| `--z-fixed` | 1030 | Fixed elements |
| `--z-modal-backdrop` | 1040 | Modal backdrops |
| `--z-modal` | 1050 | Modals, dialogs |
| `--z-popover` | 1060 | Popovers |
| `--z-tooltip` | 1070 | Tooltips |
| `--z-notification` | 1080 | Toast notifications (highest) |

### Exemplos

```tsx
// Tailwind
<div className="z-[var(--z-modal)]">Modal</div>

// CSS
.modal {
  z-index: var(--z-modal);
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}

// Inline
<div style={{ zIndex: 'var(--z-tooltip)' }}>Tooltip</div>
```

### Hierarquia Visual

```
Notifications (1080)  ←  Sempre visível
   ↓
Tooltips (1070)       ←  Informações contextuais
   ↓
Popovers (1060)       ←  Menus de contexto
   ↓
Modals (1050)         ←  Diálogos importantes
   ↓
Modal Backdrop (1040) ←  Overlay de modals
   ↓
Fixed (1030)          ←  Headers fixos
   ↓
Sticky (1020)         ←  Elementos sticky
   ↓
Dropdowns (1000)      ←  Menus dropdown
```

---

## 📦 Container Widths

### Breakpoints

| Token | Width | Uso |
|-------|-------|-----|
| `--container-xs` | 475px | Mobile landscape |
| `--container-sm` | 640px | Tablet portrait |
| `--container-md` | 768px | Tablet landscape |
| `--container-lg` | 1024px | Desktop pequeno |
| `--container-xl` | 1280px | Desktop (padrão) ✅ |
| `--container-2xl` | 1536px | Desktop grande |

### Uso no App.tsx

```tsx
<main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  {/* max-w-7xl = 1280px = --container-xl */}
</main>
```

### Responsive Design

```tsx
// Diferentes max-widths por breakpoint
<div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
  Content
</div>

// Container centralizado
<div className="container mx-auto max-w-7xl">
  Content
</div>
```

---

## 🎨 Color System

### Semantic Colors

| Color | Light | Dark | Uso |
|-------|-------|------|-----|
| `primary` | #16a34a | #22c55e | Ações principais |
| `secondary` | #64748b | #3f3f46 | Ações secundárias |
| `accent` | #f97316 | #f97316 | CTAs, destaque |
| `destructive` | #ef4444 | #ef4444 | Ações perigosas |
| `success` | #16a34a | #22c55e | Sucesso, confirmação |
| `warning` | #f59e0b | #f59e0b | Avisos |
| `info` | #3b82f6 | #3b82f6 | Informações |

### Status Colors

| Status | Light | Dark |
|--------|-------|------|
| `available` | #16a34a | #22c55e |
| `occupied` | #94a3b8 | #52525b |
| `blocked` | #ef4444 | #ef4444 |
| `pending` | #f59e0b | #f59e0b |
| `paid` | #16a34a | #22c55e |
| `canceled` | #64748b | #52525b |

### Chart Colors (WCAG AA)

| Chart | Light | Dark |
|-------|-------|------|
| `chart-1` | #16a34a | #22c55e |
| `chart-2` | #f97316 | #f97316 |
| `chart-3` | #2563eb ✅ | #60a5fa ✅ |
| `chart-4` | #7c3aed ✅ | #a78bfa ✅ |
| `chart-5` | #db2777 ✅ | #f472b6 ✅ |

✅ = Melhorado para WCAG AA

---

## 🎯 Micro-interactions

### Classes Pré-definidas

```css
/* Card Interactive */
.card-interactive {
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Uso

```tsx
<Card className="card-interactive">
  {/* Card com hover effect */}
</Card>
```

### Criar Suas Próprias

```tsx
// Button com scale
<button className="transition-transform duration-200 active:scale-95">
  Click Me
</button>

// Link com underline
<a className="hover:underline decoration-2 underline-offset-4">
  Link
</a>

// Input com glow
<input className="focus:shadow-[0_0_0_3px_rgba(22,163,74,0.2)]" />
```

---

## ♿ Accessibility

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Automático!** Não precisa fazer nada, já está implementado.

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Screen Reader Only

```tsx
<span className="sr-only">Texto apenas para leitores de tela</span>
```

---

## 📱 Responsive Patterns

### Mobile First

```tsx
// Padrão mobile, depois desktop
<div className="p-4 md:p-6 lg:p-8">
  {/* padding cresce com tela */}
</div>

<div className="text-base md:text-lg lg:text-xl">
  {/* texto cresce com tela */}
</div>
```

### Touch Targets

```tsx
// Automático em mobile
<button className="touch-target">
  {/* min-height: 44px em touch devices */}
</button>

// Ou manualmente
<button className="min-h-[44px] min-w-[44px]">
  Button
</button>
```

---

## 🔥 Receitas Comuns

### Card com Hover

```tsx
<Card className="card-interactive shadow-sm hover:shadow-md">
  <CardContent className="p-6">
    Content
  </CardContent>
</Card>
```

### Button com Animação

```tsx
<Button className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
  Click Me
</Button>
```

### Input com Focus Glow

```tsx
<Input className="focus:shadow-[0_0_0_3px_rgba(22,163,74,0.2)] transition-shadow" />
```

### Modal com Backdrop

```tsx
<div className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/50">
  <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center">
    <Dialog className="shadow-2xl">
      {/* Modal content */}
    </Dialog>
  </div>
</div>
```

### Loading State

```tsx
<div className="flex items-center gap-3">
  <Spinner />
  <span className="text-sm text-muted-foreground">Carregando...</span>
</div>
```

### Empty State

```tsx
<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
  <Icon className="h-16 w-16 text-muted-foreground" />
  <h3 className="text-xl font-medium">Nenhum item encontrado</h3>
  <p className="text-sm text-muted-foreground">
    Tente ajustar seus filtros
  </p>
  <Button>Limpar Filtros</Button>
</div>
```

---

## 🎓 Best Practices

### ✅ DO

```tsx
// Use os tokens
<div style={{ padding: 'var(--spacing-4)' }}>

// Use Tailwind quando possível
<div className="p-4 mt-8 shadow-md">

// Use transition para smooth effects
<button className="transition-all duration-200">
```

### ❌ DON'T

```tsx
// Não use valores hardcoded
<div style={{ padding: '16px' }}>

// Não use z-index aleatórios
<div style={{ zIndex: 9999 }}>

// Não use animações sem fallback
<div className="animate-bounce">
  {/* Sem prefers-reduced-motion */}
</div>
```

---

## 📚 Referências Rápidas

### Spacing Shorthand

```
p-4   → padding: 16px (all sides)
px-4  → padding-left/right: 16px
py-4  → padding-top/bottom: 16px
pt-4  → padding-top: 16px
mt-8  → margin-top: 32px
gap-6 → gap: 24px
```

### Shadow Shorthand

```
shadow-sm   → subtle
shadow-md   → default
shadow-lg   → prominent
shadow-xl   → very prominent
shadow-2xl  → hero/featured
```

### Text Size Shorthand

```
text-xs   → 12px
text-sm   → 14px
text-base → 16px (default)
text-lg   → 18px
text-xl   → 20px
text-2xl  → 24px
```

---

## 🔗 Links Úteis

- [globals.css](/styles/globals.css) - Todos os tokens
- [App.tsx](/App.tsx) - Uso prático
- [PHASE_1_FOUNDATION_COMPLETE.md](/docs/PHASE_1_FOUNDATION_COMPLETE.md) - Documentação completa

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0.0
**Tokens totais:** 55+
