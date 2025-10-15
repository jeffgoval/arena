# 🔧 Build Error Fix - Mock Data Exports

> **Correção de erros de build relacionados aos exports do mockData.ts**

**Data:** 14 de Outubro de 2025  
**Status:** ✅ Corrigido

---

## 🐛 Erros Identificados

```
ERROR: No matching export in "virtual-fs:file:///data/mockData.ts" for import "mockCourts"
ERROR: No matching export in "virtual-fs:file:///data/mockData.ts" for import "mockCourtPrices"
```

### Arquivos Afetados:
- `/components/manager/CourtManagement.tsx`
- `/components/manager/CourtScheduleConfig.tsx`

---

## 🔍 Causa do Problema

Os componentes de Gestão de Quadras foram criados com imports para `mockCourts` e `mockCourtPrices`, mas esses exports não existiam no arquivo `/data/mockData.ts`.

### Imports esperados:
```typescript
import { mockCourts, type Court, type CourtType, type CourtStatus } from "../../data/mockData";
import { mockCourtPrices, type CourtPrice } from "../../data/mockData";
```

### Problema:
O arquivo `mockData.ts` tinha apenas os dados de `mockPlans`, mas não tinha os dados de quadras e preços.

---

## ✅ Solução Implementada

### Arquivo: `/data/mockData.ts`

Adicionei no início do arquivo (antes de `Plan`):

#### 1. Interfaces e Types
```typescript
export type CourtType = "society" | "poliesportiva" | "beach-tennis" | "volei" | "futsal";
export type CourtStatus = "active" | "inactive" | "maintenance";

export interface Court {
  id: number;
  name: string;
  type: CourtType;
  status: CourtStatus;
  image?: string;
  description?: string;
  capacity: number;
  features: {
    covered: boolean;
    lighting: boolean;
    lockerRoom: boolean;
    parking: boolean;
  };
  workingHours: {
    [key: string]: {
      enabled: boolean;
      open: string;
      close: string;
    };
  };
  occupancy?: number;
}

export interface CourtPrice {
  courtId: number;
  timeSlot: string;
  casual: number;
  monthly: number;
  isPeak?: boolean;
}
```

#### 2. Mock Data Arrays

**mockCourts (4 quadras):**
- Quadra 1 - Society (ativa, 85% ocupação)
- Quadra 2 - Poliesportiva (ativa, 72% ocupação)
- Quadra 3 - Beach Tennis (ativa, 68% ocupação)
- Quadra 4 - Society (manutenção, 0% ocupação)

Cada quadra tem:
- Dados básicos (nome, tipo, status, descrição, capacidade)
- Features (cobertura, iluminação, vestiário, estacionamento)
- Horários de funcionamento por dia da semana
- Taxa de ocupação

**mockCourtPrices (30+ entradas):**
- Preços por horário para cada quadra
- Diferenciação: preço avulso vs mensalista
- Flag `isPeak` para horários nobres (18h-21h)
- Valores variados por horário do dia

---

## 📊 Estrutura do mockData.ts Atualizado

```
/data/mockData.ts
├── Court Interfaces & Types ✅ NOVO
│   ├── CourtType
│   ├── CourtStatus
│   ├── Court
│   └── CourtPrice
│
├── Court Mock Data ✅ NOVO
│   ├── mockCourts (4 quadras)
│   └── mockCourtPrices (30+ preços)
│
└── Plan Data (já existente)
    ├── Plan interface
    ├── mockPlans
    ├── mockInviteData
    ├── mockGameDetails
    └── mockParticipants
```

---

## ✅ Verificação

### Exports agora disponíveis:
- ✅ `export type CourtType`
- ✅ `export type CourtStatus`
- ✅ `export interface Court`
- ✅ `export interface CourtPrice`
- ✅ `export const mockCourts: Court[]`
- ✅ `export const mockCourtPrices: CourtPrice[]`

### Imports funcionando:
- ✅ `CourtManagement.tsx` importa mockCourts
- ✅ `CourtScheduleConfig.tsx` importa mockCourtPrices
- ✅ TypeScript types exportados
- ✅ Build passa sem erros

---

## 🧪 Como Testar

1. **Verificar build:**
   ```bash
   # Build deve passar sem erros
   npm run build
   ```

2. **Testar funcionamento:**
   - Login como gestor
   - Dashboard → Tab "Quadras"
   - Verificar que as 4 quadras são exibidas
   - Clicar em "Adicionar Quadra"
   - Verificar formulário
   - Tab "Horários" deve mostrar tabela de preços

3. **Verificar dados:**
   - Cards mostram informações corretas
   - Estatísticas calculadas (total, ativas, ocupação)
   - Filtros funcionam
   - Tabela de preços na config de horários

---

## 📝 Mock Data Criado

### Quadras (4 unidades):

| ID | Nome | Tipo | Status | Capacidade | Ocupação |
|----|------|------|--------|------------|----------|
| 1 | Quadra 1 - Society | society | active | 10 | 85% |
| 2 | Quadra 2 - Poliesportiva | poliesportiva | active | 12 | 72% |
| 3 | Quadra 3 - Beach Tennis | beach-tennis | active | 4 | 68% |
| 4 | Quadra 4 - Society | society | maintenance | 10 | 0% |

### Preços (30+ slots):

**Quadra 1 (Society):**
- 06:00 - R$ 80 (avulso) / R$ 60 (mensal)
- 18:00-21:00 - R$ 150 (avulso) / R$ 120 (mensal) ⭐ Horário Nobre

**Quadra 2 (Poliesportiva):**
- 06:00 - R$ 70 (avulso) / R$ 50 (mensal)
- 18:00-20:00 - R$ 130 (avulso) / R$ 100 (mensal) ⭐ Horário Nobre

**Quadra 3 (Beach Tennis):**
- 06:00 - R$ 60 (avulso) / R$ 45 (mensal)
- 18:00-20:00 - R$ 110 (avulso) / R$ 85 (mensal) ⭐ Horário Nobre

---

## 🎯 Resultado

✅ Build passa sem erros  
✅ Todos os imports funcionando  
✅ Mock data completo e consistente  
✅ Tipos TypeScript exportados corretamente  
✅ Componentes renderizam sem erros  

**Status:** 100% Funcional! 🎉

---

## 📚 Arquivos Modificados

1. `/data/mockData.ts` - Adicionado courts e prices mock data
2. Nenhum outro arquivo precisou ser modificado

**Total:** 1 arquivo modificado  
**Linhas adicionadas:** ~200  
**Erros corrigidos:** 2

---

**Versão:** 2.1.2  
**Data:** 14 de Outubro de 2025  
**Status:** ✅ Build Passando

**[← Voltar para Documentação](./README.md)**
