import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: "client" | "manager") => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock user data
const mockClientUser: User = {
  id: "user_1",
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 98765-4321",
  cpf: "123.456.789-00",
  birthDate: "1990-05-15",
  avatar: undefined,
  role: "client",
  bio: "Jogo futebol society toda semana. Adoro conhecer novas pessoas!",
  address: "São Paulo, SP",
  sports: ["Futebol Society", "Vôlei"],
  credits: 250.00,
  createdAt: new Date("2024-01-15"),
  stats: {
    gamesPlayed: 45,
    hoursPlayed: 78,
    totalSpent: 1250.50,
    rating: 4.8,
  },
  preferences: {
    notifications: {
      email: true,
      whatsapp: true,
      push: true,
    },
    privacy: {
      profilePublic: true,
      showStats: true,
    },
  },
};

const mockManagerUser: User = {
  id: "manager_1",
  name: "Maria Santos",
  email: "maria@arena.com",
  phone: "(11) 91234-5678",
  role: "manager",
  avatar: undefined,
  sports: [],
  credits: 0,
  createdAt: new Date("2023-01-01"),
  stats: {
    gamesPlayed: 0,
    hoursPlayed: 0,
    totalSpent: 0,
    rating: 5.0,
  },
  preferences: {
    notifications: {
      email: true,
      whatsapp: true,
      push: true,
    },
    privacy: {
      profilePublic: false,
      showStats: false,
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem("arena_user");
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Convert createdAt string back to Date
        if (parsed.createdAt) {
          parsed.createdAt = new Date(parsed.createdAt);
        }
        setUser(parsed);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: "client" | "manager" = "client") => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if this specific user exists in localStorage
    const storedUserKey = `arena_user_${email}`;
    const storedUser = localStorage.getItem(storedUserKey);
    
    let userData: User;
    
    if (storedUser) {
      // Existing user - use stored data
      const parsed = JSON.parse(storedUser);
      if (parsed.createdAt) {
        parsed.createdAt = new Date(parsed.createdAt);
      }
      userData = parsed;
    } else {
      // New user
      const baseUserData = role === "manager" ? mockManagerUser : mockClientUser;
      userData = { 
        ...baseUserData, 
        email,
        createdAt: new Date()
      };
    }
    
    setUser(userData);
    // Save with user-specific key
    localStorage.setItem(storedUserKey, JSON.stringify(userData));
    // Also save as current user
    localStorage.setItem("arena_user", JSON.stringify(userData));
    
    setIsLoading(false);
  };

  const logout = () => {
    // Limpar estado imediatamente
    setUser(null);
    
    // Limpar TODOS os dados do localStorage relacionados
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('arena_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Redirecionar para landing page
    window.location.hash = '#landing';
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("arena_user", JSON.stringify(updatedUser));
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
