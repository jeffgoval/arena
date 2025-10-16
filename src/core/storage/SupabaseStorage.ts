/**
 * Supabase Storage Implementation
 * Implementação de IStorage usando Supabase como backend
 */

import { IStorage } from './IStorage';
import { IHttpClient } from '../http/IHttpClient';

export class SupabaseStorage implements IStorage {
  private httpClient: IHttpClient;
  private prefix: string;
  private tableName: string = 'kv_store';

  constructor(httpClient: IHttpClient, prefix: string = 'arena_') {
    this.httpClient = httpClient;
    this.prefix = prefix;
  }

  /**
   * Build full key with prefix
   */
  private buildKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get item from Supabase
   */
  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key);
      const response = await this.httpClient.get<any[]>(
        `/${this.tableName}?key=eq.${encodeURIComponent(fullKey)}`
      );

      if (response.data && response.data.length > 0) {
        const stored = response.data[0];
        return stored.value as T;
      }

      return null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set item in Supabase
   */
  async setItem<T = any>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.buildKey(key);
      
      // Check if key exists
      const existing = await this.getItem(key);
      
      if (existing !== null) {
        // Update existing
        await this.httpClient.patch(
          `/${this.tableName}?key=eq.${encodeURIComponent(fullKey)}`,
          { value }
        );
      } else {
        // Insert new
        await this.httpClient.post(`/${this.tableName}`, {
          key: fullKey,
          value,
        });
      }
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove item from Supabase
   */
  async removeItem(key: string): Promise<void> {
    try {
      const fullKey = this.buildKey(key);
      await this.httpClient.delete(
        `/${this.tableName}?key=eq.${encodeURIComponent(fullKey)}`
      );
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all items with prefix
   */
  async clear(): Promise<void> {
    try {
      // Get all keys with prefix
      const keys = await this.keys();
      
      // Delete each key
      for (const key of keys) {
        await this.removeItem(key);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async hasItem(key: string): Promise<boolean> {
    const item = await this.getItem(key);
    return item !== null;
  }

  /**
   * Get all keys with prefix
   */
  async keys(): Promise<string[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/${this.tableName}?key=like.${encodeURIComponent(this.prefix)}*`
      );

      if (response.data && Array.isArray(response.data)) {
        return response.data.map(item => 
          item.key.replace(this.prefix, '')
        );
      }

      return [];
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  /**
   * Get storage size
   */
  async size(): Promise<number> {
    try {
      const keys = await this.keys();
      let totalSize = 0;

      for (const key of keys) {
        const item = await this.getItem(key);
        if (item) {
          const serialized = JSON.stringify(item);
          totalSize += new Blob([serialized]).size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating size:', error);
      return 0;
    }
  }
}

