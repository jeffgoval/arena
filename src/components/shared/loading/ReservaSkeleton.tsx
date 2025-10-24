import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReservaSkeleton() {
  return (
    <Card className="border-0 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Date skeleton */}
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReservaSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReservaSkeleton key={i} />
      ))}
    </div>
  );
}