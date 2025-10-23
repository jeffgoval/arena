'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Gift, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CreditoIndicacao, EstatisticasIndicacao } from '@/types/indicacoes.types';

interface CreditosIndicacaoProps {
  creditos: CreditoIndicacao[];
  estatisticas: EstatisticasIndicacao | null;
}

export function CreditosIndicacao({ creditos, estatisticas }: CreditosIndicacaoProps) {
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'indicacao_aceita':
        return 'Indicação Aceita';
      case 'bonus_multiplas_indicacoes':
        return 'Bônus Múltiplas Indicações';
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'indicacao_aceita':
        return <Gift className="h-4 w-4" />;
      case 'bonus_multiplas_indicacoes':
        return <Coins className="h-4 w-4" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo dos Créditos */}
      {estatisticas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Resumo dos Créditos
            </CardTitle>
            <CardDescription>
              Acompanhe seus créditos de indicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {estatisticas.creditos_disponiveis}
                </div>
                <div className="text-sm text-green-600/80">Créditos Disponíveis</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {estatisticas.total_creditos_recebidos}
                </div>
                <div className="text-sm text-blue-600/80">Total Recebido</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {estatisticas.creditos_utilizados}
                </div>
                <div className="text-sm text-gray-600/80">Créditos Utilizados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Créditos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Créditos
          </CardTitle>
          <CardDescription>
            Todos os créditos recebidos por indicações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {creditos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Você ainda não possui créditos de indicação.</p>
              <p className="text-sm">Indique amigos para começar a ganhar créditos!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {creditos.map((credito) => (
                <div
                  key={credito.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      {getTipoIcon(credito.tipo)}
                    </div>
                    
                    <div>
                      <div className="font-medium">
                        {getTipoLabel(credito.tipo)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {credito.descricao}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(credito.data_criacao), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                      {credito.usado && credito.data_uso && (
                        <div className="text-xs text-orange-600">
                          Usado {formatDistanceToNow(new Date(credito.data_uso), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        +{credito.valor_credito}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        créditos
                      </div>
                    </div>
                    
                    <Badge variant={credito.usado ? 'secondary' : 'default'}>
                      {credito.usado ? 'Usado' : 'Disponível'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}