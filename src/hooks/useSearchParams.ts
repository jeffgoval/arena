/**
 * Search Params Hook
 * Manage URL search parameters with React state
 */

import { useState, useCallback, useEffect } from 'react';

type SearchParamsValue = string | number | boolean | null | undefined;
type SearchParamsObject = Record<string, SearchParamsValue>;

export function useSearchParams(
  initialParams: SearchParamsObject = {}
): [URLSearchParams, (params: SearchParamsObject) => void] {
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(() => {
    if (typeof window === 'undefined') {
      return new URLSearchParams();
    }
    
    const params = new URLSearchParams(window.location.search);
    
    // Merge with initial params
    Object.entries(initialParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !params.has(key)) {
        params.set(key, String(value));
      }
    });
    
    return params;
  });

  // Sync with browser URL
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setSearchParams = useCallback((params: SearchParamsObject) => {
    if (typeof window === 'undefined') {
      return;
    }

    const newParams = new URLSearchParams(window.location.search);

    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Update URL without reload
    const newUrl = `${window.location.pathname}${
      newParams.toString() ? `?${newParams.toString()}` : ''
    }`;
    
    window.history.pushState({}, '', newUrl);
    setSearchParamsState(newParams);
  }, []);

  return [searchParams, setSearchParams];
}

/**
 * Hook para obter um parâmetro específico
 */
export function useSearchParam(
  key: string,
  defaultValue?: string
): [string | null, (value: SearchParamsValue) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = searchParams.get(key) || defaultValue || null;
  
  const setValue = useCallback(
    (newValue: SearchParamsValue) => {
      setSearchParams({ [key]: newValue });
    },
    [key, setSearchParams]
  );

  return [value, setValue];
}

/**
 * Parse query parameters to typed object
 */
export function parseSearchParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  schema: Record<keyof T, 'string' | 'number' | 'boolean'>
): Partial<T> {
  const result: Partial<T> = {};

  Object.entries(schema).forEach(([key, type]) => {
    const value = searchParams.get(key);
    
    if (value === null) return;

    switch (type) {
      case 'number':
        const num = Number(value);
        if (!isNaN(num)) {
          result[key as keyof T] = num as any;
        }
        break;
      case 'boolean':
        result[key as keyof T] = (value === 'true') as any;
        break;
      case 'string':
      default:
        result[key as keyof T] = value as any;
        break;
    }
  });

  return result;
}
