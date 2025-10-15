/**
 * ContextualTooltip Component
 * Tooltips que aparecem baseados em contexto e uso
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle } from 'lucide-react';
import { cn } from '../ui/utils';
import { useContextualTooltip } from '../../hooks/useContextualTooltip';

interface ContextualTooltipProps {
  id: string;
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showOnce?: boolean;
  showAfter?: number;
  dismissible?: boolean;
  trigger?: 'hover' | 'click' | 'auto';
  className?: string;
}

/**
 * Contextual Tooltip Component
 */
export function ContextualTooltip({
  id,
  content,
  children,
  placement = 'top',
  showOnce = true,
  showAfter = 1000,
  dismissible = true,
  trigger = 'auto',
  className,
}: ContextualTooltipProps) {
  const {
    isVisible,
    show,
    hide,
    toggle,
    hasBeenSeen,
  } = useContextualTooltip({
    id,
    content,
    placement,
    showOnce,
    showAfter,
    dismissible,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Auto-show on mount
  useEffect(() => {
    if (trigger === 'auto') {
      show();
    }
  }, [trigger, show]);

  // Calculate position
  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 250; // Approximate
      const tooltipHeight = 80; // Approximate
      const offset = 8;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top - tooltipHeight - offset;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + offset;
          break;
      }

      setPosition({ top, left });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, placement]);

  // Handle trigger events
  const handleMouseEnter = () => {
    if (trigger === 'hover') show();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') hide();
  };

  const handleClick = () => {
    if (trigger === 'click') toggle();
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn('relative inline-block', className)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'fixed z-50 w-64',
              'bg-popover text-popover-foreground',
              'border rounded-lg shadow-lg p-3'
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 text-sm">{content}</div>
              {dismissible && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hide();
                  }}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-popover border',
                placement === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 rotate-45 border-t-0 border-l-0',
                placement === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 rotate-45 border-b-0 border-r-0',
                placement === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 rotate-45 border-t-0 border-r-0',
                placement === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 rotate-45 border-b-0 border-l-0'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Inline Help Tooltip
 */
interface InlineHelpProps {
  content: string;
  id?: string;
  className?: string;
}

export function InlineHelp({ content, id, className }: InlineHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('inline-flex items-center', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted transition-colors"
        aria-label="Ajuda"
      >
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute z-50 mt-2 w-64',
              'bg-popover text-popover-foreground',
              'border rounded-lg shadow-lg p-3 text-sm'
            )}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">{content}</div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Feature Highlight Tooltip
 */
interface FeatureHighlightProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  showOnce?: boolean;
  badge?: string;
}

export function FeatureHighlight({
  id,
  title,
  description,
  children,
  showOnce = true,
  badge = 'Novo',
}: FeatureHighlightProps) {
  const {
    isVisible,
    hide,
    hasBeenSeen,
  } = useContextualTooltip({
    id,
    content: description,
    showOnce,
    showAfter: 500,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  if (hasBeenSeen && showOnce) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative">
      {children}

      {/* Badge */}
      {!hasBeenSeen && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={cn(
              'absolute top-full left-0 mt-2 z-50',
              'w-72 bg-primary text-primary-foreground',
              'rounded-lg shadow-xl p-4'
            )}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-foreground/20 text-xs font-medium mb-2">
              {badge}
            </div>

            {/* Content */}
            <h4 className="font-semibold mb-1">{title}</h4>
            <p className="text-sm opacity-90 mb-3">{description}</p>

            {/* Action */}
            <button
              onClick={hide}
              className="text-sm underline hover:no-underline"
            >
              Entendi
            </button>

            {/* Close */}
            <button
              onClick={hide}
              className="absolute top-2 right-2 p-1 rounded hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Arrow */}
            <div className="absolute bottom-full left-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
