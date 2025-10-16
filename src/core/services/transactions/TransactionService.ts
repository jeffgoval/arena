import { Transaction } from '../../../types';
import { ITransactionRepository, TransactionFilters } from '../../repositories/transactions/ITransactionRepository';

export class TransactionService {
  constructor(private repository: ITransactionRepository) {}

  async getTransaction(id: string): Promise<Transaction | null> {
    return this.repository.getById(id);
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.repository.getByUserId(userId);
  }

  async getBalance(userId: string): Promise<number> {
    return this.repository.getBalance(userId);
  }

  async searchTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    return this.repository.getByFilters(filters);
  }

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    if (!data.userId || !data.type || !data.amount) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(data);
  }

  async addCredits(userId: string, amount: number, description: string): Promise<Transaction> {
    return this.createTransaction({
      userId,
      type: 'credit',
      amount,
      description,
      method: 'payment',
    });
  }

  async debitCredits(userId: string, amount: number, description: string, bookingId?: string): Promise<Transaction> {
    const balance = await this.getBalance(userId);
    if (balance < amount) throw new Error('Insufficient balance');
    
    return this.createTransaction({
      userId,
      type: 'debit',
      amount,
      description,
      method: 'credits',
      bookingId,
    });
  }

  async refundTransaction(transactionId: string): Promise<Transaction> {
    const transaction = await this.repository.getById(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    return this.createTransaction({
      userId: transaction.userId,
      type: 'refund',
      amount: transaction.amount,
      description: `Refund for ${transaction.description}`,
      method: transaction.method,
    });
  }

  async getTransactionByBooking(bookingId: string): Promise<Transaction | null> {
    return this.repository.getByBookingId(bookingId);
  }
}

