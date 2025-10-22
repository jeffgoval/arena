"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Building2, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export default function GestorDashboard() {
  const stats = [
    {
      title: "Reservas Hoje",
      value: "12",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+2 vs ontem"
    },
    {
      title: "Clientes Ativos",
      value: "156",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      trend: "+8 este mês"
    },
    {
      title: "Quadras Disponíveis",
      value: "3/4",
      icon: Building2,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "1 em manutenção"
    },
    {
      title: "Receita do Mês",
      value: "R$ 12.450",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "+15% vs mês anterior"
    },
  ];

  const recentActivity = [
    { type: "reservation", user: "João Silva", action: "Nova reserva", time: "há 5 min", court: "Quadra Society 1" },
    { type: "payment", user: "Maria Santos", action: "Pagamento confirmado", time: "há 12 min", amount: "R$ 80,00" },
    { type: "cancellation", user: "Pedro Costa", action: "Cancelou reserva", time: "há 25 min", court: "Quadra Futsal" },
    { type: "registration", user: "Ana Oliveira", action: "Novo cadastro", time: "há 1h", phone: "(33) 99999-9999" },
    { type: "team", user: "Carlos Lima", action: "Criou turma", time: "há 2h", team: "Pelada de Quinta" },
  ];

  const upcomingReservations = [
    { time: "19:00", court: "Society 1", organizer: "João Silva", participants: 8, status: "confirmada" },
    { time: "20:00", court: "Futsal", organizer: "Maria Santos", participants: 6, status: "pendente" },
    { time: "21:00", court: "Society 2", organizer: "Pedro Costa", participants: 10, status: "confirmada" },
  ];

  return (
    <div className="container-custom page-padding space-y-8">
      <div>
        <h1 className="heading-2">Dashboard do Gestor</h1>
        <p className="body-medium text-muted-foreground">Visão geral da Arena Dona Santa</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {activity.type === "reservation" && <Calendar className="w-5 h-5 text-primary" />}
                    {activity.type === "payment" && <TrendingUp className="w-5 h-5 text-success" />}
                    {activity.type === "cancellation" && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {activity.type === "registration" && <Users className="w-5 h-5 text-secondary" />}
                    {activity.type === "team" && <Users className="w-5 h-5 text-accent" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user}
                      {activity.court && ` - ${activity.court}`}
                      {activity.amount && ` - ${activity.amount}`}
                      {activity.team && ` - ${activity.team}`}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Agenda de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReservations.map((reservation, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{reservation.time}</p>
                    <p className="text-xs text-muted-foreground">{reservation.court}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{reservation.organizer}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.participants} participantes
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reservation.status === "confirmada" 
                        ? "bg-success/10 text-success" 
                        : "bg-warning/10 text-warning"
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-interactive border-primary/20 bg-primary/5">
              <CardContent className="p-4 text-center">
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Nova Quadra</p>
              </CardContent>
            </Card>
            
            <Card className="card-interactive border-secondary/20 bg-secondary/5">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="font-semibold text-sm">Bloquear Horário</p>
              </CardContent>
            </Card>
            
            <Card className="card-interactive border-accent/20 bg-accent/5">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold text-sm">Gerenciar Clientes</p>
              </CardContent>
            </Card>
            
            <Card className="card-interactive border-success/20 bg-success/5">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="font-semibold text-sm">Relatórios</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}