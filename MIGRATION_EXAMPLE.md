# Exemplo de Migração - AuthContext

## ❌ Código Atual (Acoplado)

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lógica de persistência misturada
    const storedUser = localStorage.getItem("arena_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.createdAt) {
        parsed.createdAt = new Date(parsed.createdAt);
      }
      setUser(parsed);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: "client" | "manager") => {
    setIsLoading(true);
    
    // Lógica de login misturada com localStorage
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedUserKey = `arena_user_${email}`;
    const storedUser = localStorage.getItem(storedUserKey);
    
    let userData: User;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.createdAt) {
        parsed.createdAt = new Date(parsed.createdAt);
      }
      userData = parsed;
    } else {
      // Mock data aqui
      userData = { /* ... */ };
    }
    
    setUser(userData);
    localStorage.setItem(storedUserKey, JSON.stringify(userData));
    localStorage.setItem("arena_user", JSON.stringify(userData));
    
    setIsLoading(false);
  };

  // ... resto do código
}
```

## ✅ Código Novo (Desacoplado)

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { serviceContainer } from "../core/config/ServiceContainer";
import { AuthService } from "../core/services/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: "client" | "manager") => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authService: AuthService = serviceContainer.getAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar usuário ao montar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role?: "client" | "manager") => {
    try {
      setIsLoading(true);
      const user = await authService.login(email, password, role);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (user) {
      try {
        const updated = await authService.updateProfile(user.id, data);
        setUser(updated);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

## 🔄 Mudanças Principais

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Lógica de Login** | No Context | No AuthService |
| **Persistência** | localStorage direto | Via IStorage |
| **Testabilidade** | Difícil mockar | Fácil mockar Repository |
| **Trocar Backend** | Refatorar Context | Trocar Repository |
| **Reutilização** | Copiar código | Usar AuthService |

## 🎯 Benefícios

1. **Separação de Responsabilidades**
   - Context: apenas UI state
   - Service: lógica de negócio
   - Repository: acesso a dados

2. **Testabilidade**
   ```typescript
   // Teste do AuthService
   const mockRepository = new MockAuthRepository();
   const service = new AuthService(mockRepository);
   
   const user = await service.login('test@test.com', 'password');
   expect(user).toBeDefined();
   ```

3. **Flexibilidade**
   ```typescript
   // Trocar para Supabase
   const repository = new SupabaseAuthRepository();
   const service = new AuthService(repository);
   // Nenhuma mudança no Context!
   ```

4. **Reutilização**
   ```typescript
   // Usar AuthService em qualquer lugar
   const authService = serviceContainer.getAuthService();
   const user = await authService.getCurrentUser();
   ```

## 📋 Checklist de Migração

- [ ] Criar AuthService
- [ ] Criar IAuthRepository
- [ ] Criar LocalAuthRepository
- [ ] Atualizar AuthContext para usar AuthService
- [ ] Testar login/logout
- [ ] Testar persistência
- [ ] Remover lógica de localStorage do Context
- [ ] Documentar mudanças

