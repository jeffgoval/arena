import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScheduleCalendar } from "./manager/ScheduleCalendar";
import { ClientProfileModal } from "./manager/ClientProfileModal";
import { CourtManagement } from "./manager/CourtManagement";
import { AdvancedReports } from "./manager/AdvancedReports";
import { SystemSettings } from "./manager/SystemSettings";
import { TimeBlockManagement } from "./manager/TimeBlockManagement";
import { ReferralManagement } from "./manager/ReferralManagement";
import { AccessibleChart } from "./common/ChartAccessibility";
import { 
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Ban,
  Gift
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  ResponsiveContainer
} from "recharts";

interface ManagerDashboardProps {
  onBack: () => void;
}

const revenueData = [
  { month: "Jun", value: 12500 },
  { month: "Jul", value: 15800 },
  { month: "Ago", value: 18200 },
  { month: "Set", value: 21000 },
  { month: "Out", value: 19500 }
];

const occupancyData = [
  { court: "Society", occupancy: 85 },
  { court: "Poliesportiva", occupancy: 72 },
  { court: "Beach Tennis", occupancy: 68 }
];

const bookingTypeData = [
  { name: "Avulsa", value: 45, color: "#16a34a" },
  { name: "Mensalista", value: 30, color: "#f97316" },
  { name: "Recorrente", value: 25, color: "#3b82f6" }
];

const todaysBookings = [
  {
    id: 1,
    time: "08:00",
    court: "Quadra 1",
    client: "Carlos Silva",
    type: "Avulsa",
    status: "confirmed",
    value: 120
  },
  {
    id: 2,
    time: "10:00",
    court: "Quadra 2",
    client: "Ana Paula",
    type: "Mensalista",
    status: "confirmed",
    value: 100
  },
  {
    id: 3,
    time: "14:00",
    court: "Quadra 3",
    client: "Roberto Santos",
    type: "Avulsa",
    status: "pending",
    value: 80
  },
  {
    id: 4,
    time: "18:00",
    court: "Quadra 1",
    client: "Maria Oliveira",
    type: "Recorrente",
    status: "confirmed",
    value: 150
  }
];

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  lastBooking: string;
  totalBookings: number;
  status: "active" | "blocked" | "vip";
  memberSince: string;
  tags: string[];
  notes?: string;
}

const initialClients: Client[] = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos@email.com",
    phone: "(11) 98765-4321",
    balance: 50,
    lastBooking: "10/10/2025",
    totalBookings: 24,
    status: "active",
    memberSince: "Janeiro 2024",
    tags: ["regular"],
    notes: "Cliente assíduo, sempre pontual."
  },
  {
    id: 2,
    name: "Ana Paula",
    email: "ana@email.com",
    phone: "(11) 91234-5678",
    balance: -30,
    lastBooking: "12/10/2025",
    totalBookings: 18,
    status: "active",
    memberSince: "Março 2024",
    tags: ["mensalista"],
    notes: ""
  },
  {
    id: 3,
    name: "Roberto Santos",
    email: "roberto@email.com",
    phone: "(11) 99876-5432",
    balance: 120,
    lastBooking: "09/10/2025",
    totalBookings: 35,
    status: "vip",
    memberSince: "Novembro 2023",
    tags: ["vip", "regular"],
    notes: "Cliente VIP, sempre traz novos jogadores."
  }
];

const weekSchedule = [
  { day: "Segunda", date: "13/10", slots: ["08:00", "10:00", "14:00", "18:00", "20:00"] },
  { day: "Terça", date: "14/10", slots: ["08:00", "10:00", "14:00", "18:00", "20:00"] },
  { day: "Quarta", date: "15/10", slots: ["08:00", "10:00", "14:00", "18:00", "20:00"] },
  { day: "Quinta", date: "16/10", slots: ["08:00", "10:00", "14:00", "18:00", "20:00"] },
  { day: "Sexta", date: "17/10", slots: ["08:00", "10:00", "14:00", "18:00", "20:00"] },
  { day: "Sábado", date: "18/10", slots: ["08:00", "10:00", "14:00", "18:00", "20:00"] },
  { day: "Domingo", date: "19/10", slots: ["08:00", "10:00", "14:00", "18:00"] }
];

