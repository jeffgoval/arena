"use client";

import Link from "next/link";
import { Calendar, Users, Trophy, CreditCard, Plus, Target, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClienteDashboard() {
  // Simulação de dados - em produção viria de hooks/API
  const reservasFuturas: any[] = [];
  const isLoadingReservas = false;

  const stats = [
    {
      title: "Próximas Reservas",
      value: reservasFuturas?.length || 0,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Minhas Turmas", 
      value: "-",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Créditos Disponíveis",
      value: "R$ 0,00",
      icon: CreditCard,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Próximo Jogo",
      value: "Sem jogos",
      subtitle: "Crie sua primeira reserva",
      icon: Target,
      color: "text-primary-foreground",
      bgColor: "bg-gradient-to-br from-primary to-secondary",
      isGradient: true,
    },
  ];

  const quickActions = [
    {
      title: "Nova Reserva",
      description: "Reserve uma quadra agora",
      href: "/cliente/reservas/nova",
      icon: Calendar,
      color: "text-primary-foreground",
      bgColor: "bg-gradient-to-br from-primary to-primary/80",
      isGradient: true,
    },
    {
      title: "Criar Turma",
      description: "Monte seu time fixo",
      href: "/cliente/turmas/criar",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Minhas Reservas",
      description: "Gerencie suas reservas",
      href: "/cliente/reservas",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Minhas Turmas",
      description: "Gerencie seus times",
      href: "/cliente/turmas",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Convites Criados",
      description: "Gerencie seus convites",
      href: "/cliente/convites",
      icon: MessageSquare,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Meu Saldo",
      description: "Compre créditos",
      href: "/cliente/creditos",
      icon: CreditCard,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Welcome Banner */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-2">Dashboard do Cliente 👋</CardTitle>
          <CardDescription className="body-large">
            Pronto para organizar seu próximo jogo?
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`card-interactive border-0 shadow-soft ${stat.isGradient ? stat.bgColor : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.isGradient ? 'bg-white/20' : stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.isGradient ? 'text-white' : stat.color}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold mb-1 ${stat.isGradient ? 'text-white' : 'text-foreground'}`}>
                {stat.value}
              </p>
              <p className={`text-sm ${stat.isGradient ? 'text-white/90' : 'text-muted-foreground'}`}>
                {stat.title}
              </p>
              {stat.subtitle && (
                <p className={`text-xs mt-1 ${stat.isGradient ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {stat.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className={`card-interactive border-0 shadow-soft h-full ${action.isGradient ? action.bgColor : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl ${action.isGradient ? 'bg-white/20' : action.bgColor} flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 ${action.isGradient ? 'text-white' : action.color}`} />
                      </div>
                      {action.isGradient && <Plus className="w-5 h-5 ml-auto text-white" />}
                    </div>
                    <h4 className={`font-bold text-lg mb-1 ${action.isGradient ? 'text-white' : 'text-foreground'}`}>
                      {action.title}
                    </h4>
                    <p className={`text-sm ${action.isGradient ? 'text-white/90' : 'text-muted-foreground'}`}>
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reservations */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Próximas Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingReservas ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando reservas...</p>
            </div>
          ) : reservasFuturas && reservasFuturas.length > 0 ? (
            <div className="space-y-4">
              {reservasFuturas.slice(0, 3).map((reserva, index) => (
                <Link key={index} href={`/cliente/reservas/${reserva.id}`}>
                  <Card className="card-interactive border-0 shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                          <p className="text-xs font-semibold text-primary">SEG</p>
                          <p className="text-2xl font-bold text-primary">15</p>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">Quadra Society 1</h4>
                          <p className="text-sm text-muted-foreground">19:00 - 20:00</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">R$ 80,00</p>
                          <p className="text-xs text-muted-foreground">Confirmada</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-semibold mb-2">Nenhuma reserva futura</p>
              <p className="text-sm text-muted-foreground mb-6">Crie sua primeira reserva e comece a jogar!</p>
              <Link href="/cliente/reservas/nova">
                <Button>Criar Nova Reserva</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
