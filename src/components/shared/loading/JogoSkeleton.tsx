import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JogoSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Modalidade e título */}
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <div className="flex items-center gap-4 flex-wrap">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Avaliação */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-4 h-4" />
                ))}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-2 md:items-end">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function JogoSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <JogoSkeleton key={i} />
      ))}
    </div>
  );
}

export function JogoStatsSkeletonList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 text-center">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}