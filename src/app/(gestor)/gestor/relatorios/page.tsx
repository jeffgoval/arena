"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter, DollarSign, Star, UserCheck, FileText, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function RelatoriosPage() {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");
  const [selectedQuadra, setSelectedQuadra] = useState("todas");

  // Mock data - Faturamento
  const faturamentoData = {
    total: 542300,
    porQuadra: [
      { quadra: "Society 1", valor: 185400, reservas: 234, ocupacao: 82 },
      { quadra: "Society 2", valor: 168900, reservas: 213, ocupacao: 75 },
      { quadra: "Futsal", valor: 142800, reservas: 178, ocupacao: 71 },
      { quadra: "Beach Tennis", valor: 45200, reservas: 89, ocupacao: 45 }
    ],
    porMes: [
      { mes: "Jan", valor: 42000 },
      { mes: "Fev", valor: 38000 },
      { mes: "Mar", valor: 45000 },
      { mes: "Abr", valor: 41000 },
      { mes: "Mai", valor: 47000 },
      { mes: "Jun", valor: 44000 },
      { mes: "Jul", valor: 49000 },
      { mes: "Ago", valor: 46000 },
      { mes: "Set", valor: 48000 },
      { mes: "Out", valor: 45000 },
      { mes: "Nov", valor: 50000 },
      { mes: "Dez", valor: 47300 }
    ],
    porTipo: [
      { tipo: "Avulso", valor: 325380, percentual: 60 },
      { tipo: "Turma", valor: 162920, percentual: 30 },
      { tipo: "Mensalista", valor: 54000, percentual: 10 }
    ]
  };

  // Mock data - Participação
  const participacaoData = {
    clientesAtivos: 156,
    clientesInativos: 34,
    novosClientes: 28,
    frequencia: [
      { cliente: "João Silva", jogos: 45, frequencia: "Semanal", ultimoJogo: "2024-12-18" },
      { cliente: "Maria Santos", jogos: 38, frequencia: "Semanal", ultimoJogo: "2024-12-17" },
      { cliente: "Pedro Costa", jogos: 32, frequencia: "Quinzenal", ultimoJogo: "2024-12-15" },
      { cliente: "Ana Oliveira", jogos: 28, frequencia: "Semanal", ultimoJogo: "2024-12-16" },
      { cliente: "Carlos Lima", jogos: 25, frequencia: "Mensal", ultimoJogo: "2024-12-10" }
    ],
    retencao: 89,
    mediaJogosPorCliente: 8.5
  };

  // Mock data - Convites
  const convitesData = {
    totalEnviados: 1250,
    aceitos: 875,
    recusados: 245,
    pendentes: 130,
    taxaAceite: 70,
    conversaoReserva: 65,
    porQuadra: [
      { quadra: "Society 1", enviados: 420, aceitos: 315, conversao: 75 },
      { quadra: "Society 2", enviados: 380, aceitos: 266, conversao: 70 },
      { quadra: "Futsal", enviados: 310, aceitos: 217, conversao: 70 },
      { quadra: "Beach Tennis", enviados: 140, aceitos: 77, conversao: 55 }
    ]
  };

  // Mock data - Avaliações
  const avaliacoesData = {
    mediaGeral: 4.6,
    totalAvaliacoes: 342,
    porQuadra: [
      { quadra: "Society 1", media: 4.8, total: 125, comentarios: 89 },
      { quadra: "Society 2", media: 4.7, total: 98, comentarios: 67 },
      { quadra: "Futsal", media: 4.5, total: 87, comentarios: 54 },
      { quadra: "Beach Tennis", media: 4.3, total: 32, comentarios: 18 }
    ],
    distribuicao: [
      { estrelas: 5, quantidade: 198, percentual: 58 },
      { estrelas: 4, quantidade: 102, percentual: 30 },
      { estrelas: 3, quantidade: 28, percentual: 8 },
      { estrelas: 2, quantidade: 10, percentual: 3 },
      { estrelas: 1, quantidade: 4, percentual: 1 }
    ]
  };

  // Mock data - Turmas
  const turmasData = {
    totalTurmas: 12,
    alunosAtivos: 145,
    receitaMensal: 18500,
    turmas: [
      { nome: "Futebol Infantil", alunos: 18, capacidade: 20, ocupacao: 90, mensalidade: 150 },
      { nome: "Futebol Juvenil", alunos: 22, capacidade: 25, ocupacao: 88, mensalidade: 180 },
      { nome: "Beach Tennis Iniciante", alunos: 12, capacidade: 15, ocupacao: 80, mensalidade: 200 },
      { nome: "Beach Tennis Avançado", alunos: 8, capacidade: 12, ocupacao: 67, mensalidade: 250 },
      { nome: "Futsal Feminino", alunos: 15, capacidade: 18, ocupacao: 83, mensalidade: 160 }
    ],
    frequenciaMedia: 87,
    taxaEvasao: 8
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleExport = (tipo: string, formato: string) => {
    toast({
      title: "Exportando Relatório",
      description: `Gerando ${tipo} em formato ${formato}...`
    });
    
    // Simular download
    setTimeout(() => {
      toast({
        title: "Download Iniciado",
        description: `Relatório de ${tipo} baixado com sucesso!`
      });
    }, 1500);
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

      {/* Filtros Globais */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="quadra">Quadra</Label>
              <select
                id="quadra"
                className="w-full px-3 py-2 border border-border rounded-lg"
                value={selectedQuadra}
                onChange={(e) => setSelectedQuadra(e.target.value)}
              >
                <option value="todas">Todas as Quadras</option>
                <option value="society1">Society 1</option>
                <option value="society2">Society 2</option>
                <option value="futsal">Futsal</option>
                <option value="beach">Beach Tennis</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="gap-2">
                <Filter className="w-4 h-4" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-success" />
                  <Badge className="bg-success/10 text-success">+12%</Badge>
                </div>
                <p className="text-3xl font-bold text-success">{formatCurrency(faturamentoData.total)}</p>
                <p className="text-sm text-muted-foreground">Faturamento Total</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">714</p>
                <p className="text-sm text-muted-foreground">Total de Reservas</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{formatCurrency(faturamentoData.total / 12)}</p>
                <p className="text-sm text-muted-foreground">Média Mensal</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <BarChart3 className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">68%</p>
                <p className="text-sm text-muted-foreground">Ocupação Média</p>
              </CardContent>
            </Card>
          </div>

          {/* Faturamento por Quadra */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="heading-3">Faturamento por Quadra</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport("Faturamento por Quadra", "PDF")}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("Faturamento por Quadra", "Excel")}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faturamentoData.porQuadra.map((item, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg">{item.quadra}</p>
                        <p className="text-sm text-muted-foreground">{item.reservas} reservas</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">{formatCurrency(item.valor)}</p>
                        <Badge variant="outline">{item.ocupacao}% ocupação</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all"
                        style={{ width: `${item.ocupacao}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Faturamento Mensal */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Faturamento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faturamentoData.porMes.slice(-6).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-semibold">{item.mes}</span>
                      <span className="font-bold text-success">{formatCurrency(item.valor)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Faturamento por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faturamentoData.porTipo.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{item.tipo}</span>
                        <span className="font-bold text-success">{formatCurrency(item.valor)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${item.percentual}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{item.percentual}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PARTICIPAÇÃO */}
        <TabsContent value="participacao" className="space-y-6 mt-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">{participacaoData.clientesAtivos}</p>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <UserCheck className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{participacaoData.novosClientes}</p>
                <p className="text-sm text-muted-foreground">Novos este Mês</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{participacaoData.retencao}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <BarChart3 className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{participacaoData.mediaJogosPorCliente}</p>
                <p className="text-sm text-muted-foreground">Jogos/Cliente (média)</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Clientes por Frequência */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="heading-3">Clientes Mais Frequentes</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("Participação", "Excel")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Posição</th>
                      <th className="text-left p-3 font-semibold">Cliente</th>
                      <th className="text-left p-3 font-semibold">Total de Jogos</th>
                      <th className="text-left p-3 font-semibold">Frequência</th>
                      <th className="text-left p-3 font-semibold">Último Jogo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participacaoData.frequencia.map((cliente, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-bold text-primary">{index + 1}</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold">{cliente.cliente}</td>
                        <td className="p-3">
                          <Badge variant="outline">{cliente.jogos} jogos</Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={
                            cliente.frequencia === "Semanal" ? "bg-success/10 text-success" :
                            cliente.frequencia === "Quinzenal" ? "bg-primary/10 text-primary" :
                            "bg-warning/10 text-warning"
                          }>
                            {cliente.frequencia}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{formatDate(cliente.ultimoJogo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Engajamento */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Status dos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-success">Ativos</p>
                      <p className="text-sm text-muted-foreground">Jogaram nos últimos 30 dias</p>
                    </div>
                    <p className="text-2xl font-bold text-success">{participacaoData.clientesAtivos}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-warning">Inativos</p>
                      <p className="text-sm text-muted-foreground">Sem jogos há mais de 30 dias</p>
                    </div>
                    <p className="text-2xl font-bold text-warning">{participacaoData.clientesInativos}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-primary">Novos</p>
                      <p className="text-sm text-muted-foreground">Cadastrados este mês</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{participacaoData.novosClientes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Métricas de Engajamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Taxa de Retenção</span>
                      <span className="text-sm font-bold text-success">{participacaoData.retencao}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-success h-3 rounded-full transition-all"
                        style={{ width: `${participacaoData.retencao}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Média de Jogos por Cliente</span>
                      <span className="text-sm font-bold text-primary">{participacaoData.mediaJogosPorCliente}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${(participacaoData.mediaJogosPorCliente / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Distribuição de Frequência</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Semanal</span>
                        <Badge className="bg-success/10 text-success">45%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Quinzenal</span>
                        <Badge className="bg-primary/10 text-primary">35%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Mensal</span>
                        <Badge className="bg-warning/10 text-warning">20%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CONVITES */}
        <TabsContent value="convites" className="space-y-6 mt-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <FileText className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{convitesData.totalEnviados}</p>
                <p className="text-sm text-muted-foreground">Convites Enviados</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <UserCheck className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">{convitesData.aceitos}</p>
                <p className="text-sm text-muted-foreground">Aceitos</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">{convitesData.taxaAceite}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Aceite</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <BarChart3 className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-primary">{convitesData.conversaoReserva}%</p>
                <p className="text-sm text-muted-foreground">Conversão em Reserva</p>
              </CardContent>
            </Card>
          </div>

          {/* Status dos Convites */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Status dos Convites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-success/10 rounded-lg">
                  <p className="text-4xl font-bold text-success mb-2">{convitesData.aceitos}</p>
                  <p className="text-sm text-muted-foreground mb-1">Aceitos</p>
                  <Badge className="bg-success/20 text-success">{convitesData.taxaAceite}%</Badge>
                </div>
                <div className="text-center p-6 bg-destructive/10 rounded-lg">
                  <p className="text-4xl font-bold text-destructive mb-2">{convitesData.recusados}</p>
                  <p className="text-sm text-muted-foreground mb-1">Recusados</p>
                  <Badge className="bg-destructive/20 text-destructive">
                    {Math.round((convitesData.recusados / convitesData.totalEnviados) * 100)}%
                  </Badge>
                </div>
                <div className="text-center p-6 bg-warning/10 rounded-lg">
                  <p className="text-4xl font-bold text-warning mb-2">{convitesData.pendentes}</p>
                  <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
                  <Badge className="bg-warning/20 text-warning">
                    {Math.round((convitesData.pendentes / convitesData.totalEnviados) * 100)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Convites por Quadra */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="heading-3">Performance por Quadra</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("Convites", "PDF")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {convitesData.porQuadra.map((item, index) => (
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
                          {item.conversao}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">conversão</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-sm font-bold">{item.enviados}</p>
                        <p className="text-xs text-muted-foreground">Enviados</p>
                      </div>
                      <div className="text-center p-2 bg-success/10 rounded">
                        <p className="text-sm font-bold text-success">{item.aceitos}</p>
                        <p className="text-xs text-muted-foreground">Aceitos</p>
                      </div>
                      <div className="text-center p-2 bg-primary/10 rounded">
                        <p className="text-sm font-bold text-primary">{Math.round(item.aceitos * (item.conversao / 100))}</p>
                        <p className="text-xs text-muted-foreground">Reservas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise de Conversão */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Convites Enviados</span>
                    <span className="font-bold">{convitesData.totalEnviados}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Convites Aceitos</span>
                    <span className="font-bold text-success">{convitesData.aceitos} ({convitesData.taxaAceite}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div className="bg-success h-4 rounded-full" style={{ width: `${convitesData.taxaAceite}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Convertidos em Reserva</span>
                    <span className="font-bold text-primary">
                      {Math.round(convitesData.aceitos * (convitesData.conversaoReserva / 100))} ({convitesData.conversaoReserva}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: `${convitesData.conversaoReserva}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AVALIAÇÕES */}
        <TabsContent value="avaliacoes" className="space-y-6 mt-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-warning mb-2" />
                <p className="text-3xl font-bold text-warning">{avaliacoesData.mediaGeral}</p>
                <p className="text-sm text-muted-foreground">Média Geral</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <FileText className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{avaliacoesData.totalAvaliacoes}</p>
                <p className="text-sm text-muted-foreground">Total de Avaliações</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">
                  {avaliacoesData.distribuicao[0].quantidade}
                </p>
                <p className="text-sm text-muted-foreground">Avaliações 5 Estrelas</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">
                  {avaliacoesData.distribuicao[0].percentual}%
                </p>
                <p className="text-sm text-muted-foreground">Satisfação</p>
              </CardContent>
            </Card>
          </div>

          {/* Avaliações por Quadra */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="heading-3">Avaliações por Quadra</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("Avaliações", "PDF")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {avaliacoesData.porQuadra.map((item, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg">{item.quadra}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.total} avaliações • {item.comentarios} comentários
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Star className="w-6 h-6 text-warning fill-warning" />
                          <span className="text-2xl font-bold">{item.media}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= item.media
                              ? 'text-warning fill-warning'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribuição de Estrelas */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Distribuição de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {avaliacoesData.distribuicao.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1 w-24">
                        <span className="font-semibold">{item.estrelas}</span>
                        <Star className="w-4 h-4 text-warning fill-warning" />
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className="bg-warning h-3 rounded-full transition-all"
                            style={{ width: `${item.percentual}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right">
                        <span className="font-semibold">{item.quantidade}</span>
                        <span className="text-sm text-muted-foreground ml-1">({item.percentual}%)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise de Satisfação */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Índice de Satisfação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-warning/10 mb-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-warning">{avaliacoesData.mediaGeral}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(avaliacoesData.mediaGeral)
                                ? 'text-warning fill-warning'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold mb-2">Excelente!</p>
                  <p className="text-sm text-muted-foreground">
                    Baseado em {avaliacoesData.totalAvaliacoes} avaliações
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Resumo de Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-success">Positivas (4-5★)</span>
                      <span className="font-bold text-success">
                        {avaliacoesData.distribuicao[0].quantidade + avaliacoesData.distribuicao[1].quantidade}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {avaliacoesData.distribuicao[0].percentual + avaliacoesData.distribuicao[1].percentual}% das avaliações
                    </p>
                  </div>
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-warning">Neutras (3★)</span>
                      <span className="font-bold text-warning">{avaliacoesData.distribuicao[2].quantidade}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {avaliacoesData.distribuicao[2].percentual}% das avaliações
                    </p>
                  </div>
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-destructive">Negativas (1-2★)</span>
                      <span className="font-bold text-destructive">
                        {avaliacoesData.distribuicao[3].quantidade + avaliacoesData.distribuicao[4].quantidade}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {avaliacoesData.distribuicao[3].percentual + avaliacoesData.distribuicao[4].percentual}% das avaliações
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TURMAS */}
        <TabsContent value="turmas" className="space-y-6 mt-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <GraduationCap className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{turmasData.totalTurmas}</p>
                <p className="text-sm text-muted-foreground">Turmas Ativas</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">{turmasData.alunosAtivos}</p>
                <p className="text-sm text-muted-foreground">Alunos Ativos</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <DollarSign className="w-8 h-8 text-success mb-2" />
                <p className="text-3xl font-bold text-success">{formatCurrency(turmasData.receitaMensal)}</p>
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{turmasData.frequenciaMedia}%</p>
                <p className="text-sm text-muted-foreground">Frequência Média</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Turmas */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="heading-3">Turmas Detalhadas</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("Turmas", "Excel")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Turma</th>
                      <th className="text-left p-3 font-semibold">Alunos</th>
                      <th className="text-left p-3 font-semibold">Capacidade</th>
                      <th className="text-left p-3 font-semibold">Ocupação</th>
                      <th className="text-left p-3 font-semibold">Mensalidade</th>
                      <th className="text-left p-3 font-semibold">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turmasData.turmas.map((turma, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{turma.nome}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{turma.alunos} alunos</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{turma.capacidade}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-20 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  turma.ocupacao >= 80 ? 'bg-success' :
                                  turma.ocupacao >= 60 ? 'bg-primary' :
                                  'bg-warning'
                                }`}
                                style={{ width: `${turma.ocupacao}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{turma.ocupacao}%</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold">{formatCurrency(turma.mensalidade)}</td>
                        <td className="p-3 font-bold text-success">
                          {formatCurrency(turma.alunos * turma.mensalidade)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Performance */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Ocupação das Turmas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {turmasData.turmas.map((turma, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{turma.nome}</span>
                        <span className="text-sm font-bold">
                          {turma.alunos}/{turma.capacidade}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            turma.ocupacao >= 80 ? 'bg-success' :
                            turma.ocupacao >= 60 ? 'bg-primary' :
                            'bg-warning'
                          }`}
                          style={{ width: `${turma.ocupacao}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3">Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-success">Frequência Média</span>
                      <span className="text-2xl font-bold text-success">{turmasData.frequenciaMedia}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Presença dos alunos nas aulas
                    </p>
                  </div>
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-warning">Taxa de Evasão</span>
                      <span className="text-2xl font-bold text-warning">{turmasData.taxaEvasao}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Alunos que cancelaram no último mês
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary">Receita Mensal</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(turmasData.receitaMensal)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total de mensalidades
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Média por Turma</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(turmasData.receitaMensal / turmasData.totalTurmas)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receita média por turma
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise de Crescimento */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Análise de Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-success/10 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
                  <p className="text-2xl font-bold text-success">+18%</p>
                  <p className="text-sm text-muted-foreground">Crescimento de alunos</p>
                  <p className="text-xs text-muted-foreground mt-1">vs mês anterior</p>
                </div>
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold text-primary">12.1</p>
                  <p className="text-sm text-muted-foreground">Alunos por turma</p>
                  <p className="text-xs text-muted-foreground mt-1">média geral</p>
                </div>
                <div className="text-center p-6 bg-warning/10 rounded-lg">
                  <Star className="w-12 h-12 text-warning mx-auto mb-4" />
                  <p className="text-2xl font-bold text-warning">4.7</p>
                  <p className="text-sm text-muted-foreground">Satisfação média</p>
                  <p className="text-xs text-muted-foreground mt-1">avaliação dos alunos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exportação Geral */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Exportar Relatórios Completos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={() => handleExport("Relatório Completo", "PDF")}
            >
              <Download className="w-4 h-4" />
              Relatório Completo (PDF)
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={() => handleExport("Dados Gerenciais", "Excel")}
            >
              <Download className="w-4 h-4" />
              Dados Gerenciais (Excel)
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={() => handleExport("Análise Financeira", "PDF")}
            >
              <Download className="w-4 h-4" />
              Análise Financeira (PDF)
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={() => handleExport("Dashboard Executivo", "PDF")}
            >
              <Download className="w-4 h-4" />
              Dashboard Executivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
