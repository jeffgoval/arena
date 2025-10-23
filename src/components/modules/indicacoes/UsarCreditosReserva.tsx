'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Coins, Calculator, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIndicacoes } from '@/hooks/useIndicacoes';

interface UsarCreditosReservaProps {
  valorTotal: number;
  onCreditosAplicados: (valorCreditos: number, novoTotal: number) => void;
  reservaId?: string;
  disabled?: boolean;
}

export function UsarCreditosReserva({ 
  valorTotal, 
  onCreditosAplicados, 
  reservaId,
  disabled = false 
}: UsarCreditosReservaProps) {
  const [valorCreditos, setValorCreditos] = useState(0);
  const [creditosAplicados, setCreditosAplicados] = useState(false);
  const { estatisticas, usarCreditos } = useIndicacoes();
  const { toast } = useToast();

  const creditosDisponiveis = estatisticas?.creditos_disponiveis || 0;
  const maxCreditos = Math.min(creditosDisponiveis, valorTotal);
  const novoTotal = valorTotal - valorCreditos;

  useEffect(() => {
    onCreditosAplicados(valorCreditos, novoTotal);
  }, [valorCreditos, novoTotal, onCreditosAplicados]);

  const handleAplicarCreditos = async () => {
    if (!reservaId) {
      toast({
        title: "Erro",
        description: "ID da reserva não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (valorCreditos <= 0) {
      toast({
        title: "Erro",
        description: "Selecione um valor de créditos para usar",
        variant: "destructive",
      });
      return;
    }

    const resultado = await usarCreditos(valorCreditos, reservaId);
    
    if (resultado.success) {
      setCreditosAplicados(true);
      toast({
        title: "Sucesso!",
        description: `${valorCreditos} créditos aplicados à reserva`,
      });
    } else {
      toast({
        title: "Erro",
        description: resultado.error || "Erro ao aplicar créditos",
        variant: "destructive",
      });
    }
  };

  const handleUsarTodosCreditos = () => {
    setValorCreditos(maxCreditos);
  };

  const handleUsarMetadeCreditos = () => {
    setValorCreditos(Math.floor(maxCreditos / 2));
  };

  if (creditosDisponiveis === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Coins className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Você não possui créditos de indicação disponíveis.</p>
            <p className="text-xs">Indique amigos para ganhar créditos!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Usar Créditos de Indicação
          {creditosAplicados && (
            <Badge variant="default" className="ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Aplicado
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Você tem {creditosDisponiveis} créditos disponíveis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo da Reserva */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Valor da Reserva:</span>
            <span className="font-medium">R$ {valorTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Créditos Aplicados:</span>
            <span className="font-medium text-green-600">
              - R$ {valorCreditos.toFixed(2)}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-medium">Total a Pagar:</span>
            <span className="font-bold text-lg">
              R$ {novoTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {!creditosAplicados && !disabled && (
          <>
            {/* Controle de Créditos */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="valorCreditos">
                  Valor em Créditos (máx: {maxCreditos})
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="valorCreditos"
                    type="number"
                    min="0"
                    max={maxCreditos}
                    value={valorCreditos}
                    onChange={(e) => setValorCreditos(Math.min(Number(e.target.value), maxCreditos))}
                    placeholder="0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUsarMetadeCreditos}
                    disabled={maxCreditos < 2}
                  >
                    50%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUsarTodosCreditos}
                  >
                    Máx
                  </Button>
                </div>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValorCreditos(Math.min(10, maxCreditos))}
                  disabled={maxCreditos < 10}
                >
                  R$ 10
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValorCreditos(Math.min(25, maxCreditos))}
                  disabled={maxCreditos < 25}
                >
                  R$ 25
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValorCreditos(Math.min(50, maxCreditos))}
                  disabled={maxCreditos < 50}
                >
                  R$ 50
                </Button>
              </div>
            </div>

            {/* Botão Aplicar */}
            {valorCreditos > 0 && (
              <Button 
                onClick={handleAplicarCreditos}
                className="w-full"
                disabled={disabled}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Aplicar {valorCreditos} Créditos
              </Button>
            )}
          </>
        )}

        {creditosAplicados && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 dark:text-green-300 font-medium">
              Créditos aplicados com sucesso!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Economia de R$ {valorCreditos.toFixed(2)}
            </p>
          </div>
        )}

        {/* Informação sobre Créditos */}
        <div className="text-xs text-muted-foreground">
          💡 Os créditos são aplicados automaticamente no valor de 1:1 (1 crédito = R$ 1,00)
        </div>
      </CardContent>
    </Card>
  );
}