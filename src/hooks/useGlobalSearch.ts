/**
 * useGlobalSearch Hook
 * Sistema de busca global com histórico e relevância
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { usePersistedState } from './usePersistedState';

export interface SearchResult {
  id: string;
  type: 'booking' | 'court' | 'user' | 'team' | 'transaction' | 'page';
  title: string;
  description?: string;
  subtitle?: string;
  url?: string;
  icon?: string;
  metadata?: Record<string, any>;
  score?: number; // Relevance score
}

interface SearchHistory {
  query: string;
  timestamp: number;
  results: number;
}

interface UseGlobalSearchOptions {
  debounceMs?: number;
  maxHistory?: number;
  minQueryLength?: number;
  searchFn?: (query: string) => Promise<SearchResult[]>;
}

/**
 * Hook para busca global com histórico e relevância
 */
export function useGlobalSearch(options: UseGlobalSearchOptions = {}) {
  const {
    debounceMs = 300,
    maxHistory = 10,
    minQueryLength = 2,
    searchFn,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Histórico de buscas (persistido)
  const [searchHistory, setSearchHistory] = usePersistedState<SearchHistory[]>(
    'search-history',
    []
  );

  // Debounce da query
  const debouncedQuery = useDebounce(query, debounceMs);

  /**
   * Função de busca padrão (busca local em mock data)
   */
  const defaultSearchFn = useCallback(
    async (searchQuery: string): Promise<SearchResult[]> => {
      // Simular busca em diferentes tipos de dados
      const mockResults: SearchResult[] = [
        // Bookings
        {
          id: 'booking-1',
          type: 'booking',
          title: 'Reserva Quadra 1 - 15/10',
          description: 'Quinta-feira às 19:00',
          subtitle: 'Confirmada',
          url: '/meus-jogos',
          score: 10,
        },
        // Courts
        {
          id: 'court-1',
          type: 'court',
          title: 'Quadra Society',
          description: 'Grama sintética, 40x20m',
          url: '/reservar',
          score: 8,
        },
        // Users
        {
          id: 'user-1',
          type: 'user',
          title: 'João Silva',
          description: 'Cliente Premium',
          subtitle: 'joao@email.com',
          score: 6,
        },
        // Teams
        {
          id: 'team-1',
          type: 'team',
          title: 'Time dos Amigos',
          description: '8 membros',
          url: '/turmas',
          score: 7,
        },
        // Pages
        {
          id: 'page-transactions',
          type: 'page',
          title: 'Histórico de Transações',
          description: 'Ver todas as transações',
          url: '/transacoes',
          score: 5,
        },
      ];

      // Filtrar por query
      const lowerQuery = searchQuery.toLowerCase();
      return mockResults
        .filter(
          (item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery) ||
            item.subtitle?.toLowerCase().includes(lowerQuery)
        )
        .map((item) => ({
          ...item,
          score: calculateRelevanceScore(item, searchQuery),
        }))
        .sort((a, b) => (b.score || 0) - (a.score || 0));
    },
    []
  );

  /**
   * Calcular score de relevância
   */
  const calculateRelevanceScore = useCallback(
    (result: SearchResult, searchQuery: string): number => {
      let score = 0;
      const lowerQuery = searchQuery.toLowerCase();

      // Título exato: +20 pontos
      if (result.title.toLowerCase() === lowerQuery) {
        score += 20;
      }
      // Título começa com query: +15 pontos
      else if (result.title.toLowerCase().startsWith(lowerQuery)) {
        score += 15;
      }
      // Título contém query: +10 pontos
      else if (result.title.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      // Description match: +5 pontos
      if (result.description?.toLowerCase().includes(lowerQuery)) {
        score += 5;
      }

      // Subtitle match: +3 pontos
      if (result.subtitle?.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }

      // Tipo prioritário (bookings e courts): +5 pontos
      if (result.type === 'booking' || result.type === 'court') {
        score += 5;
      }

      // Score base do item
      score += result.score || 0;

      return score;
    },
    []
  );

  /**
   * Executar busca
   */
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchResults = searchFn
          ? await searchFn(searchQuery)
          : await defaultSearchFn(searchQuery);

        setResults(searchResults);

        // Adicionar ao histórico
        if (searchResults.length > 0) {
          setSearchHistory((prev) => {
            const newHistory: SearchHistory = {
              query: searchQuery,
              timestamp: Date.now(),
              results: searchResults.length,
            };

            // Remove duplicatas e mantém apenas maxHistory items
            const filtered = prev.filter((h) => h.query !== searchQuery);
            return [newHistory, ...filtered].slice(0, maxHistory);
          });
        }
      } catch (err) {
        setError(err as Error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchFn, defaultSearchFn, minQueryLength, maxHistory, setSearchHistory]
  );

  /**
   * Effect para executar busca quando query muda
   */
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, performSearch]);

  /**
   * Limpar histórico
   */
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  /**
   * Remover item do histórico
   */
  const removeFromHistory = useCallback(
    (queryToRemove: string) => {
      setSearchHistory((prev) => prev.filter((h) => h.query !== queryToRemove));
    },
    [setSearchHistory]
  );

  /**
   * Sugestões baseadas no histórico
   */
  const suggestions = useMemo(() => {
    return searchHistory.slice(0, 5).map((h) => h.query);
  }, [searchHistory]);

  /**
   * Estatísticas de busca
   */
  const stats = useMemo(() => {
    return {
      totalSearches: searchHistory.length,
      averageResults:
        searchHistory.reduce((sum, h) => sum + h.results, 0) /
          searchHistory.length || 0,
      mostSearched: searchHistory.reduce(
        (acc, h) => {
          acc[h.query] = (acc[h.query] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }, [searchHistory]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    searchHistory,
    suggestions,
    stats,
    clearHistory,
    removeFromHistory,
    performSearch,
    hasResults: results.length > 0,
    isEmpty: !query || query.length < minQueryLength,
  };
}

/**
 * Hook para busca com filtros
 */
export function useFilteredSearch<T>(
  items: T[],
  searchableFields: (keyof T)[],
  options: {
    caseSensitive?: boolean;
    fuzzy?: boolean;
  } = {}
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;

    const lowerQuery = options.caseSensitive
      ? debouncedQuery
      : debouncedQuery.toLowerCase();

    return items.filter((item) => {
      return searchableFields.some((field) => {
        const value = String(item[field] || '');
        const searchValue = options.caseSensitive ? value : value.toLowerCase();
        
        if (options.fuzzy) {
          // Fuzzy search (permite erros de digitação)
          return fuzzyMatch(searchValue, lowerQuery);
        }
        
        return searchValue.includes(lowerQuery);
      });
    });
  }, [items, debouncedQuery, searchableFields, options]);

  return {
    query,
    setQuery,
    filteredItems,
    isFiltering: query.length > 0,
  };
}

/**
 * Fuzzy matching simples
 */
function fuzzyMatch(str: string, pattern: string): boolean {
  let patternIdx = 0;
  let strIdx = 0;

  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }

  return patternIdx === pattern.length;
}

/**
 * Hook para busca em tempo real (typeahead)
 */
export function useTypeahead<T>(
  fetchFn: (query: string) => Promise<T[]>,
  options: {
    debounceMs?: number;
    minQueryLength?: number;
  } = {}
) {
  const { debounceMs = 300, minQueryLength = 2 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (debouncedQuery.length < minQueryLength) {
      setResults([]);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    fetchFn(debouncedQuery)
      .then((data) => {
        if (!cancelled) {
          setResults(data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, minQueryLength, fetchFn]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasResults: results.length > 0,
  };
}
