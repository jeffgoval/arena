'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target } from 'lucide-react';
import type { EstatisticasIndicacao } from '@/types/indicacoes.types';

interface ProgressoBonusIndicacoesProps {
  estatisticas: EstatisticasIndicacao | null;
}

export function ProgressoBonusIndicacoes({ estatisticas }: ProgressoBonusIndicacoesProps) {
  if (!estatisticas) {
    return null;
  }

  // Configuração dos bônus (idealmente viria da API)
  const bonusConfig = [
    { quantidade: 5, creditos_bonus: 25 },
    { quantidade: 10, creditos_bonus: 50 },
    { quantidade: 20, creditos_bonus: 100 },
  ];

  const indicacoesAceitas = estatisticas.indicacoes_aceitas;

  // Encontrar próximo objetivo
  const proximoObjetivo = bonusConfig.find(bonus => bonus.quantidade > indicacoesAceitas);
  const objetivoAtual = proximoObjetivo || bonusConfig[bonusConfig.length - 1];

  // Calcular progresso
  const progresso = proximoObjetivo 
    ? Math.min((indicacoesAceitas / proximoObjetivo.quantidade) * 100, 100)
    : 100;

  const faltam = proximoObjetivo 
    ? proximoObjetivo.quantidade - indicacoesAceitas
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Bônus por Múltiplas Indicações
        </CardTitle>
        <CardDescription>
          Ganhe créditos extras ao atingir metas de indicações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progresso Atual */}
        {proximoObjetivo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  Próxima Meta: {proximoObjetivo.quantidade} indicações
                </span>
              </div>
              <Badge variant="outline">
                +{proximoObjetivo.creditos_bonus} créditos
              </Badge>
            </div>
            
            <Progress value={progresso} className="h-3" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{indicacoesAceitas} de {proximoObjetivo.quantidade}</span>
              <span>
                {faltam > 0 ? `Faltam ${faltam}` : 'Meta atingida!'}
              </span>
            </div>
          </div>
        )}

        {/* Lista de Todas as Metas */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Todas as Metas:</h4>
          <div className="space-y-2">
            {bonusConfig.map((bonus) => {
              const atingida = indicacoesAceitas >= bonus.quantidade;
              const atual = proximoObjetivo?.quantidade === bonus.quantidade;
              
              return (
                <div
                  key={bonus.quantidade}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    atingida 
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                      : atual
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      atingida 
                        ? 'bg-green-500 text-white' 
                        : atual
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {atingida ? '✓' : bonus.quantidade}
                    </div>
                    <div>
                      <div className="font-medium">
                        {bonus.quantidade} indicações aceitas
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bônus de {bonus.creditos_bonus} créditos
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={atingida ? 'default' : atual ? 'secondary' : 'outline'}
                  >
                    {atingida ? 'Conquistado' : atual ? 'Em progresso' : 'Bloqueado'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivação */}
        {!proximoObjetivo && (
          <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="font-semibold text-yellow-800 dark:text-yellow-200">
              🎉 Parabéns! Você conquistou todas as metas!
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Continue indicando amigos para ajudar a comunidade crescer!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}