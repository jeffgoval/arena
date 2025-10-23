# Sistema de Responsividade Mobile - Arena

Este documento explica como usar os componentes responsivos implementados para garantir uma experiência mobile otimizada.

## 🚀 Componentes Principais

### 1. BottomNavigation
Navegação inferior para mobile que substitui o sidebar em telas pequenas.

```tsx
import { BottomNavigation } from '@/components/shared/layout/BottomNavigation';

// Uso básico
<BottomNavigation variant="dashboard" />

// Para páginas públicas
<BottomNavigation variant="public" />
```

**Características:**
- Oculto automaticamente em desktop (md:hidden)
- Posição fixa na parte inferior
- Suporte a badges de notificação
- Animações suaves
- Safe area support para iPhone

### 2. MobileModal
Modal que se adapta ao dispositivo - full screen no mobile, modal tradicional no desktop.

```tsx
import { MobileModal, useMobileModal } from '@/components/shared/layout/MobileModal';

function MyComponent() {
  const { isOpen, open, close } = useMobileModal();

  return (
    <>
      <Button onClick={open}>Abrir Modal</Button>
      
      <MobileModal
        isOpen={isOpen}
        onClose={close}
        title="Título do Modal"
        showBackButton={true}
        actions={<Button>Salvar</Button>}
      >
        <div className="p-4">
          Conteúdo do modal
        </div>
      </MobileModal>
    </>
  );
}
```

**Características:**
- Full screen no mobile
- Modal tradicional no desktop
- Header fixo com ações
- Suporte a botão voltar
- Animações específicas por dispositivo
- Previne scroll do body quando aberto

### 3. ResponsiveLayout
Layout principal que gerencia bottom navigation e espaçamento.

```tsx
import { ResponsiveLayout } from '@/components/shared/layout/ResponsiveLayout';

function MyPage() {
  return (
    <ResponsiveLayout 
      showBottomNav={true} 
      bottomNavVariant="dashboard"
    >
      <div className="p-4">
        Conteúdo da página
      </div>
    </ResponsiveLayout>
  );
}
```

### 4. ResponsiveCard
Cards que se adaptam ao tamanho da tela.

```tsx
import { ResponsiveCard, ResponsiveGrid } from '@/components/shared/layout/ResponsiveCard';

function CardExample() {
  return (
    <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
      <ResponsiveCard variant="elevated" clickable onClick={() => {}}>
        <h3>Título do Card</h3>
        <p>Conteúdo do card</p>
      </ResponsiveCard>
    </ResponsiveGrid>
  );
}
```

### 5. ResponsiveForm
Formulários otimizados para mobile.

```tsx
import { 
  ResponsiveForm, 
  ResponsiveInput, 
  ResponsiveButton,
  ResponsiveButtonGroup 
} from '@/components/shared/forms/ResponsiveForm';

function FormExample() {
  return (
    <ResponsiveForm onSubmit={handleSubmit}>
      <ResponsiveInput
        label="Nome"
        placeholder="Digite seu nome"
        required
      />
      
      <ResponsiveButtonGroup>
        <ResponsiveButton variant="outline">
          Cancelar
        </ResponsiveButton>
        <ResponsiveButton type="submit">
          Salvar
        </ResponsiveButton>
      </ResponsiveButtonGroup>
    </ResponsiveForm>
  );
}
```

## 🎨 Classes CSS Utilitárias

### Mobile-Specific Classes

```css
/* Visibilidade */
.mobile-only     /* Visível apenas no mobile */
.desktop-only    /* Visível apenas no desktop */
.tablet-up       /* Visível em tablet e desktop */

/* Espaçamento */
.mobile-padding  /* px-4 md:px-6 lg:px-8 */
.mobile-margin   /* mx-4 md:mx-6 lg:mx-8 */

/* Tipografia */
.mobile-heading    /* text-2xl md:text-3xl lg:text-4xl */
.mobile-subheading /* text-lg md:text-xl lg:text-2xl */
.mobile-body       /* text-sm md:text-base */

/* Componentes */
.mobile-card       /* Card responsivo */
.mobile-button     /* Botão otimizado para mobile */
.mobile-input      /* Input com altura adequada para mobile */

/* Safe Area */
.safe-area-pt      /* padding-top: env(safe-area-inset-top) */
.safe-area-pb      /* padding-bottom: env(safe-area-inset-bottom) */
.safe-area-p       /* Padding completo para safe area */

/* Touch */
.touch-manipulation /* Otimiza para touch */
.tap-target        /* min-h-[44px] min-w-[44px] */
```

