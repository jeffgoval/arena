import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  Calendar,
  Users,
  Trophy,
  FileText,
  Search,
  Inbox,
  Plus,
  ArrowRight,
  AlertCircle,
  Clock,
  CreditCard,
  Bell
} from "lucide-react";
import { motion } from "motion/react";

/**
 * Icon mapping for different empty state types
 */
const iconMap = {
  games: Calendar,
  teams: Users,
  tournaments: Trophy,
  transactions: CreditCard,
  notifications: Bell,
  documents: FileText,
  search: Search,
  inbox: Inbox,
  default: AlertCircle,
  upcoming: Clock,
};

export type EmptyStateType = keyof typeof iconMap;

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: "simple" | "detailed";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Generic Empty State Component
 * Used when lists, tables or content areas have no data to display
 */
export function EmptyState({
  type = "default",
  icon,
  title,
  description,
  action,
  secondaryAction,
  illustration = "simple",
  size = "md",
  className = "",
}: EmptyStateProps) {
  const Icon = icon || iconMap[type];

  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "h-12 w-12",
      title: "text-lg",
      description: "text-sm",
    },
    md: {
      container: "py-12",
      icon: "h-16 w-16",
      title: "text-xl",
      description: "text-base",
    },
    lg: {
      container: "py-16",
      icon: "h-20 w-20",
      title: "text-2xl",
      description: "text-lg",
    },
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex items-center justify-center ${classes.container} ${className}`}
    >
      <div className="max-w-md text-center space-y-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="p-4 rounded-full bg-muted">
            <Icon className={`${classes.icon} text-muted-foreground`} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${classes.title} font-medium text-foreground`}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${classes.description} text-muted-foreground max-w-sm mx-auto`}
        >
          {description}
        </motion.p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
          >
            {action && (
              <Button onClick={action.onClick} size="lg" className="gap-2">
                {action.icon ? (
                  <action.icon className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                {secondaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Specific empty state components for common use cases
 */

export function EmptyGames({ onCreateGame }: { onCreateGame: () => void }) {
  return (
    <EmptyState
      type="games"
      title="Nenhum jogo agendado"
      description="Você ainda não tem jogos marcados. Crie sua primeira reserva e convide seus amigos para jogar!"
      action={{
        label: "Criar Primeira Reserva",
        onClick: onCreateGame,
        icon: Calendar,
      }}
    />
  );
}

export function EmptyTeams({ onCreateTeam }: { onCreateTeam: () => void }) {
  return (
    <EmptyState
      type="teams"
      title="Nenhuma turma criada"
      description="Organize seus jogos recorrentes criando turmas. Convide jogadores fixos e facilite suas reservas!"
      action={{
        label: "Criar Primeira Turma",
        onClick: onCreateTeam,
        icon: Users,
      }}
    />
  );
}

export function EmptyTransactions() {
  return (
    <EmptyState
      type="transactions"
      title="Nenhuma transação"
      description="Seu histórico de transações aparecerá aqui assim que você fizer sua primeira reserva ou adicionar créditos."
      size="sm"
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      type="notifications"
      title="Tudo em dia!"
      description="Você não tem notificações no momento. Fique tranquilo, avisaremos quando houver novidades."
      size="sm"
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      type="search"
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${query}". Tente usar outros termos de busca.`}
      size="sm"
    />
  );
}

export function EmptyInbox() {
  return (
    <EmptyState
      type="inbox"
      title="Caixa de entrada vazia"
      description="Você está em dia! Não há mensagens pendentes no momento."
      size="sm"
    />
  );
}

export function EmptyUpcoming({ onBookNow }: { onBookNow?: () => void }) {
  return (
    <EmptyState
      type="upcoming"
      title="Nenhum jogo próximo"
      description="Você não tem jogos agendados para os próximos dias. Que tal marcar uma partida?"
      action={
        onBookNow
          ? {
              label: "Fazer Reserva",
              onClick: onBookNow,
              icon: Calendar,
            }
          : undefined
      }
      size="md"
    />
  );
}

/**
 * Empty State Card Wrapper
 * For use inside cards or containers
 */
export function EmptyStateCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

/**
 * Empty State with Custom Illustration
 */
interface EmptyStateIllustrationProps extends Omit<EmptyStateProps, "illustration"> {
  illustrationSrc?: string;
  illustrationAlt?: string;
}

export function EmptyStateWithIllustration({
  illustrationSrc,
  illustrationAlt = "Empty state illustration",
  ...props
}: EmptyStateIllustrationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {illustrationSrc && (
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          src={illustrationSrc}
          alt={illustrationAlt}
          className="w-64 h-64 object-contain"
        />
      )}
      <EmptyState {...props} size="md" />
    </div>
  );
}
