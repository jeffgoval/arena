/**
 * useContextualTooltip Hook
 * Sistema de tooltips contextuais que aparecem baseado em uso
 */

import { useState, useCallback, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';

interface TooltipConfig {
  id: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showOnce?: boolean; // Show only on first time
  showAfter?: number; // Show after N milliseconds
  dismissible?: boolean;
}

/**
 * Hook para gerenciar tooltip contextual
 */
export function useContextualTooltip(config: TooltipConfig) {
  const {
    id,
    content,
    placement = 'top',
    showOnce = true,
    showAfter = 1000,
    dismissible = true,
  } = config;

  const [seenTooltips, setSeenTooltips] = usePersistedState<string[]>(
    'seen-tooltips',
    []
  );

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen] = useState(() => seenTooltips.includes(id));

  /**
   * Mostrar tooltip
   */
  const show = useCallback(() => {
    if (showOnce && hasBeenSeen) return;

    setTimeout(() => {
      setIsVisible(true);
    }, showAfter);
  }, [showOnce, hasBeenSeen, showAfter]);

  /**
   * Esconder tooltip
   */
  const hide = useCallback(() => {
    setIsVisible(false);
    if (showOnce && !hasBeenSeen) {
      setSeenTooltips((prev) => [...prev, id]);
    }
  }, [showOnce, hasBeenSeen, id, setSeenTooltips]);

  /**
   * Toggle tooltip
   */
  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  return {
    isVisible,
    show,
    hide,
    toggle,
    hasBeenSeen,
    content,
    placement,
    dismissible,
  };
}

/**
 * Hook para gerenciar tooltips em grupo
 */
export function useTooltipGroup(tooltips: TooltipConfig[]) {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const showTooltip = useCallback((id: string) => {
    setActiveTooltipId(id);
  }, []);

  const hideTooltip = useCallback(() => {
    setActiveTooltipId(null);
  }, []);

  const hideAllTooltips = useCallback(() => {
    setActiveTooltipId(null);
  }, []);

  return {
    activeTooltipId,
    showTooltip,
    hideTooltip,
    hideAllTooltips,
    isTooltipActive: (id: string) => activeTooltipId === id,
  };
}
