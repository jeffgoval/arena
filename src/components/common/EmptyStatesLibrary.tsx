/**
 * Empty States Library
 * Contextual empty states with specific actions
 */

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Calendar,
  CalendarPlus,
  Users,
  UserPlus,
  CreditCard,
  Wallet,
  Trophy,
  Search,
  Filter,
  MessageSquare,
  Bell,
  Star,
  MapPin,
  FileText,
  Settings,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

interface EmptyStateProps {
  className?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

/**
 * No Bookings Empty State
 */
export function NoBookingsEmpty({ className, onAction }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-primary/10 rounded-full"
        >
          <Calendar className="h-12 w-12 text-primary" />
        </motion.div>

        <h3 className="mb-2">Nenhuma reserva ainda</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Que tal começar reservando uma quadra? É rápido e fácil!
        </p>

        {onAction && (
          <Button onClick={onAction} size="lg" className="gap-2">
            <CalendarPlus className="h-5 w-5" />
            Fazer Reserva
          </Button>
        )}

        {/* Visual hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span>Quadras disponíveis</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Reserva instantânea</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

/**
 * No Invitations Empty State
 */
export function NoInvitationsEmpty({ className, onAction }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-accent/10 rounded-full"
        >
          <Users className="h-12 w-12 text-accent" />
        </motion.div>

        <h3 className="mb-2">Nenhum convite recebido</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Quando alguém te convidar para jogar, você verá os convites aqui
        </p>

        {onAction && (
          <Button variant="outline" onClick={onAction} className="gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar Amigos
          </Button>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Compartilhe seu perfil com amigos para receber convites
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * No Transactions Empty State
 */
export function NoTransactionsEmpty({ className, onAction }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-warning/10 rounded-full"
        >
          <Wallet className="h-12 w-12 text-warning" />
        </motion.div>

        <h3 className="mb-2">Nenhuma transação</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Seu histórico de pagamentos e recargas aparecerá aqui
        </p>

        {onAction && (
          <Button onClick={onAction} variant="outline" className="gap-2">
            <CreditCard className="h-5 w-5" />
            Adicionar Créditos
          </Button>
        )}

        {/* Balance display */}
        <div className="mt-8 flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-success">R$ 0,00</p>
            <p className="text-xs text-muted-foreground">Saldo disponível</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * No Search Results Empty State
 */
export function NoSearchResultsEmpty({
  className,
  onAction,
  searchQuery,
}: EmptyStateProps & { searchQuery?: string }) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-muted rounded-full"
        >
          <Search className="h-12 w-12 text-muted-foreground" />
        </motion.div>

        <h3 className="mb-2">Nenhum resultado encontrado</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {searchQuery
            ? `Não encontramos resultados para "${searchQuery}"`
            : "Tente ajustar os filtros ou usar outros termos"}
        </p>

        <div className="flex gap-3">
          {onAction && (
            <Button variant="outline" onClick={onAction} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
          <Button variant="ghost" className="gap-2">
            <Filter className="h-4 w-4" />
            Ajustar Busca
          </Button>
        </div>

        {/* Suggestions */}
        <div className="mt-8 text-left max-w-md">
          <p className="text-sm font-medium mb-2">Sugestões:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Verifique a ortografia das palavras</li>
            <li>• Use termos mais genéricos</li>
            <li>• Tente diferentes palavras-chave</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * No Notifications Empty State
 */
export function NoNotificationsEmpty({ className }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-info/10 rounded-full"
        >
          <Bell className="h-12 w-12 text-info" />
        </motion.div>

        <h3 className="mb-2">Você está em dia!</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Nenhuma notificação no momento. Relaxe e aproveite!
        </p>

        {/* Status indicators */}
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm text-success">
            <div className="h-2 w-2 bg-success rounded-full" />
            <span>Tudo certo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * No Teams Empty State
 */
export function NoTeamsEmpty({ className, onAction }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-primary/10 rounded-full"
        >
          <Trophy className="h-12 w-12 text-primary" />
        </motion.div>

        <h3 className="mb-2">Nenhuma turma criada</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Crie uma turma recorrente para jogar com os mesmos amigos toda semana
        </p>

        {onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus className="h-5 w-5" />
            Criar Turma
          </Button>
        )}

        {/* Benefits */}
        <div className="mt-8 grid gap-3 text-left max-w-md">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 flex items-center justify-center bg-primary/10 rounded-full flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Reservas automáticas</p>
              <p className="text-xs text-muted-foreground">
                Quadra garantida toda semana
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 flex items-center justify-center bg-primary/10 rounded-full flex-shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Grupo fixo</p>
              <p className="text-xs text-muted-foreground">
                Mesmos jogadores sempre
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Error State with Retry
 */
export function ErrorStateWithRetry({
  className,
  onAction,
  onSecondaryAction,
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Tente novamente.",
  error,
}: EmptyStateProps & {
  title?: string;
  description?: string;
  error?: Error | string;
}) {
  return (
    <Card className={cn("border-destructive/50 bg-destructive/5", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-destructive/10 rounded-full"
        >
          <AlertCircle className="h-12 w-12 text-destructive" />
        </motion.div>

        <h3 className="mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>

        <div className="flex gap-3">
          {onAction && (
            <Button onClick={onAction} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          )}
          {onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Ir para Início
            </Button>
          )}
        </div>

        {/* Error details (dev mode) */}
        {error && process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left max-w-md">
            <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground">
              Detalhes do erro
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
              {typeof error === "string" ? error : error.message}
            </pre>
          </details>
        )}

        {/* Help link */}
        <div className="mt-6">
          <Button variant="link" size="sm" className="gap-2 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            Relatar problema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Network Error State
 */
export function NetworkErrorState({
  className,
  onAction,
}: EmptyStateProps) {
  return (
    <ErrorStateWithRetry
      className={className}
      onAction={onAction}
      title="Sem conexão"
      description="Verifique sua conexão com a internet e tente novamente"
    />
  );
}

/**
 * Permission Denied State
 */
export function PermissionDeniedState({
  className,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-warning/50 bg-warning/5", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-warning/10 rounded-full"
        >
          <AlertCircle className="h-12 w-12 text-warning" />
        </motion.div>

        <h3 className="mb-2">Acesso negado</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Você não tem permissão para acessar este conteúdo
        </p>

        {onAction && (
          <Button variant="outline" onClick={onAction} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Voltar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Coming Soon State
 */
export function ComingSoonState({ className, feature }: EmptyStateProps & { feature?: string }) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-info/10 rounded-full"
        >
          <Star className="h-12 w-12 text-info" />
        </motion.div>

        <h3 className="mb-2">Em breve!</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {feature
            ? `${feature} está chegando em breve`
            : "Estamos trabalhando nesta funcionalidade"}
        </p>

        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-info rounded-full animate-pulse" />
          <span>Em desenvolvimento</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Generic Empty State
 * Flexible component for custom scenarios
 */
export function GenericEmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps & {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-muted rounded-full"
        >
          <Icon className="h-12 w-12 text-muted-foreground" />
        </motion.div>

        <h3 className="mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>

        <div className="flex gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Clock component for NoBookingsEmpty
function Clock({ className }: { className?: string }) {
  return <div className={className}>⏱️</div>;
}
