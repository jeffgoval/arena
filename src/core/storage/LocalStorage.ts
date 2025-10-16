/**
 * Implementação de IStorage usando localStorage do navegador
 */

import { IStorage } from './IStorage';

export class LocalStorage implements IStorage {
  private prefix: string;

  constructor(prefix: string = 'arena_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  getItem<T = any>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(this.getKey(key));
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  setItem<T = any>(key: string, value: T): void {
    try {
      window.localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => window.localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  hasItem(key: string): boolean {
    return window.localStorage.getItem(this.getKey(key)) !== null;
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }

  size(): number {
    let size = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        const item = window.localStorage.getItem(key);
        if (item) {
          size += item.length;
        }
      }
    }
    return size;
  }
}

