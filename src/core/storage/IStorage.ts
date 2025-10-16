/**
 * Interface abstrata para persistência de dados
 * Permite trocar entre localStorage, sessionStorage, IndexedDB, etc.
 */

export interface IStorage {
  /**
   * Obtém um valor do storage
   */
  getItem<T = any>(key: string): T | null;

  /**
   * Define um valor no storage
   */
  setItem<T = any>(key: string, value: T): void;

  /**
   * Remove um valor do storage
   */
  removeItem(key: string): void;

  /**
   * Limpa todo o storage
   */
  clear(): void;

  /**
   * Verifica se uma chave existe
   */
  hasItem(key: string): boolean;

  /**
   * Obtém todas as chaves
   */
  keys(): string[];

  /**
   * Obtém o tamanho do storage
   */
  size(): number;
}

