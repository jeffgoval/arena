import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Trophy, Bell, Sun, Moon, Monitor, User, LogOut, Settings, Users, CreditCard, Calendar, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNotifications } from "../contexts/NotificationContext";
import { NotificationCenter } from "./NotificationCenter";
import { MobileNav } from "./shared/MobileNav";
import { toast } from "sonner@2.0.3";

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    // Feedback IMEDIATO
    toast.success("Saindo...", { duration: 1000 });
    
    // Logout imediato
    logout();
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Navigation - Only on Mobile */}
            <div className="md:hidden flex-shrink-0">
              <MobileNav onNavigate={onNavigate} />
            </div>

            {/* Logo - Clickable */}
            <button 
              onClick={() => onNavigate?.("landing")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0 flex-shrink"
              aria-label="Ir para página inicial"
            >
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              {/* Full name on desktop, hidden on small mobile */}
              <span className="hidden sm:inline text-lg sm:text-xl font-semibold truncate">
                Arena Dona Santa
              </span>
              {/* Short name on mobile */}
              <span className="sm:hidden text-base font-semibold truncate">
                Arena DS
              </span>
            </button>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Theme Toggle - Hidden on small mobile, visible on tablet+ */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                    {theme === "light" && <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {theme === "dark" && <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {theme === "auto" && <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> Claro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> Escuro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("auto")}>
                    <Monitor className="mr-2 h-4 w-4" /> Sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications - Always visible */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setShowNotifications(true)}
              aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu - Desktop Only */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "client" && (
                    <>
                      <DropdownMenuItem onClick={() => onNavigate?.("client-dashboard")}>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNavigate?.("booking")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Nova Reserva
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNavigate?.("teams")}>
                        <Users className="mr-2 h-4 w-4" />
                        Minhas Turmas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNavigate?.("transactions")}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Saldo e Transações
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {user.role === "manager" && (
                    <>
                      <DropdownMenuItem onClick={() => onNavigate?.("manager-dashboard")}>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard Gestor
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => onNavigate?.("user-profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
