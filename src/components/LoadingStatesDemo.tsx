import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Spinner,
  PageSpinner,
  ProgressBar,
  UploadProgress,
  GameListSkeleton,
  CourtGridSkeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  TableSkeleton,
  FormSkeleton,
  CalendarSkeleton,
  MessageSkeleton,
  ListSkeleton,
  ContentLoader,
  InlineSpinner,
} from "./LoadingStates";
import { Upload, RefreshCw } from "lucide-react";

/**
 * Demo component to showcase all loading states
 * This can be removed in production or kept for design system reference
 */
export function LoadingStatesDemo({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsUploading(false), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Voltar
          </Button>
          <h1 className="text-4xl mb-2">Loading States & Skeletons</h1>
          <p className="text-muted-foreground text-lg">
            Biblioteca completa de estados de carregamento e skeleton screens
          </p>
        </div>

        <Tabs defaultValue="spinners" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="spinners">Spinners</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="games">Jogos</TabsTrigger>
            <TabsTrigger value="courts">Quadras</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="others">Outros</TabsTrigger>
          </TabsList>

          {/* Spinners Tab */}
          <TabsContent value="spinners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spinners</CardTitle>
                <CardDescription>
                  Indicadores de carregamento em diferentes tamanhos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Size Variants */}
                <div>
                  <h3 className="font-medium mb-4">Tamanhos</h3>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <Spinner size="sm" />
                      <p className="text-xs text-muted-foreground mt-2">Small</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="md" />
                      <p className="text-xs text-muted-foreground mt-2">Medium</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="lg" />
                      <p className="text-xs text-muted-foreground mt-2">Large</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="xl" />
                      <p className="text-xs text-muted-foreground mt-2">Extra Large</p>
                    </div>
                  </div>
                </div>

                {/* With Text */}
                <div>
                  <h3 className="font-medium mb-4">Com Texto</h3>
                  <Spinner size="lg" text="Carregando dados..." />
                </div>

                {/* Inline Spinner */}
                <div>
                  <h3 className="font-medium mb-4">Inline (em botões)</h3>
                  <div className="flex gap-3">
                    <Button disabled>
                      <InlineSpinner size="sm" />
                      <span className="ml-2">Processando...</span>
                    </Button>
                    <Button variant="outline" disabled>
                      <InlineSpinner size="sm" />
                      <span className="ml-2">Salvando...</span>
                    </Button>
                  </div>
                </div>

                {/* Content Loader */}
                <div>
                  <h3 className="font-medium mb-4">Content Loader</h3>
                  <Button onClick={simulateLoading} className="mb-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Simular Carregamento (3s)
                  </Button>
                  <ContentLoader isLoading={isLoading} text="Carregando conteúdo...">
                    <Card>
                      <CardContent className="pt-6">
                        <p>✅ Conteúdo carregado com sucesso!</p>
                      </CardContent>
                    </Card>
                  </ContentLoader>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Bars</CardTitle>
                <CardDescription>
                  Barras de progresso para uploads e processos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Progress */}
                <div>
                  <h3 className="font-medium mb-4">Progress Bar Básico</h3>
                  <div className="space-y-4">
                    <ProgressBar progress={25} text="Iniciando..." />
                    <ProgressBar progress={50} text="Processando..." />
                    <ProgressBar progress={75} text="Quase lá..." />
                    <ProgressBar progress={100} text="Concluído!" variant="success" />
                  </div>
                </div>

                {/* Variant Styles */}
                <div>
                  <h3 className="font-medium mb-4">Variantes de Cor</h3>
                  <div className="space-y-4">
                    <ProgressBar progress={60} variant="default" text="Default" />
                    <ProgressBar progress={60} variant="success" text="Success" />
                    <ProgressBar progress={60} variant="warning" text="Warning" />
                    <ProgressBar progress={60} variant="error" text="Error" />
                  </div>
                </div>

                {/* Upload Progress */}
                <div>
                  <h3 className="font-medium mb-4">Upload de Arquivo</h3>
                  <Button onClick={simulateUpload} className="mb-4" disabled={isUploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    Simular Upload
                  </Button>
                  {isUploading && (
                    <UploadProgress
                      fileName="documento-importante.pdf"
                      progress={uploadProgress}
                      fileSize="2.4 MB"
                      onCancel={() => {
                        setIsUploading(false);
                        setUploadProgress(0);
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Lista de Jogos</CardTitle>
                <CardDescription>
                  Usado enquanto carrega jogos agendados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameListSkeleton count={3} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courts Tab */}
          <TabsContent value="courts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Grid de Quadras</CardTitle>
                <CardDescription>
                  Usado na página de seleção de quadras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourtGridSkeleton count={6} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Dashboard Completo</CardTitle>
                <CardDescription>
                  Skeleton para o dashboard do cliente/gestor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardSkeleton />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Others Tab */}
          <TabsContent value="others" className="space-y-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Perfil</CardTitle>
                <CardDescription>Usado na página de perfil do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSkeleton />
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Tabela</CardTitle>
                <CardDescription>Usado em listas tabulares</CardDescription>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={5} columns={4} />
              </CardContent>
            </Card>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Formulário</CardTitle>
                <CardDescription>Usado enquanto carrega formulários</CardDescription>
              </CardHeader>
              <CardContent>
                <FormSkeleton fields={4} />
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Calendário</CardTitle>
                <CardDescription>Usado na seleção de datas</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarSkeleton />
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Mensagens</CardTitle>
                <CardDescription>Usado em chat/mensagens</CardDescription>
              </CardHeader>
              <CardContent>
                <MessageSkeleton />
              </CardContent>
            </Card>

            {/* List */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton: Lista Genérica</CardTitle>
                <CardDescription>Usado em listas de itens</CardDescription>
              </CardHeader>
              <CardContent>
                <ListSkeleton count={5} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
