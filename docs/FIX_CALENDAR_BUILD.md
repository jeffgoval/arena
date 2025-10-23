# Fix: Erro de Build do Calendar

## Problema

Erro durante o build:

```
Type error: Object literal may only specify known properties, and 'IconLeft' does not exist in type 'Partial<CustomComponents>'.
```

## Causa

O componente `Calendar` estava usando a API antiga do `react-day-picker` (v8), mas o projeto usa a versão 9.4.3 que tem uma API diferente.

## Solução Aplicada

O arquivo `src/components/ui/calendar.tsx` foi atualizado para usar a nova API:

### Antes (API v8 - INCORRETA):
```tsx
components={{
  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
}}
```

### Depois (API v9 - CORRETA):
```tsx
components={{
  Chevron: ({ orientation }) => {
    const Icon = orientation === "left" ? ChevronLeft : ChevronRight
    return <Icon className="h-4 w-4" />
  },
}}
```

## Verificação

O arquivo já está correto. Para garantir que o build funcione:

1. **Limpar cache local** (se estiver testando localmente):
   ```bash
   Remove-Item -Recurse -Force .next
   Remove-Item -Force tsconfig.tsbuildinfo
   npm run build
   ```

2. **No ambiente de deploy**:
   - Faça um novo commit e push
   - O build deve funcionar automaticamente
   - Se ainda falhar, tente fazer retry do deployment

## Status

✅ **RESOLVIDO** - O componente Calendar está usando a API correta do react-day-picker v9.
