import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Bell,
  Mail,
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle,
  Star,
  Users,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";
import { NotificationType } from "../types";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  invite: Mail,
  confirmation: CheckCircle,
  reminder: Clock,
  payment: CreditCard,
  message: MessageCircle,
  rating: Star,
  team: Users,
};

const notificationColors: Record<NotificationType, string> = {
  invite: "text-info",
  confirmation: "text-success",
  reminder: "text-warning",
  payment: "text-success",
  message: "text-primary",
  rating: "text-accent",
  team: "text-info",
};

export function NotificationCenter({ isOpen, onClose, onNavigate }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [filter, setFilter] = useState<"all" | NotificationType>("all");

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const handleAction = (actionUrl?: string) => {
    if (actionUrl && onNavigate) {
      onNavigate(actionUrl);
      onClose();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "agora";
    if (minutes < 60) return `há ${minutes} min`;
    if (hours < 24) return `há ${hours}h`;
    if (days < 7) return `há ${days} dias`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l shadow-2xl z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">Notificações</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} não {unreadCount === 1 ? "lida" : "lidas"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-1" />
                    Marcar todas
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Todas
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                {(["invite", "confirmation", "reminder", "payment"] as NotificationType[]).map(
                  (type) => {
                    const count = notifications.filter((n) => n.type === type && !n.read).length;
                    return (
                      <Button
                        key={type}
                        variant={filter === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(type)}
                      >
                        {type === "invite" && "Convites"}
                        {type === "confirmation" && "Confirmações"}
                        {type === "reminder" && "Lembretes"}
                        {type === "payment" && "Pagamentos"}
                        {count > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {count}
                          </Badge>
                        )}
                      </Button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-12 text-center"
                >
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma notificação</p>
                </motion.div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification, index) => {
                    const Icon = notificationIcons[notification.type];
                    const colorClass = notificationColors[notification.type];

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`flex-shrink-0 mt-1 ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium">
                                {notification.title}
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2" />
                                )}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.createdAt)}
                              </span>

                              {notification.actionUrl && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() => {
                                      if (!notification.read) {
                                        markAsRead(notification.id);
                                      }
                                      handleAction(notification.actionUrl);
                                    }}
                                  >
                                    {notification.actionLabel || "Ver"}
                                  </Button>
                                </>
                              )}

                              {!notification.read && !notification.actionUrl && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Marcar como lida
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
