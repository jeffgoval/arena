/**
 * Interface base para repositórios
 * Define operações CRUD padrão
 */

export interface IRepository<T, ID = string> {
  /**
   * Obtém um item por ID
   */
  getById(id: ID): Promise<T | null>;

  /**
   * Obtém todos os itens
   */
  getAll(filters?: Record<string, any>): Promise<T[]>;

  /**
   * Cria um novo item
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Atualiza um item existente
   */
  update(id: ID, data: Partial<T>): Promise<T>;

  /**
   * Deleta um item
   */
  delete(id: ID): Promise<void>;

  /**
   * Verifica se um item existe
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Conta o total de itens
   */
  count(filters?: Record<string, any>): Promise<number>;
}

