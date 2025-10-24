import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function IndicacoesDashboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <Skeleton className="h-5 w-48 mb-2" />
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function IndicacoesFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <Skeleton className="h-4 w-48 mb-2" />
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function IndicacoesListaSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function IndicacoesPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Dashboard */}
      <IndicacoesDashboardSkeleton />

      {/* Tabs */}
      <Tabs defaultValue="indicar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="indicar">Indicar</TabsTrigger>
          <TabsTrigger value="compartilhar">Compartilhar</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="creditos">Créditos</TabsTrigger>
        </TabsList>

        <TabsContent value="indicar" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              {/* Código de Indicação */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full rounded-lg" />
                </CardContent>
              </Card>
              
              {/* Formulário */}
              <IndicacoesFormSkeleton />
              
              {/* Aplicar Código */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              {/* Progresso */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Lista */}
              <IndicacoesListaSkeleton />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}