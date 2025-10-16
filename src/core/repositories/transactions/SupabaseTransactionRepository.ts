/**
 * Supabase Transaction Repository
 * Implementação real de ITransactionRepository usando Supabase
 */

import { ITransactionRepository } from './ITransactionRepository';
import { Transaction } from '../../../types';
import { IHttpClient } from '../../http/IHttpClient';

export class SupabaseTransactionRepository implements ITransactionRepository {
  constructor(private httpClient: IHttpClient) {}

  async getById(id: string): Promise<Transaction | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/transactions?id=eq.${id}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToTransaction(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  async getAll(): Promise<Transaction[]> {
    try {
      const response = await this.httpClient.get<any[]>('/transactions');
      return (response.data || []).map(t => this.mapToTransaction(t));
    } catch (error) {
      console.error('Error getting all transactions:', error);
      return [];
    }
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await this.httpClient.post<any>(
        '/transactions',
        this.mapFromTransaction(transaction)
      );
      return this.mapToTransaction(response.data[0]);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await this.httpClient.patch<any>(
        `/transactions?id=eq.${id}`,
        this.mapFromTransaction(transaction)
      );
      return this.mapToTransaction(response.data[0]);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/transactions?id=eq.${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/transactions?user_id=eq.${userId}`
      );
      return (response.data || []).map(t => this.mapToTransaction(t));
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  }

  async getTransactionsByType(type: string): Promise<Transaction[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/transactions?type=eq.${type}`
      );
      return (response.data || []).map(t => this.mapToTransaction(t));
    } catch (error) {
      console.error('Error getting transactions by type:', error);
      return [];
    }
  }

  async getTransactionsByStatus(status: string): Promise<Transaction[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/transactions?status=eq.${status}`
      );
      return (response.data || []).map(t => this.mapToTransaction(t));
    } catch (error) {
      console.error('Error getting transactions by status:', error);
      return [];
    }
  }

  async getUserBalance(userId: string): Promise<number> {
    try {
      const transactions = await this.getUserTransactions(userId);
      return transactions.reduce((balance, t) => {
        if (t.type === 'credit') {
          return balance + t.amount;
        } else if (t.type === 'debit') {
          return balance - t.amount;
        }
        return balance;
      }, 0);
    } catch (error) {
      console.error('Error calculating user balance:', error);
      return 0;
    }
  }

  async getBookingTransactions(bookingId: string): Promise<Transaction[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/transactions?booking_id=eq.${bookingId}`
      );
      return (response.data || []).map(t => this.mapToTransaction(t));
    } catch (error) {
      console.error('Error getting booking transactions:', error);
      return [];
    }
  }

  private mapToTransaction(data: any): Transaction {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: data.amount,
      description: data.description,
      category: data.category,
      method: data.method,
      status: data.status,
      bookingId: data.booking_id,
      createdAt: new Date(data.created_at),
    };
  }

  private mapFromTransaction(transaction: Partial<Transaction>): any {
    return {
      user_id: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      method: transaction.method,
      status: transaction.status,
      booking_id: transaction.bookingId,
      metadata: transaction.metadata,
    };
  }
}

