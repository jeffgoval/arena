/**
 * Enhanced Toast Hook
 * Toast notifications with actions, undo, retry, and more
 */

import { toast } from "sonner@2.0.3";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastWithActionOptions = {
  action?: ToastAction;
  description?: string;
  duration?: number;
  onDismiss?: () => void;
  dismissible?: boolean;
};

/**
 * Enhanced Toast Hook
 * Provides toast notifications with actions and better UX
 */
export function useEnhancedToast() {
  /**
   * Success toast with optional action
   */
  const success = (message: string, options?: ToastWithActionOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      dismissible: options?.dismissible !== false,
    });
  };

  /**
   * Error toast with retry action
   */
  const error = (message: string, options?: ToastWithActionOptions) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      dismissible: options?.dismissible !== false,
    });
  };

  /**
   * Warning toast
   */
  const warning = (message: string, options?: ToastWithActionOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      dismissible: options?.dismissible !== false,
    });
  };

  /**
   * Info toast
   */
  const info = (message: string, options?: ToastWithActionOptions) => {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      dismissible: options?.dismissible !== false,
    });
  };

  /**
   * Promise toast - shows loading, then success/error
   */
  const promise = <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
      action?: ToastAction;
    }
  ) => {
    return toast.promise(promise, {
      loading: options.loading,
      success: (data) => {
        return typeof options.success === "function"
          ? options.success(data)
          : options.success;
      },
      error: (error) => {
        return typeof options.error === "function"
          ? options.error(error)
          : options.error;
      },
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  /**
   * Success with Undo action
   */
  const successWithUndo = (
    message: string,
    onUndo: () => void,
    options?: Omit<ToastWithActionOptions, "action">
  ) => {
    return success(message, {
      ...options,
      action: {
        label: "Desfazer",
        onClick: onUndo,
      },
    });
  };

  /**
   * Error with Retry action
   */
  const errorWithRetry = (
    message: string,
    onRetry: () => void,
    options?: Omit<ToastWithActionOptions, "action">
  ) => {
    return error(message, {
      ...options,
      action: {
        label: "Tentar Novamente",
        onClick: onRetry,
      },
    });
  };

  /**
   * Error with View Details action
   */
  const errorWithDetails = (
    message: string,
    onViewDetails: () => void,
    options?: Omit<ToastWithActionOptions, "action">
  ) => {
    return error(message, {
      ...options,
      action: {
        label: "Ver Detalhes",
        onClick: onViewDetails,
      },
    });
  };

  /**
   * Custom toast with full control
   */
  const custom = (
    message: string,
    options?: ToastWithActionOptions & {
      icon?: React.ReactNode;
      variant?: "default" | "success" | "error" | "warning" | "info";
    }
  ) => {
    const toastFn = options?.variant
      ? {
          success: toast.success,
          error: toast.error,
          warning: toast.warning,
          info: toast.info,
          default: toast,
        }[options.variant]
      : toast;

    return toastFn(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      dismissible: options?.dismissible !== false,
      icon: options?.icon,
    });
  };

  /**
   * Dismiss a specific toast
   */
  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    warning,
    info,
    promise,
    successWithUndo,
    errorWithRetry,
    errorWithDetails,
    custom,
    dismiss,
  };
}

/**
 * Common toast patterns
 */
export const toastPatterns = {
  /**
   * Booking created with undo
   */
  bookingCreated: (onUndo: () => void, bookingDetails?: string) => {
    const toast = useEnhancedToast();
    return toast.successWithUndo("Reserva criada com sucesso!", onUndo, {
      description: bookingDetails || "Você receberá uma confirmação por email",
      duration: 5000,
    });
  },

  /**
   * Booking canceled with undo
   */
  bookingCanceled: (onUndo: () => void) => {
    const toast = useEnhancedToast();
    return toast.successWithUndo("Reserva cancelada", onUndo, {
      description: "Seu crédito foi devolvido",
      duration: 5000,
    });
  },

  /**
   * Network error with retry
   */
  networkError: (onRetry: () => void) => {
    const toast = useEnhancedToast();
    return toast.errorWithRetry(
      "Erro de conexão",
      onRetry,
      {
        description: "Verifique sua conexão com a internet",
        duration: 6000,
      }
    );
  },

  /**
   * Payment success
   */
  paymentSuccess: (amount: string, onViewReceipt: () => void) => {
    const toast = useEnhancedToast();
    return toast.success(`Pagamento de ${amount} confirmado!`, {
      description: "O recibo foi enviado para seu email",
      action: {
        label: "Ver Recibo",
        onClick: onViewReceipt,
      },
      duration: 5000,
    });
  },

  /**
   * Invite sent
   */
  inviteSent: (count: number, onViewInvites: () => void) => {
    const toast = useEnhancedToast();
    return toast.success(
      `${count} ${count === 1 ? "convite enviado" : "convites enviados"}!`,
      {
        description: "Os jogadores receberão uma notificação",
        action: {
          label: "Ver Convites",
          onClick: onViewInvites,
        },
        duration: 4000,
      }
    );
  },

  /**
   * File upload with progress
   */
  uploadProgress: (fileName: string) => {
    const toast = useEnhancedToast();
    return toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Enviando ${fileName}...`,
        success: `${fileName} enviado com sucesso!`,
        error: `Erro ao enviar ${fileName}`,
      }
    );
  },
};
