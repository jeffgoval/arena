/**
 * Supabase Authentication Context
 * Gerencia autenticação com Supabase Auth
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { SupabaseAuthService } from "../core/auth/SupabaseAuthService";
import { ServiceContainer } from "../core/config/ServiceContainer";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, role?: "client" | "manager") => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar serviço de autenticação
  const authService = new SupabaseAuthService(
    ServiceContainer.getInstance().getHttpClient()
  );

  // Recuperar sessão ao montar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getSession();
        if (response.user) {
          setUser(response.user);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "client" | "manager" = "client"
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signUp(email, password, {
        name,
        role,
        email,
      });

      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }

      if (response.user) {
        setUser(response.user);
        // Salvar token
        if (response.session?.access_token) {
          localStorage.setItem('supabase_token', response.session.access_token);
          localStorage.setItem('supabase_refresh_token', response.session.refresh_token);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signIn(email, password);

      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }

      if (response.user) {
        setUser(response.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      setError(null);
      window.location.hash = '#landing';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const updatedUser = await authService.updateProfile(user.id, data);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  }
  return context;
}

