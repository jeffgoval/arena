/**
 * Enhanced Client Dashboard with UX Improvements
 * - Progressive Disclosure
 * - Customizable Dashboard
 * - URL State Management
 * - Command Palette Integration
 */

import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Users,
  Trophy,
  Plus,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Crown,
  MapPin,
  Star,
  Bell,
  Gift,
  Loader2,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "../hooks/useSearchParams";
import { useBookings, useBookingMutations } from "../hooks/useBookings";
import { useInvitations, useInvitationMutations } from "../hooks/useInvitations";
import { useTransactions } from "../hooks/useTransactions";
import { useStats } from "../hooks/useStats";

// Enhanced Components
import { DashboardBuilder, type DashboardWidget } from "./common/DashboardBuilder";
import { ProgressiveDisclosure } from "./common/ProgressiveDisclosure";
import { SmartEmptyState } from "./common/SmartEmptyState";
import { ClientActions, BookingActionMenu } from "./client/ClientActions";
import { ActionNotifications } from "./client/ActionNotifications";
import { ReferralProgram } from "./client/ReferralProgram";
import {
  BookingListSkeleton,
  InvitationCardSkeleton,
  TransactionListSkeleton,
  StatsCardSkeleton,
} from "./common/BookingSkeletons";

interface ClientDashboardEnhancedProps {
  onBack: () => void;
  onNavigateToTeams?: () => void;
  onNavigateToTransactions?: () => void;
  onNavigateToCourtDetails?: () => void;
  onNavigateToSubscription?: () => void;
}

// Data will be fetched via SWR hooks

