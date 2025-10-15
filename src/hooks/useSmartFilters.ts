/**
 * useSmartFilters Hook
 * Sistema de filtros inteligentes com múltiplos critérios
 */

import { useState, useCallback, useMemo } from 'react';
import { usePersistedState } from './usePersistedState';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
  icon?: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'toggle' | 'checkbox';
  options?: FilterOption[];
  defaultValue?: any;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface ActiveFilter {
  filterId: string;
  value: any;
  label?: string;
}

interface UseSmartFiltersOptions {
  persistKey?: string;
  onFilterChange?: (filters: ActiveFilter[]) => void;
}

/**
 * Hook para gerenciar filtros inteligentes
 */
export function useSmartFilters(
  configs: FilterConfig[],
  options: UseSmartFiltersOptions = {}
) {
  const { persistKey, onFilterChange } = options;

  // Active filters (com persistência opcional)
  const [activeFilters, setActiveFilters] = persistKey
    ? usePersistedState<ActiveFilter[]>(persistKey, [])
    : useState<ActiveFilter[]>([]);

  /**
   * Adicionar/atualizar filtro
   */
  const setFilter = useCallback(
    (filterId: string, value: any, label?: string) => {
      setActiveFilters((prev) => {
        const filtered = prev.filter((f) => f.filterId !== filterId);
        
        // Não adiciona se valor for vazio
        if (value === null || value === undefined || value === '') {
          return filtered;
        }

        const newFilters = [...filtered, { filterId, value, label }];
        onFilterChange?.(newFilters);
        return newFilters;
      });
    },
    [setActiveFilters, onFilterChange]
  );

  /**
   * Remover filtro
   */
  const removeFilter = useCallback(
    (filterId: string) => {
      setActiveFilters((prev) => {
        const newFilters = prev.filter((f) => f.filterId !== filterId);
        onFilterChange?.(newFilters);
        return newFilters;
      });
    },
    [setActiveFilters, onFilterChange]
  );

  /**
   * Limpar todos os filtros
   */
  const clearFilters = useCallback(() => {
    setActiveFilters([]);
    onFilterChange?.([]);
  }, [setActiveFilters, onFilterChange]);

  /**
   * Toggle filtro (para checkboxes e toggles)
   */
  const toggleFilter = useCallback(
    (filterId: string, value: any, label?: string) => {
      setActiveFilters((prev) => {
        const existing = prev.find((f) => f.filterId === filterId);
        
        if (existing && existing.value === value) {
          // Remove se já existe
          const newFilters = prev.filter((f) => f.filterId !== filterId);
          onFilterChange?.(newFilters);
          return newFilters;
        } else {
          // Adiciona/atualiza
          const filtered = prev.filter((f) => f.filterId !== filterId);
          const newFilters = [...filtered, { filterId, value, label }];
          onFilterChange?.(newFilters);
          return newFilters;
        }
      });
    },
    [setActiveFilters, onFilterChange]
  );

  /**
   * Obter valor de um filtro
   */
  const getFilterValue = useCallback(
    (filterId: string) => {
      return activeFilters.find((f) => f.filterId === filterId)?.value;
    },
    [activeFilters]
  );

  /**
   * Verificar se filtro está ativo
   */
  const isFilterActive = useCallback(
    (filterId: string) => {
      return activeFilters.some((f) => f.filterId === filterId);
    },
    [activeFilters]
  );

  /**
   * Obter configuração de um filtro
   */
  const getFilterConfig = useCallback(
    (filterId: string) => {
      return configs.find((c) => c.id === filterId);
    },
    [configs]
  );

  /**
   * Contar filtros ativos
   */
  const activeCount = useMemo(() => {
    return activeFilters.length;
  }, [activeFilters]);

  /**
   * Verificar se tem filtros ativos
   */
  const hasActiveFilters = useMemo(() => {
    return activeFilters.length > 0;
  }, [activeFilters]);

  /**
   * Obter labels dos filtros ativos
   */
  const activeFilterLabels = useMemo(() => {
    return activeFilters
      .map((f) => {
        const config = configs.find((c) => c.id === f.filterId);
        return f.label || config?.label || f.filterId;
      })
      .filter(Boolean);
  }, [activeFilters, configs]);

  return {
    activeFilters,
    activeCount,
    hasActiveFilters,
    activeFilterLabels,
    setFilter,
    removeFilter,
    clearFilters,
    toggleFilter,
    getFilterValue,
    isFilterActive,
    getFilterConfig,
  };
}

