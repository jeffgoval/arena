import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TurmaSkeleton() {
  return (
    <Card className="border-0 shadow-soft">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-xl">
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-5 mx-auto rounded" />
            <Skeleton className="h-8 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-5 mx-auto rounded" />
            <Skeleton className="h-8 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-5 mx-auto rounded" />
            <Skeleton className="h-8 w-8 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TurmaSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TurmaSkeleton key={i} />
      ))}
    </div>
  );
}