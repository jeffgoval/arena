import { ITransactionRepository, TransactionFilters } from './ITransactionRepository';
import { Transaction } from '../../../types';
import { IStorage } from '../../storage/IStorage';

export class LocalTransactionRepository implements ITransactionRepository {
  private storage: IStorage;
  private transactionsKey = 'transactions';

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  private getTransactions(): Transaction[] {
    return this.storage.getItem<Transaction[]>(this.transactionsKey) || [];
  }

  private saveTransactions(transactions: Transaction[]): void {
    this.storage.setItem(this.transactionsKey, transactions);
  }

  async getById(id: string): Promise<Transaction | null> {
    return this.getTransactions().find(t => t.id === id) || null;
  }

  async getAll(filters?: Record<string, any>): Promise<Transaction[]> {
    let transactions = this.getTransactions();
    if (filters?.userId) transactions = transactions.filter(t => t.userId === filters.userId);
    if (filters?.type) transactions = transactions.filter(t => t.type === filters.type);
    if (filters?.status) transactions = transactions.filter(t => t.status === filters.status);
    return transactions;
  }

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const transactions = this.getTransactions();
    const transaction: Transaction = {
      id: `trans_${Date.now()}`,
      userId: data.userId!,
      type: data.type!,
      amount: data.amount!,
      description: data.description || '',
      status: 'completed',
      method: data.method || 'credits',
      date: new Date(),
      bookingId: data.bookingId,
    };
    transactions.push(transaction);
    this.saveTransactions(transactions);
    return transaction;
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    transactions[index] = { ...transactions[index], ...data };
    this.saveTransactions(transactions);
    return transactions[index];
  }

  async delete(id: string): Promise<void> {
    this.saveTransactions(this.getTransactions().filter(t => t.id !== id));
  }

  async exists(id: string): Promise<boolean> {
    return (await this.getById(id)) !== null;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const transactions = await this.getAll(filters);
    return transactions.length;
  }

  async getByFilters(filters: TransactionFilters): Promise<Transaction[]> {
    let transactions = this.getTransactions();
    if (filters.userId) transactions = transactions.filter(t => t.userId === filters.userId);
    if (filters.type) transactions = transactions.filter(t => t.type === filters.type);
    if (filters.status) transactions = transactions.filter(t => t.status === filters.status);
    if (filters.dateFrom) transactions = transactions.filter(t => new Date(t.date) >= filters.dateFrom!);
    if (filters.dateTo) transactions = transactions.filter(t => new Date(t.date) <= filters.dateTo!);
    return transactions;
  }

  async getByUserId(userId: string): Promise<Transaction[]> {
    return this.getByFilters({ userId });
  }

  async getBalance(userId: string): Promise<number> {
    const transactions = await this.getByUserId(userId);
    return transactions.reduce((balance, t) => {
      if (t.type === 'credit') return balance + t.amount;
      if (t.type === 'debit') return balance - t.amount;
      if (t.type === 'refund') return balance + t.amount;
      return balance;
    }, 0);
  }

  async getByBookingId(bookingId: string): Promise<Transaction | null> {
    return this.getTransactions().find(t => t.bookingId === bookingId) || null;
  }
}

