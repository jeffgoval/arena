import { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "../types";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "invite",
    title: "Novo convite",
    message: "Carlos Silva te convidou para jogar quinta-feira às 19h",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    actionUrl: "invite-view",
    actionLabel: "Ver convite",
  },
  {
    id: "notif_2",
    type: "confirmation",
    title: "Reserva confirmada",
    message: "Sua reserva para 20/10 às 19h foi confirmada",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionUrl: "client-dashboard",
    actionLabel: "Ver detalhes",
  },
  {
    id: "notif_3",
    type: "reminder",
    title: "Lembrete de jogo",
    message: "Seu jogo é amanhã às 19h na Quadra 1",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "notif_4",
    type: "payment",
    title: "Pagamento confirmado",
    message: "Recebemos seu pagamento de R$ 120,00",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    actionLabel: "Ver comprovante",
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
