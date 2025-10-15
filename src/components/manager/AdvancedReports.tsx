import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  XCircle,
  Clock,
  BarChart3,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

// Mock data - Ocupação por quadra/horário
const occupancyByCourtData = [
  { hour: "08:00", society: 75, poliesportiva: 60, beachTennis: 45 },
  { hour: "10:00", society: 85, poliesportiva: 70, beachTennis: 55 },
  { hour: "14:00", society: 60, poliesportiva: 55, beachTennis: 40 },
  { hour: "16:00", society: 80, poliesportiva: 75, beachTennis: 65 },
  { hour: "18:00", society: 95, poliesportiva: 90, beachTennis: 85 },
  { hour: "20:00", society: 100, poliesportiva: 95, beachTennis: 90 },
  { hour: "22:00", society: 70, poliesportiva: 65, beachTennis: 60 },
];

// Mock data - Receita por período
const revenueByPeriodData = [
  { month: "Mai", avulsa: 8500, mensalista: 12000, recorrente: 6500, total: 27000 },
  { month: "Jun", avulsa: 9200, mensalista: 13500, recorrente: 7300, total: 30000 },
  { month: "Jul", avulsa: 11000, mensalista: 14200, recorrente: 8800, total: 34000 },
  { month: "Ago", avulsa: 10500, mensalista: 15000, recorrente: 9500, total: 35000 },
  { month: "Set", avulsa: 12000, mensalista: 16500, recorrente: 10500, total: 39000 },
  { month: "Out", avulsa: 13500, mensalista: 17200, recorrente: 11300, total: 42000 },
];

// Mock data - Clientes mais ativos
const topClientsData = [
  { id: 1, name: "Roberto Santos", bookings: 35, revenue: 4200, avgRating: 4.9, lastBooking: "14/10/2025" },
  { id: 2, name: "Carlos Silva", bookings: 28, revenue: 3360, avgRating: 4.8, lastBooking: "13/10/2025" },
  { id: 3, name: "Marina Costa", bookings: 24, revenue: 2880, avgRating: 4.7, lastBooking: "12/10/2025" },
  { id: 4, name: "Pedro Oliveira", bookings: 22, revenue: 2640, avgRating: 4.9, lastBooking: "14/10/2025" },
  { id: 5, name: "Ana Paula", bookings: 20, revenue: 2400, avgRating: 4.6, lastBooking: "11/10/2025" },
  { id: 6, name: "João Santos", bookings: 18, revenue: 2160, avgRating: 4.8, lastBooking: "13/10/2025" },
  { id: 7, name: "Fernanda Lima", bookings: 16, revenue: 1920, avgRating: 4.5, lastBooking: "10/10/2025" },
  { id: 8, name: "Lucas Almeida", bookings: 15, revenue: 1800, avgRating: 4.7, lastBooking: "12/10/2025" },
];

// Mock data - Inadimplência
const defaultersData = [
  { id: 1, name: "Marcos Ferreira", balance: -450, daysOverdue: 45, lastPayment: "01/09/2025", phone: "(11) 98765-1234" },
  { id: 2, name: "Juliana Rocha", balance: -280, daysOverdue: 30, lastPayment: "15/09/2025", phone: "(11) 91234-5678" },
  { id: 3, name: "Ricardo Mendes", balance: -180, daysOverdue: 20, lastPayment: "25/09/2025", phone: "(11) 99876-5432" },
  { id: 4, name: "Camila Torres", balance: -150, daysOverdue: 15, lastPayment: "30/09/2025", phone: "(11) 98765-9876" },
  { id: 5, name: "Gabriel Souza", balance: -120, daysOverdue: 10, lastPayment: "05/10/2025", phone: "(11) 91234-8765" },
];

// Mock data - Cancelamentos
const cancellationsData = [
  { month: "Mai", total: 12, byClient: 8, byManager: 4, rate: 8.5 },
  { month: "Jun", total: 15, byClient: 10, byManager: 5, rate: 9.2 },
  { month: "Jul", total: 10, byClient: 7, byManager: 3, rate: 6.1 },
  { month: "Ago", total: 8, byClient: 6, byManager: 2, rate: 4.8 },
  { month: "Set", total: 14, byClient: 9, byManager: 5, rate: 7.9 },
  { month: "Out", total: 11, byClient: 8, byManager: 3, rate: 6.5 },
];

