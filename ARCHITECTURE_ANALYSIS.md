# Análise de Arquitetura - Arena Dona Santa

## 📊 Arquitetura Atual

### Estrutura Existente
```
src/
├── components/          # Componentes React (UI + Features)
├── contexts/           # Context API (Auth, Theme, Notifications, SWR)
├── hooks/              # Custom hooks (useBookings, useTransactions, etc)
├── supabase/           # Integração Supabase (functions, KV store)
├── utils/              # Utilitários (supabase, clipboard, performance)
├── types/              # TypeScript interfaces
├── router/             # Roteamento (hash-based)
├── config/             # Configurações (routes)
└── styles/             # CSS global
```

### Problemas Identificados

#### 1. **Acoplamento ao Supabase**
- Dependência direta: `@jsr/supabase__supabase-js@2.49.8`
- Arquivo: `src/supabase/functions/server/kv_store.tsx` (Supabase-specific)
- Vite config referencia Supabase diretamente
- Difícil migrar para outro backend

#### 2. **Falta de Abstração de Dados**
- Lógica de dados espalhada em hooks (useBookings, useTransactions)
- Sem camada de serviço centralizada
- Mock data misturado com lógica real
- Sem padrão consistente de API calls

#### 3. **Contextos Monolíticos**
- AuthContext faz tudo: login, logout, persistência
- Sem separação de responsabilidades
- Difícil testar isoladamente

#### 4. **Falta de Padrão de Estado**
- localStorage direto em componentes
- SWR para cache, mas sem estratégia clara
- Sem normalização de dados

#### 5. **Sem Camada de Serviço**
- Lógica de negócio espalhada
- Sem repositório centralizado
- Difícil reutilizar lógica

---

## 🏗️ Nova Arquitetura Componentizada

### Princípios
1. **Independência de Backend** - Abstrair Supabase completamente
2. **Separação de Responsabilidades** - Cada camada tem um propósito
3. **Testabilidade** - Fácil mockar e testar
4. **Escalabilidade** - Fácil adicionar novos backends
5. **Type Safety** - TypeScript em toda parte

### Estrutura Proposta

```
src/
├── core/                          # Núcleo da aplicação
│   ├── services/                  # Serviços de negócio
│   │   ├── auth/
│   │   │   ├── AuthService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── bookings/
│   │   │   ├── BookingService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── courts/
│   │   ├── teams/
│   │   ├── transactions/
│   │   └── index.ts
│   │
│   ├── repositories/              # Abstração de dados
│   │   ├── IRepository.ts         # Interface base
│   │   ├── auth/
│   │   │   ├── IAuthRepository.ts
│   │   │   ├── LocalAuthRepository.ts
│   │   │   ├── SupabaseAuthRepository.ts
│   │   │   └── index.ts
│   │   ├── bookings/
│   │   ├── courts/
│   │   └── index.ts
│   │
│   ├── storage/                   # Abstração de persistência
│   │   ├── IStorage.ts
│   │   ├── LocalStorage.ts
│   │   ├── SessionStorage.ts
│   │   └── index.ts
│   │
│   ├── http/                      # Cliente HTTP abstrato
│   │   ├── IHttpClient.ts
│   │   ├── FetchHttpClient.ts
│   │   ├── SupabaseHttpClient.ts
│   │   └── index.ts
│   │
│   └── config/
│       ├── backends.ts            # Configuração de backends
│       └── index.ts
│
├── infrastructure/                # Implementações específicas
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── config.ts
│   │   └── index.ts
│   ├── api/
│   │   ├── client.ts
│   │   └── index.ts
│   └── storage/
│       └── index.ts
│
├── contexts/                      # Context API (apenas UI state)
│   ├── AuthContext.tsx            # Usa AuthService
│   ├── ThemeContext.tsx
│   ├── NotificationContext.tsx
│   └── index.ts
│
├── hooks/                         # Custom hooks (UI logic)
│   ├── useAuth.ts                 # Usa AuthContext
│   ├── useBookings.ts             # Usa BookingService
│   ├── useTransactions.ts
│   └── index.ts
│
├── components/                    # Componentes React
│   ├── ui/                        # Componentes base
│   ├── features/                  # Features complexas
│   ├── shared/                    # Componentes compartilhados
│   └── index.ts
│
├── types/                         # TypeScript types
│   ├── domain/                    # Tipos de domínio
│   ├── api/                       # Tipos de API
│   └── index.ts
│
├── utils/                         # Utilitários
├── router/                        # Roteamento
├── config/                        # Configurações
└── App.tsx
```

### Fluxo de Dados

```
Component
    ↓
Hook (useBookings)
    ↓
Service (BookingService)
    ↓
Repository (IBookingRepository)
    ↓
HttpClient (IHttpClient)
    ↓
Backend (Supabase / API / Local)
```

### Benefícios

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Trocar Backend** | Refatorar tudo | Implementar novo Repository |
| **Testar Serviço** | Mockar Supabase | Mockar Repository |
| **Reutilizar Lógica** | Copiar código | Usar Service |
| **Adicionar Cache** | Modificar Hook | Adicionar em Service |
| **Múltiplos Backends** | Impossível | Suportado nativamente |

---

## 🔄 Estratégia de Migração

### Fase 1: Preparação (1-2 dias)
- [ ] Criar estrutura de pastas
- [ ] Definir interfaces base
- [ ] Criar tipos de domínio

### Fase 2: Camada de Serviço (3-5 dias)
- [ ] Implementar AuthService
- [ ] Implementar BookingService
- [ ] Implementar CourtService
- [ ] Implementar TransactionService

### Fase 3: Repositórios (3-5 dias)
- [ ] Criar IRepository base
- [ ] Implementar LocalAuthRepository
- [ ] Implementar SupabaseAuthRepository
- [ ] Implementar para outros domínios

### Fase 4: Integração (2-3 dias)
- [ ] Atualizar Contexts
- [ ] Atualizar Hooks
- [ ] Atualizar Componentes

### Fase 5: Testes (2-3 dias)
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E

---

## 📝 Próximos Passos

1. Revisar e aprovar arquitetura
2. Iniciar Fase 1 (Preparação)
3. Criar exemplos de implementação
4. Documentar padrões de uso

