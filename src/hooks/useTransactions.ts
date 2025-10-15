/**
 * Transactions Data Hook with SWR
 * Cached data fetching for financial transactions
 */

import useSWR from 'swr';

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

// Mock fetcher
const fetcher = async (url: string): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));

  return [
    { 
      id: 1,
      date: "10/10/2025", 
      description: "Reserva Quadra 1", 
      type: "debit", 
      value: 120,
      category: "Reserva",
    },
    { 
      id: 2,
      date: "08/10/2025", 
      description: "Convite João - Jogo 15/10", 
      type: "credit", 
      value: 15,
      category: "Convite",
    },
    { 
      id: 3,
      date: "05/10/2025", 
      description: "Bônus Indicação", 
      type: "credit", 
      value: 30,
      category: "Bônus",
    },
    { 
      id: 4,
      date: "03/10/2025", 
      description: "Reserva Quadra 2", 
      type: "debit", 
      value: 100,
      category: "Reserva",
    },
  ];
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
 * Hook to fetch account balance
 */
export function useBalance() {
  const { data, error, isLoading, mutate } = useSWR<number>(
    '/api/balance',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return 250; // Mock balance
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
