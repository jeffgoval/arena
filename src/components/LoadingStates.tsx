import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Loader2 } from "lucide-react";

/**
 * Shimmer Effect CSS Animation
 * Creates a loading animation that sweeps across skeleton elements
 */
const shimmerAnimation = {
  backgroundSize: "200% 100%",
  backgroundImage: "linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
  animation: "shimmer 2s infinite",
};

/**
 * Generic Spinner Component
 */
interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export function Spinner({ size = "md", className = "", text }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-muted-foreground`}>{text}</p>
      )}
    </div>
  );
}

/**
 * Full Page Spinner
 */
export function PageSpinner({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="xl" text={text} />
    </div>
  );
}

/**
 * Progress Bar Component
 */
interface ProgressBarProps {
  progress: number;
  text?: string;
  showPercentage?: boolean;
  variant?: "default" | "success" | "warning" | "error";
}

export function ProgressBar({
  progress,
  text,
  showPercentage = true,
  variant = "default",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const variantClasses = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-destructive",
  };

  return (
    <div className="space-y-2">
      {(text || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {text && <span className="text-muted-foreground">{text}</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${variantClasses[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/**
 * Upload Progress Component
 */
interface UploadProgressProps {
  fileName: string;
  progress: number;
  fileSize?: string;
  onCancel?: () => void;
}

/**
 * Simple Upload Progress (deprecated - use UploadProgress from ProgressIndicators)
 * @deprecated Use the advanced UploadProgress from ./common/ProgressIndicators instead
 */
export function SimpleUploadProgress({
  fileName,
  progress,
  fileSize,
  onCancel,
}: UploadProgressProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <p className="font-medium truncate">{fileName}</p>
              {fileSize && (
                <p className="text-sm text-muted-foreground">{fileSize}</p>
              )}
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            )}
          </div>
          <ProgressBar
            progress={progress}
            showPercentage
            variant={progress === 100 ? "success" : "default"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Game Cards (Lista de Jogos)
 */
export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Court name and status */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Date, time, and players info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Game List (Multiple cards)
 */
export function GameListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for Court Card
 */
export function CourtCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Court Image */}
      <Skeleton className="h-48 w-full rounded-t-lg" />
      
      <CardContent className="p-4 space-y-3">
        {/* Court name */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Sport type */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Features */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-7 w-24" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Court Grid
 */
export function CourtGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourtCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for Dashboard Stats Cards
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Skeleton for User Profile
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <Skeleton className="h-24 w-24 rounded-full" />
            
            {/* Info */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            
            {/* Action Button */}
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for Table Rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/**
 * Skeleton for Table
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="flex items-center gap-4 p-4 border-b bg-muted/50">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Form
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Calendar
 */
export function CalendarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Chat/Messages
 */
export function MessageSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
        >
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1 max-w-xs">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for List Items (Generic)
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

/**
 * Skeleton for List (Generic)
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: count }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Inline Loading (for buttons and small actions)
 */
export function InlineSpinner({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return <Loader2 className={`${sizeClass} animate-spin`} />;
}

/**
 * Skeleton with shimmer effect
 */
export function ShimmerSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted relative overflow-hidden ${className}`}
      style={shimmerAnimation}
    />
  );
}

/**
 * Content Loader (shows spinner while content is loading)
 */
interface ContentLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  text?: string;
}

export function ContentLoader({
  isLoading,
  children,
  skeleton,
  text = "Carregando...",
}: ContentLoaderProps) {
  if (isLoading) {
    return skeleton ? <>{skeleton}</> : <Spinner text={text} />;
  }

  return <>{children}</>;
}

/**
 * Lazy Load Wrapper (shows spinner while lazy component loads)
 */
interface LazyLoadProps {
  isLoading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyLoad({
  isLoading,
  error,
  children,
  fallback,
}: LazyLoadProps) {
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Erro ao carregar: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return fallback ? <>{fallback}</> : <PageSpinner />;
  }

  return <>{children}</>;
}
