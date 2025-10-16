# Diagramas da Arquitetura

## 📊 Fluxo de Dados Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENTES REACT                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    Login     │  │  Dashboard   │  │   Booking    │  ...      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOM HOOKS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  useAuth()   │  │useBookings() │  useTransactions()  ...     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                      CONTEXT API                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ AuthContext  │  │ThemeContext  │  │NotifContext  │  ...      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘           │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICES                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ AuthService  │  │BookingService│  │CourtService  │  ...      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                    REPOSITORIES                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ IAuthRepository  IBookingRepository  ICourtRepository    │   │
│  │        ↓                  ↓                  ↓           │   │
│  │ LocalAuthRepo    LocalBookingRepo    LocalCourtRepo      │   │
│  │ SupabaseAuthRepo SupabaseBookingRepo SupabaseCourtRepo   │   │
│  │ ApiAuthRepo      ApiBookingRepo      ApiCourtRepo        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────┬──────────────────┬──────────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              STORAGE & HTTP CLIENTS                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ IStorage (LocalStorage, SessionStorage, IndexedDB)       │   │
│  │ IHttpClient (Fetch, Axios, Supabase)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────┬──────────────────┬──────────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ localStorage │  │  Supabase    │  │  REST API    │  ...      │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Login

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Login"                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Componente Login chama hook useAuth()                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Hook useAuth() chama AuthContext.login()                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. AuthContext chama AuthService.login()                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. AuthService chama IAuthRepository.login()                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. LocalAuthRepository acessa IStorage (localStorage)           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. localStorage retorna dados do usuário                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Dados retornam pela cadeia até o Componente                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. Componente atualiza UI com dados do usuário                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔌 Trocar de Backend

```
ANTES (Acoplado):
┌──────────────────────────────────────────────────────────┐
│ Componente → Hook → Context → localStorage/Supabase      │
│ Refatorar tudo para trocar backend!                      │
└──────────────────────────────────────────────────────────┘

DEPOIS (Desacoplado):
┌──────────────────────────────────────────────────────────┐
│ Componente → Hook → Context → Service → Repository       │
│                                           ↓              │
│                                    LocalAuthRepository   │
│                                    SupabaseAuthRepository│
│                                    ApiAuthRepository     │
│ Trocar apenas o Repository!                              │
└──────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Pastas

```
src/
├── core/                          ← Núcleo (agnóstico)
│   ├── storage/
│   │   ├── IStorage.ts
│   │   ├── LocalStorage.ts
│   │   └── index.ts
│   ├── http/
│   │   ├── IHttpClient.ts
│   │   ├── FetchHttpClient.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── IRepository.ts
│   │   ├── auth/
│   │   │   ├── IAuthRepository.ts
│   │   │   ├── LocalAuthRepository.ts
│   │   │   └── index.ts
│   │   ├── bookings/
│   │   ├── courts/
│   │   ├── teams/
│   │   ├── transactions/
│   │   └── index.ts
│   ├── services/
│   │   ├── auth/
│   │   │   ├── AuthService.ts
│   │   │   └── index.ts
│   │   ├── bookings/
│   │   ├── courts/
│   │   ├── teams/
│   │   ├── transactions/
│   │   └── index.ts
│   └── config/
│       └── ServiceContainer.ts
│
├── infrastructure/                ← Implementações específicas
│   ├── supabase/
│   ├── api/
│   └── storage/
│
├── contexts/                      ← Context API (UI state)
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── NotificationContext.tsx
│   └── index.ts
│
├── hooks/                         ← Custom hooks (UI logic)
│   ├── useAuth.ts
│   ├── useBookings.ts
│   ├── useTransactions.ts
│   └── index.ts
│
├── components/                    ← Componentes React
│   ├── ui/
│   ├── features/
│   ├── shared/
│   └── index.ts
│
├── types/                         ← TypeScript types
├── router/                        ← Roteamento
├── config/                        ← Configurações
└── App.tsx
```

## 🎯 Padrão de Implementação

```
1. Definir Interface
   ↓
2. Implementar Repositório Local
   ↓
3. Criar Service
   ↓
4. Registrar no ServiceContainer
   ↓
5. Criar Hook
   ↓
6. Usar em Componente
```

## 🔄 Ciclo de Vida de um Repositório

```
Interface (IBookingRepository)
    ↓
LocalBookingRepository (localStorage)
    ↓
SupabaseBookingRepository (Supabase)
    ↓
ApiBookingRepository (REST API)
    ↓
FirebaseBookingRepository (Firebase)
```

## 📊 Comparação: Antes vs Depois

```
ANTES (Monolítico):
┌─────────────────────────────────────────┐
│ Componente                              │
│ ├─ localStorage direto                  │
│ ├─ Supabase direto                      │
│ ├─ Lógica de negócio                    │
│ ├─ Lógica de UI                         │
│ └─ Tudo misturado!                      │
└─────────────────────────────────────────┘

DEPOIS (Componentizado):
┌─────────────────────────────────────────┐
│ Componente (apenas UI)                  │
├─────────────────────────────────────────┤
│ Hook (lógica de UI)                     │
├─────────────────────────────────────────┤
│ Service (lógica de negócio)             │
├─────────────────────────────────────────┤
│ Repository (acesso a dados)             │
├─────────────────────────────────────────┤
│ Storage/HTTP (implementação)            │
├─────────────────────────────────────────┤
│ Backend (dados reais)                   │
└─────────────────────────────────────────┘
```

## 🎓 Dependências

```
Componente
    ↓ (depende de)
Hook
    ↓ (depende de)
Context
    ↓ (depende de)
Service
    ↓ (depende de)
Repository (interface)
    ↓ (implementa)
LocalRepository / SupabaseRepository / ApiRepository
    ↓ (usa)
Storage / HttpClient
    ↓ (acessa)
Backend
```

---

**Nota:** Estes diagramas são representações visuais da arquitetura. Para mais detalhes, consulte a documentação específica.

