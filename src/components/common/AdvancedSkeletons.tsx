/**
 * Advanced Skeleton Screens
 * Skeleton screens específicos e contextuais
 */

import { motion } from 'motion/react';
import { cn } from '../ui/utils';

/**
 * Base Skeleton Component
 */
interface SkeletonProps {
  className?: string;
  variant?: 'pulse' | 'wave' | 'shimmer';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  className,
  variant = 'pulse',
  rounded = 'md',
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const variantClasses = {
    pulse: 'animate-pulse',
    wave: 'shimmer',
    shimmer: 'shimmer',
  };

  return (
    <div
      className={cn(
        'bg-muted',
        roundedClasses[rounded],
        variantClasses[variant],
        className
      )}
    />
  );
}

/**
 * Text Skeleton - Simula linhas de texto
 */
interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function TextSkeleton({
  lines = 3,
  lastLineWidth = '60%',
  className,
}: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && 'max-w-[var(--last-line-width)]')}
          style={{ '--last-line-width': lastLineWidth } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/**
 * Avatar Skeleton
 */
interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withName?: boolean;
  withSubtext?: boolean;
}

export function AvatarSkeleton({
  size = 'md',
  withName = false,
  withSubtext = false,
}: AvatarSkeletonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex items-center gap-3">
      <Skeleton className={cn(sizeClasses[size])} rounded="full" />
      
      {(withName || withSubtext) && (
        <div className="space-y-2 flex-1">
          {withName && <Skeleton className="h-4 w-32" />}
          {withSubtext && <Skeleton className="h-3 w-24" />}
        </div>
      )}
    </div>
  );
}

/**
 * Card Skeleton
 */
interface CardSkeletonProps {
  hasImage?: boolean;
  hasAvatar?: boolean;
  linesCount?: number;
  hasActions?: boolean;
  className?: string;
}

export function CardSkeleton({
  hasImage = false,
  hasAvatar = false,
  linesCount = 3,
  hasActions = false,
  className,
}: CardSkeletonProps) {
  return (
    <div className={cn('border rounded-lg p-4 space-y-4', className)}>
      {/* Header */}
      {hasAvatar && <AvatarSkeleton withName withSubtext />}

      {/* Image */}
      {hasImage && <Skeleton className="w-full h-48" />}

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <TextSkeleton lines={linesCount} />
      </div>

      {/* Actions */}
      {hasActions && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  );
}

/**
 * Table Skeleton
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <table className="w-full">
        {hasHeader && (
          <thead className="bg-muted/50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-4">
                  <Skeleton className="h-4 w-full" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Form Skeleton
 */
interface FormSkeletonProps {
  fields?: number;
  hasSubmitButton?: boolean;
  className?: string;
}

export function FormSkeleton({
  fields = 4,
  hasSubmitButton = true,
  className,
}: FormSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      {hasSubmitButton && (
        <Skeleton className="h-10 w-32" />
      )}
    </div>
  );
}

/**
 * Dashboard Stats Skeleton
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-8 h-8" rounded="md" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

/**
 * List Item Skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="w-12 h-12" rounded="md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="w-20 h-8" />
    </div>
  );
}

/**
 * Calendar Skeleton
 */
export function CalendarSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8" rounded="md" />
          <Skeleton className="w-8 h-8" rounded="md" />
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Chart Skeleton
 */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border rounded-lg p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const height = `${30 + Math.random() * 70}%`;
          return (
            <Skeleton
              key={i}
              className="flex-1"
              style={{ height }}
            />
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3" rounded="full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Profile Skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <Skeleton className="w-24 h-24" rounded="full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <TextSkeleton lines={4} />
      </div>
    </div>
  );
}

/**
 * Notification Skeleton
 */
export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 border-b">
      <Skeleton className="w-10 h-10" rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/**
 * Grid Skeleton - Genérico para grids
 */
interface GridSkeletonProps {
  items?: number;
  columns?: 1 | 2 | 3 | 4;
  itemHeight?: string;
  className?: string;
}

export function GridSkeleton({
  items = 8,
  columns = 3,
  itemHeight = '200px',
  className,
}: GridSkeletonProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton
          key={i}
          style={{ height: itemHeight }}
        />
      ))}
    </div>
  );
}

/**
 * Contextual Loading - Mostra mensagem contextual
 */
interface ContextualLoadingProps {
  message: string;
  submessage?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ContextualLoading({
  message,
  submessage,
  icon,
  className,
}: ContextualLoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      {icon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          {icon}
        </motion.div>
      )}
      
      <p className="text-lg font-medium text-foreground mb-2">
        {message}
      </p>
      
      {submessage && (
        <p className="text-sm text-muted-foreground">
          {submessage}
        </p>
      )}
      
      <div className="flex gap-1 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
