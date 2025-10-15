/**
 * Navigation Components
 * Componentes visuais para navegação avançada
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowLeft,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { useNavigationHistory, useBreadcrumbs } from '../../hooks/useNavigationHistory';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { type Page } from '../../config/routes';

/**
 * Back Button Component
 */
interface BackButtonProps {
  onBack?: () => void;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function BackButton({
  onBack,
  label = 'Voltar',
  showLabel = true,
  className,
}: BackButtonProps) {
  const { goBack, canGoBack } = useNavigationHistory();

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  if (!canGoBack && !onBack) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn('gap-2', className)}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4" />
      {showLabel && <span>{label}</span>}
    </Button>
  );
}

/**
 * Navigation Breadcrumbs
 */
interface BreadcrumbsProps {
  items: Array<{
    label: string;
    page: Page;
    params?: Record<string, any>;
  }>;
  onNavigate: (page: Page, params?: Record<string, any>) => void;
  maxItems?: number;
  className?: string;
}

export function Breadcrumbs({
  items,
  onNavigate,
  maxItems = 5,
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  // Show only last N items if too many
  const displayItems = items.length > maxItems
    ? [items[0], ...items.slice(-(maxItems - 1))]
    : items;

  const showEllipsis = items.length > maxItems;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm', className)}
    >
      <ol className="flex items-center gap-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.page}-${index}`} className="flex items-center gap-2">
              {/* Ellipsis */}
              {showEllipsis && isFirst && displayItems.length > 1 && (
                <>
                  <button
                    onClick={() => onNavigate(item.page, item.params)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </>
              )}

              {/* Regular item */}
              {(!showEllipsis || !isFirst || displayItems.length === 1) && (
                <>
                  {isLast ? (
                    <span
                      className="font-medium text-foreground"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onNavigate(item.page, item.params)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Navigation History Dropdown
 */
interface NavigationHistoryDropdownProps {
  onNavigate: (page: Page) => void;
  className?: string;
}

export function NavigationHistoryDropdown({
  onNavigate,
  className,
}: NavigationHistoryDropdownProps) {
  const { getRecentHistory } = useNavigationHistory();
  const recentHistory = getRecentHistory(10);

  if (recentHistory.length === 0) return null;

  return (
    <div className={cn('p-2 space-y-1', className)}>
      <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">
        Histórico Recente
      </h3>
      {recentHistory.reverse().map((entry, index) => (
        <button
          key={`${entry.page}-${entry.timestamp}-${index}`}
          onClick={() => onNavigate(entry.page)}
          className={cn(
            'w-full text-left px-2 py-1.5 rounded-md',
            'hover:bg-muted transition-colors',
            'text-sm truncate'
          )}
        >
          {entry.title || entry.page}
        </button>
      ))}
    </div>
  );
}

/**
 * Swipe Navigation Indicator
 */
interface SwipeIndicatorProps {
  direction: 'left' | 'right';
  progress: number; // 0 to 1
  className?: string;
}

export function SwipeIndicator({
  direction,
  progress,
  className,
}: SwipeIndicatorProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const position = direction === 'left' ? 'left-4' : 'right-4';

  if (progress === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: progress }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-50',
        position,
        className
      )}
    >
      <div
        className={cn(
          'p-4 rounded-full',
          'bg-primary/10 backdrop-blur-sm',
          'border-2 border-primary'
        )}
        style={{
          transform: `scale(${0.8 + progress * 0.2})`,
        }}
      >
        <Icon className="w-8 h-8 text-primary" />
      </div>
    </motion.div>
  );
}

/**
 * Page Transition Wrapper with Swipe
 */
interface SwipePageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  enabled?: boolean;
}

export function SwipePageTransition({
  children,
  pageKey,
  enabled = true,
}: SwipePageTransitionProps) {
  const { isSwiping, swipeProgress } = useSwipeNavigation(undefined, {
    enabled,
    threshold: 50,
  });

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Swipe Indicator */}
      {isSwiping && swipeProgress > 0 && (
        <SwipeIndicator
          direction={swipeProgress > 0 ? 'right' : 'left'}
          progress={Math.abs(swipeProgress)}
        />
      )}
    </div>
  );
}

/**
 * Bottom Navigation Bar (Mobile)
 */
interface BottomNavItem {
  label: string;
  page: Page;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
  currentPage: Page;
  onNavigate: (page: Page) => void;
  className?: string;
}

export function BottomNavigation({
  items,
  currentPage,
  onNavigate,
  className,
}: BottomNavigationProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-background border-t',
        'safe-area-bottom', // iOS safe area
        className
      )}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-around px-4 h-16">
        {items.map((item) => {
          const isActive = currentPage === item.page;

          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={cn(
                'flex flex-col items-center justify-center',
                'flex-1 py-2 px-2',
                'transition-colors relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1',
                      'min-w-[18px] h-[18px] px-1',
                      'bg-destructive text-destructive-foreground',
                      'rounded-full',
                      'text-[10px] font-medium',
                      'flex items-center justify-center'
                    )}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Floating Back Button (for mobile)
 */
interface FloatingBackButtonProps {
  onBack?: () => void;
  show?: boolean;
  className?: string;
}

export function FloatingBackButton({
  onBack,
  show = true,
  className,
}: FloatingBackButtonProps) {
  const { goBack, canGoBack } = useNavigationHistory();

  if (!show || (!canGoBack && !onBack)) return null;

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClick}
          className={cn(
            'fixed top-4 left-4 z-50',
            'p-3 rounded-full',
            'bg-background border shadow-lg',
            'hover:bg-muted transition-colors',
            className
          )}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
