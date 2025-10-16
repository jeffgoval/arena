import { CourtService } from '../CourtService';
import { LocalCourtRepository } from '../../repositories/courts/LocalCourtRepository';
import { LocalStorage } from '../../storage/LocalStorage';

describe('CourtService', () => {
  let courtService: CourtService;
  let courtRepository: LocalCourtRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    courtRepository = new LocalCourtRepository(storage);
    courtService = new CourtService(courtRepository);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('getAllCourts', () => {
    it('should return all courts', async () => {
      const courts = await courtService.getAllCourts();
      expect(courts).toBeDefined();
      expect(Array.isArray(courts)).toBe(true);
      expect(courts.length).toBeGreaterThan(0);
    });
  });

  describe('getCourt', () => {
    it('should return a court by id', async () => {
      const courts = await courtService.getAllCourts();
      const court = await courtService.getCourt(courts[0].id);
      expect(court).toBeDefined();
      expect(court?.id).toBe(courts[0].id);
    });

    it('should return null for non-existent court', async () => {
      const court = await courtService.getCourt('nonexistent');
      expect(court).toBeNull();
    });
  });

  describe('searchCourts', () => {
    it('should search courts by name', async () => {
      const results = await courtService.searchCourts('Society');
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterCourts', () => {
    it('should filter courts by type', async () => {
      const results = await courtService.filterCourts({ type: 'Futebol Society' });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter courts by rating', async () => {
      const results = await courtService.filterCourts({ minRating: 4.0 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('rateCourt', () => {
    it('should rate a court', async () => {
      const courts = await courtService.getAllCourts();
      const rated = await courtService.rateCourt(courts[0].id, 5);
      expect(rated).toBeDefined();
      expect(rated.rating.count).toBeGreaterThan(0);
    });

    it('should throw error for invalid rating', async () => {
      const courts = await courtService.getAllCourts();
      await expect(courtService.rateCourt(courts[0].id, 6)).rejects.toThrow();
    });
  });
});

