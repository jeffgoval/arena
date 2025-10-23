'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Users, 
  Copy, 
  Eye, 
  XCircle,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Convite } from '@/types/convites.types';
import { CONVITE_STATUS_LABELS, CONVITE_STATUS_COLORS } from '@/types/convites.types';

interface ConviteCardProps {
  convite: Convite;
  onCopiarLink: (token: string) => void;
  onVerAceites: (conviteId: string) => void;
  onDesativar: (conviteId: string) => void;
}

export function ConviteCard({ 
  convite, 
  onCopiarLink, 
  onVerAceites, 
  onDesativar 
}: ConviteCardProps) {
  const [loading, setLoading] = useState(false);

  const handleDesativar = async () => {
    setLoading(true);
    await onDesativar(convite.id);
    setLoading(false);
  };

  const vagasOcupadas = convite.vagas_totais - convite.vagas_disponiveis;
  const percentualOcupacao = (vagasOcupadas / convite.vagas_totais) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {convite.reserva?.quadra?.nome || 'Quadra'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {convite.reserva?.quadra?.tipo || 'Tipo não especificado'}
            </p>
          </div>
          <Badge className={CONVITE_STATUS_COLORS[convite.status]}>
            {CONVITE_STATUS_LABELS[convite.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Data e Horário */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>
            {convite.reserva?.data 
              ? format(new Date(convite.reserva.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
              : 'Data não disponível'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>
            {convite.reserva?.horario?.hora_inicio || '--:--'} às{' '}
            {convite.reserva?.horario?.hora_fim || '--:--'}
          </span>
        </div>

        {/* Vagas */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>Vagas</span>
            </div>
            <span className="font-medium">
              {vagasOcupadas} / {convite.vagas_totais}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${percentualOcupacao}%` }}
            />
          </div>
        </div>

        {/* Valor por pessoa */}
        {convite.valor_por_pessoa && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>
              R$ {convite.valor_por_pessoa.toFixed(2)} por pessoa
            </span>
          </div>
        )}

        {/* Mensagem */}
        {convite.mensagem && (
          <div className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
            "{convite.mensagem}"
          </div>
        )}

        {/* Total de aceites */}
        <div className="text-sm text-muted-foreground">
          {convite.total_aceites} {convite.total_aceites === 1 ? 'pessoa aceitou' : 'pessoas aceitaram'}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopiarLink(convite.token)}
          className="flex-1"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copiar Link
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onVerAceites(convite.id)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Aceites
        </Button>

        {convite.status === 'ativo' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDesativar}
            disabled={loading}
            className="text-destructive hover:text-destructive"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
