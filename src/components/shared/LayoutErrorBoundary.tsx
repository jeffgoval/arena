/**
 * Layout Error Boundary
 * Catches layout-specific errors and provides recovery options
 */

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface LayoutErrorBoundaryProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
}

interface LayoutErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class LayoutErrorBoundary extends React.Component<
  LayoutErrorBoundaryProps,
  LayoutErrorBoundaryState
> {
  constructor(props: LayoutErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LayoutErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Layout Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onNavigate?.("landing");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Erro no Layout</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado na estrutura da página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs font-mono text-muted-foreground">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir para Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}