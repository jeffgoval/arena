'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Indicacao } from '@/types/indicacoes.types';

interface ListaIndicacoesProps {
  indicacoes: Indicacao[];
}

export function ListaIndicacoes({ indicacoes }: ListaIndicacoesProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aceita':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'expirada':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'aceita':
        return 'default' as const;
      case 'expirada':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aceita':
        return 'Aceita';
      case 'expirada':
        return 'Expirada';
      default:
        return 'Pendente';
    }
  };

  if (indicacoes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suas Indicações
          </CardTitle>
          <CardDescription>
            Acompanhe o status das pessoas que você indicou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Você ainda não fez nenhuma indicação.</p>
            <p className="text-sm">Comece indicando seus amigos para ganhar créditos!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Suas Indicações ({indicacoes.length})
        </CardTitle>
        <CardDescription>
          Acompanhe o status das pessoas que você indicou
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indicacoes.map((indicacao) => (
            <div
              key={indicacao.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {indicacao.nome_indicado || indicacao.email_indicado}
                  </span>
                  {getStatusIcon(indicacao.status)}
                </div>
                
                {indicacao.email_indicado && indicacao.nome_indicado && (
                  <div className="text-sm text-muted-foreground mb-1">
                    {indicacao.email_indicado}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Indicado {formatDistanceToNow(new Date(indicacao.data_criacao), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
                
                {indicacao.status === 'aceita' && indicacao.data_aceite && (
                  <div className="text-xs text-green-600">
                    Aceito {formatDistanceToNow(new Date(indicacao.data_aceite), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {indicacao.creditos_concedidos > 0 && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      +{indicacao.creditos_concedidos} créditos
                    </div>
                  </div>
                )}
                
                <Badge variant={getStatusVariant(indicacao.status)}>
                  {getStatusLabel(indicacao.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}