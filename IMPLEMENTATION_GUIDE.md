# Guia de Implementação - Nova Arquitetura

## 📁 Estrutura Criada

```
src/core/
├── storage/
│   ├── IStorage.ts              # Interface abstrata
│   ├── LocalStorage.ts          # Implementação localStorage
│   └── index.ts
├── http/
│   ├── IHttpClient.ts           # Interface abstrata
│   ├── FetchHttpClient.ts       # Implementação Fetch
│   └── index.ts
├── repositories/
│   ├── IRepository.ts           # Interface base CRUD
│   ├── auth/
│   │   ├── IAuthRepository.ts   # Interface específica
│   │   ├── LocalAuthRepository.ts # Implementação local
│   │   └── index.ts
│   └── index.ts
├── services/
│   ├── auth/
│   │   ├── AuthService.ts       # Serviço de autenticação
│   │   └── index.ts
│   └── index.ts
└── config/
    └── ServiceContainer.ts      # Injeção de dependências
```

## 🔄 Fluxo de Dados

```
Component
    ↓
useAuth() Hook
    ↓
AuthService (via ServiceContainer)
    ↓
IAuthRepository (LocalAuthRepository)
    ↓
IStorage (LocalStorage)
    ↓
localStorage
```

## 🚀 Como Usar

### 1. Usar o AuthService em um Hook

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { serviceContainer } from '../core/config/ServiceContainer';
import { User } from '../types';

export function useAuth() {
  const authService = serviceContainer.getAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  return {
    user,
    isLoading,
    login: (email: string, password: string) => 
      authService.login(email, password),
    logout: () => authService.logout(),
  };
}
```

### 2. Usar em um Componente

```typescript
// src/components/Login.tsx
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { login, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirecionar
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // JSX
  );
}
```

## 🔌 Trocar de Backend

### Criar novo repositório (ex: Supabase)

```typescript
// src/core/repositories/auth/SupabaseAuthRepository.ts
import { IAuthRepository, AuthSession, LoginCredentials } from './IAuthRepository';
import { createClient } from '@supabase/supabase-js';

export class SupabaseAuthRepository implements IAuthRepository {
  private supabase = createClient(url, key);

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) throw error;
    
    return {
      user: data.user as any,
      token: data.session?.access_token,
    };
  }

  // ... implementar outros métodos
}
```

### Atualizar ServiceContainer

```typescript
// src/core/config/ServiceContainer.ts
import { SupabaseAuthRepository } from '../repositories';

export class ServiceContainer {
  private constructor() {
    // Trocar para Supabase
    this.authRepository = new SupabaseAuthRepository();
    // ... resto do código
  }
}
```

## ✅ Próximos Passos

1. **Criar mais Repositories**
   - [ ] BookingRepository
   - [ ] CourtRepository
   - [ ] TeamRepository
   - [ ] TransactionRepository

2. **Criar mais Services**
   - [ ] BookingService
   - [ ] CourtService
   - [ ] TeamService
   - [ ] TransactionService

3. **Atualizar Hooks**
   - [ ] useBookings
   - [ ] useCourts
   - [ ] useTeams
   - [ ] useTransactions

4. **Atualizar Contextos**
   - [ ] AuthContext (usar AuthService)
   - [ ] Remover lógica de dados

5. **Testes**
   - [ ] Testes unitários para Services
   - [ ] Testes para Repositories
   - [ ] Testes de integração

## 📚 Padrões

### Criar novo Service

```typescript
export class MyService {
  constructor(private repository: IMyRepository) {}

  async doSomething() {
    return this.repository.doSomething();
  }
}
```

### Criar novo Repository

```typescript
export class MyRepository implements IMyRepository {
  constructor(private storage: IStorage) {}

  async getAll() {
    return this.storage.getItem('my_data') || [];
  }
}
```

### Usar em Hook

```typescript
export function useMyData() {
  const service = serviceContainer.getMyService();
  const [data, setData] = useState(null);

  useEffect(() => {
    service.getData().then(setData);
  }, []);

  return { data };
}
```

## 🎯 Benefícios

✅ **Independência de Backend** - Trocar Supabase sem refatorar componentes
✅ **Testabilidade** - Mockar repositories facilmente
✅ **Reutilização** - Services podem ser usados em qualquer lugar
✅ **Manutenibilidade** - Código organizado e bem estruturado
✅ **Escalabilidade** - Fácil adicionar novos domínios

