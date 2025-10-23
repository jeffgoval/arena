'use client';

import { useState } from 'react';
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
  Search,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Jogo {
  id: string;
  data: Date;
  horario: string;
  quadra: string;
  tipo: 'individual' | 'dupla' | 'grupo';
  modalidade: 'futebol' | 'tenis' | 'padel' | 'volei';
  participantes: string[];
  resultado?: 'vitoria' | 'derrota' | 'empate';
  pontuacao?: {
    minha: number;
    adversario: number;
  };
  duracao: number; // em minutos
  avaliacao?: number; // 1-5 estrelas
  observacoes?: string;
}

export default function JogosPage() {
  const [jogos] = useState<Jogo[]>([
    {
      id: '1',
      data: new Date('2024-10-20T20:00:00'),
      horario: '20:00',
      quadra: 'Quadra A',
      tipo: 'dupla',
      modalidade: 'tenis',
      participantes: ['João Silva', 'Maria Santos', 'Pedro Costa'],
      resultado: 'vitoria',
      pontuacao: { minha: 6, adversario: 4 },
      duracao: 90,
      avaliacao: 5,
      observacoes: 'Ótimo jogo! Quadra em perfeitas condições.'
    },
    {
      id: '2',
      data: new Date('2024-10-18T19:00:00'),
      horario: '19:00',
      quadra: 'Quadra B',
      tipo: 'grupo',
      modalidade: 'futebol',
      participantes: ['Carlos Lima', 'Ana Paula', 'Roberto Silva', 'Fernanda Costa', 'Lucas Oliveira'],
      resultado: 'empate',
      pontuacao: { minha: 3, adversario: 3 },
      duracao: 60,
      avaliacao: 4
    },
    {
      id: '3',
      data: new Date('2024-10-15T18:30:00'),
      horario: '18:30',
      quadra: 'Quadra C',
      tipo: 'individual',
      modalidade: 'tenis',
      participantes: ['Rafael Mendes'],
      resultado: 'derrota',
      pontuacao: { minha: 4, adversario: 6 },
      duracao: 75,
      avaliacao: 3,
      observacoes: 'Adversário muito forte, mas foi um bom treino.'
    },
    {
      id: '4',
      data: new Date('2024-10-12T21:00:00'),
      horario: '21:00',
      quadra: 'Quadra A',
      tipo: 'dupla',
      modalidade: 'padel',
      participantes: ['Marcos Silva', 'Julia Santos', 'Diego Costa'],
      resultado: 'vitoria',
      pontuacao: { minha: 6, adversario: 2 },
      duracao: 80,
      avaliacao: 5
    }
  ]);

  const [filtroModalidade, setFiltroModalidade] = useState('todas');
  const [filtroResultado, setFiltroResultado] = useState('todos');
  const [busca, setBusca] = useState('');

  const modalidades = [
    { value: 'futebol', label: 'Futebol', emoji: '⚽' },
    { value: 'tenis', label: 'Tênis', emoji: '🎾' },
    { value: 'padel', label: 'Padel', emoji: '🏓' },
    { value: 'volei', label: 'Vôlei', emoji: '🏐' }
  ];

  const jogosFiltrados = jogos.filter(jogo => {
    const modalidadeOk = filtroModalidade === 'todas' || jogo.modalidade === filtroModalidade;
    const resultadoOk = filtroResultado === 'todos' || jogo.resultado === filtroResultado;
    const buscaOk = busca === '' || 
      jogo.participantes.some(p => p.toLowerCase().includes(busca.toLowerCase())) ||
      jogo.quadra.toLowerCase().includes(busca.toLowerCase());
    
    return modalidadeOk && resultadoOk && buscaOk;
  });

  // Estatísticas
  const totalJogos = jogos.length;
  const vitorias = jogos.filter(j => j.resultado === 'vitoria').length;
  const derrotas = jogos.filter(j => j.resultado === 'derrota').length;
  const empates = jogos.filter(j => j.resultado === 'empate').length;
  const tempoTotal = jogos.reduce((acc, jogo) => acc + jogo.duracao, 0);
  const avaliacaoMedia = jogos.filter(j => j.avaliacao).reduce((acc, jogo) => acc + (jogo.avaliacao || 0), 0) / jogos.filter(j => j.avaliacao).length;

  const getResultadoBadge = (resultado?: string) => {
    switch (resultado) {
      case 'vitoria':
        return <Badge className="bg-green-100 text-green-800">Vitória</Badge>;
      case 'derrota':
        return <Badge className="bg-red-100 text-red-800">Derrota</Badge>;
      case 'empate':
        return <Badge className="bg-yellow-100 text-yellow-800">Empate</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getModalidadeEmoji = (modalidade: string) => {
    return modalidades.find(m => m.value === modalidade)?.emoji || '🏃';
  };

  const renderEstrelas = (avaliacao?: number) => {
    if (!avaliacao) return <span className="text-muted-foreground">Não avaliado</span>;
    
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
            <div className="text-sm text-muted-foreground">Total de Jogos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{vitorias}</div>
            <div className="text-sm text-muted-foreground">Vitórias</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{Math.round(tempoTotal / 60)}h</div>
            <div className="text-sm text-muted-foreground">Tempo Jogado</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{avaliacaoMedia.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avaliação Média</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{vitorias}</div>
              <div className="text-sm text-muted-foreground mb-2">Vitórias</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(vitorias / totalJogos) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((vitorias / totalJogos) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{empates}</div>
              <div className="text-sm text-muted-foreground mb-2">Empates</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${(empates / totalJogos) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((empates / totalJogos) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{derrotas}</div>
              <div className="text-sm text-muted-foreground mb-2">Derrotas</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(derrotas / totalJogos) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((derrotas / totalJogos) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Buscar por participante ou quadra..."
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
            <div>
              <Select value={filtroResultado} onValueChange={setFiltroResultado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os resultados</SelectItem>
                  <SelectItem value="vitoria">Vitórias</SelectItem>
                  <SelectItem value="empate">Empates</SelectItem>
                  <SelectItem value="derrota">Derrotas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Jogos */}
      <div className="space-y-4">
        {jogosFiltrados.map(jogo => (
          <Card key={jogo.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-2xl">{getModalidadeEmoji(jogo.modalidade)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {modalidades.find(m => m.value === jogo.modalidade)?.label} - {jogo.tipo}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(jogo.data, 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {jogo.horario} ({jogo.duracao}min)
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {jogo.quadra}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {getResultadoBadge(jogo.resultado)}
                    {jogo.pontuacao && (
                      <Badge variant="outline">
                        <Target className="w-3 h-3 mr-1" />
                        {jogo.pontuacao.minha} x {jogo.pontuacao.adversario}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {jogo.participantes.length + 1} jogadores
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Participantes: </span>
                      <span className="text-sm text-muted-foreground">
                        {jogo.participantes.join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Avaliação: </span>
                      {renderEstrelas(jogo.avaliacao)}
                    </div>

                    {jogo.observacoes && (
                      <div>
                        <span className="text-sm font-medium">Observações: </span>
                        <span className="text-sm text-muted-foreground">{jogo.observacoes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    Jogar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {jogosFiltrados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum jogo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não há jogos que correspondam aos filtros selecionados.
              </p>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Novo Jogo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}