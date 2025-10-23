"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Calendar, Trophy, CreditCard, Gift, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditosHeader } from "@/components/modules/indicacoes/CreditosHeader";
import { BottomNavigation } from "@/components/shared/layout/BottomNavigation";
import { ResponsiveLayout } from "@/components/shared/layout/ResponsiveLayout";

export default function DashboardLayout({
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
    { href: "/cliente", icon: LayoutDashboard, label: "Dashboard", active: isActive("/cliente") },
    { href: "/cliente/reservas", icon: Calendar, label: "Minhas Reservas", active: isActive("/cliente/reservas") },
    { href: "/cliente/turmas", icon: Users, label: "Minhas Turmas", active: isActive("/cliente/turmas") },
    { href: "/cliente/jogos", icon: Trophy, label: "Meus Jogos", active: isActive("/cliente/jogos") },
    { href: "/cliente/indicacoes", icon: Gift, label: "Indicações", active: isActive("/cliente/indicacoes") },
    { href: "/cliente/creditos", icon: CreditCard, label: "Meus Créditos", active: isActive("/cliente/creditos") },
  ];

  return (
    <ResponsiveLayout showBottomNav={true} bottomNavVariant="dashboard">
      <div className="min-h-screen bg-background flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col shadow-soft
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          hidden md:flex
        `}>
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-primary to-secondary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center shadow-medium">
                  <span className="text-primary font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="heading-4 text-primary-foreground">Arena Dona Santa</h1>
                  <p className="text-xs text-primary-foreground/90 font-medium">Painel de Controle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${item.active 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
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
          <header className="md:hidden bg-card border-b border-border mobile-padding py-4 flex items-center justify-between safe-area-pt">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <h1 className="mobile-subheading gradient-text">Arena</h1>
            </div>
            <CreditosHeader />
          </header>

          {/* Desktop Header */}
          <header className="hidden md:block bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              <CreditosHeader />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
