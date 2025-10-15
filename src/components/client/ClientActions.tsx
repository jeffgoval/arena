/**
 * Client Actions Component
 * Quick actions, contextual menus and activity tracking for clients
 */

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { copyToClipboard } from "../../lib/clipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import {
  Calendar,
  Users,
  CreditCard,
  Share2,
  Settings,
  Download,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Copy,
  Send,
  UserPlus,
  CalendarPlus,
  Wallet,
  FileText,
  Activity,
  TrendingUp,
  Gift,
  Bell
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

export type QuickActionType = 
  | "new_booking" 
  | "invite_friends" 
  | "add_credit" 
  | "view_schedule" 
  | "manage_team"
  | "view_transactions"
  | "share_referral"
  | "contact_support";

interface QuickAction {
  id: QuickActionType;
  label: string;
  description: string;
  icon: typeof Calendar;
  color: string;
  badge?: string | number;
  enabled: boolean;
  onClick: () => void;
}

interface BookingAction {
  id: number;
  type: "cancel" | "reschedule" | "invite" | "share" | "receipt" | "rate";
  label: string;
  icon: typeof XCircle;
  variant?: "default" | "destructive";
  requiresConfirmation?: boolean;
}

interface Activity {
  id: number;
  type: "booking" | "payment" | "cancellation" | "invitation" | "referral" | "review";
  title: string;
  description: string;
  timestamp: string;
  icon: typeof CheckCircle2;
  color: string;
}

interface ClientActionsProps {
  onNavigateToBooking?: () => void;
  onNavigateToTeams?: () => void;
  onNavigateToTransactions?: () => void;
  onNavigateToSchedule?: () => void;
  onNavigateToReferral?: () => void;
}

