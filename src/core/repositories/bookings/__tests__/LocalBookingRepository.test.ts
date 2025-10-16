import { LocalBookingRepository } from '../LocalBookingRepository';
import { LocalStorage } from '../../../storage/LocalStorage';
import { Booking } from '../../../../types';

describe('LocalBookingRepository', () => {
  let repository: LocalBookingRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    repository = new LocalBookingRepository(storage);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const booking = await repository.create(bookingData);
      expect(booking).toBeDefined();
      expect(booking.id).toBeDefined();
      expect(booking.courtId).toBe('court_1');
    });
  });

  describe('getById', () => {
    it('should retrieve a booking by id', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const created = await repository.create(bookingData);
      const retrieved = await repository.getById(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });

    it('should return null for non-existent booking', async () => {
      const booking = await repository.getById('nonexistent');
      expect(booking).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should retrieve all bookings', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      await repository.create(bookingData);
      const bookings = await repository.getAll();
      expect(bookings).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const created = await repository.create(bookingData);
      const updated = await repository.update(created.id, { status: 'confirmed' });
      expect(updated.status).toBe('confirmed');
    });
  });

  describe('delete', () => {
    it('should delete a booking', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const created = await repository.create(bookingData);
      await repository.delete(created.id);
      const booking = await repository.getById(created.id);
      expect(booking).toBeNull();
    });
  });

  describe('getByUserId', () => {
    it('should retrieve bookings by user id', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      await repository.create(bookingData);
      const bookings = await repository.getByUserId('user_1');
      expect(bookings).toHaveLength(1);
      expect(bookings[0].userId).toBe('user_1');
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const created = await repository.create(bookingData);
      await repository.cancel(created.id);
      const booking = await repository.getById(created.id);
      expect(booking?.status).toBe('canceled');
    });
  });
});

