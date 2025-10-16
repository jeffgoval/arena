import { AuthService } from '../AuthService';
import { LocalAuthRepository } from '../../repositories/auth/LocalAuthRepository';
import { LocalStorage } from '../../storage/LocalStorage';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: LocalAuthRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    authRepository = new LocalAuthRepository(storage);
    authService = new AuthService(authRepository, {
      onSessionChange: jest.fn(),
      onError: jest.fn(),
    });
  });

  afterEach(() => {
    storage.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await authService.login('joao@email.com', 'password', 'client');
      expect(user).toBeDefined();
      expect(user.email).toBe('joao@email.com');
      expect(user.role).toBe('client');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        authService.login('invalid@email.com', 'wrongpassword', 'client')
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await authService.login('joao@email.com', 'password', 'client');
      await authService.logout();
      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not logged in', async () => {
      const user = await authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return current user after login', async () => {
      await authService.login('joao@email.com', 'password', 'client');
      const user = await authService.getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.email).toBe('joao@email.com');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', async () => {
      const isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it('should return true after login', async () => {
      await authService.login('joao@email.com', 'password', 'client');
      const isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(true);
    });
  });
});

