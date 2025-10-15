/**
 * Smart Empty State Component
 * Contextual empty states with appropriate actions
 */

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Search,
  WifiOff,
  Users,
  AlertCircle,
  FileText,
  Trophy,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

export type EmptyStateType =
  | "no-bookings"
  | "no-results"
  | "no-internet"
  | "no-invitations"
  | "no-teammates"
  | "no-transactions"
  | "no-data"
  | "error";

interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  suggestions?: string[];
  canRetry?: boolean;
}

interface SmartEmptyStateProps {
  type: EmptyStateType;
  context?: {
    query?: string;
    filter?: string;
    [key: string]: any;
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EMPTY_STATE_CONFIGS: Record<EmptyStateType, EmptyStateConfig> = {
  "no-bookings": {
    icon: Calendar,
    title: "Nenhuma reserva agendada",
    description: "Você ainda não tem reservas. Comece agendando sua primeira quadra agora!",
  },
  "no-results": {
    icon: Search,
    title: "Nenhum resultado encontrado",
    description: "Não encontramos nada com esses critérios de busca.",
    suggestions: [
      "Verifique a ortografia dos termos de busca",
      "Use palavras-chave mais genéricas",
      "Tente filtros diferentes",
    ],
  },
  "no-internet": {
    icon: WifiOff,
    title: "Sem conexão com a internet",
    description: "Verifique sua conexão e tente novamente.",
    canRetry: true,
  },
  "no-invitations": {
    icon: Users,
    title: "Nenhum convite pendente",
    description: "Você será notificado quando receber novos convites para jogar.",
  },
  "no-teammates": {
    icon: Users,
    title: "Nenhum jogador na sua turma",
    description: "Adicione amigos para facilitar futuros convites e organizar seus jogos.",
  },
  "no-transactions": {
    icon: FileText,
    title: "Nenhuma transação",
    description: "Seu histórico de transações aparecerá aqui quando você fizer reservas ou pagamentos.",
  },
  "no-data": {
    icon: Inbox,
    title: "Nenhum dado disponível",
    description: "Não há informações para exibir no momento.",
  },
  error: {
    icon: AlertCircle,
    title: "Algo deu errado",
    description: "Ocorreu um erro ao carregar os dados. Por favor, tente novamente.",
    canRetry: true,
  },
};

export function SmartEmptyState({
  type,
  context,
  primaryAction,
  secondaryAction,
  className = "",
}: SmartEmptyStateProps) {
  const config = EMPTY_STATE_CONFIGS[type];
  const Icon = config.icon;

  // Customize description based on context
  let description = config.description;
  if (type === "no-results" && context?.query) {
    description = `Nenhum resultado encontrado para "${context.query}"`;
  }

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto space-y-4"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted"
          >
            <Icon className="h-8 w-8 text-muted-foreground" />
          </motion.div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{config.title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Suggestions */}
          {config.suggestions && config.suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-left bg-muted/30 rounded-lg p-4 space-y-2"
            >
              <p className="text-xs font-medium">Dicas:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {config.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
            >
              {primaryAction && (
                <Button onClick={primaryAction.onClick} className="gap-2">
                  {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="outline" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
            </motion.div>
          )}

          {/* Retry for errors */}
          {config.canRetry && !primaryAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                Tentar Novamente
              </Button>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact Empty State (for smaller spaces)
 */
interface CompactEmptyStateProps {
  icon: LucideIcon;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function CompactEmptyState({
  icon: Icon,
  message,
  action,
}: CompactEmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <Icon className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Inline Empty State (for lists/tables)
 */
interface InlineEmptyStateProps {
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export function InlineEmptyState({
  icon: Icon = Inbox,
  message,
  className = "",
}: InlineEmptyStateProps) {
  return (
    <div className={`flex items-center gap-2 p-4 text-muted-foreground ${className}`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
