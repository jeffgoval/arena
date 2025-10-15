/**
 * useNavigationHistory Hook
 * Gerenciamento avançado de histórico de navegação
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePersistedState } from './usePersistedState';
import { type Page } from '../config/routes';

export interface NavigationEntry {
  page: Page;
  timestamp: number;
  params?: Record<string, any>;
  scrollPosition?: number;
  title?: string;
}

interface NavigationHistoryOptions {
  maxHistory?: number;
  persistKey?: string;
  trackScrollPosition?: boolean;
}

/**
 * Hook para gerenciar histórico de navegação
 */
export function useNavigationHistory(options: NavigationHistoryOptions = {}) {
  const {
    maxHistory = 50,
    persistKey,
    trackScrollPosition = true,
  } = options;

  // Use persisted state if key provided
  const [history, setHistory] = persistKey
    ? usePersistedState<NavigationEntry[]>(persistKey, [])
    : useState<NavigationEntry[]>([]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const isNavigatingRef = useRef(false);

  /**
   * Add entry to history
   */
  const pushHistory = useCallback(
    (entry: Omit<NavigationEntry, 'timestamp'>) => {
      if (isNavigatingRef.current) return;

      const newEntry: NavigationEntry = {
        ...entry,
        timestamp: Date.now(),
        scrollPosition: trackScrollPosition ? window.scrollY : undefined,
      };

      setHistory((prev) => {
        // Remove forward history if navigating from middle
        const newHistory = currentIndex < prev.length - 1
          ? prev.slice(0, currentIndex + 1)
          : prev;

        // Add new entry
        const updated = [...newHistory, newEntry];

        // Limit history size
        if (updated.length > maxHistory) {
          return updated.slice(-maxHistory);
        }

        return updated;
      });

      setCurrentIndex((prev) => Math.min(prev + 1, maxHistory - 1));
    },
    [currentIndex, maxHistory, trackScrollPosition]
  );

  /**
   * Navigate back in history
   */
  const goBack = useCallback(() => {
    if (currentIndex <= 0) return null;

    isNavigatingRef.current = true;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);

    return history[newIndex];
  }, [currentIndex, history]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback(() => {
    if (currentIndex >= history.length - 1) return null;

    isNavigatingRef.current = true;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);

    return history[newIndex];
  }, [currentIndex, history]);

  /**
   * Navigate to specific index
   */
  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= history.length) return null;

      isNavigatingRef.current = true;
      setCurrentIndex(index);

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);

      return history[index];
    },
    [history]
  );

  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, [setHistory]);

  /**
   * Get current entry
   */
  const currentEntry = history[currentIndex] || null;

  /**
   * Check if can go back/forward
   */
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  /**
   * Get recent history (last N entries)
   */
  const getRecentHistory = useCallback(
    (count: number = 10) => {
      return history.slice(-count);
    },
    [history]
  );

  /**
   * Get history by page
   */
  const getHistoryByPage = useCallback(
    (page: Page) => {
      return history.filter((entry) => entry.page === page);
    },
    [history]
  );

  /**
   * Get most visited pages
   */
  const getMostVisited = useCallback(
    (count: number = 5) => {
      const pageCounts = history.reduce(
        (acc, entry) => {
          acc[entry.page] = (acc[entry.page] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return Object.entries(pageCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count)
        .map(([page, count]) => ({ page: page as Page, count }));
    },
    [history]
  );

  return {
    history,
    currentEntry,
    currentIndex,
    pushHistory,
    goBack,
    goForward,
    goToIndex,
    clearHistory,
    canGoBack,
    canGoForward,
    getRecentHistory,
    getHistoryByPage,
    getMostVisited,
    historyLength: history.length,
  };
}

/**
 * Hook para breadcrumbs dinâmicos baseados no histórico
 */
export function useBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ label: string; page: Page; params?: Record<string, any> }>
  >([]);

  const addBreadcrumb = useCallback(
    (label: string, page: Page, params?: Record<string, any>) => {
      setBreadcrumbs((prev) => {
        // Check if page already exists in breadcrumbs
        const existingIndex = prev.findIndex((b) => b.page === page);
        
        if (existingIndex >= 0) {
          // Navigate back to existing page (remove everything after)
          return prev.slice(0, existingIndex + 1);
        }

        // Add new breadcrumb
        return [...prev, { label, page, params }];
      });
    },
    []
  );

  const removeBreadcrumb = useCallback((index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  return {
    breadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs,
  };
}

/**
 * Hook para rastrear página anterior
 */
export function usePreviousPage() {
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  const updatePage = useCallback((page: Page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  }, [currentPage]);

  return {
    previousPage,
    currentPage,
    updatePage,
    hasPreviousPage: previousPage !== null,
  };
}

/**
 * Hook para detectar navegação para trás
 */
export function useBackNavigation(callback: () => void) {
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Check if navigating backwards
      if (e.state?.navigationDirection === 'back') {
        callback();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [callback]);
}

/**
 * Hook para scroll restoration
 */
export function useScrollRestoration() {
  const scrollPositions = useRef<Map<string, number>>(new Map());

  const saveScrollPosition = useCallback((key: string) => {
    scrollPositions.current.set(key, window.scrollY);
  }, []);

  const restoreScrollPosition = useCallback(
    (key: string, behavior: ScrollBehavior = 'auto') => {
      const position = scrollPositions.current.get(key);
      if (position !== undefined) {
        window.scrollTo({
          top: position,
          behavior,
        });
      }
    },
    []
  );

  const clearScrollPosition = useCallback((key: string) => {
    scrollPositions.current.delete(key);
  }, []);

  const clearAllScrollPositions = useCallback(() => {
    scrollPositions.current.clear();
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    clearAllScrollPositions,
  };
}
