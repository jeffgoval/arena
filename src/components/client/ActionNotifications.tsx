/**
 * Action Notifications Component
 * Contextual notifications and tips for client actions
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X, Lightbulb, Info, AlertCircle, CheckCircle2, Gift, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type NotificationType = "tip" | "info" | "success" | "warning" | "promo";

interface ActionNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  autoHide?: boolean;
  duration?: number;
}

interface ActionNotificationsProps {
  notifications?: ActionNotification[];
  onDismiss?: (id: string) => void;
}

const NOTIFICATION_ICONS = {
  tip: { icon: Lightbulb, color: "text-info" },
  info: { icon: Info, color: "text-primary" },
  success: { icon: CheckCircle2, color: "text-success" },
  warning: { icon: AlertCircle, color: "text-warning" },
  promo: { icon: Gift, color: "text-accent" },
};

const DEFAULT_NOTIFICATIONS: ActionNotification[] = [
  {
    id: "welcome-tip",
    type: "tip",
    title: "💡 Dica Rápida",
    message: "Use as Ações Rápidas para acessar funcionalidades frequentes com apenas um clique!",
    dismissible: true,
  },
  {
    id: "referral-promo",
    type: "promo",
    title: "🎁 Ganhe R$ 20",
    message: "Indique um amigo e ganhe R$ 20 de bônus quando ele fizer a primeira reserva!",
    action: {
      label: "Indicar Agora",
      onClick: () => {},
    },
    dismissible: true,
  },
  {
    id: "first-booking",
    type: "info",
    title: "📱 Primeira Reserva",
    message: "Clique em 'Nova Reserva' para agendar sua primeira quadra. É rápido e fácil!",
    dismissible: true,
  },
];

export function ActionNotifications({ 
  notifications = DEFAULT_NOTIFICATIONS,
  onDismiss 
}: ActionNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<ActionNotification[]>(notifications);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    visibleNotifications.forEach((notification) => {
      if (notification.autoHide) {
        const timer = setTimeout(() => {
          handleDismiss(notification.id);
        }, notification.duration || 5000);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [visibleNotifications]);

  const handleDismiss = (id: string) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
    onDismiss?.(id);
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const { icon: Icon, color } = NOTIFICATION_ICONS[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      {notification.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={notification.action.onClick}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                    {notification.dismissible && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 -mt-1"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Inline Action Tip Component
 * Small contextual tips that appear inline with content
 */
interface ActionTipProps {
  icon?: typeof Lightbulb;
  message: string;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export function ActionTip({ 
  icon: Icon = Lightbulb, 
  message, 
  variant = "default",
  className = "" 
}: ActionTipProps) {
  const variantStyles = {
    default: "bg-muted/30 text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg ${variantStyles[variant]} ${className}`}>
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <p className="text-xs leading-relaxed">{message}</p>
    </div>
  );
}

/**
 * Action Shortcuts Component
 * Display keyboard shortcuts for quick actions
 */
interface ActionShortcut {
  key: string;
  description: string;
}

interface ActionShortcutsProps {
  shortcuts: ActionShortcut[];
  title?: string;
}

export function ActionShortcuts({ shortcuts, title = "Atalhos de Teclado" }: ActionShortcutsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium text-sm mb-3">{title}</h4>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Quick Stats Banner
 * Shows important stats and achievements
 */
interface QuickStatsBannerProps {
  stats: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
  }[];
}

export function QuickStatsBanner({ stats }: QuickStatsBannerProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
              {stat.trend && stat.trendValue && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp 
                    className={`h-3 w-3 ${
                      stat.trend === "up" 
                        ? "text-success" 
                        : stat.trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`} 
                  />
                  <span className="text-xs text-muted-foreground">{stat.trendValue}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
