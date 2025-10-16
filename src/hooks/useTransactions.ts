/**
 * Transactions Data Hook with SWR
 * Cached data fetching for financial transactions using Supabase
 */

import useSWR from 'swr';
import { ServiceContainer } from '../core/config/ServiceContainer';

// Types
export interface Transaction {
  id?: number;
  date: string;
  description: string;
  type: 'debit' | 'credit';
  value: number;
  category?: string;
  bookingId?: number;
}

interface UseTransactionsOptions {
  type?: 'debit' | 'credit' | 'all';
  limit?: number;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  balance: number;
  credits: number;
  debits: number;
  mutate: () => void;
}

// Real fetcher using Supabase
const fetcher = async (url: string): Promise<Transaction[]> => {
  try {
    const container = ServiceContainer.getInstance();
    const transactionService = container.getTransactionService();
    const transactions = await transactionService.getAllTransactions();

    // Map from core Transaction type to hook Transaction type
    return transactions.map(t => ({
      id: parseInt(t.id),
      date: new Date(t.createdAt).toLocaleDateString('pt-BR'),
      description: t.description,
      type: t.type as 'debit' | 'credit',
      value: t.amount,
      category: t.category,
      bookingId: t.bookingId ? parseInt(t.bookingId) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

/**
 * Hook to fetch transactions
 */
export function useTransactions(
  options: UseTransactionsOptions = {}
): UseTransactionsReturn {
  const { type = 'all', limit } = options;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Transaction[]>(`/api/transactions?type=${type}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 seconds
  });

  // Filter and limit transactions
  let filteredTransactions = data || [];

  if (type !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.type === type);
  }

  if (limit) {
    filteredTransactions = filteredTransactions.slice(0, limit);
  }

  // Calculate totals
  const credits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.value, 0);

  const debits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.value, 0);

  const balance = credits - debits;

  return {
    transactions: filteredTransactions,
    isLoading,
    isError: !!error,
    error: error || null,
    balance,
    credits,
    debits,
    mutate,
  };
}

/**
 * Hook to fetch account balance using Supabase
 */
export function useBalance(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR<number>(
    userId ? `/api/balance/${userId}` : null,
    async () => {
      try {
        const container = ServiceContainer.getInstance();
        const transactionService = container.getTransactionService();

        if (!userId) return 0;

        const balance = await transactionService.getUserBalance(userId);
        return balance;
      } catch (err) {
        console.error('Error fetching balance:', err);
        return 0;
      }
    },
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    balance: data || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
