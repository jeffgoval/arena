/**
 * useOptimisticUI Hook
 * Gerencia updates otimistas com rollback automático
 */

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
}

interface UseOptimisticUIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, rollbackData: T) => void;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

/**
 * Hook para gerenciar UI optimista com rollback automático
 */
export function useOptimisticUI<T>(
  initialData: T,
  options: UseOptimisticUIOptions<T> = {}
) {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage = 'Erro ao salvar alterações',
    showToast = true,
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const previousDataRef = useRef<T>(initialData);
  const pendingUpdatesRef = useRef<OptimisticUpdate<T>[]>([]);

  /**
   * Atualiza com otimismo e executa ação async
   */
  const optimisticUpdate = useCallback(
    async (
      newData: T | ((prev: T) => T),
      asyncAction: () => Promise<void>
    ) => {
      // Salvar estado anterior
      previousDataRef.current = data;

      // Atualizar UI imediatamente
      const updatedData = typeof newData === 'function' ? newData(data) : newData;
      setData(updatedData);
      setIsOptimistic(true);

      // Adicionar à fila de updates pendentes
      const updateId = `${Date.now()}-${Math.random()}`;
      pendingUpdatesRef.current.push({
        id: updateId,
        data: updatedData,
        timestamp: Date.now(),
      });

      try {
        // Executar ação async
        await asyncAction();

        // Remover da fila de pendentes
        pendingUpdatesRef.current = pendingUpdatesRef.current.filter(
          u => u.id !== updateId
        );

        // Confirmar update
        setIsOptimistic(false);
        previousDataRef.current = updatedData;

        // Callbacks e toast
        onSuccess?.(updatedData);
        if (showToast && successMessage) {
          toast.success(successMessage);
        }
      } catch (error) {
        // Rollback em caso de erro
        setData(previousDataRef.current);
        setIsOptimistic(false);

        // Remover da fila
        pendingUpdatesRef.current = pendingUpdatesRef.current.filter(
          u => u.id !== updateId
        );

        // Callbacks e toast
        onError?.(error as Error, previousDataRef.current);
        if (showToast) {
          toast.error(errorMessage);
        }

        throw error;
      }
    },
    [data, onSuccess, onError, successMessage, errorMessage, showToast]
  );

  /**
   * Atualiza campo específico otimisticamente
   */
  const optimisticFieldUpdate = useCallback(
    async <K extends keyof T>(
      field: K,
      value: T[K],
      asyncAction: () => Promise<void>
    ) => {
      await optimisticUpdate(
        prev => ({ ...prev, [field]: value } as T),
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  /**
   * Reverte para estado anterior manualmente
   */
  const rollback = useCallback(() => {
    setData(previousDataRef.current);
    setIsOptimistic(false);
    pendingUpdatesRef.current = [];
  }, []);

  /**
   * Reseta para novo estado
   */
  const reset = useCallback((newData: T) => {
    setData(newData);
    previousDataRef.current = newData;
    setIsOptimistic(false);
    pendingUpdatesRef.current = [];
  }, []);

  return {
    data,
    isOptimistic,
    optimisticUpdate,
    optimisticFieldUpdate,
    rollback,
    reset,
    hasPendingUpdates: pendingUpdatesRef.current.length > 0,
  };
}

/**
 * Hook para lista com updates otimistas
 */
export function useOptimisticList<T extends { id: string | number }>(
  initialList: T[],
  options: UseOptimisticUIOptions<T[]> = {}
) {
  const {
    data: list,
    isOptimistic,
    optimisticUpdate,
    rollback,
    reset,
  } = useOptimisticUI<T[]>(initialList, options);

  /**
   * Adiciona item otimisticamente
   */
  const addItem = useCallback(
    async (item: T, asyncAction: () => Promise<void>) => {
      await optimisticUpdate(
        prev => [...prev, item],
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  /**
   * Remove item otimisticamente
   */
  const removeItem = useCallback(
    async (id: string | number, asyncAction: () => Promise<void>) => {
      await optimisticUpdate(
        prev => prev.filter(item => item.id !== id),
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  /**
   * Atualiza item otimisticamente
   */
  const updateItem = useCallback(
    async (
      id: string | number,
      updates: Partial<T>,
      asyncAction: () => Promise<void>
    ) => {
      await optimisticUpdate(
        prev => prev.map(item =>
          item.id === id ? { ...item, ...updates } : item
        ),
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  /**
   * Reordena lista otimisticamente
   */
  const reorderList = useCallback(
    async (
      fromIndex: number,
      toIndex: number,
      asyncAction: () => Promise<void>
    ) => {
      await optimisticUpdate(
        prev => {
          const newList = [...prev];
          const [removed] = newList.splice(fromIndex, 1);
          newList.splice(toIndex, 0, removed);
          return newList;
        },
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  return {
    list,
    isOptimistic,
    addItem,
    removeItem,
    updateItem,
    reorderList,
    rollback,
    reset,
  };
}

/**
 * Hook para toggle otimista (checkboxes, switches)
 */
export function useOptimisticToggle(
  initialValue: boolean,
  asyncAction: (value: boolean) => Promise<void>,
  options: Omit<UseOptimisticUIOptions<boolean>, 'onSuccess'> = {}
) {
  const [value, setValue] = useState(initialValue);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const previousValueRef = useRef(initialValue);

  const toggle = useCallback(async () => {
    // Salvar valor anterior
    previousValueRef.current = value;
    
    // Atualizar imediatamente
    const newValue = !value;
    setValue(newValue);
    setIsOptimistic(true);

    try {
      // Executar ação
      await asyncAction(newValue);
      
      // Confirmar
      setIsOptimistic(false);
      previousValueRef.current = newValue;

      if (options.showToast !== false && options.successMessage) {
        toast.success(options.successMessage);
      }
    } catch (error) {
      // Rollback
      setValue(previousValueRef.current);
      setIsOptimistic(false);

      options.onError?.(error as Error, previousValueRef.current);
      
      if (options.showToast !== false) {
        toast.error(options.errorMessage || 'Erro ao atualizar');
      }

      throw error;
    }
  }, [value, asyncAction, options]);

  return {
    value,
    isOptimistic,
    toggle,
    setValue,
  };
}

/**
 * Hook para contador otimista (likes, votos, etc)
 */
export function useOptimisticCounter(
  initialValue: number,
  options: UseOptimisticUIOptions<number> = {}
) {
  const {
    data: count,
    isOptimistic,
    optimisticUpdate,
    rollback,
    reset,
  } = useOptimisticUI<number>(initialValue, options);

  const increment = useCallback(
    async (asyncAction: () => Promise<void>) => {
      await optimisticUpdate(
        prev => prev + 1,
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  const decrement = useCallback(
    async (asyncAction: () => Promise<void>) => {
      await optimisticUpdate(
        prev => Math.max(0, prev - 1),
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  const set = useCallback(
    async (value: number, asyncAction: () => Promise<void>) => {
      await optimisticUpdate(
        value,
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  return {
    count,
    isOptimistic,
    increment,
    decrement,
    set,
    rollback,
    reset,
  };
}

/**
 * Hook para status otimista (aprovado, rejeitado, etc)
 */
export function useOptimisticStatus<T extends string>(
  initialStatus: T,
  options: UseOptimisticUIOptions<T> = {}
) {
  const {
    data: status,
    isOptimistic,
    optimisticUpdate,
    rollback,
    reset,
  } = useOptimisticUI<T>(initialStatus, options);

  const changeStatus = useCallback(
    async (newStatus: T, asyncAction: () => Promise<void>) => {
      await optimisticUpdate(
        newStatus,
        asyncAction
      );
    },
    [optimisticUpdate]
  );

  return {
    status,
    isOptimistic,
    changeStatus,
    rollback,
    reset,
  };
}
