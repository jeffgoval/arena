"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Skeleton genérico
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

// Skeleton para Card
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6 border-0 shadow-soft", className)}>
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
}

// Skeleton para Tabela
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

// Skeleton para Lista
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="p-4 border border-border">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Skeleton para Grid de Cards
export function GridSkeleton({ 
  items = 6, 
  columns = 3 
}: { 
  items?: number; 
  columns?: number;
}) {
  return (
    <div 
      className="grid gap-6"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
      }}
    >
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para Perfil/Avatar com Info
export function ProfileSkeleton() {
  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Skeleton para Formulário
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
}

// Skeleton para Calendário
export function CalendarSkeleton() {
  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        
        {/* Grid de dias */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </Card>
  );
}

// Skeleton para Estatísticas/Dashboard
export function StatsSkeleton({ stats = 4 }: { stats?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: stats }).map((_, i) => (
        <Card key={i} className="p-6 border-0 shadow-soft">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ 
  size = "md",
  className 
}: { 
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}

// Loading Overlay (para cobrir conteúdo)
export function LoadingOverlay({ 
  message = "Carregando..." 
}: { 
  message?: string;
}) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// Loading Page (tela cheia)
export function LoadingPage({ 
  message = "Carregando..." 
}: { 
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
