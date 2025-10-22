"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, Mail, Phone, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientesPage() {
  // Simulação de dados de clientes
  const clients = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(33) 99999-1111",
      cadastro: "2024-01-15",
      ultimoJogo: "2024-12-18",
      totalJogos: 23,
      saldo: 45.50,
      status: "ativo"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "(33) 99999-2222",
      cadastro: "2024-02-20",
      ultimoJogo: "2024-12-17",
      totalJogos: 15,
      saldo: -30.00,
      status: "devedor"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro@email.com",
      telefone: "(33) 99999-3333",
      cadastro: "2024-03-10",
      ultimoJogo: "2024-12-16",
      totalJogos: 8,
      saldo: 120.00,
      status: "ativo"
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      email: "ana@email.com",
      telefone: "(33) 99999-4444",
      cadastro: "2024-11-01",
      ultimoJogo: "2024-12-15",
      totalJogos: 3,
      saldo: 0.00,
      status: "novo"
    },
    {
      id: 5,
      nome: "Carlos Lima",
      email: "carlos@email.com",
      telefone: "(33) 99999-5555",
      cadastro: "2024-01-05",
      ultimoJogo: "2024-11-20",
      totalJogos: 45,
      saldo: 25.00,
      status: "inativo"
    }
  ];

  const stats = [
    { title: "Total de Clientes", value: clients.length, icon: Users, color: "text-primary" },
    { title: "Clientes Ativos", value: clients.filter(c => c.status === "ativo").length, icon: TrendingUp, color: "text-success" },
    { title: "Novos este Mês", value: clients.filter(c => c.status === "novo").length, icon: Calendar, color: "text-secondary" },
    { title: "Com Saldo Devedor", value: clients.filter(c => c.saldo < 0).length, icon: TrendingUp, color: "text-destructive" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-success/10 text-success">Ativo</Badge>;
      case "devedor":
        return <Badge variant="destructive">Devedor</Badge>;
      case "novo":
        return <Badge className="bg-secondary/10 text-secondary">Novo</Badge>;
      case "inativo":
        return <Badge variant="outline">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Gestão de Clientes
          </h1>
          <p className="body-medium text-muted-foreground">
            Gerencie todos os clientes da arena
          </p>
        </div>
        
        <Button>Novo Cliente</Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              <select className="px-3 py-2 border border-border rounded-lg text-sm">
                <option>Todos os status</option>
                <option>Ativo</option>
                <option>Devedor</option>
                <option>Novo</option>
                <option>Inativo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Cliente</th>
                  <th className="text-left p-4 font-semibold">Contato</th>
                  <th className="text-left p-4 font-semibold">Cadastro</th>
                  <th className="text-left p-4 font-semibold">Último Jogo</th>
                  <th className="text-left p-4 font-semibold">Total Jogos</th>
                  <th className="text-left p-4 font-semibold">Saldo</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{client.nome}</p>
                        <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {client.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{formatDate(client.cadastro)}</td>
                    <td className="p-4 text-sm">{formatDate(client.ultimoJogo)}</td>
                    <td className="p-4 text-center font-semibold">{client.totalJogos}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        client.saldo > 0 ? 'text-success' : 
                        client.saldo < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatCurrency(client.saldo)}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(client.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}