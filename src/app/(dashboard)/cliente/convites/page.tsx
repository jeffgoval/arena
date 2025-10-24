'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Inbox, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ConviteCard, ConvitesStats, ConvitesFiltros } from '@/components/convites';
import { useConvites } from '@/hooks/useConvites';
import type { ConviteStatus } from '@/types/convites.types';

export default function ConvitesCriadosPage() {
  const router = useRouter();
  const { convites, stats, loading, error, fetchConvites, desativarConvite, copiarLink } = useConvites();
  const [filtroStatus, setFiltroStatus] = useState<ConviteStatus | 'todos'>('todos');

  useEffect(() => {
    const filters = filtroStatus !== 'todos' ? { status: filtroStatus } : undefined;
    fetchConvites(filters);
  }, [filtroStatus, fetchConvites]);

  const handleVerAceites = (conviteId: string) => {
    router.push(`/cliente/convites/${conviteId}/aceites`);
  };

  if (loading && !convites.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando convites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro ao carregar</h2>
            <p className="text-muted-foreground">{error}</p>
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
      {stats && <ConvitesStats stats={stats} />}

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <ConvitesFiltros 
          statusAtivo={filtroStatus}
          onStatusChange={setFiltroStatus}
        />
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
            <ConviteCard
              key={convite.id}
              convite={convite}
              onCopiarLink={copiarLink}
              onVerAceites={handleVerAceites}
              onDesativar={desativarConvite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
