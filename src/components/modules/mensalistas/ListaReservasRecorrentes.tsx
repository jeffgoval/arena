'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Repeat, 
  Pause, 
  Play,
  X,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useMensalistas } from '@/hooks/useMensalistas';
import type { ReservaRecorrente } from '@/types/mensalistas.types';

export function ListaReservasRecorrentes() {
  const { reservasRecorrentes, pausarReservaRecorrente, cancelarReservaRecorrente } = useMensalistas();
  const { toast } = useToast();

  const handlePausar = async (reservaId: string) => {
    const resultado = await pausarReservaRecorrente(reservaId);
    
    if (resultado.success) {
      toast({
        title: "Reserva Pausada",
        description: "A reserva recorrente foi pausada com sucesso",
      });
    } else {
      toast({
        title: "Erro",
        description: resultado.error || 'Erro ao pausar reserva',
        variant: "destructive",
      });
    }
  };

  const handleCancelar = async (reservaId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta reserva recorrente? Esta ação não pode ser desfeita.')) {
      const resultado = await cancelarReservaRecorrente(reservaId);
      
      if (resultado.success) {
        toast({
          title: "Reserva Cancelada",
          description: "A reserva recorrente foi cancelada com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: resultado.error || 'Erro ao cancelar reserva',
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-500';
      case 'pausada': return 'bg-yellow-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pausada': return 'Pausada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getTipoRecorrenciaLabel = (tipo: string) => {
    switch (tipo) {
      case 'semanal': return 'Semanal';
      case 'quinzenal': return 'Quinzenal';
      case 'mensal': return 'Mensal';
      default: return tipo;
    }
  };

  const formatarDiasSemana = (dias: number[]) => {
    const diasNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map(dia => diasNomes[dia]).join(', ');
  };

  const formatarHorario = (inicio: string, fim: string) => {
    return `${inicio} às ${fim}`;
  };

  if (reservasRecorrentes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">Nenhuma reserva recorrente encontrada</p>
          <p className="text-sm text-muted-foreground">
            Crie uma reserva recorrente para automatizar suas reservas regulares
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reservas Recorrentes</h3>
          <p className="text-sm text-muted-foreground">
            {reservasRecorrentes.length} reserva{reservasRecorrentes.length !== 1 ? 's' : ''} configurada{reservasRecorrentes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reservasRecorrentes.map((reserva) => (
          <Card key={reserva.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    {reserva.titulo}
                  </CardTitle>
                  {reserva.descricao && (
                    <CardDescription className="mt-1">
                      {reserva.descricao}
                    </CardDescription>
                  )}
                </div>
                
                <Badge className={getStatusColor(reserva.status)}>
                  {getStatusLabel(reserva.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Informações da Reserva */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Quadra {reserva.quadra_id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{formatarHorario(reserva.hora_inicio, reserva.hora_fim)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Repeat className="h-4 w-4 text-purple-600" />
                    <span>{getTipoRecorrenciaLabel(reserva.tipo_recorrencia)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span>
                      Desde {format(new Date(reserva.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  
                  {reserva.data_fim && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <span>
                        Até {format(new Date(reserva.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="font-medium">Valor:</span> R$ {reserva.valor_por_reserva.toFixed(2)}
                    {reserva.desconto_percentual > 0 && (
                      <span className="text-green-600 ml-1">
                        (-{reserva.desconto_percentual}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalhes da Recorrência */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium">Recorrência: </span>
                  {reserva.tipo_recorrencia === 'mensal' ? (
                    <span>Todo dia {reserva.dia_mes} do mês</span>
                  ) : (
                    <span>{formatarDiasSemana(reserva.dias_semana)}</span>
                  )}
                </div>
                <div className="text-sm mt-1">
                  <span className="font-medium">Reservas geradas: </span>
                  <span>{reserva.total_reservas_geradas}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Reservas
                </Button>
                
                {reserva.status === 'ativa' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePausar(reserva.id)}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pausar
                  </Button>
                )}
                
                {reserva.status === 'pausada' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePausar(reserva.id)} // Implementar reativar
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Reativar
                  </Button>
                )}
                
                {reserva.status !== 'cancelada' && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleCancelar(reserva.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}