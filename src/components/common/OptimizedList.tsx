/**
 * OptimizedList Component
 * High-performance list rendering with virtualization and memoization
 */

import { memo, useMemo, useCallback, ReactNode } from 'react';
import { VirtualList } from '../VirtualList';
import { PageSpinner } from '../LoadingStates';
import { SmartEmptyState } from './SmartEmptyState';

interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T, index: number) => string | number;
  height?: number;
  itemHeight?: number;
  virtualized?: boolean;
  loading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  onRetry?: () => void;
}

/**
 * Optimized list with automatic virtualization for large datasets
 */
function OptimizedListComponent<T>({
  items,
  renderItem,
  getItemKey,
  height = 600,
  itemHeight = 80,
  virtualized = true,
  loading = false,
  error = null,
  emptyMessage = 'Nenhum item encontrado',
  emptyIcon,
  className,
  onRetry,
}: OptimizedListProps<T>) {
  // Memoize the render function
  const memoizedRenderItem = useCallback(
    (item: T, index: number) => {
      const key = getItemKey(item, index);
      return <div key={key}>{renderItem(item, index)}</div>;
    },
    [renderItem, getItemKey]
  );

  // Decide if we should use virtualization
  // Only virtualize if we have many items (> 50)
  const shouldVirtualize = useMemo(() => {
    return virtualized && items.length > 50;
  }, [virtualized, items.length]);

  // Loading state
  if (loading) {
    return (
      <div className={className} style={{ height }}>
        <PageSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className} style={{ height }}>
        <SmartEmptyState
          variant="error"
          title="Erro ao carregar dados"
          description={error.message}
          action={onRetry ? { label: 'Tentar novamente', onClick: onRetry } : undefined}
        />
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={className} style={{ height }}>
        <SmartEmptyState
          variant="no-data"
          title={emptyMessage}
          icon={emptyIcon}
        />
      </div>
    );
  }

  // Render with virtualization
  if (shouldVirtualize) {
    return (
      <VirtualList
        items={items}
        height={height}
        itemHeight={itemHeight}
        renderItem={memoizedRenderItem}
        className={className}
      />
    );
  }

  // Render without virtualization (for small lists)
  return (
    <div className={className} style={{ maxHeight: height, overflow: 'auto' }}>
      {items.map((item, index) => memoizedRenderItem(item, index))}
    </div>
  );
}

// Memoize the entire component
export const OptimizedList = memo(OptimizedListComponent) as typeof OptimizedListComponent;

/**
 * Optimized Grid Component
 */
interface OptimizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T, index: number) => string | number;
  columns?: number;
  gap?: number;
  loading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  className?: string;
  onRetry?: () => void;
}

function OptimizedGridComponent<T>({
  items,
  renderItem,
  getItemKey,
  columns = 3,
  gap = 16,
  loading = false,
  error = null,
  emptyMessage = 'Nenhum item encontrado',
  className,
  onRetry,
}: OptimizedGridProps<T>) {
  // Memoize grid styles
  const gridStyles = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: `${gap}px`,
    }),
    [columns, gap]
  );

  // Loading state
  if (loading) {
    return <PageSpinner />;
  }

  // Error state
  if (error) {
    return (
      <SmartEmptyState
        variant="error"
        title="Erro ao carregar dados"
        description={error.message}
        action={onRetry ? { label: 'Tentar novamente', onClick: onRetry } : undefined}
      />
    );
  }

  // Empty state
  if (items.length === 0) {
    return <SmartEmptyState variant="no-data" title={emptyMessage} />;
  }

  return (
    <div className={className} style={gridStyles}>
      {items.map((item, index) => {
        const key = getItemKey(item, index);
        return <div key={key}>{renderItem(item, index)}</div>;
      })}
    </div>
  );
}

export const OptimizedGrid = memo(OptimizedGridComponent) as typeof OptimizedGridComponent;

/**
 * Memoized List Item wrapper
 * Use this to wrap individual list items for better performance
 */
interface MemoizedItemProps {
  children: ReactNode;
  dependencies?: any[];
}

export const MemoizedItem = memo<MemoizedItemProps>(
  ({ children }) => <>{children}</>,
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if dependencies change
    if (!nextProps.dependencies || !prevProps.dependencies) {
      return false; // Always re-render if no dependencies
    }
    
    return nextProps.dependencies.every(
      (dep, index) => dep === prevProps.dependencies![index]
    );
  }
);

MemoizedItem.displayName = 'MemoizedItem';
