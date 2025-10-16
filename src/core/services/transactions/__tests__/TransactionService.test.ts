import { TransactionService } from '../TransactionService';
import { LocalTransactionRepository } from '../../repositories/transactions/LocalTransactionRepository';
import { LocalStorage } from '../../storage/LocalStorage';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: LocalTransactionRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    transactionRepository = new LocalTransactionRepository(storage);
    transactionService = new TransactionService(transactionRepository);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('addCredits', () => {
    it('should add credits to user', async () => {
      const transaction = await transactionService.addCredits(
        'user_1',
        100,
        'Payment for credits'
      );
      expect(transaction).toBeDefined();
      expect(transaction.type).toBe('credit');
      expect(transaction.amount).toBe(100);
    });
  });

  describe('debitCredits', () => {
    it('should debit credits from user', async () => {
      // First add credits
      await transactionService.addCredits('user_1', 100, 'Initial credits');
      
      // Then debit
      const transaction = await transactionService.debitCredits(
        'user_1',
        50,
        'Booking payment'
      );
      expect(transaction).toBeDefined();
      expect(transaction.type).toBe('debit');
      expect(transaction.amount).toBe(50);
    });

    it('should throw error when insufficient balance', async () => {
      await expect(
        transactionService.debitCredits('user_1', 100, 'Booking payment')
      ).rejects.toThrow('Insufficient balance');
    });
  });

  describe('getBalance', () => {
    it('should return correct balance', async () => {
      await transactionService.addCredits('user_1', 100, 'Initial credits');
      await transactionService.debitCredits('user_1', 30, 'Booking payment');
      
      const balance = await transactionService.getBalance('user_1');
      expect(balance).toBe(70);
    });

    it('should return 0 for user with no transactions', async () => {
      const balance = await transactionService.getBalance('user_2');
      expect(balance).toBe(0);
    });
  });

  describe('getUserTransactions', () => {
    it('should return user transactions', async () => {
      await transactionService.addCredits('user_1', 100, 'Initial credits');
      await transactionService.debitCredits('user_1', 30, 'Booking payment');
      
      const transactions = await transactionService.getUserTransactions('user_1');
      expect(transactions).toHaveLength(2);
      expect(transactions[0].userId).toBe('user_1');
    });
  });

  describe('refundTransaction', () => {
    it('should create refund transaction', async () => {
      const original = await transactionService.addCredits(
        'user_1',
        100,
        'Initial credits'
      );
      
      const refund = await transactionService.refundTransaction(original.id);
      expect(refund).toBeDefined();
      expect(refund.type).toBe('refund');
      expect(refund.amount).toBe(100);
    });

    it('should throw error for non-existent transaction', async () => {
      await expect(
        transactionService.refundTransaction('nonexistent')
      ).rejects.toThrow();
    });
  });
});

