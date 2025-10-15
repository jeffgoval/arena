/**
 * useURLState Hook
 * Gerencia estado na URL com query parameters e deep linking
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useHashRouter } from './useHashRouter';

export interface URLStateOptions<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  replace?: boolean; // Replace history instead of push
}

/**
 * Hook para sincronizar estado com URL query parameters
 */
export function useURLState<T>(
  options: URLStateOptions<T>
): [T, (value: T) => void, () => void] {
  const {
    key,
    defaultValue,
    serialize = (v) => JSON.stringify(v),
    deserialize = (v) => JSON.parse(v),
    replace = false,
  } = options;

  // Get initial value from URL
  const getURLValue = useCallback((): T => {
    if (typeof window === 'undefined') return defaultValue;

    const params = new URLSearchParams(window.location.search);
    const value = params.get(key);

    if (value === null) return defaultValue;

    try {
      return deserialize(value);
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue, deserialize]);

  const [state, setState] = useState<T>(getURLValue);

  // Update URL when state changes
  const updateURL = useCallback(
    (newValue: T) => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);

      if (newValue === defaultValue || newValue === null || newValue === undefined) {
        params.delete(key);
      } else {
        params.set(key, serialize(newValue));
      }

      const newSearch = params.toString();
      const newURL = newSearch
        ? `${window.location.pathname}${window.location.hash}?${newSearch}`
        : `${window.location.pathname}${window.location.hash}`;

      if (replace) {
        window.history.replaceState(null, '', newURL);
      } else {
        window.history.pushState(null, '', newURL);
      }

      setState(newValue);
    },
    [key, defaultValue, serialize, replace]
  );

  // Clear URL parameter
  const clearURLState = useCallback(() => {
    updateURL(defaultValue);
  }, [updateURL, defaultValue]);

  // Sync state with URL on popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setState(getURLValue());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getURLValue]);

  return [state, updateURL, clearURLState];
}

/**
 * Hook para gerenciar múltiplos estados na URL
 */
export function useURLParams<T extends Record<string, any>>(
  defaultValues: T
): {
  params: T;
  setParam: <K extends keyof T>(key: K, value: T[K]) => void;
  setParams: (updates: Partial<T>) => void;
  clearParam: (key: keyof T) => void;
  clearAll: () => void;
} {
  const getParams = useCallback((): T => {
    if (typeof window === 'undefined') return defaultValues;

    const urlParams = new URLSearchParams(window.location.search);
    const result: any = { ...defaultValues };

    Object.keys(defaultValues).forEach((key) => {
      const value = urlParams.get(key);
      if (value !== null) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    });

    return result;
  }, [defaultValues]);

  const [params, setParamsState] = useState<T>(getParams);

  const updateURL = useCallback(
    (newParams: T) => {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams();

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== defaultValues[key as keyof T]) {
          urlParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      });

      const newSearch = urlParams.toString();
      const newURL = newSearch
        ? `${window.location.pathname}${window.location.hash}?${newSearch}`
        : `${window.location.pathname}${window.location.hash}`;

      window.history.pushState(null, '', newURL);
      setParamsState(newParams);
    },
    [defaultValues]
  );

  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      updateURL({ ...params, [key]: value });
    },
    [params, updateURL]
  );

  const setParams = useCallback(
    (updates: Partial<T>) => {
      updateURL({ ...params, ...updates });
    },
    [params, updateURL]
  );

  const clearParam = useCallback(
    (key: keyof T) => {
      updateURL({ ...params, [key]: defaultValues[key] });
    },
    [params, updateURL, defaultValues]
  );

  const clearAll = useCallback(() => {
    updateURL(defaultValues);
  }, [updateURL, defaultValues]);

  // Sync with URL on popstate
  useEffect(() => {
    const handlePopState = () => {
      setParamsState(getParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getParams]);

  return {
    params,
    setParam,
    setParams,
    clearParam,
    clearAll,
  };
}

/**
 * Hook para deep linking - extrair e gerenciar dados da URL
 */
export function useDeepLink<T = any>() {
  const getDeepLinkData = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const data: any = {};

    params.forEach((value, key) => {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    });

    return Object.keys(data).length > 0 ? data : null;
  }, []);

  const [deepLinkData, setDeepLinkData] = useState<T | null>(getDeepLinkData);

  const createDeepLink = useCallback((data: Record<string, any>): string => {
    const params = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      params.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    });

    return `${window.location.origin}${window.location.pathname}${window.location.hash}?${params.toString()}`;
  }, []);

  const navigateToDeepLink = useCallback((data: Record<string, any>) => {
    const url = createDeepLink(data);
    window.history.pushState(null, '', url);
    setDeepLinkData(data as T);
  }, [createDeepLink]);

  useEffect(() => {
    const handlePopState = () => {
      setDeepLinkData(getDeepLinkData());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getDeepLinkData]);

  return {
    deepLinkData,
    createDeepLink,
    navigateToDeepLink,
    hasDeepLink: deepLinkData !== null,
  };
}

/**
 * Hook para construir URLs com query params de forma type-safe
 */
export function useURLBuilder() {
  const buildURL = useCallback((
    path: string,
    params?: Record<string, any>
  ): string => {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    const query = urlParams.toString();
    return query ? `${path}?${query}` : path;
  }, []);

  const parseURL = useCallback((url: string): {
    path: string;
    params: Record<string, any>;
  } => {
    const [path, search] = url.split('?');
    const params: Record<string, any> = {};

    if (search) {
      const urlParams = new URLSearchParams(search);
      urlParams.forEach((value, key) => {
        try {
          params[key] = JSON.parse(value);
        } catch {
          params[key] = value;
        }
      });
    }

    return { path, params };
  }, []);

  return {
    buildURL,
    parseURL,
  };
}
