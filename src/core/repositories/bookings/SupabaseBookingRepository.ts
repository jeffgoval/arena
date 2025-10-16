/**
 * Supabase Booking Repository
 * Implementação real de IBookingRepository usando Supabase
 */

import { IBookingRepository, BookingFilters } from './IBookingRepository';
import { Booking } from '../../../types';
import { IHttpClient } from '../../http/IHttpClient';

export class SupabaseBookingRepository implements IBookingRepository {
  constructor(private httpClient: IHttpClient) {}

  async getById(id: string): Promise<Booking | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/bookings?id=eq.${id}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToBooking(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  async getAll(): Promise<Booking[]> {
    try {
      const response = await this.httpClient.get<any[]>('/bookings');
      return (response.data || []).map(b => this.mapToBooking(b));
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return [];
    }
  }

  async create(booking: Partial<Booking>): Promise<Booking> {
    try {
      const response = await this.httpClient.post<any>(
        '/bookings',
        this.mapFromBooking(booking)
      );
      return this.mapToBooking(response.data[0]);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async update(id: string, booking: Partial<Booking>): Promise<Booking> {
    try {
      const response = await this.httpClient.patch<any>(
        `/bookings?id=eq.${id}`,
        this.mapFromBooking(booking)
      );
      return this.mapToBooking(response.data[0]);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/bookings?id=eq.${id}`);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/bookings?user_id=eq.${userId}`
      );
      return (response.data || []).map(b => this.mapToBooking(b));
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  async getCourtBookings(courtId: string): Promise<Booking[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/bookings?court_id=eq.${courtId}`
      );
      return (response.data || []).map(b => this.mapToBooking(b));
    } catch (error) {
      console.error('Error getting court bookings:', error);
      return [];
    }
  }

  async search(filters: BookingFilters): Promise<Booking[]> {
    try {
      let query = '/bookings?';
      const params: string[] = [];

      if (filters.userId) {
        params.push(`user_id=eq.${filters.userId}`);
      }
      if (filters.courtId) {
        params.push(`court_id=eq.${filters.courtId}`);
      }
      if (filters.status) {
        params.push(`status=eq.${filters.status}`);
      }
      if (filters.startDate) {
        params.push(`date=gte.${filters.startDate}`);
      }
      if (filters.endDate) {
        params.push(`date=lte.${filters.endDate}`);
      }

      query += params.join('&');
      const response = await this.httpClient.get<any[]>(query);
      return (response.data || []).map(b => this.mapToBooking(b));
    } catch (error) {
      console.error('Error searching bookings:', error);
      return [];
    }
  }

  async cancelBooking(id: string, reason?: string): Promise<void> {
    try {
      await this.update(id, {
        status: 'canceled',
      });
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  }

  async confirmBooking(id: string): Promise<void> {
    try {
      await this.update(id, {
        status: 'confirmed',
      });
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  }

  private mapToBooking(data: any): Booking {
    return {
      id: data.id,
      courtId: String(data.court_id),
      userId: data.user_id,
      date: data.date,
      time: data.time,
      duration: data.duration,
      type: data.type,
      status: data.status,
      price: data.price,
      participants: data.participants || [],
      teamId: data.team_id,
      createdAt: new Date(data.created_at),
    };
  }

  private mapFromBooking(booking: Partial<Booking>): any {
    return {
      court_id: booking.courtId ? parseInt(booking.courtId) : undefined,
      user_id: booking.userId,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      type: booking.type,
      status: booking.status,
      price: booking.price,
      participants: booking.participants,
      team_id: booking.teamId,
      notes: booking.notes,
    };
  }
}

