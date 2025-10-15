/**
 * Referral Management Component
 * Manager-facing referral program management and analytics
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Gift,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Award,
  X
} from "lucide-react";
import { mockReferrals, type Referral, type ReferralStatus } from "../../data/mockData";

const STATUS_CONFIG: Record<ReferralStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: typeof CheckCircle2 }> = {
  pending: { label: "Pendente", variant: "secondary", icon: Clock },
  active: { label: "Ativo", variant: "default", icon: CheckCircle2 },
  rewarded: { label: "Recompensado", variant: "default", icon: Gift },
  expired: { label: "Expirado", variant: "outline", icon: AlertCircle },
};

const CHART_COLORS = {
  primary: "#16a34a",
  accent: "#f97316",
  info: "#3b82f6",
  warning: "#f59e0b",
};

export function ReferralManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [referrerFilter, setReferrerFilter] = useState<string>("all");

  // Get unique referrers
  const uniqueReferrers = useMemo(() => {
    const referrers = new Map<number, string>();
    mockReferrals.forEach((r) => {
      referrers.set(r.referrerId, r.referrerName);
    });
    return Array.from(referrers.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter referrals
  const filteredReferrals = useMemo(() => {
    return mockReferrals.filter((referral) => {
      const matchesSearch =
        referral.referredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referredEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referralCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || referral.status === statusFilter;
      const matchesReferrer =
        referrerFilter === "all" || referral.referrerId === parseInt(referrerFilter);

      return matchesSearch && matchesStatus && matchesReferrer;
    });
  }, [searchTerm, statusFilter, referrerFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockReferrals.length;
    const active = mockReferrals.filter((r) => r.status === "active" || r.status === "rewarded").length;
    const pending = mockReferrals.filter((r) => r.status === "pending").length;
    const rewarded = mockReferrals.filter((r) => r.status === "rewarded").length;
    const totalPaidOut = mockReferrals
      .filter((r) => r.rewardClaimed)
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    const conversionRate = total > 0 ? Math.round((rewarded / total) * 100) : 0;

    return { total, active, pending, rewarded, totalPaidOut, conversionRate };
  }, []);

  // Top referrers data
  const topReferrers = useMemo(() => {
    const referrerStats = new Map<number, { name: string; count: number; earned: number }>();

    mockReferrals.forEach((r) => {
      const existing = referrerStats.get(r.referrerId);
      if (existing) {
        existing.count += 1;
        if (r.rewardClaimed) {
          existing.earned += r.rewardAmount;
        }
      } else {
        referrerStats.set(r.referrerId, {
          name: r.referrerName,
          count: 1,
          earned: r.rewardClaimed ? r.rewardAmount : 0,
        });
      }
    });

    return Array.from(referrerStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const months = ["Set", "Out", "Nov", "Dez"];
    return months.map((month, index) => ({
      month,
      referrals: Math.floor(Math.random() * 10) + 5,
      conversions: Math.floor(Math.random() * 8) + 3,
    }));
  }, []);

  // Status distribution data
  const statusDistribution = useMemo(() => {
    return [
      { name: "Recompensados", value: stats.rewarded, color: CHART_COLORS.primary },
      { name: "Ativos", value: stats.active - stats.rewarded, color: CHART_COLORS.info },
      { name: "Pendentes", value: stats.pending, color: CHART_COLORS.warning },
    ];
  }, [stats]);

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || referrerFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setReferrerFilter("all");
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: ReferralStatus) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Programa de Indicação
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestão e análise do programa de indicações
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Indicações</p>
                  <p className="mt-1">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <p className="mt-1">{stats.conversionRate}%</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="mt-1">{stats.active}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pago</p>
                  <p className="mt-1">R$ {stats.totalPaidOut}</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Indicações e conversões por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="referrals"
                  name="Indicações"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  name="Conversões"
                  stroke={CHART_COLORS.accent}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Status das indicações</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Top Indicadores
          </CardTitle>
          <CardDescription>Clientes que mais indicaram amigos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                    <span className="text-sm text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <div>{referrer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {referrer.count} indicação(ões)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-success">R$ {referrer.earned}</div>
                  <div className="text-xs text-muted-foreground">ganhos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtros</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar indicações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="rewarded">Recompensados</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>

            {/* Referrer Filter */}
            <Select value={referrerFilter} onValueChange={setReferrerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos indicadores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos indicadores</SelectItem>
                {uniqueReferrers.map((referrer) => (
                  <SelectItem key={referrer.id} value={referrer.id.toString()}>
                    {referrer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Indicações</CardTitle>
          <CardDescription>
            {filteredReferrals.length} indicação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReferrals.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicador</TableHead>
                    <TableHead>Indicado</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead>1ª Reserva</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Recompensa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>{referral.referrerName}</TableCell>
                      <TableCell>
                        <div>
                          <div>{referral.referredName}</div>
                          <div className="text-xs text-muted-foreground">
                            {referral.referredEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {referral.referralCode}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(referral.signupDate)}</TableCell>
                      <TableCell>{formatDate(referral.firstBookingDate)}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={
                              referral.rewardClaimed
                                ? "text-success"
                                : "text-muted-foreground"
                            }
                          >
                            R$ {referral.rewardAmount}
                          </span>
                          {referral.rewardClaimed && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Nenhuma indicação encontrada</h3>
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a busca"
                  : "As indicações aparecerão aqui quando os clientes começarem a indicar amigos"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
