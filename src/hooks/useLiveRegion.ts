/**
 * Live Region Hook
 * Manages dynamic announcements for screen readers
 */

import { useCallback, useRef } from "react";
import { useAnnouncer } from "../components/A11yAnnouncer";

interface LiveRegionOptions {
  priority?: "polite" | "assertive";
  clearAfter?: number; // ms
}

/**
 * Hook for announcing dynamic content changes
 */
export function useLiveRegion() {
  const { announce: baseAnnounce } = useAnnouncer();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const announce = useCallback((
    message: string,
    options: LiveRegionOptions = {}
  ) => {
    const { priority = "polite", clearAfter = 5000 } = options;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Announce message
    baseAnnounce(message, priority);

    // Auto-clear if specified
    if (clearAfter > 0) {
      timeoutRef.current = setTimeout(() => {
        baseAnnounce("", priority);
      }, clearAfter);
    }
  }, [baseAnnounce]);

  const announcePolite = useCallback((message: string) => {
    announce(message, { priority: "polite" });
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, { priority: "assertive" });
  }, [announce]);

  const announceLoading = useCallback((message: string = "Carregando...") => {
    announce(message, { priority: "polite", clearAfter: 0 });
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Sucesso: ${message}`, { priority: "polite" });
  }, [announce]);

  const announceError = useCallback((message: string) => {
    announce(`Erro: ${message}`, { priority: "assertive" });
  }, [announce]);

  const announceProgress = useCallback((current: number, total: number, label?: string) => {
    const percentage = Math.round((current / total) * 100);
    const message = label 
      ? `${label}: ${percentage}% completo` 
      : `${percentage}% completo`;
    announce(message, { priority: "polite", clearAfter: 3000 });
  }, [announce]);

  return {
    announce,
    announcePolite,
    announceAssertive,
    announceLoading,
    announceSuccess,
    announceError,
    announceProgress,
  };
}

/**
 * Hook for status updates
 */
export function useStatusAnnouncer() {
  const { announcePolite } = useLiveRegion();

  const announceListUpdate = useCallback((
    itemCount: number,
    itemType: string = "itens"
  ) => {
    announcePolite(`Lista atualizada. ${itemCount} ${itemCount === 1 ? itemType.slice(0, -1) : itemType} encontrados.`);
  }, [announcePolite]);

  const announceFilterUpdate = useCallback((
    resultCount: number,
    filterName?: string
  ) => {
    const message = filterName
      ? `Filtro aplicado: ${filterName}. ${resultCount} resultados.`
      : `${resultCount} resultados encontrados.`;
    announcePolite(message);
  }, [announcePolite]);

  const announceSortUpdate = useCallback((
    sortBy: string,
    direction: "asc" | "desc" = "asc"
  ) => {
    const directionText = direction === "asc" ? "crescente" : "decrescente";
    announcePolite(`Lista ordenada por ${sortBy} em ordem ${directionText}.`);
  }, [announcePolite]);

  const announcePageChange = useCallback((
    currentPage: number,
    totalPages: number
  ) => {
    announcePolite(`Página ${currentPage} de ${totalPages}.`);
  }, [announcePolite]);

  const announceSearch = useCallback((
    query: string,
    resultCount: number
  ) => {
    announcePolite(`Busca por "${query}". ${resultCount} resultados encontrados.`);
  }, [announcePolite]);

  return {
    announceListUpdate,
    announceFilterUpdate,
    announceSortUpdate,
    announcePageChange,
    announceSearch,
  };
}
