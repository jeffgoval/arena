/**
 * Bottom Sheet Component
 * Responsive modal that uses Drawer on mobile and Dialog on desktop
 */

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  showClose?: boolean;
  mobileBreakpoint?: number;
}

/**
 * Responsive Bottom Sheet
 * - Mobile (< 768px): Drawer from bottom
 * - Desktop (>= 768px): Centered Dialog
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showClose = true,
  mobileBreakpoint = 768,
}: BottomSheetProps) {
  const isDesktop = useMediaQuery(`(min-width: ${mobileBreakpoint}px)`);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          <div className="py-4">{children}</div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {showClose && (
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 touch-target"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        )}
        {(title || description) && (
          <DrawerHeader className="text-left">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className="px-4 pb-4 overflow-y-auto max-h-[80vh]">{children}</div>
        {footer && (
          <DrawerFooter className="pt-2 flex-row gap-2">
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Bottom Sheet with Form
 * Optimized for form interactions on mobile
 */
interface BottomSheetFormProps extends BottomSheetProps {
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function BottomSheetForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onCancel,
  isSubmitting = false,
  showClose = true,
}: BottomSheetFormProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
        className="flex-1 touch-target-comfortable"
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 touch-target-comfortable"
      >
        {isSubmitting ? "Processando..." : submitLabel}
      </Button>
    </>
  );

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
      showClose={showClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </BottomSheet>
  );
}

/**
 * Bottom Sheet with Confirmation
 * For destructive or important actions
 */
interface BottomSheetConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function BottomSheetConfirm({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  variant = "default",
  isLoading = false,
}: BottomSheetConfirmProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isLoading}
        className="flex-1 touch-target-comfortable"
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        variant={variant}
        onClick={handleConfirm}
        disabled={isLoading}
        className="flex-1 touch-target-comfortable"
      >
        {isLoading ? "Processando..." : confirmLabel}
      </Button>
    </>
  );

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
    >
      {/* Additional content can go here */}
    </BottomSheet>
  );
}

/**
 * Bottom Sheet with List Selection
 * For picking options on mobile
 */
interface BottomSheetSelectProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  options: T[];
  value?: T;
  onSelect: (option: T) => void;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
}

export function BottomSheetSelect<T>({
  open,
  onOpenChange,
  title,
  description,
  options,
  value,
  onSelect,
  getOptionLabel,
  getOptionValue,
}: BottomSheetSelectProps<T>) {
  const handleSelect = (option: T) => {
    onSelect(option);
    onOpenChange(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = value && getOptionValue(value) === getOptionValue(option);
          return (
            <Button
              key={getOptionValue(option)}
              variant={isSelected ? "default" : "outline"}
              className="w-full justify-start touch-target-comfortable"
              onClick={() => handleSelect(option)}
            >
              {getOptionLabel(option)}
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
