'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Inbox, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ConviteSkeletonList, ConviteStatsSkeletonList } from '@/components/shared/loading/ConviteSkeleton';
import type { ConviteStatus } from '@/types/convites.types';

export default function ConvitesCriadosPage() {
  const router = useRouter();
  const [filtroStatus, setFiltroStatus] = useState<ConviteStatus | 'todos'>('todos');
  const [convites, setConvites] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchConvites() {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (filtroStatus && filtroStatus !== 'todos') {
          params.append('status', filtroStatus);
        }

        console.log('Fazendo requisição para:', `/api/convites/simple?${params.toString()}`);
        
        const response = await fetch(`/api/convites/simple?${params.toString()}`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na resposta:', errorText);
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        setConvites(data.convites || []);
        setStats(data.stats || null);
      } catch (err) {
        console.error('Erro ao buscar convites:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConvites();
  }, [filtroStatus]);

  const handleVerAceites = (conviteId: string) => {
    router.push(`/cliente/convites/${conviteId}/aceites`);
  };

  if (isLoading) {
    return (
      <div className="container-custom page-padding space-y-6">
        {/* Cabeçalho */}
        <Card className="border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="heading-2">Meus Convites</h1>
                <p className="text-muted-foreground">
                  Gerencie todos os convites que você criou para suas reservas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Estatísticas */}
        <ConviteStatsSkeletonList />

        {/* Skeleton Filtros */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Skeleton Lista */}
        <ConviteSkeletonList />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom page-padding">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="heading-3 mb-2">Erro ao carregar convites</h2>
            <p className="text-muted-foreground mb-6">
              {error.message}
            </p>
            <details className="text-left text-sm">
              <summary className="cursor-pointer">Detalhes do erro</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom page-padding space-y-6">
      {/* Cabeçalho */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="heading-2">Meus Convites</h1>
              <p className="text-muted-foreground">
                Gerencie todos os convites que você criou para suas reservas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completos}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expirados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expirados}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-red-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['todos', 'ativo', 'completo', 'expirado'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filtroStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Convites */}
      {convites.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <Inbox className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="heading-3 mb-2">
              Nenhum convite encontrado
            </h3>
            <p className="text-muted-foreground">
              {filtroStatus !== 'todos'
                ? `Você não tem convites com status "${filtroStatus}"`
                : 'Você ainda não criou nenhum convite. Crie uma reserva e convide amigos!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {convites.map((convite) => (
            <Card key={convite.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Convite #{convite.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Status: <span className={`font-medium ${
                          convite.status === 'ativo' ? 'text-green-600' :
                          convite.status === 'completo' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {convite.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Vagas:</strong> {convite.vagas_disponiveis} de {convite.vagas_totais}
                    </p>
                    <p className="text-sm">
                      <strong>Aceites:</strong> {convite.total_aceites}
                    </p>
                    {convite.valor_por_pessoa && (
                      <p className="text-sm">
                        <strong>Valor:</strong> R$ {convite.valor_por_pessoa.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {convite.mensagem && (
                    <div className="border-l-2 border-gray-200 pl-3">
                      <p className="text-sm text-muted-foreground">{convite.mensagem}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleVerAceites(convite.id)}
                      className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Ver Aceites
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/convite/${convite.token}`)}
                      className="flex-1 px-3 py-2 text-sm bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
                    >
                      Copiar Link
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
