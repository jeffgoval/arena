"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Convite, CONVITE_STATUS_LABELS, CONVITE_STATUS_COLORS } from "@/types/convites.types";
import { Calendar, Clock, MapPin, Users, DollarSign, Share2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConviteCardProps {
  convite: Convite;
  onShare?: (convite: Convite) => void;
  onCopyLink?: (convite: Convite) => void;
  className?: string;
  showActions?: boolean;
}

export function ConviteCard({
  convite,
  onShare,
  onCopyLink,
  className,
  showActions = true,
}: ConviteCardProps) {
  const vagasRestantes = convite.vagas_disponiveis;
  const percentualOcupado = ((convite.vagas_totais - vagasRestantes) / convite.vagas_totais) * 100;

  return (
    <Card className={cn("border-0 shadow-soft hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {convite.reserva?.quadra?.nome || "Quadra"}
            </CardTitle>
            <Badge className={cn("text-xs", CONVITE_STATUS_COLORS[convite.status])}>
              {CONVITE_STATUS_LABELS[convite.status]}
            </Badge>
          </div>
          {showActions && (
            <div className="flex gap-2">
              {onCopyLink && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCopyLink(convite)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShare(convite)}
                  className="h-8 w-8"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações da Reserva */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {convite.reserva?.data
                ? format(new Date(convite.reserva.data), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
                : "Data não definida"}
            </span>
          </div>

          {convite.reserva?.horario && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {convite.reserva.horario.hora_inicio} - {convite.reserva.horario.hora_fim}
              </span>
            </div>
          )}

          {convite.reserva?.quadra?.tipo && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{convite.reserva.quadra.tipo}</span>
            </div>
          )}
        </div>

        {/* Vagas Disponíveis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Vagas</span>
            </div>
            <span className="text-muted-foreground">
              {vagasRestantes} de {convite.vagas_totais} disponíveis
            </span>
          </div>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                percentualOcupado >= 100
                  ? "bg-blue-500"
                  : percentualOcupado >= 75
                  ? "bg-orange-500"
                  : "bg-green-500"
              )}
              style={{ width: `${percentualOcupado}%` }}
            />
          </div>
        </div>

        {/* Valor por Pessoa */}
        {convite.valor_por_pessoa && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              R$ {convite.valor_por_pessoa.toFixed(2)} por pessoa
            </span>
          </div>
        )}

        {/* Mensagem do Organizador */}
        {convite.mensagem && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground italic">
              &quot;{convite.mensagem}&quot;
            </p>
          </div>
        )}

        {/* Organizador */}
        {convite.organizador && (
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Organizado por {convite.organizador.nome_completo}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
