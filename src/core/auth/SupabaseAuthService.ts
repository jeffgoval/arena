/**
 * Supabase Authentication Service
 * Gerencia autenticação com Supabase Auth
 */

import { User } from '../../types';
import { IHttpClient } from '../http/IHttpClient';

export interface AuthResponse {
  user: User | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null;
  error: string | null;
}

export class SupabaseAuthService {
  private baseUrl: string;
  private anonKey: string;

  constructor(
    private httpClient: IHttpClient,
    baseUrl: string = import.meta.env.VITE_SUPABASE_URL,
    anonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY
  ) {
    this.baseUrl = baseUrl;
    this.anonKey = anonKey;
  }

  /**
   * Registrar novo usuário
   */
  async signUp(
    email: string,
    password: string,
    userData: Partial<User>
  ): Promise<AuthResponse> {
    try {
      // 1. Criar usuário no Supabase Auth
      const authResponse = await this.httpClient.post<any>(
        `${this.baseUrl}/auth/v1/signup`,
        {
          email,
          password,
        },
        {
          'Content-Type': 'application/json',
          'apikey': this.anonKey,
        }
      );

      if (!authResponse.data?.user) {
        return {
          user: null,
          session: null,
          error: 'Erro ao criar usuário',
        };
      }

      // 2. Criar registro do usuário na tabela users
      const user: User = {
        id: authResponse.data.user.id,
        email: authResponse.data.user.email,
        name: userData.name || email.split('@')[0],
        role: userData.role || 'client',
        credits: 0,
        status: 'active',
        createdAt: new Date(),
        ...userData,
      };

      await this.httpClient.post('/users', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      });

      return {
        user,
        session: {
          access_token: authResponse.data.session?.access_token || '',
          refresh_token: authResponse.data.session?.refresh_token || '',
          expires_in: authResponse.data.session?.expires_in || 3600,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        user: null,
        session: null,
        error: String(error),
      };
    }
  }

  /**
   * Login com email e senha
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // 1. Autenticar com Supabase Auth
      const authResponse = await this.httpClient.post<any>(
        `${this.baseUrl}/auth/v1/token?grant_type=password`,
        {
          email,
          password,
        },
        {
          'Content-Type': 'application/json',
          'apikey': this.anonKey,
        }
      );

      if (!authResponse.data?.user) {
        return {
          user: null,
          session: null,
          error: 'Email ou senha inválidos',
        };
      }

      // 2. Buscar dados do usuário na tabela users
      const userResponse = await this.httpClient.get<any[]>(
        `/users?id=eq.${authResponse.data.user.id}`
      );

      const userData = userResponse.data?.[0];
      if (!userData) {
        return {
          user: null,
          session: null,
          error: 'Usuário não encontrado',
        };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        cpf: userData.cpf,
        role: userData.role,
        credits: userData.credits || 0,
        status: userData.status,
        avatar: userData.avatar_url,
        createdAt: new Date(userData.created_at),
      };

      // 3. Salvar token no localStorage
      localStorage.setItem('supabase_token', authResponse.data.access_token);
      localStorage.setItem('supabase_refresh_token', authResponse.data.refresh_token);

      return {
        user,
        session: {
          access_token: authResponse.data.access_token,
          refresh_token: authResponse.data.refresh_token,
          expires_in: authResponse.data.expires_in || 3600,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        user: null,
        session: null,
        error: String(error),
      };
    }
  }

  /**
   * Logout
   */
  async signOut(): Promise<void> {
    try {
      const token = localStorage.getItem('supabase_token');
      if (token) {
        await this.httpClient.post(
          `${this.baseUrl}/auth/v1/logout`,
          {},
          {
            'Authorization': `Bearer ${token}`,
            'apikey': this.anonKey,
          }
        );
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      localStorage.removeItem('supabase_token');
      localStorage.removeItem('supabase_refresh_token');
    }
  }

  /**
   * Recuperar sessão do localStorage
   */
  async getSession(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem('supabase_token');
      if (!token) {
        return {
          user: null,
          session: null,
          error: null,
        };
      }

      // Buscar usuário atual
      const response = await this.httpClient.get<any[]>(
        '/users?select=*',
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      if (!response.data || response.data.length === 0) {
        return {
          user: null,
          session: null,
          error: null,
        };
      }

      const userData = response.data[0];
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        cpf: userData.cpf,
        role: userData.role,
        credits: userData.credits || 0,
        status: userData.status,
        avatar: userData.avatar_url,
        createdAt: new Date(userData.created_at),
      };

      return {
        user,
        session: {
          access_token: token,
          refresh_token: localStorage.getItem('supabase_refresh_token') || '',
          expires_in: 3600,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return {
        user: null,
        session: null,
        error: String(error),
      };
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
    try {
      const token = localStorage.getItem('supabase_token');
      const response = await this.httpClient.patch<any>(
        `/users?id=eq.${userId}`,
        {
          name: data.name,
          phone: data.phone,
          avatar_url: data.avatar,
          bio: data.bio,
          address: data.address,
        },
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const userData = response.data[0];
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        cpf: userData.cpf,
        role: userData.role,
        credits: userData.credits || 0,
        status: userData.status,
        avatar: userData.avatar_url,
        createdAt: new Date(userData.created_at),
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }
}

