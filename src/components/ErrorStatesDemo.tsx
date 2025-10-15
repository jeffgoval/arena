import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  EmptyState,
  EmptyGames,
  EmptyTeams,
  EmptyTransactions,
  EmptyNotifications,
  EmptySearch,
  EmptyUpcoming,
  EmptyStateCard,
} from "./EmptyState";
import {
  ErrorState,
  InlineError,
  NetworkError,
  ServerError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ErrorStateCard,
} from "./ErrorState";
import { ErrorBoundary } from "./ErrorBoundary";
import { NotFound } from "./NotFound";
import { AlertCircle, Users, Calendar } from "lucide-react";
import { toast } from "sonner@2.0.3";

/**
 * Demo component to showcase all error and empty states
 */
export function ErrorStatesDemo({ onBack }: { onBack: () => void }) {
  const [showInlineError, setShowInlineError] = useState(true);
  const [triggerError, setTriggerError] = useState(false);

  // Component that throws an error for ErrorBoundary demo
  function BrokenComponent() {
    if (triggerError) {
      throw new Error("Erro de demonstração gerado pelo componente!");
    }
    return <p className="text-muted-foreground">Componente funcionando normalmente.</p>;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Voltar
          </Button>
          <h1 className="text-4xl mb-2">Error & Empty States</h1>
          <p className="text-muted-foreground text-lg">
            Biblioteca completa de estados de erro e estados vazios
          </p>
        </div>

        <Tabs defaultValue="empty" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="empty">Empty States</TabsTrigger>
            <TabsTrigger value="errors">Error States</TabsTrigger>
            <TabsTrigger value="inline">Inline Errors</TabsTrigger>
            <TabsTrigger value="boundary">Error Boundary</TabsTrigger>
          </TabsList>

          {/* Empty States Tab */}
          <TabsContent value="empty" className="space-y-6">
            {/* Generic Empty State */}
            <Card>
              <CardHeader>
                <CardTitle>Empty State Genérico</CardTitle>
                <CardDescription>
                  Estado vazio customizável com título, descrição e ações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={AlertCircle}
                  title="Nenhum item encontrado"
                  description="Não há itens para exibir no momento. Comece criando seu primeiro item."
                  action={{
                    label: "Criar Item",
                    onClick: () => toast.success("Ação de criar item!"),
                  }}
                  secondaryAction={{
                    label: "Saber Mais",
                    onClick: () => toast.info("Mais informações..."),
                  }}
                />
              </CardContent>
            </Card>

            {/* Empty Games */}
            <Card>
              <CardHeader>
                <CardTitle>Empty Games</CardTitle>
                <CardDescription>Exibido quando não há jogos agendados</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyGames onCreateGame={() => toast.success("Navegar para criar jogo!")} />
              </CardContent>
            </Card>

            {/* Empty Teams */}
            <Card>
              <CardHeader>
                <CardTitle>Empty Teams</CardTitle>
                <CardDescription>Exibido quando não há turmas criadas</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyTeams onCreateTeam={() => toast.success("Navegar para criar turma!")} />
              </CardContent>
            </Card>

            {/* Empty Upcoming */}
            <Card>
              <CardHeader>
                <CardTitle>Empty Upcoming Games</CardTitle>
                <CardDescription>Exibido quando não há jogos próximos</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyUpcoming onBookNow={() => toast.success("Navegar para reserva!")} />
              </CardContent>
            </Card>

            {/* Small Empty States */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Empty Transactions</CardTitle>
                  <CardDescription>Histórico vazio</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyTransactions />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Empty Notifications</CardTitle>
                  <CardDescription>Sem notificações</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyNotifications />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Empty Search</CardTitle>
                  <CardDescription>Nenhum resultado</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptySearch query="futebol society" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tamanhos</CardTitle>
                  <CardDescription>sm / md / lg</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <EmptyState
                    icon={Users}
                    title="Small"
                    description="Estado vazio pequeno"
                    size="sm"
                  />
                  <EmptyState
                    icon={Calendar}
                    title="Large"
                    description="Estado vazio grande para páginas completas"
                    size="lg"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Error States Tab */}
          <TabsContent value="errors" className="space-y-6">
            {/* Network Error */}
            <Card>
              <CardHeader>
                <CardTitle>Network Error</CardTitle>
                <CardDescription>Erro de conexão com a internet</CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkError onRetry={() => toast.success("Tentando reconectar...")} />
              </CardContent>
            </Card>

            {/* Server Error */}
            <Card>
              <CardHeader>
                <CardTitle>Server Error</CardTitle>
                <CardDescription>Erro no servidor</CardDescription>
              </CardHeader>
              <CardContent>
                <ServerError
                  onRetry={() => toast.success("Tentando novamente...")}
                  onGoHome={() => toast.info("Voltando para início...")}
                />
              </CardContent>
            </Card>

            {/* Not Found Error */}
            <Card>
              <CardHeader>
                <CardTitle>Not Found Error</CardTitle>
                <CardDescription>Conteúdo não encontrado</CardDescription>
              </CardHeader>
              <CardContent>
                <NotFoundError
                  onGoBack={() => toast.info("Voltando...")}
                  onGoHome={() => toast.info("Indo para início...")}
                />
              </CardContent>
            </Card>

            {/* Unauthorized Error */}
            <Card>
              <CardHeader>
                <CardTitle>Unauthorized Error</CardTitle>
                <CardDescription>Usuário não autenticado</CardDescription>
              </CardHeader>
              <CardContent>
                <UnauthorizedError onGoHome={() => toast.info("Indo para login...")} />
              </CardContent>
            </Card>

            {/* Forbidden Error */}
            <Card>
              <CardHeader>
                <CardTitle>Forbidden Error</CardTitle>
                <CardDescription>Acesso negado</CardDescription>
              </CardHeader>
              <CardContent>
                <ForbiddenError
                  onGoBack={() => toast.info("Voltando...")}
                  onGoHome={() => toast.info("Indo para início...")}
                />
              </CardContent>
            </Card>

            {/* Custom Error */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Error</CardTitle>
                <CardDescription>Erro customizado com detalhes</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorState
                  type="generic"
                  title="Erro ao processar pagamento"
                  message="Não foi possível processar o pagamento. Verifique os dados do cartão e tente novamente."
                  error={new Error("Payment processing failed: Invalid card number")}
                  onRetry={() => toast.success("Tentando novamente...")}
                  showDetails={true}
                  size="md"
                />
              </CardContent>
            </Card>

            {/* Size Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Tamanhos</CardTitle>
                <CardDescription>sm / md / lg</CardDescription>
              </CardHeader>
              <CardContent className="space-y-12">
                <ErrorState
                  type="validation"
                  title="Erro Small"
                  message="Erro em tamanho pequeno"
                  size="sm"
                />
                <ErrorState
                  type="server"
                  title="Erro Large"
                  message="Erro em tamanho grande para páginas completas"
                  onRetry={() => toast.success("Retry")}
                  size="lg"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inline Errors Tab */}
          <TabsContent value="inline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inline Error</CardTitle>
                <CardDescription>
                  Erros inline para formulários e áreas de conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showInlineError && (
                  <InlineError
                    title="Erro de validação"
                    message="O campo de e-mail é obrigatório e deve ser válido."
                    type="error"
                    onDismiss={() => setShowInlineError(false)}
                  />
                )}

                <InlineError
                  title="Aviso"
                  message="Sua sessão expirará em 5 minutos. Salve seu trabalho."
                  type="warning"
                />

                <InlineError
                  message="Senha deve ter no mínimo 8 caracteres e incluir números e letras."
                  type="error"
                />

                {!showInlineError && (
                  <Button onClick={() => setShowInlineError(true)} variant="outline">
                    Mostrar erro novamente
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Form Example */}
            <Card>
              <CardHeader>
                <CardTitle>Exemplo em Formulário</CardTitle>
                <CardDescription>
                  Inline error em contexto de formulário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Digite seu nome"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md border-destructive"
                    placeholder="seu@email.com"
                    defaultValue="email-invalido"
                  />
                  <InlineError
                    message="Por favor, insira um endereço de e-mail válido."
                    type="error"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="********"
                  />
                </div>

                <Button>Enviar</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Boundary Tab */}
          <TabsContent value="boundary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Boundary</CardTitle>
                <CardDescription>
                  Captura erros React e exibe UI de fallback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  O Error Boundary captura erros JavaScript em qualquer lugar da árvore de
                  componentes filhos, registra esses erros e exibe uma UI de fallback.
                </p>

                <div className="space-y-4">
                  <Button
                    onClick={() => setTriggerError(!triggerError)}
                    variant={triggerError ? "destructive" : "default"}
                  >
                    {triggerError ? "Resetar Erro" : "Gerar Erro"}
                  </Button>

                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <ErrorBoundary
                        showDetails={true}
                        onReset={() => {
                          setTriggerError(false);
                          toast.success("Error Boundary resetado!");
                        }}
                        onError={(error) => {
                          console.log("Error caught by boundary:", error);
                          toast.error("Erro capturado pelo Error Boundary!");
                        }}
                      >
                        <BrokenComponent />
                      </ErrorBoundary>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-sm font-medium">Como usar:</p>
                  <pre className="p-4 bg-muted rounded text-xs overflow-auto">
{`<ErrorBoundary
  showDetails={true}
  onReset={() => {}}
  onError={(error, errorInfo) => {
    logErrorToService(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* 404 Page Demo */}
            <Card>
              <CardHeader>
                <CardTitle>404 Not Found Page</CardTitle>
                <CardDescription>
                  Página customizada para rotas não encontradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 rounded-lg overflow-hidden">
                  <NotFound
                    onGoHome={() => toast.success("Navegando para início...")}
                    onGoBack={() => toast.info("Voltando...")}
                    showSearch
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
