/**
 * Transactions Data Hook with SWR
 * Cached data fetching for financial transactions using TransactionService
 */

import useSWR from 'swr';
import { Transaction } from '../types';
import { serviceContainer } from '../core/config/ServiceContainer';
import { TransactionService } from '../core/services/transactions';

interface UseTransactionsOptions {
  userId?: string;
  type?: Transaction['type'] | 'all';
  limit?: number;
  refreshInterval?: number;
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

/**
 * Hook to fetch transactions
 */
export function useTransactions(
  options: UseTransactionsOptions = {}
): UseTransactionsReturn {
  const transactionService: TransactionService = serviceContainer.getTransactionService();
  const { userId, type = 'all', limit, refreshInterval = 0 } = options;

  const cacheKey = `/api/transactions?userId=${userId || 'all'}&type=${type}`;

  const fetcher = async () => {
    if (!userId) return [];

    if (type === 'all') {
      return transactionService.getUserTransactions(userId);
    } else {
      return transactionService.searchTransactions({ userId, type: type as Transaction['type'] });
    }
  };

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Transaction[]>(cacheKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    refreshInterval,
  });

  // Filter and limit transactions
  let filteredTransactions = data || [];

  if (limit) {
    filteredTransactions = filteredTransactions.slice(0, limit);
  }

  // Calculate totals
  const credits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const debits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

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
 * Hook to fetch account balance
 */
export function useBalance(userId?: string) {
  const transactionService: TransactionService = serviceContainer.getTransactionService();
  const cacheKey = userId ? `/api/balance/${userId}` : null;

  const fetcher = async () => {
    if (!userId) return 0;
    return transactionService.getBalance(userId);
  };

  const { data, error, isLoading, mutate } = useSWR<number>(
    cacheKey,
    fetcher,
    {
      refreshInterval: 60000,
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
