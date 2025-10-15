import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { 
  CalendarDays,
  Clock,
  CreditCard,
  Users,
  Trophy,
  Plus,
  Bell,
  Settings,
  LogOut,
  MapPin,
  DollarSign,
  TrendingUp,
  Share2,
  Copy,
  CheckCircle,
  Crown,
  Star,
  UserPlus,
  FileText
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { copyToClipboard } from "../lib/clipboard";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { ReferralProgram } from "./client/ReferralProgram";
import { ClientActions, BookingActionMenu } from "./client/ClientActions";
import { ActionNotifications } from "./client/ActionNotifications";

interface ClientDashboardProps {
  onBack: () => void;
  onNavigateToTeams?: () => void;
  onNavigateToTransactions?: () => void;
  onNavigateToCourtDetails?: () => void;
  onNavigateToSubscription?: () => void;
}

const upcomingGames = [
  {
    id: 1,
    court: "Quadra 1 - Society",
    date: "15/10/2025",
    time: "19:00",
    status: "confirmed",
    players: 8,
    totalPlayers: 10,
    payment: "paid"
  },
  {
    id: 2,
    court: "Quadra 2 - Poliesportiva",
    date: "18/10/2025",
    time: "20:00",
    status: "confirmed",
    players: 6,
    totalPlayers: 12,
    payment: "paid"
  },
  {
    id: 3,
    court: "Quadra 1 - Society",
    date: "22/10/2025",
    time: "19:00",
    status: "pending",
    players: 5,
    totalPlayers: 10,
    payment: "pending"
  }
];

const invitations = [
  {
    id: 1,
    organizer: "Carlos Silva",
    court: "Quadra 1 - Society",
    date: "20/10/2025",
    time: "18:00",
    value: 15
  },
  {
    id: 2,
    organizer: "Ana Paula",
    court: "Quadra 3 - Beach Tennis",
    date: "25/10/2025",
    time: "17:00",
    value: 20
  }
];

const myGuests = [
  { id: 1, name: "João Santos", phone: "(11) 98765-4321", tags: ["Fixo"], status: "active" },
  { id: 2, name: "Maria Oliveira", phone: "(11) 91234-5678", tags: ["Gratuito"], status: "active" },
  { id: 3, name: "Pedro Costa", phone: "(11) 99876-5432", tags: [], status: "active" }
];

const transactions = [
  { date: "10/10/2025", description: "Reserva Quadra 1", type: "debit", value: 120 },
  { date: "08/10/2025", description: "Convite João - Jogo 15/10", type: "credit", value: 15 },
  { date: "05/10/2025", description: "Bônus Indicação", type: "credit", value: 30 },
  { date: "03/10/2025", description: "Reserva Quadra 2", type: "debit", value: 100 }
];

export function ClientDashboard({ 
  onBack, 
  onNavigateToTeams, 
  onNavigateToTransactions,
  onNavigateToCourtDetails,
  onNavigateToSubscription 
}: ClientDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyReferralLink = async () => {
    const text = "https://arenado nasanta.com/ref/USER123";
    
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation */}
          <div className="bg-background rounded-lg border p-2">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="jogos">Meus Jogos</TabsTrigger>
              <TabsTrigger value="participo">Participo</TabsTrigger>
              <TabsTrigger value="convidados">Convidados</TabsTrigger>
              <TabsTrigger value="saldo">Saldo</TabsTrigger>
              <TabsTrigger value="indicacao">Indicação</TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jogos Organizados</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jogos Participados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+8 este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 1.240</div>
                  <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
                </CardContent>
              </Card>

              <Card id="credits-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Créditos</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">R$ 250</div>
                  <p className="text-xs text-muted-foreground">Disponível</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Notifications */}
            <ActionNotifications 
              notifications={[
                {
                  id: "welcome-tip",
                  type: "tip",
                  title: "💡 Bem-vindo ao Dashboard!",
                  message: "Use as Ações Rápidas abaixo para acessar funcionalidades frequentes com apenas um clique!",
                  dismissible: true,
                },
                {
                  id: "referral-promo",
                  type: "promo",
                  title: "🎁 Ganhe R$ 20",
                  message: "Indique um amigo e ganhe R$ 20 de bônus quando ele fizer a primeira reserva!",
                  action: {
                    label: "Indicar Agora",
                    onClick: () => setActiveTab("indicacao"),
                  },
                  dismissible: true,
                },
              ]}
            />

            {/* Subscription Banner */}
            {onNavigateToSubscription && (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Crown className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Plano Prata Ativo</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          5.5h usadas de 8h • Renova em 17 dias
                        </p>
                        <div className="flex gap-2 items-center text-xs text-success">
                          <CheckCircle className="h-4 w-4" />
                          <span>Você está economizando 15% em cada reserva</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={onNavigateToSubscription} size="sm">
                        Gerenciar Plano
                      </Button>
                      <Button variant="outline" size="sm" onClick={onNavigateToSubscription}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Fazer Upgrade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client Actions Component */}
            <ClientActions
              onNavigateToBooking={onBack}
              onNavigateToTeams={onNavigateToTeams}
              onNavigateToTransactions={onNavigateToTransactions}
              onNavigateToSchedule={() => setActiveTab("jogos")}
              onNavigateToReferral={() => setActiveTab("indicacao")}
            />

            {/* Upcoming Games */}
            <Card id="upcoming-games-section">
              <CardHeader>
                <CardTitle>Próximos Jogos</CardTitle>
                <CardDescription>Seus jogos agendados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingGames.slice(0, 3).map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{game.court}</div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {game.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {game.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {game.players}/{game.totalPlayers}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={game.payment === 'paid' ? 'default' : 'secondary'} className={game.payment === 'paid' ? 'bg-primary' : ''}>
                        {game.payment === 'paid' ? 'Pago' : 'Pendente'}
                      </Badge>
                      <Button 
                        id={game.id === 1 ? "invite-friends-btn" : undefined}
                        size="sm" 
                        variant="outline" 
                        onClick={onNavigateToCourtDetails}
                      >
                        Detalhes
                      </Button>
                      <BookingActionMenu 
                        bookingId={game.id} 
                        status={game.status}
                        onAction={(type, id) => {
                          toast.info(`Ação ${type} para reserva #${id}`);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meus Jogos Tab */}
          <TabsContent value="jogos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Meus Jogos</h2>
                <p className="text-muted-foreground">Jogos que você organizou</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90" onClick={onBack}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </div>

            <Tabs defaultValue="proximos">
              <TabsList>
                <TabsTrigger value="proximos">Próximos</TabsTrigger>
                <TabsTrigger value="passados">Passados</TabsTrigger>
              </TabsList>

              <TabsContent value="proximos" className="space-y-4 mt-6">
                {upcomingGames.map((game) => (
                  <Card key={game.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <CardTitle>{game.court}</CardTitle>
                            <BookingActionMenu 
                              bookingId={game.id} 
                              status={game.status}
                              onAction={(type, id) => {
                                toast.info(`Ação ${type} para reserva #${id}`);
                              }}
                            />
                          </div>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {game.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {game.time}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={game.status === 'confirmed' ? 'default' : 'secondary'} className={game.status === 'confirmed' ? 'bg-primary' : ''}>
                          {game.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Participantes</span>
                          <span className="text-sm font-medium">{game.players}/{game.totalPlayers}</span>
                        </div>
                        <Progress value={(game.players / game.totalPlayers) * 100} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                          toast.info("Funcionalidade de gerenciar convites em breve!");
                        }}>
                          <Users className="mr-2 h-4 w-4" />
                          Gerenciar Convites
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                          toast.success("Link de compartilhamento copiado!");
                        }}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="passados">
                <Card>
                  <CardContent className="py-12 text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Nenhum jogo passado</h3>
                    <p className="text-sm text-muted-foreground">
                      Seus jogos anteriores aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Jogos que Participo Tab */}
          <TabsContent value="participo" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Jogos que Participo</h2>
              <p className="text-muted-foreground">Convites aceitos</p>
            </div>

            {invitations.length > 0 ? (
              <div className="space-y-4">
                {invitations.map((invite) => (
                  <Card key={invite.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{invite.court}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span>Organizador: {invite.organizer}</span>
                          </CardDescription>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {invite.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {invite.time}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge className="bg-primary">Confirmado</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">Valor da participação</span>
                          <div className="text-lg font-bold text-primary">R$ {invite.value.toFixed(2)}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={onNavigateToCourtDetails}>
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhum convite pendente</h3>
                  <p className="text-sm text-muted-foreground">
                    Você será notificado quando receber convites
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Convidados Tab */}
          <TabsContent value="convidados" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Meus Convidados</h2>
                <p className="text-muted-foreground">Gerencie sua lista de contatos</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Convidado
              </Button>
            </div>

            <div className="space-y-3">
              {myGuests.map((guest) => (
                <Card key={guest.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{guest.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{guest.name}</div>
                        <div className="text-sm text-muted-foreground">{guest.phone}</div>
                      </div>
                      {guest.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        toast.info("Funcionalidade de editar convidado em breve!");
                      }}>
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        toast.info("Funcionalidade de remover convidado em breve!");
                      }}>
                        Remover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Saldo Tab */}
          <TabsContent value="saldo" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Saldo Financeiro</h2>
              <p className="text-muted-foreground">Acompanhe seus créditos e débitos</p>
            </div>

            {/* Balance Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Créditos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">R$ 250,00</div>
                  <p className="text-xs text-muted-foreground mt-1">Disponível para uso</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Débitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">R$ 0,00</div>
                  <p className="text-xs text-muted-foreground mt-1">Nada pendente</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 250,00</div>
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Positivo
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Extrato</CardTitle>
                <CardDescription>Histórico de movimentações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <TrendingUp className="h-5 w-5 text-primary" />
                            ) : (
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">{transaction.date}</div>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-primary' : 'text-foreground'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'} R$ {transaction.value.toFixed(2)}
                        </div>
                      </div>
                      {index < transactions.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Indicação Tab */}
          <TabsContent value="indicacao" className="space-y-6">
            <div id="referral-section">
              <ReferralProgram />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
