"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  UserCheck,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useRelatorioFaturamento,
  useRelatorioParticipacao,
  useRelatorioConvites,
} from "@/hooks/core/useRelatorios";
import { useAvaliacoesStats } from "@/hooks/core/useAvaliacoes";
import { useTurmas } from "@/hooks/core/useTurmas";
import {
  RelatorioResumoSkeleton,
  RelatorioListaSkeleton,
  RelatorioGraficoSkeleton,
  RelatorioTabelaSkeleton,
} from "@/components/shared/loading/RelatoriosSkeleton";

export default function RelatoriosPage() {
  // Buscar dados reais
  const { data: faturamento, isLoading: loadingFaturamento } = useRelatorioFaturamento();
  const { data: participacao, isLoading: loadingParticipacao } = useRelatorioParticipacao();
  const { data: convites, isLoading: loadingConvites } = useRelatorioConvites();
  const { data: avaliacoes, isLoading: loadingAvaliacoes } = useAvaliacoesStats();
  const { data: turmas, isLoading: loadingTurmas } = useTurmas();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Relatórios Gerenciais
          </h1>
          <p className="body-medium text-muted-foreground">
            Análises completas e métricas da arena
          </p>
        </div>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="faturamento" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="participacao">Participação</TabsTrigger>
          <TabsTrigger value="convites">Convites</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="turmas">Turmas</TabsTrigger>
        </TabsList>

        {/* FATURAMENTO */}
        <TabsContent value="faturamento" className="space-y-6 mt-6">
          {/* Resumo */}
          {loadingFaturamento ? (
            <RelatorioResumoSkeleton />
          ) : faturamento ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-3xl font-bold text-success">
                    {formatCurrency(faturamento.total)}
                  </p>
                  <p className="text-sm text-muted-foreground">Faturamento Total</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {faturamento.totalReservas}
                  </p>
                  <p className="text-sm text-muted-foreground">Total de Reservas</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(faturamento.mediaMensal)}
                  </p>
                  <p className="text-sm text-muted-foreground">Média Mensal</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <BarChart3 className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(faturamento.ocupacaoMedia)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Ocupação Média</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Faturamento por Quadra */}
          {loadingFaturamento ? (
            <RelatorioListaSkeleton rows={4} />
          ) : faturamento && faturamento.porQuadra.length > 0 ? (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Faturamento por Quadra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faturamento.porQuadra.map((item, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">{item.quadra}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.reservas} reservas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">
                            {formatCurrency(item.valor)}
                          </p>
                          {item.ocupacao > 0 && (
                            <Badge variant="outline">{item.ocupacao}% ocupação</Badge>
                          )}
                        </div>
                      </div>
                      {item.ocupacao > 0 && (
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-success h-2 rounded-full transition-all"
                            style={{ width: `${item.ocupacao}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum dado de faturamento disponível.</p>
              </CardContent>
            </Card>
          )}

          {/* Faturamento Mensal */}
          {!loadingFaturamento && faturamento && faturamento.porMes.length > 0 && (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Faturamento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faturamento.porMes.slice(-6).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-semibold">{item.mes}</span>
                      <span className="font-bold text-success">
                        {formatCurrency(item.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* PARTICIPAÇÃO */}
        <TabsContent value="participacao" className="space-y-6 mt-6">
          {/* Resumo */}
          {loadingParticipacao ? (
            <RelatorioResumoSkeleton />
          ) : participacao ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 text-success mb-2" />
                  <p className="text-3xl font-bold text-success">
                    {participacao.clientesAtivos}
                  </p>
                  <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <UserCheck className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {participacao.novosClientes}
                  </p>
                  <p className="text-sm text-muted-foreground">Novos este Mês</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {participacao.retencao}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <BarChart3 className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {participacao.mediaJogosPorCliente}
                  </p>
                  <p className="text-sm text-muted-foreground">Jogos/Cliente (média)</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Top Clientes */}
          {loadingParticipacao ? (
            <RelatorioTabelaSkeleton />
          ) : participacao && participacao.topClientes.length > 0 ? (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Clientes Mais Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-semibold">Posição</th>
                        <th className="text-left p-3 font-semibold">Cliente</th>
                        <th className="text-left p-3 font-semibold">Total de Jogos</th>
                        <th className="text-left p-3 font-semibold">Última Reserva</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participacao.topClientes.map((cliente, index) => (
                        <tr
                          key={cliente.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="p-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-bold text-primary">{index + 1}</span>
                            </div>
                          </td>
                          <td className="p-3 font-semibold">{cliente.nome}</td>
                          <td className="p-3">
                            <Badge variant="outline">{cliente.jogos} jogos</Badge>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {formatDate(cliente.ultimaReserva)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
              </CardContent>
            </Card>
          )}

          {/* Status dos Clientes */}
          {!loadingParticipacao && participacao && (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Status dos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-success">Ativos</p>
                      <p className="text-sm text-muted-foreground">
                        Jogaram nos últimos 30 dias
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-success">
                      {participacao.clientesAtivos}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-warning">Inativos</p>
                      <p className="text-sm text-muted-foreground">
                        Sem jogos há mais de 30 dias
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-warning">
                      {participacao.clientesInativos}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-primary">Novos</p>
                      <p className="text-sm text-muted-foreground">Cadastrados este mês</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {participacao.novosClientes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CONVITES */}
        <TabsContent value="convites" className="space-y-6 mt-6">
          {/* Resumo */}
          {loadingConvites ? (
            <RelatorioResumoSkeleton />
          ) : convites ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {convites.totalEnviados}
                  </p>
                  <p className="text-sm text-muted-foreground">Convites Enviados</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <UserCheck className="w-8 h-8 text-success mb-2" />
                  <p className="text-3xl font-bold text-success">{convites.aceitos}</p>
                  <p className="text-sm text-muted-foreground">Aceitos</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 text-success mb-2" />
                  <p className="text-3xl font-bold text-success">{convites.taxaAceite}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Aceite</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 text-warning mb-2" />
                  <p className="text-3xl font-bold text-warning">{convites.pendentes}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Status dos Convites */}
          {!loadingConvites && convites && (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Status dos Convites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-success/10 rounded-lg">
                    <p className="text-4xl font-bold text-success mb-2">
                      {convites.aceitos}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">Aceitos</p>
                    <Badge className="bg-success/20 text-success">
                      {convites.taxaAceite}%
                    </Badge>
                  </div>
                  <div className="text-center p-6 bg-destructive/10 rounded-lg">
                    <p className="text-4xl font-bold text-destructive mb-2">
                      {convites.recusados}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">Recusados</p>
                    <Badge className="bg-destructive/20 text-destructive">
                      {convites.totalEnviados > 0
                        ? Math.round((convites.recusados / convites.totalEnviados) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="text-center p-6 bg-warning/10 rounded-lg">
                    <p className="text-4xl font-bold text-warning mb-2">
                      {convites.pendentes}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
                    <Badge className="bg-warning/20 text-warning">
                      {convites.totalEnviados > 0
                        ? Math.round((convites.pendentes / convites.totalEnviados) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Convites por Quadra */}
          {loadingConvites ? (
            <RelatorioListaSkeleton rows={4} />
          ) : convites && convites.porQuadra.length > 0 ? (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Performance por Quadra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {convites.porQuadra.map((item, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">{item.quadra}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.enviados} enviados • {item.aceitos} aceitos
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-success/10 text-success text-lg px-3 py-1">
                            {item.enviados > 0
                              ? Math.round((item.aceitos / item.enviados) * 100)
                              : 0}
                            %
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">conversão</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-sm font-bold">{item.enviados}</p>
                          <p className="text-xs text-muted-foreground">Enviados</p>
                        </div>
                        <div className="text-center p-2 bg-success/10 rounded">
                          <p className="text-sm font-bold text-success">{item.aceitos}</p>
                          <p className="text-xs text-muted-foreground">Aceitos</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum convite encontrado.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AVALIAÇÕES */}
        <TabsContent value="avaliacoes" className="space-y-6 mt-6">
          {loadingAvaliacoes ? (
            <RelatorioResumoSkeleton />
          ) : avaliacoes ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Relatório completo de avaliações disponível em:
                </p>
                <a
                  href="/gestor/avaliacoes"
                  className="text-primary hover:underline font-semibold"
                >
                  Ver Página de Avaliações →
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Carregando dados de avaliações...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TURMAS */}
        <TabsContent value="turmas" className="space-y-6 mt-6">
          {loadingTurmas ? (
            <RelatorioResumoSkeleton />
          ) : turmas ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Relatório completo de turmas disponível em:
                </p>
                <a
                  href="/gestor/turmas"
                  className="text-primary hover:underline font-semibold"
                >
                  Ver Página de Turmas →
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Carregando dados de turmas...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
