import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Carregando página...
        </p>
      </div>
    </div>
  );
}
