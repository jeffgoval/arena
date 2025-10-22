"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react";

export default function RelatoriosPage() {
  const reports = [
    {
      title: "Faturamento Mensal",
      description: "Receita total por mês e quadra",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      data: "R$ 45.230 este mês"
    },
    {
      title: "Ocupação das Quadras",
      description: "Taxa de ocupação por horário e dia",
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
      data: "78% de ocupação média"
    },
    {
      title: "Clientes Ativos",
      description: "Frequência e engajamento dos clientes",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      data: "156 clientes ativos"
    },
    {
      title: "Reservas por Período",
      description: "Análise temporal das reservas",
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
      data: "342 reservas este mês"
    }
  ];

  const monthlyData = [
    { month: "Jan", revenue: 35000, reservations: 280, clients: 120 },
    { month: "Fev", revenue: 38000, reservations: 310, clients: 135 },
    { month: "Mar", revenue: 42000, reservations: 340, clients: 145 },
    { month: "Abr", revenue: 39000, reservations: 320, clients: 140 },
    { month: "Mai", revenue: 44000, reservations: 360, clients: 150 },
    { month: "Jun", revenue: 41000, reservations: 335, clients: 148 },
    { month: "Jul", revenue: 46000, reservations: 380, clients: 155 },
    { month: "Ago", revenue: 43000, reservations: 350, clients: 152 },
    { month: "Set", revenue: 47000, reservations: 390, clients: 158 },
    { month: "Out", revenue: 45000, reservations: 370, clients: 156 },
    { month: "Nov", revenue: 48000, reservations: 400, clients: 162 },
    { month: "Dez", revenue: 45230, reservations: 342, clients: 156 }
  ];

  const topClients = [
    { name: "João Silva", reservations: 23, revenue: 1840 },
    { name: "Maria Santos", reservations: 18, revenue: 1440 },
    { name: "Pedro Costa", reservations: 15, revenue: 1200 },
    { name: "Ana Oliveira", reservations: 12, revenue: 960 },
    { name: "Carlos Lima", reservations: 10, revenue: 800 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Relatórios Gerenciais
          </h1>
          <p className="body-medium text-muted-foreground">
            Análises e métricas da arena
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="border-0 shadow-soft card-interactive">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${report.bgColor} flex items-center justify-center`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
              <p className="text-lg font-bold text-foreground">{report.data}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.slice(-6).map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{data.month}</p>
                    <p className="text-sm text-muted-foreground">{data.reservations} reservas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{formatCurrency(data.revenue)}</p>
                    <p className="text-sm text-muted-foreground">{data.clients} clientes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3">Top Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.reservations} reservas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{formatCurrency(client.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Análise Detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted rounded-lg">
              <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
              <p className="text-2xl font-bold text-success">+15%</p>
              <p className="text-sm text-muted-foreground">Crescimento vs mês anterior</p>
            </div>
            
            <div className="text-center p-6 bg-muted rounded-lg">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-2xl font-bold text-primary">8.2</p>
              <p className="text-sm text-muted-foreground">Participantes médios por jogo</p>
            </div>
            
            <div className="text-center p-6 bg-muted rounded-lg">
              <Calendar className="w-12 h-12 text-secondary mx-auto mb-4" />
              <p className="text-2xl font-bold text-secondary">78%</p>
              <p className="text-sm text-muted-foreground">Taxa de ocupação média</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Exportar Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="w-4 h-4" />
              Faturamento (PDF)
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="w-4 h-4" />
              Clientes (Excel)
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="w-4 h-4" />
              Ocupação (PDF)
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="w-4 h-4" />
              Relatório Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}