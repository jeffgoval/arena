/**
 * Command Palette Component
 * Global search and quick actions (⌘K / Ctrl+K)
 */

import { useEffect, useState, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Users,
  CreditCard,
  Settings,
  FileText,
  MapPin,
  TrendingUp,
  User,
  LogOut,
  Search,
  Clock,
  Trophy,
  Gift,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  keywords?: string[];
  shortcut?: string[];
  category: "navigation" | "actions" | "recent" | "settings";
  onSelect: () => void;
  badge?: string;
  isNew?: boolean;
}

interface CommandPaletteProps {
  onNavigate?: (page: string) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();

  // Define available actions
  const actions: CommandAction[] = useMemo(() => {
    const baseActions: CommandAction[] = [
      // Navigation
      {
        id: "nav-dashboard",
        label: "Dashboard",
        description: "Ver visão geral",
        icon: TrendingUp,
        keywords: ["inicio", "home", "painel"],
        shortcut: ["g", "d"],
        category: "navigation",
        onSelect: () => {
          onNavigate?.("dashboard");
          setOpen(false);
        },
      },
      {
        id: "nav-bookings",
        label: "Meus Jogos",
        description: "Ver reservas agendadas",
        icon: Calendar,
        keywords: ["reservas", "agendamentos", "partidas"],
        shortcut: ["g", "j"],
        category: "navigation",
        onSelect: () => {
          onNavigate?.("jogos");
          setOpen(false);
        },
      },
      {
        id: "nav-teams",
        label: "Meu Time",
        description: "Gerenciar turmas",
        icon: Users,
        keywords: ["turma", "grupo", "amigos"],
        shortcut: ["g", "t"],
        category: "navigation",
        onSelect: () => {
          onNavigate?.("teams");
          setOpen(false);
        },
      },
      {
        id: "nav-transactions",
        label: "Transações",
        description: "Ver histórico financeiro",
        icon: FileText,
        keywords: ["extrato", "pagamentos", "financeiro"],
        shortcut: ["g", "e"],
        category: "navigation",
        onSelect: () => {
          onNavigate?.("transactions");
          setOpen(false);
        },
      },

      // Actions
      {
        id: "action-new-booking",
        label: "Nova Reserva",
        description: "Agendar uma quadra",
        icon: Calendar,
        keywords: ["agendar", "reservar", "quadra"],
        shortcut: ["n"],
        category: "actions",
        onSelect: () => {
          onNavigate?.("booking");
          setOpen(false);
        },
        badge: "Ação rápida",
      },
      {
        id: "action-add-credit",
        label: "Adicionar Créditos",
        description: "Recarregar saldo",
        icon: CreditCard,
        keywords: ["pagar", "recarregar", "saldo"],
        category: "actions",
        onSelect: () => {
          onNavigate?.("add-credit");
          setOpen(false);
        },
      },
      {
        id: "action-invite",
        label: "Convidar Amigos",
        description: "Enviar convite para jogar",
        icon: Users,
        keywords: ["convidar", "chamar"],
        category: "actions",
        onSelect: () => {
          // Open invite modal
          setOpen(false);
        },
      },
      {
        id: "action-referral",
        label: "Indicar Amigo",
        description: "Ganhe bônus indicando",
        icon: Gift,
        keywords: ["indicação", "bonus", "recompensa"],
        category: "actions",
        onSelect: () => {
          onNavigate?.("referral");
          setOpen(false);
        },
        badge: "R$ 20",
        isNew: true,
      },
      {
        id: "action-support",
        label: "Falar com Suporte",
        description: "Abrir WhatsApp",
        icon: MessageSquare,
        keywords: ["ajuda", "contato", "whatsapp"],
        category: "actions",
        onSelect: () => {
          window.open("https://wa.me/5511987654321", "_blank");
          setOpen(false);
        },
      },

      // Settings
      {
        id: "settings-profile",
        label: "Editar Perfil",
        description: "Atualizar informações",
        icon: User,
        keywords: ["perfil", "dados", "informações"],
        shortcut: ["p"],
        category: "settings",
        onSelect: () => {
          onNavigate?.("profile");
          setOpen(false);
        },
      },
      {
        id: "settings-preferences",
        label: "Configurações",
        description: "Preferências do sistema",
        icon: Settings,
        keywords: ["preferencias", "opcoes"],
        shortcut: [","],
        category: "settings",
        onSelect: () => {
          onNavigate?.("settings");
          setOpen(false);
        },
      },
      {
        id: "settings-logout",
        label: "Sair",
        description: "Fazer logout",
        icon: LogOut,
        keywords: ["logout", "desconectar"],
        category: "settings",
        onSelect: () => {
          toast.success("Saindo...", { duration: 1000 });
          logout();
          setOpen(false);
        },
      },
    ];

    return baseActions;
  }, [onNavigate, logout]);

