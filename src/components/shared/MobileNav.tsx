/**
 * Mobile Navigation Component
 * Sheet-based navigation for mobile devices
 */

import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Menu,
  Home,
  Calendar,
  Users,
  CreditCard,
  User,
  Settings,
  LogOut,
  Trophy,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Gift,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { toast } from "sonner@2.0.3";

interface MobileNavProps {
  onNavigate?: (page: string) => void;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  page: string;
  badge?: number;
  variant?: "default" | "danger";
}

export function MobileNav({ onNavigate }: MobileNavProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleNavigation = (page: string) => {
    setOpen(false);
    onNavigate?.(page);
  };

  const handleLogout = () => {
    setOpen(false);
    toast.success("Saindo...", { duration: 1000 });
    logout();
  };

  // Client navigation items
  const clientNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", page: "client-dashboard" },
    { icon: Calendar, label: "Nova Reserva", page: "booking" },
    { icon: Users, label: "Minhas Turmas", page: "teams" },
    { icon: CreditCard, label: "Saldo e Transações", page: "transactions" },
    { icon: Gift, label: "Programa de Indicação", page: "client-dashboard" },
  ];

  // Manager navigation items
  const managerNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", page: "manager-dashboard" },
    { icon: Calendar, label: "Agenda", page: "manager-dashboard" },
    { icon: MapPin, label: "Quadras", page: "manager-dashboard" },
    { icon: Users, label: "Clientes", page: "manager-dashboard" },
    { icon: BarChart3, label: "Relatórios", page: "manager-dashboard" },
    { icon: Settings, label: "Configurações", page: "manager-dashboard" },
  ];

  // Common items
  const commonItems: NavItem[] = [
    { icon: User, label: "Meu Perfil", page: "user-profile" },
    { icon: Settings, label: "Configurações", page: "settings" },
  ];

  // Help items
  const helpItems: NavItem[] = [
    { icon: HelpCircle, label: "FAQ", page: "faq" },
    { icon: FileText, label: "Termos de Uso", page: "terms" },
  ];

  const navItems = user.role === "client" ? clientNavItems : managerNavItems;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 text-left">
              <SheetTitle className="text-base">{user.name}</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {user.role === "client" ? "Cliente" : "Gestor"}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Main Navigation */}
        <nav className="flex flex-col py-4">
          <div className="px-6 pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navegação
            </h3>
          </div>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <Separator />

        {/* Profile & Settings */}
        <nav className="flex flex-col py-4">
          <div className="px-6 pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Perfil
            </h3>
          </div>
          {commonItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>

        <Separator />

        {/* Help */}
        <nav className="flex flex-col py-4">
          <div className="px-6 pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ajuda
            </h3>
          </div>
          {helpItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>

        <Separator />

        {/* Logout */}
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Brand */}
        <div className="p-6 border-t bg-muted/30 mt-auto">
          <div className="flex items-center gap-2 justify-center text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">Arena Dona Santa</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
