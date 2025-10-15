/**
 * Booking Skeleton Components
 * Loading states for booking-related UI elements
 */

import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * Single Booking Card Skeleton
 */
export function BookingCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
      <div className="flex-1 space-y-3">
        {/* Court name */}
        <Skeleton className="h-5 w-48" />
        
        {/* Date, time, players info */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Booking List Skeleton (multiple cards)
 */
interface BookingListSkeletonProps {
  count?: number;
}

export function BookingListSkeleton({ count = 3 }: BookingListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Booking Widget Skeleton (for dashboard widgets)
 */
export function BookingWidgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <BookingListSkeleton count={3} />
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

/**
 * Compact Booking Skeleton (for smaller spaces)
 */
export function CompactBookingSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/**
 * Invitation Card Skeleton
 */
export function InvitationCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

/**
 * Stats Card Skeleton (for KPI cards)
 */
export function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

/**
 * Transaction Row Skeleton
 */
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-2 animate-pulse">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

/**
 * Transaction List Skeleton
 */
interface TransactionListSkeletonProps {
  count?: number;
}

export function TransactionListSkeleton({ count = 4 }: TransactionListSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Dashboard Stats Grid Skeleton
 */
export function DashboardStatsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Full Dashboard Skeleton (comprehensive loading state)
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Grid */}
      <DashboardStatsGridSkeleton />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BookingWidgetSkeleton />
        <Card className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <InvitationCardSkeleton />
            <InvitationCardSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Shimmer effect wrapper (enhanced loading animation)
 */
interface ShimmerWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerWrapper({ children, className = "" }: ShimmerWrapperProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="shimmer absolute inset-0 pointer-events-none" />
    </div>
  );
}
