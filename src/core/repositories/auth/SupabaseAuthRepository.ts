/**
 * Supabase Auth Repository
 * Implementação real de IAuthRepository usando Supabase
 */

import { IAuthRepository } from './IAuthRepository';
import { User } from '../../../types';
import { IHttpClient } from '../../http/IHttpClient';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private httpClient: IHttpClient) {}

  async getById(id: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/users?id=eq.${id}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToUser(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const response = await this.httpClient.get<any[]>('/users');
      return (response.data || []).map(u => this.mapToUser(u));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const response = await this.httpClient.post<any>(
        '/users',
        this.mapFromUser(user)
      );
      return this.mapToUser(response.data[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    try {
      const response = await this.httpClient.patch<any>(
        `/users?id=eq.${id}`,
        this.mapFromUser(user)
      );
      return this.mapToUser(response.data[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/users?id=eq.${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/users?email=eq.${email}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToUser(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async getUserByCPF(cpf: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/users?cpf=eq.${cpf}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToUser(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting user by CPF:', error);
      return null;
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/users?role=eq.${role}`
      );
      return (response.data || []).map(u => this.mapToUser(u));
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/users?name=ilike.%${query}%`
      );
      return (response.data || []).map(u => this.mapToUser(u));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async updateUserCredits(userId: string, amount: number): Promise<User> {
    try {
      const user = await this.getById(userId);
      if (!user) throw new Error('User not found');
      
      const newCredits = (user.credits || 0) + amount;
      return this.update(userId, { credits: newCredits });
    } catch (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      cpf: data.cpf,
      role: data.role,
      credits: data.credits || 0,
      status: data.status,
      avatar: data.avatar_url,
      createdAt: new Date(data.created_at),
    };
  }

  private mapFromUser(user: Partial<User>): any {
    return {
      email: user.email,
      name: user.name,
      phone: user.phone,
      cpf: user.cpf,
      role: user.role,
      credits: user.credits,
      status: user.status,
      avatar_url: user.avatar,
      birth_date: user.birthDate,
      bio: user.bio,
      address: user.address,
    };
  }
}

