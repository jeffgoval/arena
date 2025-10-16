import { BookingService } from '../BookingService';
import { LocalBookingRepository } from '../../repositories/bookings/LocalBookingRepository';
import { LocalStorage } from '../../storage/LocalStorage';
import { Booking } from '../../../types';

describe('BookingService', () => {
  let bookingService: BookingService;
  let bookingRepository: LocalBookingRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    bookingRepository = new LocalBookingRepository(storage);
    bookingService = new BookingService(bookingRepository);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const booking = await bookingService.createBooking(bookingData);
      expect(booking).toBeDefined();
      expect(booking.courtId).toBe('court_1');
      expect(booking.userId).toBe('user_1');
      expect(booking.status).toBe('pending');
    });

    it('should throw error when missing required fields', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        // Missing userId, date, time
      };

      await expect(bookingService.createBooking(bookingData)).rejects.toThrow();
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      await bookingService.createBooking(bookingData);
      const bookings = await bookingService.getUserBookings('user_1');
      expect(bookings).toHaveLength(1);
      expect(bookings[0].userId).toBe('user_1');
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const booking = await bookingService.createBooking(bookingData);
      await bookingService.cancelBooking(booking.id);
      
      const cancelled = await bookingService.getBooking(booking.id);
      expect(cancelled?.status).toBe('canceled');
    });

    it('should throw error when booking not found', async () => {
      await expect(bookingService.cancelBooking('nonexistent')).rejects.toThrow();
    });
  });

  describe('confirmBooking', () => {
    it('should confirm a booking', async () => {
      const bookingData: Partial<Booking> = {
        courtId: 'court_1',
        userId: 'user_1',
        date: '2025-10-20',
        time: '19:00',
        duration: 1,
        price: 150,
      };

      const booking = await bookingService.createBooking(bookingData);
      const confirmed = await bookingService.confirmBooking(booking.id);
      expect(confirmed.status).toBe('confirmed');
    });
  });
});

