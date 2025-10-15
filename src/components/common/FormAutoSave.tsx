/**
 * FormAutoSave Component
 * Wrapper para formulários com auto-save
 */

import { ReactNode, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Check, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { cn } from '../ui/utils';
import { useFormAutoSave, FormAutoSaveOptions } from '../../hooks/useFormAutoSave';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useState } from 'react';

interface FormAutoSaveProps<T extends Record<string, any>> {
  initialData: T;
  options: FormAutoSaveOptions<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (props: {
    formData: T;
    updateField: <K extends keyof T>(field: K, value: T[K]) => void;
    updateFields: (updates: Partial<T>) => void;
    isDirty: boolean;
  }) => ReactNode;
  showStatus?: boolean;
  showDraftRestore?: boolean;
  className?: string;
}

export function FormAutoSave<T extends Record<string, any>>({
  initialData,
  options,
  onSubmit,
  children,
  showStatus = true,
  showDraftRestore = true,
  className,
}: FormAutoSaveProps<T>) {
  const {
    formData,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    hasDraft,
    updateField,
    updateFields,
    restoreDraft,
    discardDraft,
    isDirty,
  } = useFormAutoSave(initialData, options);

  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleRestoreDraft = () => {
    restoreDraft();
  };

  const handleDiscardDraft = () => {
    setShowDiscardDialog(true);
  };

  const confirmDiscard = () => {
    discardDraft();
    setShowDiscardDialog(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        {/* Draft Restore Banner */}
        {showDraftRestore && hasDraft && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-info/10 border border-info rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-info mb-1">
                    Rascunho encontrado
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Há um rascunho salvo anteriormente. Deseja restaurá-lo?
                  </p>
                  {lastSaved && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Salvo em {lastSaved.toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRestoreDraft}
                >
                  Restaurar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDiscardDraft}
                >
                  Descartar
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Content */}
        {children({ formData, updateField, updateFields, isDirty })}

        {/* Auto-save Status */}
        {showStatus && (
          <AutoSaveStatus
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}
      </form>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar rascunho?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O rascunho salvo será permanentemente
              excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Auto-save Status Indicator
 */
interface AutoSaveStatusProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  className?: string;
}

export function AutoSaveStatus({
  isSaving,
  lastSaved,
  hasUnsavedChanges,
  className,
}: AutoSaveStatusProps) {
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'agora mesmo';
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `há ${Math.floor(seconds / 3600)} h`;
    return `há ${Math.floor(seconds / 86400)} dias`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex items-center justify-end gap-2 text-sm', className)}
    >
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Save className="w-4 h-4" />
            </motion.div>
            <span>Salvando...</span>
          </motion.div>
        ) : hasUnsavedChanges ? (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 text-warning"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Alterações não salvas</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 text-success"
          >
            <Check className="w-4 h-4" />
            <span>Salvo {getTimeAgo(lastSaved)}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Draft List Component
 */
interface DraftListProps {
  drafts: Array<{
    key: string;
    data: any;
    metadata: {
      savedAt: number;
      version: number;
      formId: string;
    };
  }>;
  onRestore: (key: string) => void;
  onDelete: (key: string) => void;
  className?: string;
}

export function DraftList({
  drafts,
  onRestore,
  onDelete,
  className,
}: DraftListProps) {
  if (drafts.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhum rascunho salvo</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {drafts.map((draft) => (
        <div
          key={draft.key}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{draft.metadata.formId}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(draft.metadata.savedAt).toLocaleString('pt-BR')}
              </span>
              <Badge variant="secondary" className="ml-2">
                v{draft.metadata.version}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(draft.key)}
            >
              Restaurar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(draft.key)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Simple Auto-save Indicator (minimal)
 */
export function SimpleAutoSaveIndicator({
  isSaving,
  className,
}: {
  isSaving: boolean;
  className?: string;
}) {
  if (!isSaving) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'bg-muted text-muted-foreground text-sm',
        className
      )}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Save className="w-3 h-3" />
      </motion.div>
      <span>Salvando...</span>
    </motion.div>
  );
}
