import { IBookingRepository, BookingFilters } from './IBookingRepository';
import { Booking } from '../../../types';
import { IStorage } from '../../storage/IStorage';

export class LocalBookingRepository implements IBookingRepository {
  private storage: IStorage;
  private bookingsKey = 'bookings';

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  private getBookings(): Booking[] {
    return this.storage.getItem<Booking[]>(this.bookingsKey) || [];
  }

  private saveBookings(bookings: Booking[]): void {
    this.storage.setItem(this.bookingsKey, bookings);
  }

  async getById(id: string): Promise<Booking | null> {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === id) || null;
  }

  async getAll(filters?: Record<string, any>): Promise<Booking[]> {
    let bookings = this.getBookings();
    if (filters?.userId) bookings = bookings.filter(b => b.userId === filters.userId);
    if (filters?.status) bookings = bookings.filter(b => b.status === filters.status);
    return bookings;
  }

  async create(data: Partial<Booking>): Promise<Booking> {
    const bookings = this.getBookings();
    const booking: Booking = {
      id: `booking_${Date.now()}`,
      courtId: data.courtId!,
      userId: data.userId!,
      date: data.date!,
      time: data.time!,
      duration: data.duration || 1,
      type: data.type || 'avulsa',
      status: 'pending',
      price: data.price || 0,
      createdAt: new Date(),
      ...data,
    };
    bookings.push(booking);
    this.saveBookings(bookings);
    return booking;
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index] = { ...bookings[index], ...data };
    this.saveBookings(bookings);
    return bookings[index];
  }

  async delete(id: string): Promise<void> {
    const bookings = this.getBookings();
    this.saveBookings(bookings.filter(b => b.id !== id));
  }

  async exists(id: string): Promise<boolean> {
    return (await this.getById(id)) !== null;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const bookings = await this.getAll(filters);
    return bookings.length;
  }

  async getByFilters(filters: BookingFilters): Promise<Booking[]> {
    let bookings = this.getBookings();
    if (filters.userId) bookings = bookings.filter(b => b.userId === filters.userId);
    if (filters.courtId) bookings = bookings.filter(b => b.courtId === filters.courtId);
    if (filters.status) bookings = bookings.filter(b => b.status === filters.status);
    if (filters.dateFrom) bookings = bookings.filter(b => new Date(b.date) >= filters.dateFrom!);
    if (filters.dateTo) bookings = bookings.filter(b => new Date(b.date) <= filters.dateTo!);
    return bookings;
  }

  async getByUserId(userId: string): Promise<Booking[]> {
    return this.getByFilters({ userId });
  }

  async getByCourtId(courtId: string): Promise<Booking[]> {
    return this.getByFilters({ courtId });
  }

  async cancel(id: string, reason?: string): Promise<void> {
    await this.update(id, { status: 'canceled' });
  }

  async confirm(id: string): Promise<Booking> {
    return this.update(id, { status: 'confirmed' });
  }
}

