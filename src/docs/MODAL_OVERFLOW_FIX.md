# 🔧 Fix: Barra de Rolagem Horizontal no Modal

> **Correção do overflow horizontal no modal "Nova Quadra"**

**Data:** 14 de Outubro de 2025  
**Issue:** Barra de rolagem horizontal aparecia no modal de Nova Quadra  
**Status:** ✅ Corrigido

---

## 🐛 Problema Identificado

O modal "Nova Quadra" (`CourtFormModal`) exibia uma barra de rolagem horizontal indesejada, especialmente em telas menores (mobile/tablet).

### Causas:
1. **DialogContent muito largo:** `max-w-3xl` sem limite de viewport width
2. **Elementos inflexíveis:** Horários dispostos em linha única sem responsividade
3. **Textos longos:** Botões e labels sem quebra de linha
4. **Sem overflow-x control:** Faltava `overflow-x-hidden`

---

## ✅ Correções Aplicadas

### 1. DialogContent - Largura Responsiva

**Arquivo:** `/components/manager/CourtFormModal.tsx`

**Antes:**
```tsx
<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
```

**Depois:**
```tsx
<DialogContent className="max-w-3xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
```

**O que mudou:**
- ✅ `w-[calc(100vw-2rem)]` - Largura máxima da viewport menos margem
- ✅ `overflow-x-hidden` - Previne scroll horizontal
- ✅ Mantém `overflow-y-auto` - Permite scroll vertical quando necessário

### 2. Form - Overflow Control

**Arquivo:** `/components/manager/CourtFormModal.tsx`

**Antes:**
```tsx
<form onSubmit={handleSubmit}>
```

**Depois:**
```tsx
<form onSubmit={handleSubmit} className="overflow-hidden">
```

**O que mudou:**
- ✅ `overflow-hidden` - Previne qualquer overflow interno

### 3. CourtScheduleConfig - Layout Responsivo

**Arquivo:** `/components/manager/CourtScheduleConfig.tsx`

#### Configuração de Horários por Dia

**Antes:**
```tsx
<div className="flex items-center gap-4">
  <div className="flex items-center gap-2 w-[160px]">
    {/* Switch e Label */}
  </div>
  
  {workingHours[key].enabled ? (
    <>
      <div className="flex items-center gap-2">
        <Label>Abertura:</Label>
        <Input className="w-[120px]" />
      </div>
      <div className="flex items-center gap-2">
        <Label>Fechamento:</Label>
        <Input className="w-[120px]" />
      </div>
      <Button>Copiar para todos</Button>
    </>
  ) : (
    <span>Fechado</span>
  )}
</div>
```

**Depois:**
```tsx
<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
  <div className="flex items-center gap-2 w-full sm:w-[160px] flex-shrink-0">
    {/* Switch e Label */}
  </div>
  
  {workingHours[key].enabled ? (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:flex-1">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Label className="whitespace-nowrap">Abertura:</Label>
        <Input className="w-[120px] flex-shrink-0" />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Label className="whitespace-nowrap">Fechamento:</Label>
        <Input className="w-[120px] flex-shrink-0" />
      </div>
      <Button className="whitespace-nowrap self-start sm:self-center">
        <span className="hidden lg:inline">Copiar para todos</span>
        <span className="lg:hidden">Copiar</span>
      </Button>
    </div>
  ) : (
    <span>Fechado</span>
  )}
</div>
```

**O que mudou:**
- ✅ `flex-col sm:flex-row` - Empilha em mobile, linha em desktop
- ✅ `whitespace-nowrap` - Previne quebra de texto indesejada
- ✅ `flex-shrink-0` - Previne compressão de inputs
- ✅ `w-full sm:w-[160px]` - Largura responsiva
- ✅ Texto do botão adaptativo (mobile vs desktop)
- ✅ Gaps reduzidos em mobile (`gap-3 sm:gap-4`)

---

## 📱 Comportamento Responsivo

### Mobile (< 640px)
```
┌──────────────────────────┐
│ Switch  Segunda-feira    │
├──────────────────────────┤
│ Abertura: [06:00]        │
├──────────────────────────┤
│ Fechamento: [23:00]      │
├──────────────────────────┤
│ [Copiar] button          │
└──────────────────────────┘
```

