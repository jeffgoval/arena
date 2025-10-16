import { LocalTransactionRepository } from '../LocalTransactionRepository';
import { LocalStorage } from '../../../storage/LocalStorage';
import { Transaction } from '../../../../types';

describe('LocalTransactionRepository', () => {
  let repository: LocalTransactionRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    repository = new LocalTransactionRepository(storage);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transactionData: Partial<Transaction> = {
        userId: 'user_1',
        type: 'credit',
        amount: 100,
        description: 'Payment',
      };

      const transaction = await repository.create(transactionData);
      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.type).toBe('credit');
    });
  });

  describe('getById', () => {
    it('should retrieve a transaction by id', async () => {
      const transactionData: Partial<Transaction> = {
        userId: 'user_1',
        type: 'credit',
        amount: 100,
        description: 'Payment',
      };

      const created = await repository.create(transactionData);
      const retrieved = await repository.getById(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });
  });

  describe('getByUserId', () => {
    it('should retrieve transactions by user id', async () => {
      const transactionData: Partial<Transaction> = {
        userId: 'user_1',
        type: 'credit',
        amount: 100,
        description: 'Payment',
      };

      await repository.create(transactionData);
      const transactions = await repository.getByUserId('user_1');
      expect(transactions).toHaveLength(1);
      expect(transactions[0].userId).toBe('user_1');
    });
  });

  describe('getBalance', () => {
    it('should calculate correct balance', async () => {
      await repository.create({
        userId: 'user_1',
        type: 'credit',
        amount: 100,
        description: 'Payment',
      });

      await repository.create({
        userId: 'user_1',
        type: 'debit',
        amount: 30,
        description: 'Booking',
      });

      const balance = await repository.getBalance('user_1');
      expect(balance).toBe(70);
    });

    it('should return 0 for user with no transactions', async () => {
      const balance = await repository.getBalance('user_2');
      expect(balance).toBe(0);
    });
  });

  describe('getByFilters', () => {
    it('should filter transactions by type', async () => {
      await repository.create({
        userId: 'user_1',
        type: 'credit',
        amount: 100,
        description: 'Payment',
      });

      await repository.create({
        userId: 'user_1',
        type: 'debit',
        amount: 30,
        description: 'Booking',
      });

      const credits = await repository.getByFilters({ userId: 'user_1', type: 'credit' });
      expect(credits).toHaveLength(1);
      expect(credits[0].type).toBe('credit');
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      const transactionData: Partial<Transaction> = {
        userId: 'user_1',
        type: 'credit',
        amount: 100,
        description: 'Payment',
      };

      const created = await repository.create(transactionData);
      await repository.delete(created.id);
      const transaction = await repository.getById(created.id);
      expect(transaction).toBeNull();
    });
  });
});

