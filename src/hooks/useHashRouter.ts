/**
 * useHashRouter Hook
 * Simple hash-based routing for the application
 */

import { useState, useEffect, useCallback } from 'react';
import { ROUTES, type Page } from '../config/routes';

/**
 * Get route from current hash
 */
function getRouteFromHash(defaultRoute: Page): Page {
  if (typeof window === 'undefined') {
    return defaultRoute;
  }
  
  const hash = window.location.hash.slice(1); // Remove '#'
  const route = hash.startsWith('/') ? hash.slice(1) : hash;
  
  // Check if route is valid
  const isValidRoute = Object.values(ROUTES).includes(route as Page);
  
  if (isValidRoute) {
    return route as Page;
  } else if (hash === '' || hash === '/') {
    return defaultRoute;
  } else {
    return ROUTES.NOT_FOUND;
  }
}

/**
 * Hook to manage hash-based routing
 * Allows navigation via URLs like /#/client-dashboard
 */
export function useHashRouter(defaultRoute: Page = ROUTES.LANDING) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return getRouteFromHash(defaultRoute);
  });

  /**
   * Navigate to a new page
   */
  const navigate = useCallback((page: Page, replace: boolean = false) => {
    if (typeof window === 'undefined') return;
    
    const newHash = `#/${page}`;
    
    if (replace) {
      window.location.replace(newHash);
    } else {
      window.location.hash = newHash;
    }
    
    setCurrentPage(page);
    
    // Scroll to top on navigation
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  /**
   * Listen to hash changes (back/forward buttons)
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleHashChange = () => {
      const newPage = getRouteFromHash(defaultRoute);
      setCurrentPage(newPage);
      if (window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Listen to hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Set initial hash if empty (only once on mount)
    const currentHash = window.location.hash;
    if (!currentHash || currentHash === '#' || currentHash === '#/') {
      window.history.replaceState(null, '', `#/${defaultRoute}`);
      setCurrentPage(defaultRoute);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [defaultRoute]);

  /**
   * Go back in history
   */
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  /**
   * Go forward in history
   */
  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  return {
    currentPage,
    navigate,
    goBack,
    goForward,
  };
}
