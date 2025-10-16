/**
 * Interface para repositório de autenticação
 * Abstrai a lógica de autenticação do backend específico
 */

import { User } from '../../../types';

export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'client' | 'manager' | 'admin';
}

export interface SignUpData extends LoginCredentials {
  name: string;
  phone?: string;
}

export interface AuthSession {
  user: User;
  token?: string;
  expiresAt?: Date;
}

export interface IAuthRepository {
  /**
   * Faz login com email e senha
   */
  login(credentials: LoginCredentials): Promise<AuthSession>;

  /**
   * Faz signup (registro) de novo usuário
   */
  signup(data: SignUpData): Promise<AuthSession>;

  /**
   * Faz logout
   */
  logout(): Promise<void>;

  /**
   * Obtém a sessão atual
   */
  getCurrentSession(): Promise<AuthSession | null>;

  /**
   * Atualiza o perfil do usuário
   */
  updateProfile(userId: string, data: Partial<User>): Promise<User>;

  /**
   * Muda a senha
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;

  /**
   * Solicita reset de senha
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Reseta a senha com token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): Promise<User | null>;
}

