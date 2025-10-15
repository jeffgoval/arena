/**
 * Smart Pagination Component
 * Enhanced pagination with page size options and mobile optimization
 */

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useLiveRegion } from "../../hooks/useLiveRegion";

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showInfo?: boolean;
  loading?: boolean;
}

export function SmartPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  showInfo = true,
  loading = false,
}: SmartPaginationProps) {
  const { announcePageChange } = useLiveRegion();

  const handlePageChange = (page: number) => {
    if (page === currentPage || loading) return;
    onPageChange(page);
    announcePageChange(page, totalPages);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize);
    onPageSizeChange(size);
  };

  // Calculate visible page range
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  // Calculate item range
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Mostrando {startItem} a {endItem} de {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </div>
      )}

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage <= 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-disabled={currentPage <= 1 || loading}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  isActive={page === currentPage}
                  className={loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  aria-disabled={loading}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-disabled={currentPage >= totalPages || loading}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page Size Selector */}
      {showPageSize && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Itens por página:
          </span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={loading}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

/**
 * Simple Pagination
 * Minimal pagination for mobile-first designs
 */
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}) {
  const { announcePageChange } = useLiveRegion();

  const handlePageChange = (page: number) => {
    if (page === currentPage || loading) return;
    onPageChange(page);
    announcePageChange(page, totalPages);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </Button>

      <span className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
      >
        Próxima
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

/**
 * Hook for pagination state
 */
export function usePagination(
  totalItems: number,
  initialPageSize = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Reset to page 1 when total items change significantly
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return {
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
  };
}