### Tablet/Desktop (≥ 640px)
```
┌────────────────────────────────────────────────────────────┐
│ Switch Segunda  | Abertura: [06:00] | Fechamento: [23:00] | [Copiar para todos] │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Classes Tailwind Utilizadas

### Responsive Utilities
- `flex-col sm:flex-row` - Direction responsivo
- `w-full sm:w-[160px]` - Width responsivo
- `gap-3 sm:gap-4` - Gap responsivo
- `hidden lg:inline` - Visibilidade condicional
- `self-start sm:self-center` - Alinhamento responsivo

### Layout Control
- `overflow-x-hidden` - Esconde overflow horizontal
- `overflow-y-auto` - Permite scroll vertical
- `overflow-hidden` - Esconde todo overflow
- `flex-shrink-0` - Previne compressão
- `whitespace-nowrap` - Previne quebra de linha

### Sizing
- `w-[calc(100vw-2rem)]` - Largura viewport com margem
- `w-[120px]` - Largura fixa para inputs time
- `max-w-3xl` - Largura máxima do modal

---

## 🧪 Como Testar

### Desktop (> 1024px)
1. Abrir modal "Nova Quadra"
2. Navegar pelas 3 tabs
3. ✅ Sem scroll horizontal
4. ✅ Layout em linha na tab Horários

### Tablet (640px - 1024px)
1. Reduzir janela para ~768px
2. Abrir modal "Nova Quadra"
3. Tab "Horários"
4. ✅ Sem scroll horizontal
5. ✅ Layout em linha (compacto)
6. ✅ Botão mostra "Copiar" apenas

### Mobile (< 640px)
1. Reduzir janela para ~375px
2. Abrir modal "Nova Quadra"
3. Tab "Horários"
4. ✅ Sem scroll horizontal
5. ✅ Layout empilhado (vertical)
6. ✅ Elementos não excedem viewport
7. ✅ Modal tem margem de 1rem (16px)

---

## 📊 Checklist de Verificação

### DialogContent
- [x] Largura máxima respeitando viewport
- [x] Overflow-x hidden
- [x] Overflow-y auto (scroll vertical funcional)
- [x] Margem adequada em mobile

### Form
- [x] Overflow controlado
- [x] Conteúdo não excede limites

### Tab Horários
- [x] Layout responsivo (empilha em mobile)
- [x] Inputs não comprimem
- [x] Labels não quebram
- [x] Botão adaptativo
- [x] Gaps adequados

### Todos os Breakpoints
- [x] 320px (mobile pequeno)
- [x] 375px (mobile médio)
- [x] 640px (tablet)
- [x] 768px (tablet grande)
- [x] 1024px (desktop)
- [x] 1280px (desktop grande)

---

## 🎯 Resultado

✅ Sem barra de rolagem horizontal em nenhum breakpoint  
✅ Layout responsivo e adaptativo  
✅ Melhor UX em mobile  
✅ Textos não quebram onde não devem  
✅ Inputs mantêm tamanho adequado  

---

## 📝 Lições Aprendidas

### Ao criar modais:
1. Sempre usar `w-[calc(100vw-Xrem)]` para largura responsiva
2. Adicionar `overflow-x-hidden` ao DialogContent
3. Usar `flex-col sm:flex-row` para layouts adaptativos
4. Adicionar `flex-shrink-0` em inputs de tamanho fixo
5. Usar `whitespace-nowrap` em labels que não devem quebrar
6. Testar em múltiplos breakpoints
7. Considerar texto adaptativo em botões (mobile vs desktop)

### Classes importantes:
- `overflow-x-hidden` - Previne scroll horizontal
- `w-[calc(100vw-2rem)]` - Largura viewport com margem
- `flex-shrink-0` - Previne compressão
- `whitespace-nowrap` - Mantém texto em linha única
- Responsive prefixes (`sm:`, `lg:`) - Adapta layout

---

**Versão:** 2.1.3  
**Data:** 14 de Outubro de 2025  
**Status:** ✅ Corrigido e Testado

**[← Voltar para Documentação](./README.md)**
