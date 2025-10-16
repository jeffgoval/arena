/**
 * Container de serviços (Service Locator)
 * Centraliza a criação e acesso aos serviços
 */

import { LocalStorage, IStorage } from '../storage';
import { FetchHttpClient, IHttpClient } from '../http';
import { LocalAuthRepository, IAuthRepository } from '../repositories';
import { LocalBookingRepository, IBookingRepository } from '../repositories/bookings';
import { LocalCourtRepository, ICourtRepository } from '../repositories/courts';
import { LocalTeamRepository, ITeamRepository } from '../repositories/teams';
import { LocalTransactionRepository, ITransactionRepository } from '../repositories/transactions';
import { AuthService } from '../services/auth';
import { BookingService } from '../services/bookings';
import { CourtService } from '../services/courts';
import { TeamService } from '../services/teams';
import { TransactionService } from '../services/transactions';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private storage: IStorage;
  private httpClient: IHttpClient;

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

  private constructor() {
    // Inicializar storage
    this.storage = new LocalStorage('arena_');

    // Inicializar HTTP client
    this.httpClient = new FetchHttpClient(process.env.REACT_APP_API_URL || '');

    // Inicializar repositórios
    this.authRepository = new LocalAuthRepository(this.storage);
    this.bookingRepository = new LocalBookingRepository(this.storage);
    this.courtRepository = new LocalCourtRepository(this.storage);
    this.teamRepository = new LocalTeamRepository(this.storage);
    this.transactionRepository = new LocalTransactionRepository(this.storage);

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

