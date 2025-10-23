"use client";

import React from "react";
import { 
  ContextualTooltip, 
  HelpTooltip, 
  FeatureTooltip, 
  StatusTooltip 
} from "./ContextualTooltip";
import { DefinitionTooltip, ProgressTooltip } from "./InlineTooltip";
import { 
  Calendar, 
  Users, 
  Trophy, 
  CreditCard, 
  Gift,
  Star,
  Clock,
  MapPin,
  DollarSign
} from "lucide-react";

// Tooltips específicos para funcionalidades do Arena

export function ReservaTooltip({ children }: { children: React.ReactNode }) {
  return (
    <FeatureTooltip
      title="Sistema de Reservas"
      description="Reserve quadras de forma rápida e organize seus jogos com facilidade. Gerencie horários, participantes e pagamentos em um só lugar."
      children={children}
    />
  );
}

export function RateioTooltip({ children }: { children: React.ReactNode }) {
  return (
    <FeatureTooltip
      title="Rateio Inteligente"
      description="Divida automaticamente os custos entre os participantes. O sistema calcula valores, envia cobranças e acompanha pagamentos."
      children={children}
    />
  );
}

export function IndicacoesTooltip({ children }: { children: React.ReactNode }) {
  return (
    <FeatureTooltip
      title="Programa de Indicações"
      description="Ganhe créditos indicando amigos para a plataforma. Quanto mais pessoas você trouxer, mais benefícios você recebe."
      isPremium={true}
      children={children}
    />
  );
}

export function TurmasTooltip({ children }: { children: React.ReactNode }) {
  return (
    <FeatureTooltip
      title="Gestão de Turmas"
      description="Crie e gerencie grupos fixos de jogadores. Ideal para peladas regulares, aulas e campeonatos."
      children={children}
    />
  );
}

export function CreditosTooltip({ children }: { children: React.ReactNode }) {
  return (
    <ContextualTooltip
      content={
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Seus Créditos
          </h4>
          <p className="text-xs">
            Use seus créditos para pagar reservas, taxas de rateio ou outras funcionalidades da plataforma.
          </p>
          <div className="text-xs text-muted-foreground">
            • Ganhe créditos com indicações<br/>
            • Receba bônus por atividade<br/>
            • Válidos por 12 meses
          </div>
        </div>
      }
      variant="info"
      showIcon={true}
      maxWidth="md"
    >
      {children}
    </ContextualTooltip>
  );
}

// Tooltips de status para reservas
interface ReservaStatusTooltipProps {
  status: "confirmada" | "pendente" | "cancelada" | "em_andamento";
  children: React.ReactNode;
}

export function ReservaStatusTooltip({ status, children }: ReservaStatusTooltipProps) {
  const statusConfig = {
    confirmada: {
      variant: "success" as const,
      title: "Reserva Confirmada",
      description: "Sua reserva está confirmada e o pagamento foi processado."
    },
    pendente: {
      variant: "warning" as const,
      title: "Aguardando Confirmação",
      description: "Reserva criada, aguardando confirmação de pagamento ou disponibilidade."
    },
    cancelada: {
      variant: "error" as const,
      title: "Reserva Cancelada",
      description: "Esta reserva foi cancelada. Verifique se houve reembolso."
    },
    em_andamento: {
      variant: "info" as const,
      title: "Jogo em Andamento",
      description: "O jogo está acontecendo agora. Divirta-se!"
    }
  };

  const config = statusConfig[status];

  return (
    <StatusTooltip
      status={config.variant}
      title={config.title}
      description={config.description}
      children={children}
    />
  );
}

// Tooltip para explicar sistema de pontuação
export function PontuacaoTooltip({ children }: { children: React.ReactNode }) {
  return (
    <DefinitionTooltip
      term="Sistema de Pontuação"
      definition={
        <div className="space-y-2">
          <p>Ganhe pontos participando de atividades:</p>
          <ul className="text-xs space-y-1">
            <li>• Reserva confirmada: +10 pontos</li>
            <li>• Indicação aceita: +50 pontos</li>
            <li>• Avaliação da quadra: +5 pontos</li>
            <li>• Participação em torneio: +25 pontos</li>
          </ul>
          <p className="text-xs">Use pontos para descontos e benefícios!</p>
        </div>
      }
      children={children}
    />
  );
}

// Tooltip para horários de funcionamento
interface HorarioTooltip {
  horarios: {
    abertura: string;
    fechamento: string;
    dias: string[];
  };
  children: React.ReactNode;
}

export function HorarioTooltip({ horarios, children }: HorarioTooltip) {
  return (
    <ContextualTooltip
      content={
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horário de Funcionamento
          </h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>{horarios.dias.join(", ")}</span>
              <span>{horarios.abertura} - {horarios.fechamento}</span>
            </div>
          </div>
        </div>
      }
      variant="info"
      showIcon={true}
    >
      {children}
    </ContextualTooltip>
  );
}

// Tooltip para localização
interface LocalizacaoTooltipProps {
  endereco: string;
  distancia?: string;
  children: React.ReactNode;
}

export function LocalizacaoTooltip({ endereco, distancia, children }: LocalizacaoTooltipProps) {
  return (
    <ContextualTooltip
      content={
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Localização
          </h4>
          <p className="text-xs">{endereco}</p>
          {distancia && (
            <p className="text-xs text-muted-foreground">
              Distância: {distancia}
            </p>
          )}
        </div>
      }
      variant="info"
      showIcon={true}
    >
      {children}
    </ContextualTooltip>
  );
}

// Tooltip para preços
interface PrecoTooltipProps {
  preco: number;
  descricao?: string;
  promocao?: {
    precoOriginal: number;
    desconto: number;
  };
  children: React.ReactNode;
}

export function PrecoTooltip({ preco, descricao, promocao, children }: PrecoTooltipProps) {
  return (
    <ContextualTooltip
      content={
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Detalhes do Preço
          </h4>
          
          {promocao ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-muted-foreground">
                  R$ {promocao.precoOriginal.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  R$ {preco.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-green-600">
                Desconto de {promocao.desconto}%
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold">R$ {preco.toFixed(2)}</p>
          )}
          
          {descricao && (
            <p className="text-xs text-muted-foreground">{descricao}</p>
          )}
        </div>
      }
      variant="info"
      showIcon={true}
    >
      {children}
    </ContextualTooltip>
  );
}

// Tooltip para progresso de metas
interface MetaProgressoTooltipProps {
  meta: {
    nome: string;
    atual: number;
    total: number;
    recompensa: string;
  };
  children: React.ReactNode;
}

export function MetaProgressoTooltip({ meta, children }: MetaProgressoTooltipProps) {
  return (
    <ProgressTooltip
      current={meta.atual}
      total={meta.total}
      label={meta.nome}
      details={`Recompensa: ${meta.recompensa}`}
      children={children}
    />
  );
}

// Tooltip para novidades/features
export function NovidadeTooltip({ children }: { children: React.ReactNode }) {
  return (
    <FeatureTooltip
      title="Nova Funcionalidade!"
      description="Esta é uma funcionalidade recém-lançada. Experimente e nos dê seu feedback!"
      isNew={true}
      children={children}
    />
  );
}

// Tooltip para ajuda contextual
interface AjudaContextualProps {
  titulo: string;
  conteudo: React.ReactNode;
  children?: React.ReactNode;
}

export function AjudaContextual({ titulo, conteudo, children }: AjudaContextualProps) {
  return (
    <HelpTooltip
      content={
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{titulo}</h4>
          <div className="text-xs">{conteudo}</div>
        </div>
      }
      variant="info"
      maxWidth="lg"
    />
  );
}