/**
 * Container de serviços (Service Locator)
 * Centraliza a criação e acesso aos serviços
 * Suporta múltiplos backends: Local, Supabase, REST API
 */

import { LocalStorage } from '../storage/LocalStorage';
import { IStorage } from '../storage/IStorage';
import { FetchHttpClient } from '../http/FetchHttpClient';
import { IHttpClient } from '../http/IHttpClient';
import { LocalAuthRepository, IAuthRepository } from '../repositories';
import { LocalBookingRepository, IBookingRepository } from '../repositories/bookings';
import { LocalCourtRepository, ICourtRepository } from '../repositories/courts';
import { LocalTeamRepository, ITeamRepository } from '../repositories/teams';
import { LocalTransactionRepository, ITransactionRepository } from '../repositories/transactions';
import { SupabaseAuthRepository } from '../repositories/auth/SupabaseAuthRepository';
import { SupabaseBookingRepository } from '../repositories/bookings/SupabaseBookingRepository';
import { SupabaseCourtRepository } from '../repositories/courts/SupabaseCourtRepository';
import { SupabaseTeamRepository } from '../repositories/teams/SupabaseTeamRepository';
import { SupabaseTransactionRepository } from '../repositories/transactions/SupabaseTransactionRepository';
import { AuthService } from '../services/auth';
import { BookingService } from '../services/bookings';
import { CourtService } from '../services/courts';
import { TeamService } from '../services/teams';
import { TransactionService } from '../services/transactions';

// Tipos de backend suportados
export type BackendType = 'local' | 'supabase' | 'rest-api';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private storage: IStorage;
  private httpClient: IHttpClient;
  private backend: BackendType;

  // Repositories
  private authRepository: IAuthRepository;
  private bookingRepository: IBookingRepository;
  private courtRepository: ICourtRepository;
  private teamRepository: ITeamRepository;
  private transactionRepository: ITransactionRepository;

  // Services
  private authService: AuthService;
  private bookingService: BookingService;
  private courtService: CourtService;
  private teamService: TeamService;
  private transactionService: TransactionService;

  private constructor(backend: BackendType = 'local') {
    this.backend = backend;

    // Inicializar HTTP client baseado no backend
    if (backend === 'supabase') {
      const { SupabaseHttpClient } = require('../http/SupabaseHttpClient');
      this.httpClient = new SupabaseHttpClient();
    } else {
      this.httpClient = new FetchHttpClient(import.meta.env.VITE_API_URL || '');
    }

    // Inicializar storage baseado no backend
    if (backend === 'supabase') {
      const { SupabaseStorage } = require('../storage/SupabaseStorage');
      this.storage = new SupabaseStorage(this.httpClient, 'arena_');
    } else {
      this.storage = new LocalStorage('arena_');
    }

    // Inicializar repositórios baseado no backend
    if (backend === 'supabase') {
      this.authRepository = new SupabaseAuthRepository(this.httpClient);
      this.bookingRepository = new SupabaseBookingRepository(this.httpClient);
      this.courtRepository = new SupabaseCourtRepository(this.httpClient);
      this.teamRepository = new SupabaseTeamRepository(this.httpClient);
      this.transactionRepository = new SupabaseTransactionRepository(this.httpClient);
    } else {
      this.authRepository = new LocalAuthRepository(this.storage);
      this.bookingRepository = new LocalBookingRepository(this.storage);
      this.courtRepository = new LocalCourtRepository(this.storage);
      this.teamRepository = new LocalTeamRepository(this.storage);
      this.transactionRepository = new LocalTransactionRepository(this.storage);
    }

    // Inicializar serviços
    this.authService = new AuthService(this.authRepository, {
      onSessionChange: (session) => {
        console.log('Session changed:', session);
      },
      onError: (error) => {
        console.error('Auth error:', error);
      },
    });

    this.bookingService = new BookingService(this.bookingRepository);
    this.courtService = new CourtService(this.courtRepository);
    this.teamService = new TeamService(this.teamRepository);
    this.transactionService = new TransactionService(this.transactionRepository);
  }

  /**
   * Obtém a instância singleton
   */
  static getInstance(backend?: BackendType): ServiceContainer {
    if (!ServiceContainer.instance) {
      // Detectar backend a partir de variáveis de ambiente
      const detectedBackend = backend ||
        (import.meta.env.VITE_ENABLE_SUPABASE === 'true' ? 'supabase' : 'local');
      ServiceContainer.instance = new ServiceContainer(detectedBackend);
    }
    return ServiceContainer.instance;
  }

  /**
   * Reinicializar com novo backend
   */
  static switchBackend(backend: BackendType): void {
    ServiceContainer.instance = new ServiceContainer(backend);
  }

  /**
   * Obter backend atual
   */
  getBackend(): BackendType {
    return this.backend;
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
   * Obtém o serviço de autenticação
   */
  getAuthService(): AuthService {
    return this.authService;
  }

  /**
   * Obtém o serviço de bookings
   */
  getBookingService(): BookingService {
    return this.bookingService;
  }

  /**
   * Obtém o serviço de quadras
   */
  getCourtService(): CourtService {
    return this.courtService;
  }

  /**
   * Obtém o serviço de times
   */
  getTeamService(): TeamService {
    return this.teamService;
  }

  /**
   * Obtém o serviço de transações
   */
  getTransactionService(): TransactionService {
    return this.transactionService;
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

