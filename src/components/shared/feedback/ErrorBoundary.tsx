"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Chama callback customizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Se um fallback customizado foi fornecido, usa ele
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <Card className="max-w-lg w-full p-8 border-0 shadow-soft">
            <div className="text-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold mb-3">
                Ops! Algo deu errado
              </h1>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Encontramos um erro inesperado. Não se preocupe, você pode tentar recarregar a página ou voltar para o início.
              </p>

              {/* Mostra detalhes do erro apenas em desenvolvimento */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                    Detalhes do erro (apenas em desenvolvimento)
                  </summary>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleReload} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Recarregar Página
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Ir para Início
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar ErrorBoundary de forma funcional
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}

// Componente ErrorBoundary simplificado para seções específicas
export function SectionErrorBoundary({ 
  children,
  onRetry
}: { 
  children: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <ErrorBoundary
      fallback={
        <Card className="p-8 text-center border-0 shadow-soft">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              Erro ao carregar esta seção
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Não foi possível carregar este conteúdo.
            </p>

            {onRetry && (
              <Button onClick={onRetry} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            )}
          </div>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
