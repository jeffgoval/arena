import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    context?: string,
    customMessage?: string
  ) => {
    // Log do erro para debugging
    if (context) {
      console.error(`[${context}]`, error);
    } else {
      console.error('Error:', error);
    }

    // Determinar mensagem de erro
    let errorMessage = customMessage;
    
    if (!errorMessage) {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Algo deu errado. Tente novamente.';
      }
    }

    // Mostrar toast
    toast({
      title: "Erro",
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const handleSuccess = useCallback((message: string, title = "Sucesso") => {
    toast({
      title,
      description: message,
    });
  }, [toast]);

  return { handleError, handleSuccess };
}