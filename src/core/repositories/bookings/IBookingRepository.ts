import { IRepository } from '../IRepository';
import { Booking } from '../../../types';

export interface BookingFilters {
  userId?: string;
  courtId?: string;
  status?: Booking['status'];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IBookingRepository extends IRepository<Booking> {
  getByFilters(filters: BookingFilters): Promise<Booking[]>;
  getByUserId(userId: string): Promise<Booking[]>;
  getByCourtId(courtId: string): Promise<Booking[]>;
  cancel(id: string, reason?: string): Promise<void>;
  confirm(id: string): Promise<Booking>;
}

