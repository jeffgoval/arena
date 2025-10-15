/**
 * Persisted State Hook
 * useState with automatic localStorage sync
 */

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Get initial value from localStorage or use provided initial value
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error loading persisted state for key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving persisted state for key "${key}":`, error);
    }
  }, [key, state]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setState(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [state, setState];
}

/**
 * Session Storage variant
 */
export function useSessionState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error loading session state for key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving session state for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

/**
 * Clear persisted data
 */
export function clearPersistedState(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing persisted state for key "${key}":`, error);
  }
}

/**
 * Get all persisted keys
 */
export function getPersistedKeys(prefix?: string): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const keys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (!prefix || key.startsWith(prefix))) {
      keys.push(key);
    }
  }

  return keys;
}
