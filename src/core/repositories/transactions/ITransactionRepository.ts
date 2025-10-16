import { IRepository } from '../IRepository';
import { Transaction } from '../../../types';

export interface TransactionFilters {
  userId?: string;
  type?: Transaction['type'];
  status?: Transaction['status'];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ITransactionRepository extends IRepository<Transaction> {
  getByFilters(filters: TransactionFilters): Promise<Transaction[]>;
  getByUserId(userId: string): Promise<Transaction[]>;
  getBalance(userId: string): Promise<number>;
  getByBookingId(bookingId: string): Promise<Transaction | null>;
}

