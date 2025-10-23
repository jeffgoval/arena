import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