// Mock data - Comparativo mensal
const monthlyComparisonData = [
  { metric: "Receita", atual: 42000, anterior: 39000, meta: 45000 },
  { metric: "Reservas", atual: 180, anterior: 165, meta: 200 },
  { metric: "Taxa Ocupação", atual: 85, anterior: 78, meta: 90 },
  { metric: "Novos Clientes", atual: 12, anterior: 8, meta: 15 },
  { metric: "Taxa Cancelamento", atual: 6.5, anterior: 7.9, meta: 5.0 },
];

// Mock data - Projeções
const projectionData = [
  { month: "Out", real: 42000, projecao: 42000 },
  { month: "Nov", real: null, projecao: 45500 },
  { month: "Dez", real: null, projecao: 52000 },
  { month: "Jan", real: null, projecao: 48000 },
  { month: "Fev", real: null, projecao: 50500 },
  { month: "Mar", real: null, projecao: 54000 },
];

// Mock data - Distribuição de horários
const timeDistributionData = [
  { period: "Manhã (8h-12h)", value: 25, color: "#f59e0b" },
  { period: "Tarde (12h-18h)", value: 30, color: "#3b82f6" },
  { period: "Noite (18h-23h)", value: 45, color: "#16a34a" },
];

// Mock data - Performance por dia da semana
const weekdayPerformanceData = [
  { day: "Seg", ocupacao: 72, receita: 5200, reservas: 22 },
  { day: "Ter", ocupacao: 75, receita: 5800, reservas: 24 },
  { day: "Qua", ocupacao: 78, receita: 6100, reservas: 26 },
  { day: "Qui", ocupacao: 80, receita: 6400, reservas: 28 },
  { day: "Sex", ocupacao: 88, receita: 7200, reservas: 32 },
  { day: "Sáb", ocupacao: 95, receita: 8500, reservas: 36 },
  { day: "Dom", ocupacao: 85, receita: 6800, reservas: 30 },
];

const COLORS = {
  primary: "#16a34a",
  secondary: "#f97316",
  tertiary: "#3b82f6",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#ef4444",
  muted: "#64748b",
};

interface AdvancedReportsProps {
  onBack?: () => void;
}

