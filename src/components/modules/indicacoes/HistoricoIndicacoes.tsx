'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle,
  Mail,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Indicacao } from '@/types/indicacoes.types';

interface HistoricoIndicacoesProps {
  indicacoes: Indicacao[];
}

export function HistoricoIndicacoes({ indicacoes }: HistoricoIndicacoesProps) {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  // Filtrar indicações
  const indicacoesFiltradas = indicacoes.filter((indicacao) => {
    const matchStatus = filtroStatus === 'todos' || indicacao.status === filtroStatus;
    const matchBusca = busca === '' || 
      indicacao.nome_indicado?.toLowerCase().includes(busca.toLowerCase()) ||
      indicacao.email_indicado?.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchBusca;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aceita':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'expirada':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aceita':
        return 'Aceita';
      case 'pendente':
        return 'Pendente';
      case 'expirada':
        return 'Expirada';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'aceita':
        return 'default';
      case 'pendente':
        return 'secondary';
      case 'expirada':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Estatísticas rápidas
  const stats = {
    total: indicacoes.length,
    aceitas: indicacoes.filter(i => i.status === 'aceita').length,
    pendentes: indicacoes.filter(i => i.status === 'pendente').length,
    expiradas: indicacoes.filter(i => i.status === 'expirada').length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico Completo de Indicações
        </CardTitle>
        <CardDescription>
          Acompanhe todas as suas indicações e seus status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600/80">Total</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.aceitas}</div>
            <div className="text-sm text-green-600/80">Aceitas</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.pendentes}</div>
            <div className="text-sm text-orange-600/80">Pendentes</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.expiradas}</div>
            <div className="text-sm text-red-600/80">Expiradas</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="aceita">Aceitas</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="expirada">Expiradas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Indicações */}
        {indicacoesFiltradas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma indicação encontrada.</p>
            {busca && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setBusca('')}
                className="mt-2"
              >
                Limpar busca
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {indicacoesFiltradas.map((indicacao) => (
              <div
                key={indicacao.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Nome/Email */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-medium">
                        {indicacao.nome_indicado || indicacao.email_indicado}
                      </div>
                      {getStatusIcon(indicacao.status)}
                    </div>
                    
                    {/* Email (se houver nome) */}
                    {indicacao.email_indicado && indicacao.nome_indicado && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Mail className="h-3 w-3" />
                        {indicacao.email_indicado}
                      </div>
                    )}
                    
                    {/* Datas */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Indicado {formatDistanceToNow(new Date(indicacao.data_criacao), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                      
                      {indicacao.status === 'aceita' && indicacao.data_aceite && (
                        <div className="text-green-600">
                          Aceito {formatDistanceToNow(new Date(indicacao.data_aceite), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                      )}
                      
                      {indicacao.status === 'pendente' && (
                        <div className="text-orange-600">
                          Expira em {format(new Date(indicacao.data_expiracao), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status e Créditos */}
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusVariant(indicacao.status)}>
                      {getStatusLabel(indicacao.status)}
                    </Badge>
                    
                    {indicacao.creditos_concedidos > 0 && (
                      <div className="text-sm font-medium text-green-600">
                        +{indicacao.creditos_concedidos} créditos
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo dos Resultados */}
        {indicacoesFiltradas.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Mostrando {indicacoesFiltradas.length} de {indicacoes.length} indicações
          </div>
        )}
      </CardContent>
    </Card>
  );
}