// Mock schedule data - in real app this would come from API
const getSlotStatus = () => {
  const statuses = ["available", "booked-avulsa", "booked-mensalista", "booked-recorrente", "blocked"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export function ManagerDashboard({ onBack }: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourt, setSelectedCourt] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientProfile, setShowClientProfile] = useState(false);

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation */}
          <div className="bg-background rounded-lg border p-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
                <LayoutDashboard className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="agenda" className="text-xs sm:text-sm">
                <Calendar className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="quadras" className="text-xs sm:text-sm">
                <MapPin className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Quadras</span>
              </TabsTrigger>
              <TabsTrigger value="bloqueios" className="text-xs sm:text-sm">
                <Ban className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Bloqueios</span>
              </TabsTrigger>
              <TabsTrigger value="clientes" className="text-xs sm:text-sm">
                <Users className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Clientes</span>
              </TabsTrigger>
              <TabsTrigger value="indicacoes" className="text-xs sm:text-sm">
                <Gift className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Indicações</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="text-xs sm:text-sm">
                <BarChart3 className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
              <TabsTrigger value="configuracoes" className="text-xs sm:text-sm">
                <Settings className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Config</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento do Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 19.500</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocupação Média</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">75%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todas as quadras
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservas Hoje</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    4 pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">R$ 450</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 clientes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Faturamento</CardTitle>
                  <CardDescription>Últimos 5 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccessibleChart
                    title="Faturamento Mensal"
                    description="Gráfico de linhas mostrando a evolução do faturamento nos últimos 5 meses"
                    data={revenueData.map(d => ({ label: d.month, value: d.value }))}
                    type="line"
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#16a34a" 
                          strokeWidth={2}
                          dot={{ fill: "#16a34a", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </AccessibleChart>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ocupação por Quadra</CardTitle>
                  <CardDescription>Taxa de ocupação média</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccessibleChart
                    title="Taxa de Ocupação por Quadra"
                    description="Gráfico de barras mostrando a taxa de ocupação percentual média de cada quadra"
                    data={occupancyData.map(d => ({ label: d.court, value: d.occupancy }))}
                    type="bar"
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={occupancyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="court" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Bar dataKey="occupancy" fill="#16a34a" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </AccessibleChart>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Today's Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Reservas de Hoje</CardTitle>
                  <CardDescription>13 de Outubro de 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaysBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">{booking.time}</div>
                            <div className="text-xs text-muted-foreground">{booking.court}</div>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div>
                            <div className="font-medium text-sm">{booking.client}</div>
                            <div className="text-xs text-muted-foreground">{booking.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-2">
                            <div className="text-sm font-medium">R$ {booking.value}</div>
                          </div>
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            className={booking.status === 'confirmed' ? 'bg-primary' : ''}
                          >
                            {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Reserva</CardTitle>
                  <CardDescription>Distribuição do mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccessibleChart
                    title="Distribuição de Tipos de Reserva"
                    description="Gráfico de pizza mostrando a porcentagem de cada tipo de reserva no mês atual"
                    data={bookingTypeData.map(d => ({ label: d.name, value: d.value }))}
                    type="pie"
                  >
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={bookingTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {bookingTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {bookingTypeData.map((type) => (
                        <div key={type.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="text-sm">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </AccessibleChart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agenda Tab */}
          <TabsContent value="agenda" className="space-y-6">
            <ScheduleCalendar 
              selectedCourt={selectedCourt}
              onCourtChange={setSelectedCourt}
            />
          </TabsContent>

          {/* Quadras Tab */}
          <TabsContent value="quadras" className="space-y-6">
            <CourtManagement onBack={onBack} />
          </TabsContent>

          {/* Clientes Tab */}
          <TabsContent value="clientes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Clientes</h2>
                <p className="text-muted-foreground">Gerencie sua base de clientes</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>{clients.length} clientes cadastrados</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar cliente..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead>Última Reserva</TableHead>
                      <TableHead>Total Reservas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {client.name}
                            {client.status === "vip" && (
                              <Badge className="bg-yellow-500">VIP</Badge>
                            )}
                            {client.status === "blocked" && (
                              <Badge variant="destructive">Bloqueado</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{client.email}</div>
                          <div className="text-xs text-muted-foreground">{client.phone}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            client.balance >= 0 ? 'text-primary' : 'text-destructive'
                          }`}>
                            {client.balance >= 0 ? '+' : ''} R$ {Math.abs(client.balance)}
                          </span>
                        </TableCell>
                        <TableCell>{client.lastBooking}</TableCell>
                        <TableCell>{client.totalBookings}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client);
                              setShowClientProfile(true);
                            }}
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Relatórios</h2>
                <p className="text-muted-foreground">Análise e métricas de performance</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 3 meses</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Quadra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Quadras</SelectItem>
                    <SelectItem value="1">Quadra 1</SelectItem>
                    <SelectItem value="2">Quadra 2</SelectItem>
                    <SelectItem value="3">Quadra 3</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Reserva" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="avulsa">Avulsa</SelectItem>
                    <SelectItem value="mensalista">Mensalista</SelectItem>
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>

            {/* Metrics Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 98.500</div>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +18% vs período anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">486</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Média de 16/dia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% vs período anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 115</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por reserva
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Charts */}
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faturamento Detalhado</CardTitle>
                  <CardDescription>Comparativo mensal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="value" name="Faturamento" fill="#16a34a" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bloqueios Tab */}
          <TabsContent value="bloqueios" className="space-y-6">
            <TimeBlockManagement />
          </TabsContent>

          {/* Indicações Tab */}
          <TabsContent value="indicacoes" className="space-y-6">
            <ReferralManagement />
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            <AdvancedReports />
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="configuracoes" className="space-y-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Client Profile Modal */}
      <ClientProfileModal
        client={selectedClient}
        isOpen={showClientProfile}
        onClose={() => setShowClientProfile(false)}
        onUpdate={handleUpdateClient}
      />
    </div>
  );
}
