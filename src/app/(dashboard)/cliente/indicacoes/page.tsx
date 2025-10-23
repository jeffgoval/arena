'use client';

import { useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIndicacoes } from '@/hooks/useIndicacoes';
import { CodigoIndicacao } from '@/components/modules/indicacoes/CodigoIndicacao';
import { FormIndicacao } from '@/components/modules/indicacoes/FormIndicacao';
import { ListaIndicacoes } from '@/components/modules/indicacoes/ListaIndicacoes';
import { CreditosIndicacao } from '@/components/modules/indicacoes/CreditosIndicacao';
import { FormAplicarCodigo } from '@/components/modules/indicacoes/FormAplicarCodigo';
import { DashboardIndicacoes } from '@/components/modules/indicacoes/DashboardIndicacoes';
import { ProgressoBonusIndicacoes } from '@/components/modules/indicacoes/ProgressoBonusIndicacoes';
import { HistoricoIndicacoes } from '@/components/modules/indicacoes/HistoricoIndicacoes';
import { NotificacoesIndicacao } from '@/components/modules/indicacoes/NotificacoesIndicacao';
import { ExemplosCompartilhamento } from '@/components/modules/indicacoes/ExemplosCompartilhamento';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IndicacoesPage() {
  const {
    indicacoes,
    codigo,
    creditos,
    estatisticas,
    loading,
    error,
    recarregar,
  } = useIndicacoes();
  const { toast } = useToast();



  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando sistema de indicações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programa de Indicação</h1>
          <p className="text-muted-foreground">
            Indique amigos e ganhe créditos para suas reservas
          </p>
        </div>
        
        <Button variant="outline" onClick={recarregar}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Dashboard Resumo */}
      <DashboardIndicacoes estatisticas={estatisticas} />

      {/* Conteúdo Principal com Abas */}
      <Tabs defaultValue="notificacoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="indicar">Indicar</TabsTrigger>
          <TabsTrigger value="compartilhar">Compartilhar</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="creditos">Créditos</TabsTrigger>
        </TabsList>

        {/* Aba: Notificações */}
        <TabsContent value="notificacoes">
          <NotificacoesIndicacao isTabView={true} />
        </TabsContent>

        {/* Aba: Indicar Amigos */}
        <TabsContent value="indicar" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              {/* Código de Indicação */}
              {codigo && <CodigoIndicacao codigo={codigo} />}
              
              {/* Formulário para Indicar */}
              <FormIndicacao />
              
              {/* Formulário para Aplicar Código */}
              <FormAplicarCodigo onSucesso={recarregar} />
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              {/* Progresso dos Bônus */}
              <ProgressoBonusIndicacoes estatisticas={estatisticas} />
              
              {/* Lista de Indicações Recentes */}
              <ListaIndicacoes indicacoes={indicacoes.slice(0, 5)} />
            </div>
          </div>
        </TabsContent>

        {/* Aba: Compartilhar */}
        <TabsContent value="compartilhar">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando seu código de indicação...</p>
              </div>
            </div>
          ) : codigo ? (
            <ExemplosCompartilhamento codigo={codigo.codigo} />
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Código de indicação não encontrado</p>
                <Button onClick={recarregar} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                {error && (
                  <p className="text-sm text-destructive mt-2">Erro: {error}</p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Aba: Histórico */}
        <TabsContent value="historico">
          <HistoricoIndicacoes indicacoes={indicacoes} />
        </TabsContent>

        {/* Aba: Créditos */}
        <TabsContent value="creditos">
          <CreditosIndicacao creditos={creditos} estatisticas={estatisticas} />
        </TabsContent>
      </Tabs>
    </div>
  );
}