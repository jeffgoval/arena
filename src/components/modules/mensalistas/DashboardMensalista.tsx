'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Pause,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useMensalistas } from '@/hooks/useMensalistas';

export function DashboardMensalista() {
  const { assinatura, estatisticas, pausarAssinatura, cancelarAssinatura } = useMensalistas();
  const { toast } = useToast();

  if (!assinatura || !assinatura.plano || !estatisticas) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Você não possui uma assinatura ativa</p>
        </CardContent>
      </Card>
    );
  }

  const handlePausar = async () => {
    const resultado = await pausarAssinatura();
    
    if (resultado.success) {
      toast({
        title: "Assinatura Pausada",
        description: "Sua assinatura foi pausada com sucesso",
      });
    } else {
      toast({
        title: "Erro",
        description: resultado.error || 'Erro ao pausar assinatura',
        variant: "destructive",
      });
    }
  };

  const handleCancelar = async () => {
    if (confirm('Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.')) {
      const resultado = await cancelarAssinatura();
      
      if (resultado.success) {
        toast({
          title: "Assinatura Cancelada",
          description: "Sua assinatura foi cancelada com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: resultado.error || 'Erro ao cancelar assinatura',
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
      case 'vencida': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pausada': return 'Pausada';
      case 'cancelada': return 'Cancelada';
      case 'vencida': return 'Vencida';
      default: return status;
    }
  };

  const proximaCobranca = new Date(estatisticas.proxima_cobranca);
  const diasParaVencimento = Math.ceil((proximaCobranca.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Assinatura */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Plano {assinatura.plano.nome}
              </CardTitle>
              <CardDescription>
                Assinatura desde {format(new Date(assinatura.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(assinatura.status)}>
                {getStatusLabel(assinatura.status)}
              </Badge>
              <div className="text-right">
                <div className="text-2xl font-bold">R$ {assinatura.valor_mensal.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">por mês</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Horas Utilizadas</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {estatisticas.horas_utilizadas_mes}h
            </div>
            <div className="text-xs text-muted-foreground">
              de {assinatura.plano.horas_incluidas}h incluídas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Horas Restantes</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {estatisticas.horas_restantes_mes}h
            </div>
            <div className="text-xs text-muted-foreground">
              {estatisticas.percentual_uso}% utilizado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Reservas do Mês</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {estatisticas.reservas_realizadas_mes}
            </div>
            <div className="text-xs text-muted-foreground">
              reservas realizadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Próximo Vencimento</span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              {diasParaVencimento > 0 ? `${diasParaVencimento} dias` : 'Hoje'}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(proximaCobranca, 'dd/MM/yyyy', { locale: ptBR })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uso Mensal</CardTitle>
          <CardDescription>
            Acompanhe o uso das suas horas incluídas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Horas utilizadas</span>
              <span>{estatisticas.horas_utilizadas_mes}h / {assinatura.plano.horas_incluidas}h</span>
            </div>
            <Progress 
              value={estatisticas.percentual_uso} 
              className="h-3"
            />
          </div>
          
          {estatisticas.percentual_uso > 80 && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800 dark:text-amber-200">
                Você já utilizou {estatisticas.percentual_uso}% das suas horas. 
                Horas extras custam R$ {assinatura.plano.horas_extras_valor.toFixed(2)} cada.
              </span>
            </div>
          )}
          
          {estatisticas.valor_economizado > 0 && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Você economizou R$ {estatisticas.valor_economizado.toFixed(2)} este mês com sua assinatura!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações da Assinatura */}
      {assinatura.status === 'ativa' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gerenciar Assinatura</CardTitle>
            <CardDescription>
              Pause ou cancele sua assinatura quando necessário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePausar}
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pausar Assinatura
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelar}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar Assinatura
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pausar: Suspende cobranças temporariamente. Cancelar: Encerra definitivamente a assinatura.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}