export function AdvancedReports({ onBack }: AdvancedReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCourt, setSelectedCourt] = useState("all");

  const handleExport = (reportType: string) => {
    toast.success(`Exportando relatório: ${reportType}`);
  };

  const calculateGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth > 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Relatórios Avançados</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Análise completa de desempenho e métricas do negócio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => handleExport("Completo")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold mt-1">R$ 42.000</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+7.7% vs mês anterior</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Taxa de Ocupação</p>
                  <p className="text-2xl font-bold mt-1">85%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+7 pontos</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Clientes Ativos</p>
                  <p className="text-2xl font-bold mt-1">156</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+12 novos</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Taxa Cancelamento</p>
                  <p className="text-2xl font-bold mt-1">6.5%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">-1.4 pontos</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="occupancy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="occupancy">Ocupação</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="defaulters">Inadimplência</TabsTrigger>
          <TabsTrigger value="cancellations">Cancelamentos</TabsTrigger>
          <TabsTrigger value="projections">Projeções</TabsTrigger>
        </TabsList>

        {/* Occupancy Report */}
        <TabsContent value="occupancy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Ocupação por Horário
                </CardTitle>
                <CardDescription>
                  Taxa de ocupação das quadras por faixa horária
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occupancyByCourtData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="society" name="Society" fill={COLORS.primary} />
                    <Bar dataKey="poliesportiva" name="Poliesportiva" fill={COLORS.secondary} />
                    <Bar dataKey="beachTennis" name="Beach Tennis" fill={COLORS.tertiary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {timeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Performance por Dia da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weekdayPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="ocupacao"
                    name="Ocupação (%)"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="receita"
                    name="Receita (R$)"
                    stroke={COLORS.secondary}
                    fill={COLORS.secondary}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Report */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Receita por Tipo de Reserva
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Evolução da receita nos últimos 6 meses
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("Receita")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueByPeriodData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avulsa"
                    stackId="1"
                    name="Avulsa"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                  />
                  <Area
                    type="monotone"
                    dataKey="mensalista"
                    stackId="1"
                    name="Mensalista"
                    stroke={COLORS.secondary}
                    fill={COLORS.secondary}
                  />
                  <Area
                    type="monotone"
                    dataKey="recorrente"
                    stackId="1"
                    name="Recorrente"
                    stroke={COLORS.tertiary}
                    fill={COLORS.tertiary}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Receita Avulsa</p>
                  <p className="text-xl font-bold mt-1">R$ 13.500</p>
                  <p className="text-xs text-success mt-1">+22.7%</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Receita Mensalista</p>
                  <p className="text-xl font-bold mt-1">R$ 17.200</p>
                  <p className="text-xs text-success mt-1">+14.7%</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Receita Recorrente</p>
                  <p className="text-xl font-bold mt-1">R$ 11.300</p>
                  <p className="text-xs text-success mt-1">+18.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Clients Report */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Clientes Mais Ativos
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Ranking dos clientes por número de reservas e receita gerada
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("Clientes")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Reservas</TableHead>
                    <TableHead className="text-center">Receita</TableHead>
                    <TableHead className="text-center">Avaliação</TableHead>
                    <TableHead>Última Reserva</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topClientsData.map((client, index) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {index < 3 ? (
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              index === 0 ? "bg-warning/20 text-warning" :
                              index === 1 ? "bg-muted/50 text-foreground" :
                              "bg-accent/20 text-accent"
                            }`}>
                              {index + 1}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{client.bookings}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-success">
                        R$ {client.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-warning">★</span>
                          <span>{client.avgRating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {client.lastBooking}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-success">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaulters Report */}
        <TabsContent value="defaulters" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total em Atraso</p>
                    <p className="text-2xl font-bold text-destructive">R$ 1.180</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clientes Inadimplentes</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Média de Atraso</p>
                    <p className="text-2xl font-bold">24 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Lista de Inadimplentes
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Clientes com saldo devedor ordenados por prioridade
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("Inadimplentes")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Saldo Devedor</TableHead>
                    <TableHead className="text-center">Dias em Atraso</TableHead>
                    <TableHead>Último Pagamento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultersData.map((defaulter) => (
                    <TableRow key={defaulter.id}>
                      <TableCell className="font-medium">{defaulter.name}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-destructive">
                          R$ {Math.abs(defaulter.balance).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={
                          defaulter.daysOverdue > 30 ? "destructive" :
                          defaulter.daysOverdue > 15 ? "secondary" : "outline"
                        }>
                          {defaulter.daysOverdue} dias
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {defaulter.lastPayment}
                      </TableCell>
                      <TableCell className="text-sm">{defaulter.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Funcionalidade de cobrança em desenvolvimento")}
                        >
                          Cobrar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cancellations Report */}
        <TabsContent value="cancellations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Análise de Cancelamentos
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Evolução e motivos dos cancelamentos de reservas
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("Cancelamentos")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cancellationsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total"
                    stroke={COLORS.danger}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="byClient"
                    name="Por Cliente"
                    stroke={COLORS.warning}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="byManager"
                    name="Por Gestor"
                    stroke={COLORS.tertiary}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <p className="text-xs text-muted-foreground">Total do Mês</p>
                  <p className="text-2xl font-bold mt-1">11</p>
                  <p className="text-xs text-success mt-1">↓ 3 vs anterior</p>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <p className="text-xs text-muted-foreground">Por Cliente</p>
                  <p className="text-2xl font-bold mt-1">8</p>
                  <p className="text-xs text-muted-foreground mt-1">72.7%</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Por Gestor</p>
                  <p className="text-2xl font-bold mt-1">3</p>
                  <p className="text-xs text-muted-foreground mt-1">27.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projections Report */}
        <TabsContent value="projections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Projeção de Receita
                </CardTitle>
                <CardDescription>
                  Previsão baseada no histórico dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="real"
                      name="Real"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="projecao"
                      name="Projeção"
                      stroke={COLORS.secondary}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 p-4 bg-success/5 rounded-lg border border-success/20">
                  <p className="text-sm text-muted-foreground">Projeção próximos 6 meses</p>
                  <p className="text-2xl font-bold text-success mt-1">R$ 300.000</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Crescimento estimado de 18.5%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Comparativo: Atual vs Anterior vs Meta
                </CardTitle>
                <CardDescription>
                  Performance do mês atual comparado com objetivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyComparisonData.map((item) => {
                    const growth = calculateGrowth(item.atual, item.anterior);
                    const goalProgress = (item.atual / item.meta) * 100;

                    return (
                      <div key={item.metric} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.atual}</span>
                            <div className={`flex items-center gap-1 text-xs ${
                              growth.isPositive ? "text-success" : "text-destructive"
                            }`}>
                              {growth.isPositive ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {growth.value}%
                            </div>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              goalProgress >= 100 ? "bg-success" :
                              goalProgress >= 75 ? "bg-primary" :
                              goalProgress >= 50 ? "bg-warning" : "bg-destructive"
                            }`}
                            style={{ width: `${Math.min(goalProgress, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Anterior: {item.anterior}</span>
                          <span>Meta: {item.meta}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
