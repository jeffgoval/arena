import { Booking } from '../../../types';
import { IBookingRepository, BookingFilters } from '../../repositories/bookings/IBookingRepository';

export class BookingService {
  constructor(private repository: IBookingRepository) {}

  async getBooking(id: string): Promise<Booking | null> {
    return this.repository.getById(id);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.repository.getByUserId(userId);
  }

  async getCourtBookings(courtId: string): Promise<Booking[]> {
    return this.repository.getByCourtId(courtId);
  }

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    if (!data.courtId || !data.userId || !data.date || !data.time) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(data);
  }

  async cancelBooking(id: string, reason?: string): Promise<void> {
    const booking = await this.repository.getById(id);
    if (!booking) throw new Error('Booking not found');
    if (booking.status === 'completed') throw new Error('Cannot cancel completed booking');
    await this.repository.cancel(id, reason);
  }

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.repository.getById(id);
    if (!booking) throw new Error('Booking not found');
    return this.repository.confirm(id);
  }

  async searchBookings(filters: BookingFilters): Promise<Booking[]> {
    return this.repository.getByFilters(filters);
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.repository.getAll();
  }
}