/**
 * Hook para filtrar array de items com múltiplos critérios
 */
export function useFilterItems<T>(
  items: T[],
  activeFilters: ActiveFilter[],
  filterFn: (item: T, filter: ActiveFilter) => boolean
) {
  return useMemo(() => {
    if (activeFilters.length === 0) return items;

    return items.filter((item) => {
      return activeFilters.every((filter) => filterFn(item, filter));
    });
  }, [items, activeFilters, filterFn]);
}

/**
 * Hook para filtros pré-definidos comuns
 */
export function useCommonFilters() {
  // Status filter
  const statusFilter: FilterConfig = {
    id: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { id: 'pending', label: 'Pendente', value: 'pending' },
      { id: 'confirmed', label: 'Confirmada', value: 'confirmed' },
      { id: 'cancelled', label: 'Cancelada', value: 'cancelled' },
      { id: 'completed', label: 'Concluída', value: 'completed' },
    ],
  };

  // Date range filter
  const dateRangeFilter: FilterConfig = {
    id: 'dateRange',
    label: 'Período',
    type: 'date',
  };

  // Court filter
  const courtFilter: FilterConfig = {
    id: 'court',
    label: 'Quadra',
    type: 'multiselect',
    options: [
      { id: 'court-1', label: 'Quadra Society', value: 'court-1' },
      { id: 'court-2', label: 'Quadra Arena', value: 'court-2' },
      { id: 'court-3', label: 'Quadra Beach', value: 'court-3' },
    ],
  };

  // Price range filter
  const priceRangeFilter: FilterConfig = {
    id: 'priceRange',
    label: 'Faixa de Preço',
    type: 'range',
    min: 0,
    max: 500,
  };

  // Payment status filter
  const paymentStatusFilter: FilterConfig = {
    id: 'paymentStatus',
    label: 'Pagamento',
    type: 'multiselect',
    options: [
      { id: 'paid', label: 'Pago', value: 'paid' },
      { id: 'pending', label: 'Pendente', value: 'pending' },
      { id: 'cancelled', label: 'Cancelado', value: 'cancelled' },
    ],
  };

  // Time of day filter
  const timeOfDayFilter: FilterConfig = {
    id: 'timeOfDay',
    label: 'Período do Dia',
    type: 'multiselect',
    options: [
      { id: 'morning', label: 'Manhã (6h-12h)', value: 'morning' },
      { id: 'afternoon', label: 'Tarde (12h-18h)', value: 'afternoon' },
      { id: 'evening', label: 'Noite (18h-23h)', value: 'evening' },
    ],
  };

  return {
    statusFilter,
    dateRangeFilter,
    courtFilter,
    priceRangeFilter,
    paymentStatusFilter,
    timeOfDayFilter,
  };
}

/**
 * Hook para salvar filtros favoritos
 */
export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = usePersistedState<
    Array<{
      id: string;
      name: string;
      filters: ActiveFilter[];
      createdAt: number;
    }>
  >('saved-filters', []);

  const saveFilters = useCallback(
    (name: string, filters: ActiveFilter[]) => {
      setSavedFilters((prev) => [
        ...prev,
        {
          id: `filter-${Date.now()}`,
          name,
          filters,
          createdAt: Date.now(),
        },
      ]);
    },
    [setSavedFilters]
  );

  const deleteSavedFilter = useCallback(
    (id: string) => {
      setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    },
    [setSavedFilters]
  );

  const loadSavedFilter = useCallback(
    (id: string) => {
      return savedFilters.find((f) => f.id === id)?.filters || [];
    },
    [savedFilters]
  );

  return {
    savedFilters,
    saveFilters,
    deleteSavedFilter,
    loadSavedFilter,
  };
}
