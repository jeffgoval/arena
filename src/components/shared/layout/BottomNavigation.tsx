"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Trophy,
    CreditCard,
    Gift,
    Home,
    User,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConvitesPendentes } from "@/hooks/useConvitesPendentes";

interface NavItem {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: number;
}

interface BottomNavigationProps {
    variant?: 'dashboard' | 'public';
    className?: string;
}

export function BottomNavigation({ variant = 'dashboard', className }: BottomNavigationProps) {
    const pathname = usePathname();
    const { count: convitesPendentes } = useConvitesPendentes();

    const dashboardItems: NavItem[] = [
        { href: "/cliente", icon: LayoutDashboard, label: "Dashboard", badge: 0 },
        { href: "/cliente/reservas", icon: Calendar, label: "Reservas", badge: 0 },
        { href: "/cliente/turmas", icon: Users, label: "Turmas", badge: 0 },
        { href: "/cliente/convites", icon: Mail, label: "Convites", badge: convitesPendentes },
        { href: "/cliente/creditos", icon: CreditCard, label: "Créditos", badge: 0 },
    ];

    const publicItems: NavItem[] = [
        { href: "/", icon: Home, label: "Início" },
        { href: "/sobre", icon: Users, label: "Sobre" },
        { href: "/contato", icon: User, label: "Contato" },
    ];

    const items = variant === 'dashboard' ? dashboardItems : publicItems;

    const isActive = (path: string) => {
        if (path === "/cliente") {
            return pathname === path;
        }
        return pathname?.startsWith(path);
    };

    return (
        <nav className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border",
            "md:hidden", // Ocultar em desktop
            className
        )}>
            <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
                {items.map((item) => {
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-all duration-200",
                                "relative group",
                                active
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {/* Indicador ativo */}
                            {active && (
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                            )}

                            {/* Ícone */}
                            <div className={cn(
                                "relative p-1.5 rounded-lg transition-all duration-200",
                                active
                                    ? "bg-primary/10 scale-110"
                                    : "group-hover:bg-accent/50 group-hover:scale-105"
                            )}>
                                <item.icon className="w-5 h-5" />

                                {/* Badge de notificação */}
                                {item.badge && item.badge > 0 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span className={cn(
                                "text-xs font-medium mt-1 truncate max-w-full",
                                "transition-all duration-200",
                                active ? "text-primary font-semibold" : "text-muted-foreground"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// Hook para usar com padding bottom quando bottom nav está ativa
export function useBottomNavigation() {
    return {
        paddingClass: "pb-20 md:pb-0", // 80px de padding bottom no mobile
        isVisible: true, // Pode ser usado para controlar visibilidade
    };
}