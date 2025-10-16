/**
 * Serviço de autenticação
 * Orquestra a lógica de autenticação usando o repositório
 */

import { User } from '../../../types';
import { IAuthRepository, LoginCredentials, SignUpData, AuthSession } from '../../repositories/auth/IAuthRepository';

export interface AuthServiceOptions {
  onSessionChange?: (session: AuthSession | null) => void;
  onError?: (error: Error) => void;
}

export class AuthService {
  private repository: IAuthRepository;
  private currentSession: AuthSession | null = null;
  private options: AuthServiceOptions;

  constructor(repository: IAuthRepository, options: AuthServiceOptions = {}) {
    this.repository = repository;
    this.options = options;
    this.initializeSession();
  }

  private async initializeSession(): Promise<void> {
    try {
      this.currentSession = await this.repository.getCurrentSession();
      this.options.onSessionChange?.(this.currentSession);
    } catch (error) {
      console.error('Error initializing session:', error);
      this.options.onError?.(error as Error);
    }
  }

  /**
   * Faz login
   */
  async login(email: string, password: string, role?: 'client' | 'manager' | 'admin'): Promise<User> {
    try {
      const credentials: LoginCredentials = { email, password, role };
      const session = await this.repository.login(credentials);
      this.currentSession = session;
      this.options.onSessionChange?.(session);
      return session.user;
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Faz signup
   */
  async signup(name: string, email: string, password: string, role?: 'client' | 'manager' | 'admin'): Promise<User> {
    try {
      const data: SignUpData = { name, email, password, role };
      const session = await this.repository.signup(data);
      this.currentSession = session;
      this.options.onSessionChange?.(session);
      return session.user;
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Faz logout
   */
  async logout(): Promise<void> {
    try {
      await this.repository.logout();
      this.currentSession = null;
      this.options.onSessionChange?.(null);
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.currentSession) {
        this.currentSession = await this.repository.getCurrentSession();
      }
      return this.currentSession?.user || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Obtém a sessão atual
   */
  async getCurrentSession(): Promise<AuthSession | null> {
    if (!this.currentSession) {
      this.currentSession = await this.repository.getCurrentSession();
    }
    return this.currentSession;
  }

  /**
   * Verifica se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return this.repository.isAuthenticated();
  }

  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const updated = await this.repository.updateProfile(userId, data);
      if (this.currentSession) {
        this.currentSession.user = updated;
        this.options.onSessionChange?.(this.currentSession);
      }
      return updated;
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Muda a senha
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      await this.repository.changePassword(userId, oldPassword, newPassword);
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.repository.requestPasswordReset(email);
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Reseta a senha
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await this.repository.resetPassword(token, newPassword);
    } catch (error) {
      const err = error as Error;
      this.options.onError?.(err);
      throw err;
    }
  }
}