  // Filter actions based on search
  const filteredActions = useMemo(() => {
    if (!search) return actions;

    const searchLower = search.toLowerCase();
    return actions.filter((action) => {
      const labelMatch = action.label.toLowerCase().includes(searchLower);
      const descMatch = action.description?.toLowerCase().includes(searchLower);
      const keywordMatch = action.keywords?.some((k) =>
        k.toLowerCase().includes(searchLower)
      );

      return labelMatch || descMatch || keywordMatch;
    });
  }, [actions, search]);

  // Group filtered actions by category
  const groupedActions = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {
      navigation: [],
      actions: [],
      recent: [],
      settings: [],
    };

    filteredActions.forEach((action) => {
      groups[action.category].push(action);
    });

    return groups;
  }, [filteredActions]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || 
          (e.key === "/" && e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Implement keyboard navigation shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Single letter shortcuts
      const action = actions.find(
        (a) =>
          a.shortcut?.length === 1 &&
          a.shortcut[0] === e.key.toLowerCase() &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey
      );

      if (action) {
        e.preventDefault();
        action.onSelect();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, actions]);

  return (
    <>
      {/* Trigger button (optional - can be in header) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 md:hidden z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Abrir busca rápida"
      >
        <Search className="h-5 w-5" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Digite um comando ou busque..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center text-sm">
              <Search className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum resultado encontrado</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tente usar termos diferentes
              </p>
            </div>
          </CommandEmpty>

          {/* Navigation */}
          {groupedActions.navigation.length > 0 && (
            <>
              <CommandGroup heading="Navegação">
                {groupedActions.navigation.map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={action.onSelect}
                    className="flex items-center gap-3"
                  >
                    <action.icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{action.label}</span>
                        {action.isNew && (
                          <Badge variant="secondary" className="text-xs">
                            Novo
                          </Badge>
                        )}
                      </div>
                      {action.description && (
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      )}
                    </div>
                    {action.shortcut && (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        {action.shortcut.map((key, i) => (
                          <span key={i}>{key}</span>
                        ))}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Actions */}
          {groupedActions.actions.length > 0 && (
            <>
              <CommandGroup heading="Ações">
                {groupedActions.actions.map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={action.onSelect}
                    className="flex items-center gap-3"
                  >
                    <action.icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{action.label}</span>
                        {action.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {action.badge}
                          </Badge>
                        )}
                        {action.isNew && (
                          <Badge className="text-xs bg-accent">Novo</Badge>
                        )}
                      </div>
                      {action.description && (
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      )}
                    </div>
                    {action.shortcut && (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        {action.shortcut.join(" + ")}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Settings */}
          {groupedActions.settings.length > 0 && (
            <CommandGroup heading="Configurações">
              {groupedActions.settings.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={action.onSelect}
                  className="flex items-center gap-3"
                >
                  <action.icon className="h-4 w-4" />
                  <div className="flex-1">
                    <span>{action.label}</span>
                    {action.description && (
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    )}
                  </div>
                  {action.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {action.shortcut.join(" + ")}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer with tip */}
        <div className="border-t p-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              Dica: Use <kbd className="px-1 py-0.5 rounded bg-muted">⌘K</kbd> para abrir
            </span>
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 rounded bg-muted">↑</kbd>{" "}
              <kbd className="px-1 py-0.5 rounded bg-muted">↓</kbd> para navegar
            </span>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