export function ClientActions({
  onNavigateToBooking,
  onNavigateToTeams,
  onNavigateToTransactions,
  onNavigateToSchedule,
  onNavigateToReferral,
}: ClientActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; bookingId?: number } | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Quick Actions Configuration
  const quickActions: QuickAction[] = [
    {
      id: "new_booking",
      label: "Nova Reserva",
      description: "Agendar uma nova quadra",
      icon: CalendarPlus,
      color: "text-primary",
      enabled: true,
      onClick: () => {
        onNavigateToBooking?.();
        toast.success("Iniciando nova reserva...");
      },
    },
    {
      id: "invite_friends",
      label: "Convidar Amigos",
      description: "Convidar para jogar",
      icon: UserPlus,
      color: "text-info",
      badge: 2,
      enabled: true,
      onClick: () => {
        toast.info("Abrir lista de convites");
      },
    },
    {
      id: "add_credit",
      label: "Adicionar Créditos",
      description: "Recarregar saldo",
      icon: Wallet,
      color: "text-success",
      enabled: true,
      onClick: () => {
        onNavigateToTransactions?.();
        toast.success("Acessar área de pagamentos");
      },
    },
    {
      id: "view_schedule",
      label: "Minha Agenda",
      description: "Ver jogos agendados",
      icon: Calendar,
      color: "text-accent",
      badge: 3,
      enabled: true,
      onClick: () => {
        onNavigateToSchedule?.();
      },
    },
    {
      id: "manage_team",
      label: "Meu Time",
      description: "Gerenciar turma",
      icon: Users,
      color: "text-secondary",
      enabled: true,
      onClick: () => {
        onNavigateToTeams?.();
      },
    },
    {
      id: "view_transactions",
      label: "Extrato",
      description: "Histórico financeiro",
      icon: FileText,
      color: "text-muted-foreground",
      enabled: true,
      onClick: () => {
        onNavigateToTransactions?.();
      },
    },
    {
      id: "share_referral",
      label: "Indicar Amigo",
      description: "Ganhe bônus",
      icon: Gift,
      color: "text-warning",
      badge: "R$ 20",
      enabled: true,
      onClick: () => {
        onNavigateToReferral?.();
        toast.success("Programa de indicações");
      },
    },
    {
      id: "contact_support",
      label: "Suporte",
      description: "Fale conosco",
      icon: MessageSquare,
      color: "text-muted-foreground",
      enabled: true,
      onClick: () => {
        toast.info("Abrindo WhatsApp...");
        window.open("https://wa.me/5511987654321", "_blank");
      },
    },
  ];

  // Booking Actions
  const getBookingActions = (bookingId: number, status: string): BookingAction[] => {
    const actions: BookingAction[] = [];

    if (status === "confirmed" || status === "pending") {
      actions.push({
        id: bookingId,
        type: "cancel",
        label: "Cancelar Reserva",
        icon: XCircle,
        variant: "destructive",
        requiresConfirmation: true,
      });

      actions.push({
        id: bookingId,
        type: "reschedule",
        label: "Reagendar",
        icon: Calendar,
        requiresConfirmation: false,
      });
    }

    actions.push({
      id: bookingId,
      type: "invite",
      label: "Convidar Amigos",
      icon: UserPlus,
      requiresConfirmation: false,
    });

    actions.push({
      id: bookingId,
      type: "share",
      label: "Compartilhar",
      icon: Share2,
      requiresConfirmation: false,
    });

    actions.push({
      id: bookingId,
      type: "receipt",
      label: "Ver Comprovante",
      icon: FileText,
      requiresConfirmation: false,
    });

    if (status === "completed") {
      actions.push({
        id: bookingId,
        type: "rate",
        label: "Avaliar",
        icon: Star,
        requiresConfirmation: false,
      });
    }

    return actions;
  };

  // Recent Activities
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: "booking",
      title: "Nova Reserva Confirmada",
      description: "Quadra 1 - Society • 15/10/2025 às 19:00",
      timestamp: "Há 2 horas",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      id: 2,
      type: "payment",
      title: "Pagamento Realizado",
      description: "R$ 120,00 • Crédito adicionado",
      timestamp: "Há 2 horas",
      icon: CreditCard,
      color: "text-info",
    },
    {
      id: 3,
      type: "invitation",
      title: "Convite Enviado",
      description: "João Santos • Jogo dia 18/10",
      timestamp: "Há 5 horas",
      icon: Send,
      color: "text-accent",
    },
    {
      id: 4,
      type: "referral",
      title: "Indicação Bem-sucedida",
      description: "Maria Silva se cadastrou • +R$ 20,00",
      timestamp: "Ontem",
      icon: Gift,
      color: "text-warning",
    },
    {
      id: 5,
      type: "review",
      title: "Avaliação Enviada",
      description: "5 estrelas para Quadra 2",
      timestamp: "2 dias atrás",
      icon: Star,
      color: "text-warning",
    },
    {
      id: 6,
      type: "cancellation",
      title: "Reserva Cancelada",
      description: "Quadra 3 • Reembolso de R$ 80,00",
      timestamp: "3 dias atrás",
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  const handleBookingAction = (action: BookingAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction({ type: action.type, bookingId: action.id });
      setShowConfirmDialog(true);
    } else {
      executeBookingAction(action.type, action.id);
    }
  };

  const executeBookingAction = async (type: string, bookingId: number) => {
    switch (type) {
      case "cancel":
        toast.success("Reserva cancelada com sucesso!");
        break;
      case "reschedule":
        toast.info("Abrindo opções de reagendamento...");
        break;
      case "invite":
        toast.info("Abrir lista de contatos para convite");
        break;
      case "share":
        const shareText = `Vou jogar na Arena Dona Santa! 🎾⚽`;
        
        // Check if Web Share API is available and supported
        if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
          try {
            await navigator.share({ text: shareText });
            toast.success("Compartilhado com sucesso!");
          } catch (error: any) {
            // User cancelled or error occurred
            if (error.name !== 'AbortError') {
              // Fallback to clipboard
              const success = await copyToClipboard(shareText);
              if (success) {
                toast.success("Link copiado!");
              } else {
                toast.error("Não foi possível compartilhar.");
              }
            }
          }
        } else {
          // Fallback to clipboard
          const success = await copyToClipboard(shareText);
          if (success) {
            toast.success("Link copiado!");
          } else {
            toast.error("Não foi possível copiar.");
          }
        }
        break;
      case "receipt":
        toast.success("Baixando comprovante...");
        break;
      case "rate":
        toast.info("Abrir formulário de avaliação");
        break;
    }
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      executeBookingAction(confirmAction.type, confirmAction.bookingId || 0);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const getActivityIcon = (activity: Activity) => {
    const IconComponent = activity.icon;
    return <IconComponent className={`h-4 w-4 ${activity.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às funcionalidades mais usadas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TooltipProvider key={action.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          disabled={!action.enabled}
                          onClick={action.onClick}
                          className="h-auto w-full flex-col items-center justify-center gap-2 relative px-[14px] py-[16px]"
                        >
                          {action.badge && (
                            <Badge className="absolute -top-2 -right-2 h-5 px-1.5">
                              {action.badge}
                            </Badge>
                          )}
                          <IconComponent className={`h-6 w-6 ${action.color}`} />
                          <span className="text-xs text-center leading-tight">
                            {action.label}
                          </span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Suas últimas ações no sistema
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActivityLog(true)}
            >
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5">{getActivityIcon(activity)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
                {index < recentActivities.length - 1 && <Separator className="mt-3" />}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Action Menu Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MoreVertical className="h-5 w-5 text-primary" />
            Ações Contextuais
          </CardTitle>
          <CardDescription>
            Menu de ações disponíveis para cada reserva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Quadra 1 - Society</p>
                <p className="text-sm text-muted-foreground">15/10/2025 às 19:00</p>
                <Badge className="mt-1 bg-success">Confirmada</Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ações da Reserva</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getBookingActions(1, "confirmed").map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <DropdownMenuItem
                      key={action.type}
                      onClick={() => handleBookingAction(action)}
                      className={action.variant === "destructive" ? "text-destructive" : ""}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {action.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Dica:</strong> Clique nos três pontos de qualquer reserva para acessar
              ações rápidas como cancelar, reagendar, convidar amigos e muito mais!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ação</DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "cancel" && (
                <>
                  Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                  <br />
                  <br />
                  Se cancelar com mais de 24h de antecedência, o valor será reembolsado
                  integralmente ao seu saldo.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Voltar
            </Button>
            <Button
              variant={confirmAction?.type === "cancel" ? "destructive" : "default"}
              onClick={confirmActionHandler}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Log Dialog */}
      <Dialog open={showActivityLog} onOpenChange={setShowActivityLog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Histórico Completo de Atividades
            </DialogTitle>
            <DialogDescription>
              Todas as suas ações e eventos no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <div className="mt-0.5">{getActivityIcon(activity)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityLog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Booking Action Menu Component
 * Reusable dropdown menu for booking actions
 */
interface BookingActionMenuProps {
  bookingId: number;
  status: string;
  onAction?: (type: string, bookingId: number) => void;
}

export function BookingActionMenu({ bookingId, status, onAction }: BookingActionMenuProps) {
  const actions: BookingAction[] = [
    ...(status === "confirmed" || status === "pending"
      ? [
          {
            id: bookingId,
            type: "cancel" as const,
            label: "Cancelar",
            icon: XCircle,
            variant: "destructive" as const,
            requiresConfirmation: true,
          },
          {
            id: bookingId,
            type: "reschedule" as const,
            label: "Reagendar",
            icon: Calendar,
            requiresConfirmation: false,
          },
        ]
      : []),
    {
      id: bookingId,
      type: "invite" as const,
      label: "Convidar",
      icon: UserPlus,
      requiresConfirmation: false,
    },
    {
      id: bookingId,
      type: "share" as const,
      label: "Compartilhar",
      icon: Share2,
      requiresConfirmation: false,
    },
    {
      id: bookingId,
      type: "receipt" as const,
      label: "Comprovante",
      icon: FileText,
      requiresConfirmation: false,
    },
  ];

  const handleAction = (type: string) => {
    onAction?.(type, bookingId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <DropdownMenuItem
              key={action.type}
              onClick={() => handleAction(action.type)}
              className={action.variant === "destructive" ? "text-destructive" : ""}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
