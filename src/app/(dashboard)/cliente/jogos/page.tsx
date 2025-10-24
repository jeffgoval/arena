'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Filter,
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReservas } from '@/hooks/core/useReservas';
import { useAvaliacoes } from '@/hooks/core/useAvaliacoes';

export default function JogosPage() {
  const { data: reservasData, isLoading: isLoadingReservas } = useReservas();
  const { avaliacoes: avaliacoesData } = useAvaliacoes();

  const [filtroModalidade, setFiltroModalidade] = useState('todas');
  const [busca, setBusca] = useState('');

  // Filter only past reservations (completed games)
  const hoje = new Date();
  const jogosPassados = reservasData?.filter((reserva: any) => {
    const dataReserva = parseISO(reserva.data);
    return dataReserva < hoje && reserva.status === 'confirmada';
  }).sort((a: any, b: any) => {
    return parseISO(b.data).getTime() - parseISO(a.data).getTime(); // Most recent first
  }) || [];

  const modalidades = [
    { value: 'society', label: 'Society', emoji: '⚽' },
    { value: 'beach_tennis', label: 'Beach Tennis', emoji: '🎾' },
    { value: 'volei', label: 'Vôlei', emoji: '🏐' },
    { value: 'futvolei', label: 'Futevôlei', emoji: '⚽🏐' }
  ];

  const jogosFiltrados = jogosPassados.filter((jogo: any) => {
    const modalidadeOk = filtroModalidade === 'todas' || jogo.quadra?.tipo === filtroModalidade;
    const buscaOk = busca === '' ||
      jogo.quadra?.nome?.toLowerCase().includes(busca.toLowerCase());

    return modalidadeOk && buscaOk;
  });

  // Estatísticas
  const totalJogos = jogosPassados.length;

  // Get ratings for these games
  const avaliacoesMap = new Map();
  avaliacoesData?.forEach((aval: any) => {
    avaliacoesMap.set(aval.reserva_id, aval.nota);
  });

  const jogosComAvaliacao = jogosPassados.filter((j: any) => avaliacoesMap.has(j.id));
  const avaliacaoMedia = jogosComAvaliacao.length > 0
    ? jogosComAvaliacao.reduce((acc: number, j: any) => acc + avaliacoesMap.get(j.id), 0) / jogosComAvaliacao.length
    : 0;

  const getModalidadeEmoji = (tipo: string) => {
    return modalidades.find(m => m.value === tipo)?.emoji || '🏃';
  };

  const getModalidadeLabel = (tipo: string) => {
    return modalidades.find(m => m.value === tipo)?.label || tipo;
  };

  const renderEstrelas = (avaliacao?: number) => {
    if (!avaliacao) return <span className="text-muted-foreground text-sm">Não avaliado</span>;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoadingReservas) {
    return (
      <div className="container-custom page-padding">
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-padding space-y-8">
      <div>
        <h1 className="heading-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Meus Jogos
        </h1>
        <p className="body-medium text-muted-foreground">
          Histórico completo dos seus jogos e estatísticas
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{totalJogos}</div>
            <div className="text-sm text-muted-foreground">Jogos Realizados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{jogosComAvaliacao.length}</div>
            <div className="text-sm text-muted-foreground">Avaliados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{new Set(jogosPassados.map((j: any) => j.quadra?.nome)).size}</div>
            <div className="text-sm text-muted-foreground">Quadras Usadas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{avaliacaoMedia > 0 ? avaliacaoMedia.toFixed(1) : '-'}</div>
            <div className="text-sm text-muted-foreground">Avaliação Média</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Buscar por quadra..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={filtroModalidade} onValueChange={setFiltroModalidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as modalidades</SelectItem>
                  {modalidades.map(modalidade => (
                    <SelectItem key={modalidade.value} value={modalidade.value}>
                      {modalidade.emoji} {modalidade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Jogos */}
      <div className="space-y-4">
        {jogosFiltrados.map((jogo: any) => {
          const dataReserva = parseISO(jogo.data);
          const avaliacao = avaliacoesMap.get(jogo.id);
          const totalParticipantes = jogo.reserva_participantes?.length || 0;

          return (
            <Card key={jogo.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-2xl">{getModalidadeEmoji(jogo.quadra?.tipo)}</div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {getModalidadeLabel(jogo.quadra?.tipo)} - {jogo.quadra?.nome}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(dataReserva, "dd/MM/yyyy - EEEE", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {jogo.horario?.hora_inicio} - {jogo.horario?.hora_fim}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {jogo.quadra?.nome}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant="secondary" className="capitalize">
                        {jogo.status}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {totalParticipantes} participante{totalParticipantes !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline">
                        R$ {jogo.valor_total?.toFixed(2)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Avaliação: </span>
                      {renderEstrelas(avaliacao)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <Link href={`/cliente/reservas/${jogo.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href="/cliente/reservas/nova">
                      <Button variant="outline" size="sm">
                        Reservar Novamente
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {jogosFiltrados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum jogo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {totalJogos === 0
                  ? 'Você ainda não jogou nenhuma partida. Faça sua primeira reserva!'
                  : 'Não há jogos que correspondam aos filtros selecionados.'}
              </p>
              <Link href="/cliente/reservas/nova">
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Nova Reserva
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}