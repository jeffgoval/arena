/**
 * Bulk Actions Component
 * Allows performing actions on multiple items at once
 */

import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Download, 
  Send, 
  Copy,
  MoreVertical,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface BulkAction {
  id: string;
  label: string;
  icon: typeof Trash2;
  variant?: "default" | "destructive";
  requiresConfirmation?: boolean;
  confirmMessage?: string;
}

interface BulkActionsProps<T> {
  items: T[];
  selectedIds: Set<number | string>;
  onSelectionChange: (ids: Set<number | string>) => void;
  getItemId: (item: T) => number | string;
  actions?: BulkAction[];
  onAction?: (actionId: string, selectedIds: Set<number | string>) => void;
}

const DEFAULT_ACTIONS: BulkAction[] = [
  {
    id: "download",
    label: "Baixar Comprovantes",
    icon: Download,
    variant: "default",
  },
  {
    id: "share",
    label: "Compartilhar",
    icon: Send,
    variant: "default",
  },
  {
    id: "copy",
    label: "Copiar Links",
    icon: Copy,
    variant: "default",
  },
  {
    id: "delete",
    label: "Excluir",
    icon: Trash2,
    variant: "destructive",
    requiresConfirmation: true,
    confirmMessage: "Tem certeza que deseja excluir os itens selecionados? Esta ação não pode ser desfeita.",
  },
];

export function BulkActions<T>({
  items,
  selectedIds,
  onSelectionChange,
  getItemId,
  actions = DEFAULT_ACTIONS,
  onAction,
}: BulkActionsProps<T>) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: BulkAction | null;
  }>({ open: false, action: null });

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const handleToggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      const allIds = new Set(items.map((item) => getItemId(item)));
      onSelectionChange(allIds);
    }
  };

  const handleAction = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmDialog({ open: true, action });
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: BulkAction) => {
    onAction?.(action.id, selectedIds);
    
    // Default action handlers
    switch (action.id) {
      case "download":
        toast.success(`Baixando ${selectedIds.size} comprovante(s)...`);
        break;
      case "share":
        toast.success(`Compartilhando ${selectedIds.size} item(s)...`);
        break;
      case "copy":
        toast.success(`${selectedIds.size} link(s) copiado(s)!`);
        break;
      case "delete":
        toast.success(`${selectedIds.size} item(s) excluído(s)!`);
        onSelectionChange(new Set());
        break;
    }
  };

  const confirmAction = () => {
    if (confirmDialog.action) {
      executeAction(confirmDialog.action);
      setConfirmDialog({ open: false, action: null });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-0 z-10 bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectionChange(new Set())}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="gap-1">
                  {selectedIds.size} {selectedIds.size === 1 ? "item" : "itens"} selecionado{selectedIds.size !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant={action.variant === "destructive" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleAction(action)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select All Checkbox */}
      <div className="flex items-center gap-2 mb-3">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) {
              el.indeterminate = someSelected;
            }
          }}
          onCheckedChange={handleToggleAll}
          id="select-all"
        />
        <label
          htmlFor="select-all"
          className="text-sm text-muted-foreground cursor-pointer select-none"
        >
          {allSelected
            ? "Desmarcar todos"
            : someSelected
            ? `${selectedIds.size} de ${items.length} selecionados`
            : "Selecionar todos"}
        </label>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ open, action: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action?.confirmMessage ||
                "Tem certeza que deseja executar esta ação?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                confirmDialog.action?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Item Selection Checkbox
 * Individual checkbox for selecting items
 */
interface ItemSelectionProps {
  itemId: number | string;
  selectedIds: Set<number | string>;
  onToggle: (id: number | string) => void;
  label?: string;
}

export function ItemSelection({
  itemId,
  selectedIds,
  onToggle,
  label,
}: ItemSelectionProps) {
  const isSelected = selectedIds.has(itemId);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(itemId)}
        id={`item-${itemId}`}
      />
      {label && (
        <label
          htmlFor={`item-${itemId}`}
          className="text-sm cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}

/**
 * Bulk Actions Menu
 * Compact dropdown menu for bulk actions
 */
interface BulkActionsMenuProps {
  selectedCount: number;
  actions: BulkAction[];
  onAction: (actionId: string) => void;
  onClearSelection: () => void;
}

export function BulkActionsMenu({
  selectedCount,
  actions,
  onAction,
  onClearSelection,
}: BulkActionsMenuProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        {selectedCount} selecionado{selectedCount !== 1 ? "s" : ""}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4 mr-2" />
            Ações
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações em Lote</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={action.id}
                onClick={() => onAction(action.id)}
                className={action.variant === "destructive" ? "text-destructive" : ""}
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClearSelection}>
            <X className="h-4 w-4 mr-2" />
            Limpar Seleção
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
