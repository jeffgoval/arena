import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  AlertCircle,
  WifiOff,
  ServerCrash,
  XCircle,
  RefreshCw,
  Home,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";

export type ErrorType =
  | "network"
  | "server"
  | "not-found"
  | "unauthorized"
  | "forbidden"
  | "generic"
  | "validation";

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Error icons and default messages for each error type
 */
const errorConfig: Record<
  ErrorType,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
    defaultMessage: string;
    color: string;
  }
> = {
  network: {
    icon: WifiOff,
    defaultTitle: "Sem conexão",
    defaultMessage:
      "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.",
    color: "text-warning",
  },
  server: {
    icon: ServerCrash,
    defaultTitle: "Erro no servidor",
    defaultMessage:
      "Ocorreu um erro em nossos servidores. Nossa equipe já foi notificada. Por favor, tente novamente em alguns instantes.",
    color: "text-destructive",
  },
  "not-found": {
    icon: AlertCircle,
    defaultTitle: "Não encontrado",
    defaultMessage:
      "O conteúdo que você está procurando não foi encontrado ou não existe mais.",
    color: "text-muted-foreground",
  },
  unauthorized: {
    icon: ShieldAlert,
    defaultTitle: "Não autorizado",
    defaultMessage:
      "Você precisa estar autenticado para acessar este conteúdo. Faça login e tente novamente.",
    color: "text-warning",
  },
  forbidden: {
    icon: XCircle,
    defaultTitle: "Acesso negado",
    defaultMessage:
      "Você não tem permissão para acessar este conteúdo ou realizar esta ação.",
    color: "text-destructive",
  },
  validation: {
    icon: AlertTriangle,
    defaultTitle: "Dados inválidos",
    defaultMessage:
      "Os dados fornecidos são inválidos. Verifique as informações e tente novamente.",
    color: "text-warning",
  },
  generic: {
    icon: AlertCircle,
    defaultTitle: "Algo deu errado",
    defaultMessage:
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
    color: "text-destructive",
  },
};

/**
 * Generic Error State Component
 * Displays error messages with retry and navigation options
 */
export function ErrorState({
  type = "generic",
  title,
  message,
  error,
  onRetry,
  onGoHome,
  onGoBack,
  showDetails = false,
  size = "md",
  className = "",
}: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

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
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md text-center space-y-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className={`p-4 rounded-full bg-destructive/10`}>
            <Icon className={`${classes.icon} ${config.color}`} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${classes.title} font-medium text-foreground`}
        >
          {displayTitle}
        </motion.h3>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${classes.description} text-muted-foreground max-w-sm mx-auto`}
        >
          {displayMessage}
        </motion.p>

        {/* Error Details */}
        {showDetails && error && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-left"
          >
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Detalhes técnicos
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-40">
              {error.stack || error.message}
            </pre>
          </motion.details>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
        >
          {onRetry && (
            <Button onClick={onRetry} size="lg" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          )}
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} variant="outline" size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Ir para Início
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Inline Error Alert
 * For displaying errors inside forms or content areas
 */
interface InlineErrorProps {
  title?: string;
  message: string;
  type?: "error" | "warning";
  onDismiss?: () => void;
}

export function InlineError({
  title = "Erro",
  message,
  type = "error",
  onDismiss,
}: InlineErrorProps) {
  return (
    <Alert variant={type === "error" ? "destructive" : "default"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-start justify-between gap-4">
        <span>{message}</span>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-auto p-0 hover:bg-transparent"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Error State Card Wrapper
 */
export function ErrorStateCard({
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
 * Specific error state components
 */

export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      type="network"
      onRetry={onRetry}
    />
  );
}

export function ServerError({
  onRetry,
  onGoHome,
}: {
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorState
      type="server"
      onRetry={onRetry}
      onGoHome={onGoHome}
    />
  );
}

export function NotFoundError({
  onGoHome,
  onGoBack,
}: {
  onGoHome?: () => void;
  onGoBack?: () => void;
}) {
  return (
    <ErrorState
      type="not-found"
      onGoHome={onGoHome}
      onGoBack={onGoBack}
    />
  );
}

export function UnauthorizedError({
  onGoHome,
}: {
  onGoHome?: () => void;
}) {
  return (
    <ErrorState
      type="unauthorized"
      onGoHome={onGoHome}
    />
  );
}

export function ForbiddenError({
  onGoBack,
  onGoHome,
}: {
  onGoBack?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorState
      type="forbidden"
      onGoBack={onGoBack}
      onGoHome={onGoHome}
    />
  );
}
