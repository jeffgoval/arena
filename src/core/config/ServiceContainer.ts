/**
 * Container de serviços (Service Locator)
 * Centraliza a criação e acesso aos serviços
 */

import { LocalStorage, IStorage } from '../storage';
import { FetchHttpClient, IHttpClient } from '../http';
import { LocalAuthRepository, IAuthRepository } from '../repositories';
import { AuthService } from '../services/auth';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private storage: IStorage;
  private httpClient: IHttpClient;
  private authRepository: IAuthRepository;
  private authService: AuthService;

  private constructor() {
    // Inicializar storage
    this.storage = new LocalStorage('arena_');

    // Inicializar HTTP client
    this.httpClient = new FetchHttpClient(process.env.REACT_APP_API_URL || '');

    // Inicializar repositórios
    this.authRepository = new LocalAuthRepository(this.storage);

    // Inicializar serviços
    this.authService = new AuthService(this.authRepository, {
      onSessionChange: (session) => {
        console.log('Session changed:', session);
      },
      onError: (error) => {
        console.error('Auth error:', error);
      },
    });
  }

  /**
   * Obtém a instância singleton
   */
  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Obtém o storage
   */
  getStorage(): IStorage {
    return this.storage;
  }

  /**
   * Obtém o cliente HTTP
   */
  getHttpClient(): IHttpClient {
    return this.httpClient;
  }

  /**
   * Obtém o repositório de autenticação
   */
  getAuthRepository(): IAuthRepository {
    return this.authRepository;
  }

  /**
   * Obtém o serviço de autenticação
   */
  getAuthService(): AuthService {
    return this.authService;
  }

  /**
   * Reseta o container (útil para testes)
   */
  static reset(): void {
    ServiceContainer.instance = null as any;
  }
}

// Exportar instância global
export const serviceContainer = ServiceContainer.getInstance();

