"use client";

import Link from "next/link";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  MapPin,
  Plus,
  Settings,
  FileText,
  UserCheck,
  Target,
  Activity,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReservasGestor } from "@/hooks/core/useReservasGestor";
import { useMetricasGestor, calcularVariacao, useAtividadesRecentes } from "@/hooks/core/useMetricasGestor";
import { GraficoFaturamento } from "@/components/modules/core/dashboard/GraficoFaturamento";
import { StatCard } from "@/components/modules/core/dashboard/StatCard";

export default function GestorDashboard() {
  const hoje = new Date().toISOString().split('T')[0];

  const { data: reservasHoje, isLoading: loadingHoje } = useReservasGestor({
    data_inicio: hoje,
    data_fim: hoje,
  });

  const { data: metricas, isLoading: loadingMetricas } = useMetricasGestor();
  const { data: atividades, isLoading: loadingAtividades } = useAtividadesRecentes(5);

  // Calcular variações
  const variacaoFaturamento = metricas
    ? calcularVariacao(metricas.faturamentoMes, metricas.faturamentoMesAnterior)
    : { percentual: '0%', isPositivo: true };

  const stats = [
    {
      title: "Faturamento do Mês",
      value: metricas ? `R$ ${metricas.faturamentoMes.toFixed(2)}` : "R$ 0,00",
      change: variacaoFaturamento.percentual,
      isPositive: variacaoFaturamento.isPositivo,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Taxa de Ocupação",
      value: metricas ? `${metricas.taxaOcupacao}%` : "0%",
      subtitle: `${metricas?.totalReservasMes || 0} reservas`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Clientes Ativos",
      value: metricas?.clientesAtivos || 0,
      change: metricas?.clientesNovos ? `+${metricas.clientesNovos} novos` : undefined,
      isPositive: true,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Reservas Hoje",
      value: metricas?.reservasHoje || 0,
      subtitle: metricas?.reservasPendentes
        ? `${metricas.reservasPendentes} pendentes`
        : "Nenhuma pendente",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const quickActions = [
    {
      title: "Agenda",
      description: "Ver agenda completa",
      href: "/gestor/agenda",
      icon: Calendar,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      title: "Reservas",
      description: "Gerenciar reservas",
      href: "/gestor/reservas",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Quadras",
      description: "Gerenciar quadras",
      href: "/gestor/quadras",
      icon: MapPin,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Turmas",
      description: "Gerenciar turmas",
      href: "/gestor/turmas",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avaliações",
      description: "Ver avaliações",
      href: "/gestor/avaliacoes",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Financeiro",
      description: "Gestão financeira",
      href: "/gestor/financeiro",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const isLoading = loadingHoje || loadingMetricas;

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Welcome Banner */}
      <Card className="border-0 shadow-soft bg-gradient-to-br from-primary to-primary/80">
        <CardHeader>
          <CardTitle className="heading-2 text-white">Dashboard do Gestor 👋</CardTitle>
          <CardDescription className="body-large text-white/90">
            Visão geral da operação da arena
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="card-interactive border-0 shadow-soft h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mb-1 text-foreground">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Faturamento */}
      {metricas && (
        <GraficoFaturamento
          faturamentoMes={metricas.faturamentoMes}
          faturamentoMesAnterior={metricas.faturamentoMesAnterior}
          mediaPorReserva={metricas.mediaPorReserva}
        />
      )}

      {/* Reservas de Hoje */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="heading-3">Reservas de Hoje</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </div>
            <Link href="/gestor/agenda">
              <Button variant="outline" size="sm">
                Ver Agenda Completa
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loadingHoje ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando reservas...</p>
            </div>
          ) : !reservasHoje || reservasHoje.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-semibold mb-2">Nenhuma reserva para hoje</p>
              <p className="text-sm text-muted-foreground mb-6">
                Não há jogos programados para hoje
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservasHoje.slice(0, 5).map((reserva) => {
                const statusColors = {
                  confirmada: 'bg-green-100 text-green-700',
                  pendente: 'bg-amber-100 text-amber-700',
                  cancelada: 'bg-red-100 text-red-700',
                };

                return (
                  <Card key={reserva.id} className="card-interactive border-0 shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-primary mb-1" />
                          <p className="text-xs font-bold text-primary">
                            {reserva.horario?.hora_inicio}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold text-foreground">
                              {reserva.quadra?.nome}
                            </h4>
                            <Badge className={statusColors[reserva.status]}>
                              {reserva.status === 'confirmada' ? 'Confirmada' :
                                reserva.status === 'pendente' ? 'Pendente' : 'Cancelada'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-4 h-4" />
                              <span>{reserva.organizador?.nome_completo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{reserva.participantes_count || 0} participantes</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            R$ {reserva.valor_total?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAtividades ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carregando atividades...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Status do Sistema */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Sistema Operacional
                  </p>
                  <p className="text-sm text-blue-800">
                    Todas as funcionalidades estão operando normalmente
                  </p>
                </div>
                <span className="text-xs text-blue-600">Agora</span>
              </div>

              {/* Desempenho do Mês */}
              {metricas && metricas.totalReservasMes > 0 && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">
                      Bom Desempenho
                    </p>
                    <p className="text-sm text-green-800">
                      {metricas.totalReservasMes} reservas realizadas este mês
                    </p>
                  </div>
                  <span className="text-xs text-green-600">Este mês</span>
                </div>
              )}

              {/* Clientes Novos */}
              {metricas && metricas.clientesNovos > 0 && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <UserPlus className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900">
                      Novos Clientes
                    </p>
                    <p className="text-sm text-purple-800">
                      {metricas.clientesNovos} {metricas.clientesNovos === 1 ? 'cliente novo' : 'clientes novos'} este mês
                    </p>
                  </div>
                  <span className="text-xs text-purple-600">Este mês</span>
                </div>
              )}

              {/* Atividades Recentes */}
              {atividades && atividades.length > 0 && (
                <>
                  <div className="pt-3 border-t">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      ÚLTIMAS ATIVIDADES
                    </p>
                  </div>
                  {atividades.slice(0, 3).map((atividade) => {
                    const timestamp = new Date(atividade.timestamp);
                    const tempoDecorrido = Math.floor((Date.now() - timestamp.getTime()) / 1000 / 60);
                    const tempoTexto = tempoDecorrido < 60
                      ? `${tempoDecorrido}min atrás`
                      : tempoDecorrido < 1440
                        ? `${Math.floor(tempoDecorrido / 60)}h atrás`
                        : `${Math.floor(tempoDecorrido / 1440)}d atrás`;

                    return (
                      <div key={atividade.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            {atividade.descricao}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            R$ {atividade.valor?.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {tempoTexto}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
