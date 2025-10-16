/**
 * Implementação local de IAuthRepository usando localStorage
 * Útil para desenvolvimento e testes
 */

import { User } from '../../../types';
import { IStorage } from '../../storage/IStorage';
import {
  IAuthRepository,
  LoginCredentials,
  SignUpData,
  AuthSession,
} from './IAuthRepository';

const MOCK_CLIENT_USER: User = {
  id: 'user_1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  birthDate: '1990-05-15',
  avatar: undefined,
  role: 'client',
  bio: 'Jogo futebol society toda semana. Adoro conhecer novas pessoas!',
  address: 'São Paulo, SP',
  sports: ['Futebol Society', 'Vôlei'],
  credits: 250.0,
  createdAt: new Date('2024-01-15'),
  stats: {
    gamesPlayed: 45,
    hoursPlayed: 78,
    totalSpent: 1250.5,
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

const MOCK_MANAGER_USER: User = {
  id: 'manager_1',
  name: 'Maria Santos',
  email: 'maria@arena.com',
  phone: '(11) 91234-5678',
  role: 'manager',
  avatar: undefined,
  sports: [],
  credits: 0,
  createdAt: new Date('2023-01-01'),
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

export class LocalAuthRepository implements IAuthRepository {
  private storage: IStorage;
  private currentSessionKey = 'auth_session';
  private usersKey = 'auth_users';

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = this.storage.getItem<Record<string, User>>(this.usersKey) || {};
    let user = users[credentials.email];

    if (!user) {
      // Novo usuário - usar mock
      const baseUser = credentials.role === 'manager' ? MOCK_MANAGER_USER : MOCK_CLIENT_USER;
      user = {
        ...baseUser,
        email: credentials.email,
        createdAt: new Date(),
      };
      users[credentials.email] = user;
      this.storage.setItem(this.usersKey, users);
    }

    const session: AuthSession = {
      user,
      token: `token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    this.storage.setItem(this.currentSessionKey, session);
    return session;
  }

  async signup(data: SignUpData): Promise<AuthSession> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = this.storage.getItem<Record<string, User>>(this.usersKey) || {};

    if (users[data.email]) {
      throw new Error('Email já cadastrado');
    }

    const baseUser = data.role === 'manager' ? MOCK_MANAGER_USER : MOCK_CLIENT_USER;
    const user: User = {
      ...baseUser,
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || baseUser.phone,
      createdAt: new Date(),
    };

    users[data.email] = user;
    this.storage.setItem(this.usersKey, users);

    const session: AuthSession = {
      user,
      token: `token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    this.storage.setItem(this.currentSessionKey, session);
    return session;
  }

  async logout(): Promise<void> {
    this.storage.removeItem(this.currentSessionKey);
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    return this.storage.getItem<AuthSession>(this.currentSessionKey);
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const users = this.storage.getItem<Record<string, User>>(this.usersKey) || {};
    const user = Object.values(users).find(u => u.id === userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const updated = { ...user, ...data };
    users[user.email] = updated;
    this.storage.setItem(this.usersKey, users);

    // Atualizar sessão
    const session = await this.getCurrentSession();
    if (session && session.user.id === userId) {
      session.user = updated;
      this.storage.setItem(this.currentSessionKey, session);
    }

    return updated;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Implementação simplificada - em produção validar senha antiga
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async requestPasswordReset(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  async getCurrentUser(): Promise<User | null> {
    const session = await this.getCurrentSession();
    return session?.user || null;
  }
}

