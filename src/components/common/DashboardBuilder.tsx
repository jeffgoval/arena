/**
 * Dashboard Builder Component
 * Customizable dashboard with draggable widgets
 */

import { useState, useCallback, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  GripVertical,
  Settings,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { motion, Reorder } from "motion/react";
import { usePersistedState } from "../../hooks/usePersistedState";
import { cn } from "../../lib/utils";

export interface DashboardWidget {
  id: string;
  title: string;
  icon?: LucideIcon;
  content: ReactNode;
  priority: "high" | "medium" | "low";
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  minHeight?: string;
  badge?: string | number;
}

interface WidgetState {
  id: string;
  visible: boolean;
  collapsed: boolean;
  order: number;
}

interface DashboardBuilderProps {
  widgets: DashboardWidget[];
  storageKey?: string;
  className?: string;
  onWidgetToggle?: (widgetId: string, visible: boolean) => void;
  onLayoutChange?: (layout: WidgetState[]) => void;
}

export function DashboardBuilder({
  widgets,
  storageKey = "dashboard-layout",
  className = "",
  onWidgetToggle,
  onLayoutChange,
}: DashboardBuilderProps) {
  // Initialize widget states
  const initialStates: WidgetState[] = widgets.map((widget, index) => ({
    id: widget.id,
    visible: true,
    collapsed: widget.defaultCollapsed || false,
    order: index,
  }));

  const [widgetStates, setWidgetStates] = usePersistedState<WidgetState[]>(
    storageKey,
    initialStates
  );

  // Merge with new widgets if they don't exist
  const mergedStates = widgets.map((widget, index) => {
    const existingState = widgetStates.find((s) => s.id === widget.id);
    return (
      existingState || {
        id: widget.id,
        visible: true,
        collapsed: widget.defaultCollapsed || false,
        order: index,
      }
    );
  });

  // Sort by order
  const sortedStates = [...mergedStates].sort((a, b) => a.order - b.order);

  const toggleWidgetVisibility = useCallback(
    (widgetId: string) => {
      setWidgetStates((prev) =>
        prev.map((state) =>
          state.id === widgetId ? { ...state, visible: !state.visible } : state
        )
      );
      const widget = widgetStates.find((s) => s.id === widgetId);
      if (widget) {
        onWidgetToggle?.(widgetId, !widget.visible);
      }
    },
    [setWidgetStates, widgetStates, onWidgetToggle]
  );

  const toggleWidgetCollapsed = useCallback(
    (widgetId: string) => {
      setWidgetStates((prev) =>
        prev.map((state) =>
          state.id === widgetId ? { ...state, collapsed: !state.collapsed } : state
        )
      );
    },
    [setWidgetStates]
  );

  const resetLayout = useCallback(() => {
    setWidgetStates(initialStates);
    onLayoutChange?.(initialStates);
  }, [setWidgetStates, initialStates, onLayoutChange]);

  const handleReorder = useCallback(
    (newOrder: WidgetState[]) => {
      const updatedStates = newOrder.map((state, index) => ({
        ...state,
        order: index,
      }));
      setWidgetStates(updatedStates);
      onLayoutChange?.(updatedStates);
    },
    [setWidgetStates, onLayoutChange]
  );

  const visibleWidgets = sortedStates
    .filter((state) => state.visible)
    .map((state) => {
      const widget = widgets.find((w) => w.id === state.id);
      return { ...state, widget };
    })
    .filter((item) => item.widget !== undefined);

  const hiddenCount = sortedStates.filter((s) => !s.visible).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Dashboard</h2>
          {hiddenCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {hiddenCount} oculto{hiddenCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetLayout}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Resetar</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Personalizar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Widgets Visíveis</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {widgets.map((widget) => {
                const state = sortedStates.find((s) => s.id === widget.id);
                return (
                  <DropdownMenuCheckboxItem
                    key={widget.id}
                    checked={state?.visible}
                    onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {widget.icon && <widget.icon className="h-4 w-4" />}
                      <span className="flex-1">{widget.title}</span>
                      <Badge
                        variant={
                          widget.priority === "high"
                            ? "default"
                            : widget.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {widget.priority}
                      </Badge>
                    </div>
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Draggable Widgets */}
      <Reorder.Group
        axis="y"
        values={visibleWidgets}
        onReorder={handleReorder}
        className="space-y-4"
      >
        {visibleWidgets.map(({ widget, collapsed }) => {
          if (!widget) return null;

          const Icon = widget.icon;

          return (
            <Reorder.Item
              key={widget.id}
              value={{ id: widget.id, visible: true, collapsed, order: 0 }}
              className="list-none"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={cn(
                    "overflow-hidden transition-all",
                    collapsed && "h-auto"
                  )}
                >
                  <CardHeader
                    className={cn(
                      "cursor-grab active:cursor-grabbing",
                      widget.collapsible && "cursor-pointer"
                    )}
                    onClick={
                      widget.collapsible
                        ? () => toggleWidgetCollapsed(widget.id)
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                      <CardTitle className="flex-1">{widget.title}</CardTitle>
                      
                      {widget.badge && (
                        <Badge variant="secondary">
                          {widget.badge}
                        </Badge>
                      )}

                      {widget.collapsible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWidgetCollapsed(widget.id);
                          }}
                        >
                          {collapsed ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {!collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent
                        className={cn(
                          "pt-0",
                          widget.minHeight && `min-h-[${widget.minHeight}]`
                        )}
                      >
                        {widget.content}
                      </CardContent>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <EyeOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Todos os widgets estão ocultos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em "Personalizar" para mostrar widgets
            </p>
            <Button variant="outline" size="sm" onClick={resetLayout}>
              Restaurar Layout Padrão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Compact Dashboard Builder (without drag-and-drop)
 */
interface CompactDashboardProps {
  widgets: DashboardWidget[];
  className?: string;
}

export function CompactDashboard({ widgets, className = "" }: CompactDashboardProps) {
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>(
    {}
  );

  const toggleCollapsed = (widgetId: string) => {
    setCollapsedStates((prev) => ({
      ...prev,
      [widgetId]: !prev[widgetId],
    }));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {widgets.map((widget) => {
        const Icon = widget.icon;
        const collapsed = collapsedStates[widget.id] || widget.defaultCollapsed;

        return (
          <Card key={widget.id}>
            <CardHeader
              className={cn(
                widget.collapsible && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={
                widget.collapsible ? () => toggleCollapsed(widget.id) : undefined
              }
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5" />}
                <CardTitle className="flex-1">{widget.title}</CardTitle>
                {widget.badge && (
                  <Badge variant="secondary">{widget.badge}</Badge>
                )}
                {widget.collapsible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {collapsed ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            {!collapsed && (
              <CardContent className="pt-0">{widget.content}</CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