export function ClientDashboardEnhanced({
  onBack,
  onNavigateToTeams,
  onNavigateToTransactions,
  onNavigateToCourtDetails,
  onNavigateToSubscription,
}: ClientDashboardEnhancedProps) {
  const { user } = useAuth();
  
  // URL State Management
  const [searchParams, setSearchParams] = useSearchParams({ tab: "dashboard" });
  const activeTab = searchParams.get("tab") || "dashboard";
  
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  // Data Fetching with SWR
  const { bookings, isLoading: loadingBookings, mutate: mutateBookings } = useBookings({
    type: 'organized',
    status: ['confirmed', 'pending'],
  });

  const { invitations, isLoading: loadingInvitations, mutate: mutateInvitations } = useInvitations();

  const { transactions, isLoading: loadingTransactions, balance } = useTransactions({
    limit: 4,
  });

  const { stats, isLoading: loadingStats } = useStats();

  // Mutations
  const { cancelBooking } = useBookingMutations();
  const { acceptInvitation, declineInvitation } = useInvitationMutations();

  // Optimistic mutation handlers
  const handleCancelBooking = async (bookingId: number) => {
    try {
      toast.loading('Cancelando reserva...', { id: `cancel-${bookingId}` });
      await cancelBooking(bookingId);
      mutateBookings(); // Revalidate data
      toast.success('Reserva cancelada com sucesso!', { id: `cancel-${bookingId}` });
    } catch (error) {
      toast.error('Erro ao cancelar reserva', { id: `cancel-${bookingId}` });
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      toast.loading('Aceitando convite...', { id: `accept-${invitationId}` });
      await acceptInvitation(invitationId);
      mutateInvitations(); // Revalidate data
      toast.success('Convite aceito!', { id: `accept-${invitationId}` });
    } catch (error) {
      toast.error('Erro ao aceitar convite', { id: `accept-${invitationId}` });
    }
  };

  const handleDeclineInvitation = async (invitationId: number) => {
    try {
      toast.loading('Recusando convite...', { id: `decline-${invitationId}` });
      await declineInvitation(invitationId);
      mutateInvitations(); // Revalidate data
      toast.info('Convite recusado', { id: `decline-${invitationId}` });
    } catch (error) {
      toast.error('Erro ao recusar convite', { id: `decline-${invitationId}` });
    }
  };

  // Dashboard Widgets Configuration
  const dashboardWidgets: DashboardWidget[] = useMemo(
    () => [
      // High Priority - Always visible, cannot collapse
      {
        id: "quick-actions",
        title: "Ações Rápidas",
        icon: TrendingUp,
        priority: "high",
        collapsible: false,
        content: (
          <ClientActions
            onNavigateToBooking={onBack}
            onNavigateToTeams={onNavigateToTeams}
            onNavigateToTransactions={onNavigateToTransactions}
            onNavigateToSchedule={() => handleTabChange("jogos")}
            onNavigateToReferral={() => handleTabChange("indicacao")}
          />
        ),
      },

      // High Priority - Upcoming Games
      {
        id: "upcoming-games",
        title: "Próximos Jogos",
        icon: CalendarDays,
        priority: "high",
        collapsible: true,
        defaultCollapsed: false,
        badge: loadingBookings ? undefined : bookings.length,
        content: loadingBookings ? (
          <BookingListSkeleton count={3} />
        ) : (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <SmartEmptyState
                type="no-bookings"
                primaryAction={{
                  label: "Fazer Reserva",
                  onClick: onBack,
                  icon: Plus,
                }}
              />
            ) : (
              bookings.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{game.court}</div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {game.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {game.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {game.players}/{game.totalPlayers}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Badge
                      variant={game.payment === "paid" ? "default" : "secondary"}
                      className={game.payment === "paid" ? "bg-primary" : ""}
                    >
                      {game.payment === "paid" ? "Pago" : "Pendente"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onNavigateToCourtDetails}
                    >
                      Ver
                    </Button>
                    <BookingActionMenu
                      bookingId={game.id}
                      status={game.status}
                      onAction={(type, id) => {
                        if (type === 'cancel') {
                          handleCancelBooking(id);
                        } else {
                          toast.info(`Ação ${type} para reserva #${id}`);
                        }
                      }}
                    />
                  </div>
                </div>
              ))
            )}
            {bookings.length > 0 && (
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => handleTabChange("jogos")}
              >
                Ver Todos os Jogos
              </Button>
            )}
          </div>
        ),
      },

      // Medium Priority - Invitations
      {
        id: "invitations",
        title: "Convites Pendentes",
        icon: Bell,
        priority: "medium",
        collapsible: true,
        defaultCollapsed: !loadingInvitations && invitations.length === 0,
        badge: loadingInvitations ? undefined : invitations.length > 0 ? invitations.length : undefined,
        content: loadingInvitations ? (
          <div className="space-y-3">
            <InvitationCardSkeleton />
            <InvitationCardSkeleton />
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.length === 0 ? (
              <SmartEmptyState type="no-invitations" />
            ) : (
              invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{invite.organizer}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {invite.court} • {invite.date} às {invite.time}
                    </div>
                    <div className="text-sm font-medium text-primary mt-1">
                      R$ {invite.value.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invite.id)}
                    >
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineInvitation(invite.id)}
                    >
                      Recusar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ),
      },

      // Medium Priority - Stats with Progressive Disclosure
      {
        id: "statistics",
        title: "Estatísticas",
        icon: Trophy,
        priority: "medium",
        collapsible: true,
        defaultCollapsed: true,
        content: loadingStats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats?.gamesOrganized || 0}</div>
                <div className="text-xs text-muted-foreground">Organizados</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-accent">{stats?.gamesParticipated || 0}</div>
                <div className="text-xs text-muted-foreground">Participados</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">R$ {((stats?.totalInvested || 0) / 1000).toFixed(1)}k</div>
                <div className="text-xs text-muted-foreground">Investido</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-success">R$ {stats?.credits || 0}</div>
                <div className="text-xs text-muted-foreground">Créditos</div>
              </div>
            </div>

            {/* Progressive Disclosure for Details */}
            <ProgressiveDisclosure
              title="Desempenho Detalhado"
              summary="Veja sua evolução nos últimos 3 meses"
              icon={Star}
              variant="compact"
              details={
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de comparecimento</span>
                    <span className="font-medium">{stats?.attendanceRate || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jogos por mês</span>
                    <span className="font-medium">{stats?.gamesPerMonth || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Economia com plano</span>
                    <span className="font-medium text-success">R$ {stats?.savings || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bônus de indicação</span>
                    <span className="font-medium text-primary">R$ {stats?.referralBonus || 0}</span>
                  </div>
                </div>
              }
            />
          </div>
        ),
      },

      // Low Priority - Transactions
      {
        id: "transactions",
        title: "Transações Recentes",
        icon: DollarSign,
        priority: "low",
        collapsible: true,
        defaultCollapsed: true,
        content: loadingTransactions ? (
          <TransactionListSkeleton count={4} />
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    transaction.type === "credit" ? "text-success" : "text-foreground"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"}R${" "}
                  {transaction.value.toFixed(2)}
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={onNavigateToTransactions}
            >
              Ver Extrato Completo
            </Button>
          </div>
        ),
      },

      // Low Priority - Subscription
      {
        id: "subscription",
        title: "Meu Plano",
        icon: Crown,
        priority: "low",
        collapsible: true,
        defaultCollapsed: false,
        badge: "Ativo",
        content: onNavigateToSubscription ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Plano Prata</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  5.5h usadas de 8h • Renova em 17 dias
                </p>
                <div className="flex gap-2 items-center text-xs text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span>Economizando 15% em cada reserva</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={onNavigateToSubscription}>
                Gerenciar Plano
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={onNavigateToSubscription}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Você ainda não tem um plano ativo
            </p>
            <Button>Ver Planos Disponíveis</Button>
          </div>
        ),
      },
    ],
    [
      onBack,
      onNavigateToTeams,
      onNavigateToTransactions,
      onNavigateToCourtDetails,
      onNavigateToSubscription,
      bookings,
      loadingBookings,
      invitations,
      loadingInvitations,
      transactions,
      loadingTransactions,
      stats,
      loadingStats,
      handleAcceptInvitation,
      handleDeclineInvitation,
      handleCancelBooking,
    ]
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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

          {/* Dashboard Tab with Customizable Widgets */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Action Notifications */}
            <ActionNotifications
              notifications={[
                {
                  id: "welcome-tip",
                  type: "tip",
                  title: "💡 Dashboard Personalizado!",
                  message:
                    "Arraste os widgets para reorganizar, clique em 'Personalizar' para mostrar/ocultar seções, e use ⌘K para acesso rápido!",
                  dismissible: true,
                },
                {
                  id: "referral-promo",
                  type: "promo",
                  title: "🎁 Ganhe R$ 20",
                  message:
                    "Indique um amigo e ganhe R$ 20 de bônus quando ele fizer a primeira reserva!",
                  action: {
                    label: "Indicar Agora",
                    onClick: () => handleTabChange("indicacao"),
                  },
                  dismissible: true,
                },
              ]}
            />

            {/* Customizable Dashboard */}
            <DashboardBuilder
              widgets={dashboardWidgets}
              storageKey="client-dashboard-layout"
              onWidgetToggle={(widgetId, visible) => {
                console.log(`Widget ${widgetId} ${visible ? "shown" : "hidden"}`);
              }}
              onLayoutChange={(layout) => {
                console.log("Layout changed:", layout);
              }}
            />
          </TabsContent>

          {/* Meus Jogos Tab */}
          <TabsContent value="jogos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Meus Jogos</h2>
                <p className="text-muted-foreground">Jogos que você organizou</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90" onClick={onBack}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </div>

            {loadingBookings ? (
              <BookingListSkeleton count={5} />
            ) : bookings.length === 0 ? (
              <SmartEmptyState
                type="no-bookings"
                primaryAction={{
                  label: "Fazer Primeira Reserva",
                  onClick: onBack,
                  icon: Plus,
                }}
              />
            ) : (
              <div className="space-y-3">
                {bookings.map((game) => (
                  <Card key={game.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{game.court}</h3>
                            <Badge
                              variant={game.payment === "paid" ? "default" : "secondary"}
                              className={game.payment === "paid" ? "bg-primary" : ""}
                            >
                              {game.payment === "paid" ? "Pago" : "Pendente"}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                              {game.players}/{game.totalPlayers} jogadores
                            </div>
                            {game.price && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                R$ {game.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <Button
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
                              if (type === 'cancel') {
                                handleCancelBooking(id);
                              } else {
                                toast.info(`Ação ${type} para reserva #${id}`);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Participo Tab */}
          <TabsContent value="participo" className="space-y-6">
            <div>
              <h2>Jogos que Participo</h2>
              <p className="text-muted-foreground">Convites aceitos e confirmados</p>
            </div>

            {loadingBookings ? (
              <BookingListSkeleton count={4} />
            ) : (
              <div className="space-y-3">
                {/* Mock data for participating games */}
                {[
                  {
                    id: 10,
                    organizer: "Carlos Silva",
                    court: "Quadra 1 - Society",
                    date: "16/10/2025",
                    time: "19:00",
                    value: 15,
                    status: "confirmed",
                  },
                  {
                    id: 11,
                    organizer: "Ana Paula",
                    court: "Quadra 3 - Beach Tennis",
                    date: "19/10/2025",
                    time: "18:00",
                    value: 20,
                    status: "confirmed",
                  },
                ].map((game) => (
                  <Card key={game.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{game.court}</h3>
                            <Badge variant="outline">Convidado</Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Organizado por {game.organizer}
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {game.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {game.time}
                            </div>
                          </div>

                          <div className="text-sm font-medium text-primary">
                            Sua parte: R$ {game.value.toFixed(2)}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onNavigateToCourtDetails}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Convidados Tab */}
          <TabsContent value="convidados" className="space-y-6">
            <div>
              <h2>Meus Convidados</h2>
              <p className="text-muted-foreground">Gerenciar lista de convidados frequentes</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { id: 1, name: "João Santos", phone: "(11) 98765-4321", tags: ["Fixo"], gamesPlayed: 12 },
                    { id: 2, name: "Maria Oliveira", phone: "(11) 91234-5678", tags: ["Gratuito"], gamesPlayed: 8 },
                    { id: 3, name: "Pedro Costa", phone: "(11) 99876-5432", tags: [], gamesPlayed: 5 },
                    { id: 4, name: "Ana Silva", phone: "(11) 94567-8901", tags: ["Fixo"], gamesPlayed: 15 },
                  ].map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {guest.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{guest.name}</h4>
                            {guest.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span>{guest.phone}</span>
                            <span>•</span>
                            <span>{guest.gamesPlayed} jogos</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost">
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Convidado
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saldo Tab */}
          <TabsContent value="saldo" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Saldo e Transações</h2>
                <p className="text-muted-foreground">Histórico financeiro e créditos</p>
              </div>
              <Button variant="outline" onClick={onNavigateToTransactions}>
                Ver Extrato Completo
              </Button>
            </div>

            {/* Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingTransactions ? (
                    <div className="space-y-2">
                      <StatsCardSkeleton />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-success">
                        R$ {balance.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Disponível para usar
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <StatsCardSkeleton />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        R$ {stats?.totalInvested.toFixed(2) || "0.00"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Últimos 3 meses
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Economia com Plano</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <StatsCardSkeleton />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-primary">
                        R$ {stats?.savings.toFixed(2) || "0.00"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Economizado no total
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas movimentações da sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTransactions ? (
                  <TransactionListSkeleton count={6} />
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "credit"
                                ? "bg-success/10"
                                : "bg-muted"
                            }`}
                          >
                            {transaction.type === "credit" ? (
                              <TrendingUp className="h-4 w-4 text-success" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.date}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${
                            transaction.type === "credit"
                              ? "text-success"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}R${" "}
                          {transaction.value.toFixed(2)}
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={onNavigateToTransactions}
                    >
                      Ver Histórico Completo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Indicação Tab */}
          <TabsContent value="indicacao">
            <ReferralProgram />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
