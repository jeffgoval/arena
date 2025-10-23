"use client";

import { 
  FileQuestion, 
  Search, 
  Calendar, 
  Users, 
  MapPin,
  ClipboardList,
  AlertCircle,
  Inbox,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  titulo: string;
  descricao?: string;
  acao?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// Empty State Genérico
export function EmptyState({
  icon: Icon = Inbox,
  titulo,
  descricao,
  acao,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("p-12 text-center border-0 shadow-soft", className)}>
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{titulo}</h3>
        
        {descricao && (
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {descricao}
          </p>
        )}
        
        {acao && (
          <Button onClick={acao.onClick}>
            {acao.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

// Empty State para Busca sem Resultados
export function EmptySearchState({ 
  termoBusca,
  onLimparBusca 
}: { 
  termoBusca: string;
  onLimparBusca?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      titulo="Nenhum resultado encontrado"
      descricao={`Não encontramos resultados para "${termoBusca}". Tente usar outros termos de busca.`}
      acao={onLimparBusca ? {
        label: "Limpar busca",
        onClick: onLimparBusca
      } : undefined}
    />
  );
}

// Empty State para Reservas
export function EmptyReservasState({ 
  onNovaReserva 
}: { 
  onNovaReserva?: () => void;
}) {
  return (
    <EmptyState
      icon={Calendar}
      titulo="Nenhuma reserva encontrada"
      descricao="Você ainda não possui reservas. Comece agora e garanta seu horário!"
      acao={onNovaReserva ? {
        label: "Fazer Reserva",
        onClick: onNovaReserva
      } : undefined}
    />
  );
}

// Empty State para Quadras
export function EmptyQuadrasState({ 
  onNovaQuadra 
}: { 
  onNovaQuadra?: () => void;
}) {
  return (
    <EmptyState
      icon={MapPin}
      titulo="Nenhuma quadra cadastrada"
      descricao="Comece criando sua primeira quadra para gerenciar horários e bloqueios."
      acao={onNovaQuadra ? {
        label: "Criar Primeira Quadra",
        onClick: onNovaQuadra
      } : undefined}
    />
  );
}

// Empty State para Usuários/Clientes
export function EmptyUsuariosState({ 
  onNovoUsuario 
}: { 
  onNovoUsuario?: () => void;
}) {
  return (
    <EmptyState
      icon={Users}
      titulo="Nenhum usuário encontrado"
      descricao="A lista de usuários está vazia. Adicione o primeiro usuário para começar."
      acao={onNovoUsuario ? {
        label: "Adicionar Usuário",
        onClick: onNovoUsuario
      } : undefined}
    />
  );
}

// Empty State para Lista Genérica
export function EmptyListState({ 
  tipo = "item",
  onNovo 
}: { 
  tipo?: string;
  onNovo?: () => void;
}) {
  return (
    <EmptyState
      icon={ClipboardList}
      titulo={`Nenhum ${tipo} encontrado`}
      descricao={`A lista está vazia. Adicione o primeiro ${tipo} para começar.`}
      acao={onNovo ? {
        label: `Adicionar ${tipo}`,
        onClick: onNovo
      } : undefined}
    />
  );
}

// Empty State para Erros/Sem Permissão
export function EmptyErrorState({ 
  titulo = "Algo deu errado",
  descricao = "Não foi possível carregar os dados. Tente novamente mais tarde.",
  onTentarNovamente
}: { 
  titulo?: string;
  descricao?: string;
  onTentarNovamente?: () => void;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      titulo={titulo}
      descricao={descricao}
      acao={onTentarNovamente ? {
        label: "Tentar Novamente",
        onClick: onTentarNovamente
      } : undefined}
    />
  );
}

// Empty State Inline (menor, para usar dentro de cards)
export function EmptyStateInline({
  icon: Icon = Inbox,
  mensagem,
  className
}: {
  icon?: LucideIcon;
  mensagem: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center py-8", className)}>
      <Icon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{mensagem}</p>
    </div>
  );
}

// Empty State com Ilustração Customizada
export function EmptyStateCustom({
  ilustracao,
  titulo,
  descricao,
  acoes,
  className
}: {
  ilustracao: React.ReactNode;
  titulo: string;
  descricao?: string;
  acoes?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-12 text-center border-0 shadow-soft", className)}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          {ilustracao}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{titulo}</h3>
        
        {descricao && (
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {descricao}
          </p>
        )}
        
        {acoes && (
          <div className="flex gap-3 justify-center">
            {acoes}
          </div>
        )}
      </div>
    </Card>
  );
}