### Breakpoints

```css
/* Mobile First */
/* Base: 0px - 767px (Mobile) */
md: /* 768px+ (Tablet) */
lg: /* 1024px+ (Desktop) */
xl: /* 1280px+ (Large Desktop) */
```

## 📱 Hooks Utilitários

### useIsMobile
Detecta se o usuário está em um dispositivo mobile.

```tsx
import { useIsMobile } from '@/components/shared/layout/ResponsiveLayout';

function MyComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? 'Versão Mobile' : 'Versão Desktop'}
    </div>
  );
}
```

### useBottomNavigation
Fornece classes e estados para trabalhar com bottom navigation.

```tsx
import { useBottomNavigation } from '@/components/shared/layout/BottomNavigation';

function MyComponent() {
  const { paddingClass } = useBottomNavigation();
  
  return (
    <div className={paddingClass}>
      Conteúdo com espaço para bottom nav
    </div>
  );
}
```

### useSafeArea
Obtém informações sobre safe area do dispositivo.

```tsx
import { useSafeArea } from '@/components/shared/layout/ResponsiveLayout';

function MyComponent() {
  const safeArea = useSafeArea();
  
  return (
    <div style={{ paddingTop: safeArea.top }}>
      Conteúdo respeitando safe area
    </div>
  );
}
```

## 🔧 Configuração no Layout

### Dashboard Layout
O layout do dashboard já foi atualizado para usar os componentes responsivos:

```tsx
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <ResponsiveLayout showBottomNav={true} bottomNavVariant="dashboard">
      {/* Sidebar oculto no mobile */}
      <aside className="hidden md:flex">
        {/* Navegação desktop */}
      </aside>
      
      {/* Conteúdo principal */}
      <main>
        {children}
      </main>
    </ResponsiveLayout>
  );
}
```

### Páginas Individuais
Use os componentes responsivos nas suas páginas:

```tsx
// Exemplo de página
export default function MinhasPagina() {
  return (
    <div className="mobile-padding py-6">
      <h1 className="mobile-heading mb-6">Título da Página</h1>
      
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <ResponsiveCard>
          <h3 className="mobile-subheading">Card 1</h3>
          <p className="mobile-body">Conteúdo do card</p>
        </ResponsiveCard>
      </ResponsiveGrid>
    </div>
  );
}
```

## 📋 Checklist de Implementação

### Para cada página:
- [ ] Usar `mobile-padding` para espaçamento horizontal
- [ ] Usar classes de tipografia responsiva (`mobile-heading`, etc.)
- [ ] Implementar `ResponsiveCard` para cards
- [ ] Usar `ResponsiveForm` para formulários
- [ ] Testar em diferentes tamanhos de tela
- [ ] Verificar touch targets (mínimo 44px)
- [ ] Testar navegação com bottom nav

### Para modais:
- [ ] Usar `MobileModal` ao invés de modal padrão
- [ ] Configurar `fullScreen={true}` para mobile
- [ ] Adicionar botão voltar quando necessário
- [ ] Testar animações em mobile e desktop

### Para formulários:
- [ ] Usar `ResponsiveForm` e componentes relacionados
- [ ] Configurar `font-size: 16px` para prevenir zoom no iOS
- [ ] Usar `mobile-input` para altura adequada
- [ ] Implementar `ResponsiveButtonGroup` para ações

## 🎯 Melhores Práticas

1. **Mobile First**: Sempre desenvolva pensando primeiro no mobile
2. **Touch Targets**: Mínimo 44px para elementos clicáveis
3. **Safe Area**: Use classes safe-area para dispositivos com notch
4. **Performance**: Use `touch-manipulation` para melhor responsividade
5. **Acessibilidade**: Mantenha contraste e tamanhos adequados
6. **Testes**: Teste em dispositivos reais sempre que possível

## 🔍 Debugging

Para debugar problemas de responsividade:

```tsx
// Componente de debug
function DebugBreakpoint() {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">
      {isMobile ? 'Mobile' : 'Desktop'}
      <div className="text-xs">
        <div className="block sm:hidden">XS</div>
        <div className="hidden sm:block md:hidden">SM</div>
        <div className="hidden md:block lg:hidden">MD</div>
        <div className="hidden lg:block xl:hidden">LG</div>
        <div className="hidden xl:block">XL</div>
      </div>
    </div>
  );
}
```

Use este componente durante o desenvolvimento para ver qual breakpoint está ativo.