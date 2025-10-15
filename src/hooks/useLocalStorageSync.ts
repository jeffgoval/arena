/**
 * useLocalStorageSync Hook
 * Sincronização avançada com localStorage
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface StorageSyncOptions<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  syncAcrossTabs?: boolean;
  versioning?: boolean;
  onError?: (error: Error) => void;
  compress?: boolean;
}

interface VersionedData<T> {
  version: number;
  data: T;
  timestamp: number;
}

/**
 * Hook avançado para localStorage com sync entre tabs
 */
export function useLocalStorageSync<T>(
  options: StorageSyncOptions<T>
) {
  const {
    key,
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true,
    versioning = false,
    onError,
    compress = false,
  } = options;

  // Estado
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStoredValue(key, defaultValue, deserialize, versioning, onError);
  });

  const [isHydrated, setIsHydrated] = useState(false);
  const versionRef = useRef(1);

  /**
   * Setter que persiste no localStorage
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir atualização com função
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Atualizar estado
        setStoredValue(valueToStore);

        // Salvar no localStorage
        if (typeof window !== 'undefined') {
          if (versioning) {
            const versionedData: VersionedData<T> = {
              version: versionRef.current++,
              data: valueToStore,
              timestamp: Date.now(),
            };
            window.localStorage.setItem(key, serialize(versionedData as any));
          } else {
            window.localStorage.setItem(key, serialize(valueToStore));
          }

          // Disparar evento customizado para sync entre tabs
          if (syncAcrossTabs) {
            window.dispatchEvent(
              new CustomEvent('local-storage-sync', {
                detail: { key, value: valueToStore },
              })
            );
          }
        }
      } catch (error) {
        onError?.(error as Error);
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serialize, versioning, syncAcrossTabs, onError]
  );

  /**
   * Remover do localStorage
   */
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(defaultValue);
      }
    } catch (error) {
      onError?.(error as Error);
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue, onError]);

  /**
   * Atualizar campo específico (para objetos)
   */
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValue((prev) => ({ ...prev, [field]: value }));
    },
    [setValue]
  );

  /**
   * Verificar se chave existe
   */
  const hasValue = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(key) !== null;
  }, [key]);

  /**
   * Obter tamanho do valor em bytes
   */
  const getSize = useCallback((): number => {
    if (typeof window === 'undefined') return 0;
    const item = window.localStorage.getItem(key);
    return item ? new Blob([item]).size : 0;
  }, [key]);

  /**
   * Effect: Sync entre tabs
   */
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = versioning
            ? (deserialize(e.newValue) as VersionedData<T>).data
            : deserialize(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          onError?.(error as Error);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-sync', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-sync', handleCustomSync);
    };
  }, [key, deserialize, versioning, syncAcrossTabs, onError]);

  /**
   * Effect: Marcar como hidratado
   */
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    value: storedValue,
    setValue,
    removeValue,
    updateField,
    hasValue,
    getSize,
    isHydrated,
  };
}

/**
 * Helper: Obter valor armazenado
 */
function getStoredValue<T>(
  key: string,
  defaultValue: T,
  deserialize: (value: string) => T,
  versioning: boolean,
  onError?: (error: Error) => void
): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }

    const parsed = deserialize(item);
    
    if (versioning) {
      const versionedData = parsed as unknown as VersionedData<T>;
      return versionedData.data;
    }

    return parsed;
  } catch (error) {
    onError?.(error as Error);
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Hook para gerenciar múltiplas keys com namespace
 */
export function useLocalStorageNamespace(namespace: string) {
  const getKey = useCallback(
    (key: string) => `${namespace}:${key}`,
    [namespace]
  );

  const listKeys = useCallback((): string[] => {
    if (typeof window === 'undefined') return [];

    const keys: string[] = [];
    const prefix = `${namespace}:`;

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keys.push(key.substring(prefix.length));
      }
    }

    return keys;
  }, [namespace]);

  const clearNamespace = useCallback(() => {
    if (typeof window === 'undefined') return;

    const keys = listKeys();
    keys.forEach(key => {
      window.localStorage.removeItem(getKey(key));
    });
  }, [listKeys, getKey]);

  const getNamespaceSize = useCallback((): number => {
    if (typeof window === 'undefined') return 0;

    let totalSize = 0;
    const keys = listKeys();

    keys.forEach(key => {
      const item = window.localStorage.getItem(getKey(key));
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });

    return totalSize;
  }, [listKeys, getKey]);

  return {
    getKey,
    listKeys,
    clearNamespace,
    getNamespaceSize,
    count: listKeys().length,
  };
}

/**
 * Hook para monitorar quota do localStorage
 */
export function useLocalStorageQuota() {
  const [usage, setUsage] = useState(0);
  const [quota, setQuota] = useState(0);

  const calculateUsage = useCallback(() => {
    if (typeof window === 'undefined') return;

    let totalSize = 0;

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        const item = window.localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      }
    }

    setUsage(totalSize);

    // Estimate quota (usually 5-10MB)
    // Try to detect quota if possible
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setQuota(estimate.quota || 10 * 1024 * 1024); // Default 10MB
      });
    } else {
      setQuota(10 * 1024 * 1024); // Default 10MB
    }
  }, []);

  useEffect(() => {
    calculateUsage();
  }, [calculateUsage]);

  return {
    usage,
    quota,
    usagePercent: quota > 0 ? (usage / quota) * 100 : 0,
    remaining: quota - usage,
    refresh: calculateUsage,
  };
}

/**
 * Hook para limpar dados antigos do localStorage
 */
export function useLocalStorageCleanup() {
  const cleanupByAge = useCallback((maxAge: number = 30 * 24 * 60 * 60 * 1000) => {
    if (typeof window === 'undefined') return 0;

    const now = Date.now();
    let cleaned = 0;

    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (!key) continue;

      try {
        const item = window.localStorage.getItem(key);
        if (!item) continue;

        const parsed = JSON.parse(item);
        
        // Check if it's versioned data with timestamp
        if (parsed.timestamp && typeof parsed.timestamp === 'number') {
          const age = now - parsed.timestamp;
          if (age > maxAge) {
            window.localStorage.removeItem(key);
            cleaned++;
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    return cleaned;
  }, []);

  const cleanupByPattern = useCallback((pattern: RegExp) => {
    if (typeof window === 'undefined') return 0;

    let cleaned = 0;

    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (key && pattern.test(key)) {
        window.localStorage.removeItem(key);
        cleaned++;
      }
    }

    return cleaned;
  }, []);

  const cleanupAll = useCallback(() => {
    if (typeof window === 'undefined') return;
    const count = window.localStorage.length;
    window.localStorage.clear();
    return count;
  }, []);

  return {
    cleanupByAge,
    cleanupByPattern,
    cleanupAll,
  };
}
