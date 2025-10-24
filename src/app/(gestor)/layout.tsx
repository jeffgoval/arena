"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Calendar, Users, BarChart3, Settings, LogOut, Menu, X, ClipboardList, Ban, Bell, Star, GraduationCap, DollarSign, Mail, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GestorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => pathname === path;
    const isActiveStartsWith = (path: string) => pathname?.startsWith(path);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            router.push("/auth");
        }
    };

    const navItems = [
        { href: "/gestor", icon: LayoutDashboard, label: "Dashboard", active: isActive("/gestor") },
        { href: "/gestor/quadras", icon: Building2, label: "Quadras", active: isActiveStartsWith("/gestor/quadras") },
        { href: "/gestor/agenda", icon: Calendar, label: "Agenda", active: isActive("/gestor/agenda") },
        { href: "/gestor/reservas", icon: ClipboardList, label: "Reservas", active: isActive("/gestor/reservas") },
        { href: "/gestor/convites", icon: Mail, label: "Convites", active: isActiveStartsWith("/gestor/convites") },
        { href: "/gestor/bloqueios", icon: Ban, label: "Bloqueios", active: isActive("/gestor/bloqueios") },
        { href: "/gestor/clientes", icon: Users, label: "Clientes", active: isActive("/gestor/clientes") },
        { href: "/gestor/turmas", icon: GraduationCap, label: "Turmas", active: isActive("/gestor/turmas") },
        { href: "/gestor/jogos", icon: Trophy, label: "Jogos", active: isActiveStartsWith("/gestor/jogos") },
        { href: "/gestor/financeiro", icon: DollarSign, label: "Financeiro", active: isActive("/gestor/financeiro") },
        { href: "/gestor/avaliacoes", icon: Star, label: "Avaliações", active: isActive("/gestor/avaliacoes") },
        { href: "/gestor/notificacoes", icon: Bell, label: "Notificações", active: isActive("/gestor/notificacoes") },
        { href: "/gestor/relatorios", icon: BarChart3, label: "Relatórios", active: isActive("/gestor/relatorios") },
        { href: "/gestor/configuracoes", icon: Settings, label: "Configurações", active: isActive("/gestor/configuracoes") },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col shadow-soft
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Header */}
                <div className="p-6 bg-gradient-to-br from-primary to-success">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center shadow-medium">
                                <span className="text-primary font-bold text-xl">A</span>
                            </div>
                            <div>
                                <h1 className="heading-4 text-primary-foreground">Arena Dona Santa</h1>
                                <p className="text-xs text-primary-foreground/90 font-medium">Painel do Gestor</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={true}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${item.active
                                        ? 'bg-primary text-primary-foreground shadow-soft'
                                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        variant="outline"
                        className="w-full justify-start gap-3 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">{isLoggingOut ? "Saindo..." : "Sair"}</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h1 className="heading-4 gradient-text">Painel do Gestor</h1>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Page Content */}
                <main className="flex-1 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}