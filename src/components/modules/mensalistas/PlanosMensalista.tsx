'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMensalistas } from '@/hooks/useMensalistas';
import type { PlanoMensalista } from '@/types/mensalistas.types';

interface PlanosMensalistaProps {
  onPlanoSelecionado?: (plano: PlanoMensalista) => void;
}

export function PlanosMensalista({ onPlanoSelecionado }: PlanosMensalistaProps) {
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoMensalista | null>(null);
  const [diaVencimento, setDiaVencimento] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  
  const { planos, assinatura, criarAssinatura } = useMensalistas();
  const { toast } = useToast();

  const handleSelecionarPlano = (plano: PlanoMensalista) => {
    if (assinatura) {
      toast({
        title: "Assinatura Ativa",
        description: "Você já possui uma assinatura ativa. Cancele a atual para contratar um novo plano.",
        variant: "destructive",
      });
      return;
    }

    setPlanoSelecionado(plano);
    setDialogAberto(true);
    onPlanoSelecionado?.(plano);
  };

  const handleConfirmarAssinatura = async () => {
    if (!planoSelecionado || !diaVencimento) {
      toast({
        title: "Erro",
        description: "Selecione um dia de vencimento",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const resultado = await criarAssinatura(planoSelecionado.id, parseInt(diaVencimento));
      
      if (resultado.success) {
        toast({
          title: "Sucesso! 🎉",
          description: "Assinatura criada com sucesso!",
        });
        setDialogAberto(false);
        setPlanoSelecionado(null);
        setDiaVencimento('');
      } else {
        toast({
          title: "Erro",
          description: resultado.error || 'Erro ao criar assinatura',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar assinatura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanoIcon = (nome: string) => {
    if (nome.toLowerCase().includes('premium')) return Crown;
    if (nome.toLowerCase().includes('intermediário')) return Star;
    return Shield;
  };

  const getPlanoColor = (nome: string) => {
    if (nome.toLowerCase().includes('premium')) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
    if (nome.toLowerCase().includes('intermediário')) return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
    return 'text-green-600 bg-green-50 dark:bg-green-950';
  };

  const formatarHorarios = (horarios: any[]) => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return horarios.map((horario, index) => (
      <div key={index} className="text-sm">
        <span className="font-medium">
          {horario.dias_semana.map((dia: number) => diasSemana[dia]).join(', ')}:
        </span>
        <span className="ml-1">
          {horario.hora_inicio} às {horario.hora_fim}
        </span>
      </div>
    ));
  };

  if (assinatura) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Você já é mensalista!</h3>
          <p className="text-muted-foreground">
            Você possui uma assinatura ativa do plano {assinatura.plano?.nome}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Planos Mensalistas</h2>
        <p className="text-muted-foreground">
          Escolha o plano ideal para sua frequência de jogo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((plano) => {
          const Icon = getPlanoIcon(plano.nome);
          const colorClass = getPlanoColor(plano.nome);
          const valorPorHora = plano.valor_mensal / plano.horas_incluidas;
          
          return (
            <Card 
              key={plano.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                plano.nome.toLowerCase().includes('premium') 
                  ? 'border-yellow-200 dark:border-yellow-800' 
                  : ''
              }`}
            >
              {plano.nome.toLowerCase().includes('premium') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8" />
                </div>
                
                <CardTitle className="text-xl">{plano.nome}</CardTitle>
                <CardDescription>{plano.descricao}</CardDescription>
                
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    R$ {plano.valor_mensal.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">por mês</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    R$ {valorPorHora.toFixed(2)} por hora
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Horas Incluídas */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    <strong>{plano.horas_incluidas}h</strong> incluídas por mês
                  </span>
                </div>
                
                {/* Valor Hora Extra */}
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    Hora extra: <strong>R$ {plano.horas_extras_valor.toFixed(2)}</strong>
                  </span>
                </div>
                
                {/* Horários Permitidos */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Horários permitidos:</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {formatarHorarios(plano.horarios_permitidos)}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSelecionarPlano(plano)}
                  className="w-full mt-6"
                  variant={plano.nome.toLowerCase().includes('premium') ? 'default' : 'outline'}
                >
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Confirmação */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Assinatura</DialogTitle>
            <DialogDescription>
              Você está prestes a assinar o plano {planoSelecionado?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {planoSelecionado && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{planoSelecionado.nome}</h4>
                <div className="text-sm space-y-1">
                  <div>Valor mensal: <strong>R$ {planoSelecionado.valor_mensal.toFixed(2)}</strong></div>
                  <div>Horas incluídas: <strong>{planoSelecionado.horas_incluidas}h</strong></div>
                  <div>Hora extra: <strong>R$ {planoSelecionado.horas_extras_valor.toFixed(2)}</strong></div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="diaVencimento">Dia de vencimento da mensalidade</Label>
              <Select value={diaVencimento} onValueChange={setDiaVencimento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                    <SelectItem key={dia} value={dia.toString()}>
                      Dia {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                A primeira cobrança será feita no próximo dia {diaVencimento}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDialogAberto(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmarAssinatura}
                disabled={loading || !diaVencimento}
                className="flex-1"
              >
                {loading ? 'Processando...' : 'Confirmar Assinatura'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}