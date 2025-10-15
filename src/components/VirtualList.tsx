import { useState, useRef, useEffect, ReactNode, CSSProperties } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  emptyState?: ReactNode;
}

/**
 * Componente de lista virtualizada para renderização eficiente de listas grandes
 * 
 * Apenas renderiza os itens visíveis + overscan buffer
 * Perfeito para listas com centenas ou milhares de itens
 * 
 * @example
 * <VirtualList
 *   items={transactions}
 *   height={600}
 *   itemHeight={80}
 *   renderItem={(transaction) => (
 *     <TransactionCard transaction={transaction} />
 *   )}
 *   overscan={3}
 * />
 */
export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className,
  emptyState,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce scroll para melhor performance
  const debouncedScrollTop = useDebounce(scrollTop, 50);

  // Calcular itens visíveis
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(debouncedScrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((debouncedScrollTop + height) / itemHeight) + overscan
  );
  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Lista vazia
  if (items.length === 0 && emptyState) {
    return (
      <div className={className} style={{ height }}>
        {emptyState}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={className}
      style={{
        height,
        overflow: "auto",
        position: "relative",
      }}
    >
      {/* Spacer para manter o scroll height correto */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {/* Items visíveis */}
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Hook para gerenciar scroll infinito com virtual list
 */
export function useInfiniteScroll<T>(
  initialItems: T[],
  loadMore: () => Promise<T[]>,
  hasMore: boolean
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems = await loadMore();
      setItems((prev) => [...prev, ...newItems]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    isLoading,
    error,
    loadMore: handleLoadMore,
  };
}
