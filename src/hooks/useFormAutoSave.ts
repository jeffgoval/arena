/**
 * useFormAutoSave Hook
 * Auto-save de formulários com debounce e gerenciamento de rascunhos
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { usePersistedState } from './usePersistedState';
import { toast } from 'sonner@2.0.3';

export interface FormAutoSaveOptions<T> {
  key: string; // Chave única para o formulário
  debounceMs?: number; // Tempo de debounce (default: 1000ms)
  onSave?: (data: T) => Promise<void>; // Callback ao salvar
  onRestore?: (data: T) => void; // Callback ao restaurar rascunho
  showToast?: boolean; // Mostrar toast de auto-save
  validateBeforeSave?: (data: T) => boolean; // Validação antes de salvar
  ttl?: number; // Time to live em ms (default: 7 dias)
  enabled?: boolean; // Habilitar/desabilitar auto-save
}

export interface DraftMetadata {
  savedAt: number;
  version: number;
  formId: string;
}

export interface SavedDraft<T> {
  data: T;
  metadata: DraftMetadata;
}

/**
 * Hook para auto-save de formulários
 */
export function useFormAutoSave<T extends Record<string, any>>(
  initialData: T,
  options: FormAutoSaveOptions<T>
) {
  const {
    key,
    debounceMs = 1000,
    onSave,
    onRestore,
    showToast = true,
    validateBeforeSave,
    ttl = 7 * 24 * 60 * 60 * 1000, // 7 dias
    enabled = true,
  } = options;

  // Estado do formulário
  const [formData, setFormData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Rascunho persistido
  const [savedDraft, setSavedDraft] = usePersistedState<SavedDraft<T> | null>(
    `form-draft-${key}`,
    null
  );

  // Refs
  const initialDataRef = useRef(initialData);
  const versionRef = useRef(0);

  // Debounce dos dados do formulário
  const debouncedFormData = useDebounce(formData, debounceMs);

  /**
   * Verificar se dados mudaram
   */
  const hasChanged = useCallback((data: T): boolean => {
    return JSON.stringify(data) !== JSON.stringify(initialDataRef.current);
  }, []);

  /**
   * Verificar se rascunho está expirado
   */
  const isDraftExpired = useCallback((draft: SavedDraft<T>): boolean => {
    const now = Date.now();
    const age = now - draft.metadata.savedAt;
    return age > ttl;
  }, [ttl]);

  /**
   * Salvar rascunho no localStorage
   */
  const saveDraft = useCallback(
    async (data: T) => {
      if (!enabled) return;

      // Validar antes de salvar
      if (validateBeforeSave && !validateBeforeSave(data)) {
        return;
      }

      setIsSaving(true);

      try {
        versionRef.current += 1;

        const draft: SavedDraft<T> = {
          data,
          metadata: {
            savedAt: Date.now(),
            version: versionRef.current,
            formId: key,
          },
        };

        setSavedDraft(draft);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);

        // Callback externo
        if (onSave) {
          await onSave(data);
        }

        if (showToast) {
          toast.success('Rascunho salvo automaticamente', {
            duration: 2000,
          });
        }
      } catch (error) {
        console.error('Error saving draft:', error);
        if (showToast) {
          toast.error('Erro ao salvar rascunho');
        }
      } finally {
        setIsSaving(false);
      }
    },
    [enabled, key, validateBeforeSave, setSavedDraft, onSave, showToast]
  );

  /**
   * Restaurar rascunho
   */
  const restoreDraft = useCallback(() => {
    if (!savedDraft) return false;

    // Verificar expiração
    if (isDraftExpired(savedDraft)) {
      setSavedDraft(null);
      setHasDraft(false);
      return false;
    }

    setFormData(savedDraft.data);
    setLastSaved(new Date(savedDraft.metadata.savedAt));
    setHasDraft(false);

    if (onRestore) {
      onRestore(savedDraft.data);
    }

    if (showToast) {
      toast.success('Rascunho restaurado');
    }

    return true;
  }, [savedDraft, isDraftExpired, setSavedDraft, onRestore, showToast]);

  /**
   * Descartar rascunho
   */
  const discardDraft = useCallback(() => {
    setSavedDraft(null);
    setHasDraft(false);
    setFormData(initialDataRef.current);
    setLastSaved(null);
    setHasUnsavedChanges(false);

    if (showToast) {
      toast.info('Rascunho descartado');
    }
  }, [setSavedDraft, showToast]);

  /**
   * Limpar auto-save
   */
  const clearAutoSave = useCallback(() => {
    setSavedDraft(null);
    setLastSaved(null);
    setHasUnsavedChanges(false);
    setHasDraft(false);
  }, [setSavedDraft]);

  /**
   * Resetar para dados iniciais
   */
  const reset = useCallback((newInitialData?: T) => {
    const dataToUse = newInitialData || initialDataRef.current;
    setFormData(dataToUse);
    initialDataRef.current = dataToUse;
    setHasUnsavedChanges(false);
    clearAutoSave();
  }, [clearAutoSave]);

  /**
   * Atualizar campo do formulário
   */
  const updateField = useCallback(<K extends keyof T>(
    field: K,
    value: T[K]
  ) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      setHasUnsavedChanges(hasChanged(newData));
      return newData;
    });
  }, [hasChanged]);

  /**
   * Atualizar múltiplos campos
   */
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      setHasUnsavedChanges(hasChanged(newData));
      return newData;
    });
  }, [hasChanged]);

  /**
   * Salvar manualmente
   */
  const saveNow = useCallback(async () => {
    await saveDraft(formData);
  }, [formData, saveDraft]);

  /**
   * Effect: Auto-save quando dados mudam
   */
  useEffect(() => {
    if (!enabled) return;

    // Não salvar se dados não mudaram
    if (!hasChanged(debouncedFormData)) return;

    saveDraft(debouncedFormData);
  }, [debouncedFormData, enabled, hasChanged, saveDraft]);

  /**
   * Effect: Verificar rascunho ao montar
   */
  useEffect(() => {
    if (savedDraft && !isDraftExpired(savedDraft)) {
      setHasDraft(true);
      setLastSaved(new Date(savedDraft.metadata.savedAt));
    }
  }, [savedDraft, isDraftExpired]);

  /**
   * Effect: Aviso ao sair com mudanças não salvas
   */
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    // Estado
    formData,
    setFormData,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    hasDraft,

    // Métodos
    updateField,
    updateFields,
    saveDraft: saveNow,
    restoreDraft,
    discardDraft,
    clearAutoSave,
    reset,

    // Helpers
    isDirty: hasUnsavedChanges,
    canRestore: hasDraft,
  };
}

/**
 * Hook para gerenciar múltiplos rascunhos
 */
export function useDraftManager(prefix: string = 'form-draft') {
  const [drafts, setDrafts] = usePersistedState<Record<string, SavedDraft<any>>>(
    `${prefix}-index`,
    {}
  );

  const listDrafts = useCallback(() => {
    return Object.entries(drafts).map(([key, draft]) => ({
      key,
      ...draft,
    }));
  }, [drafts]);

  const getDraft = useCallback((key: string) => {
    return drafts[key] || null;
  }, [drafts]);

  const deleteDraft = useCallback((key: string) => {
    setDrafts(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[key];
      return newDrafts;
    });
  }, [setDrafts]);

  const deleteAllDrafts = useCallback(() => {
    setDrafts({});
  }, [setDrafts]);

  const deleteExpiredDrafts = useCallback((ttl: number = 7 * 24 * 60 * 60 * 1000) => {
    const now = Date.now();
    setDrafts(prev => {
      const newDrafts = { ...prev };
      Object.keys(newDrafts).forEach(key => {
        const age = now - newDrafts[key].metadata.savedAt;
        if (age > ttl) {
          delete newDrafts[key];
        }
      });
      return newDrafts;
    });
  }, [setDrafts]);

  return {
    drafts: listDrafts(),
    getDraft,
    deleteDraft,
    deleteAllDrafts,
    deleteExpiredDrafts,
    count: Object.keys(drafts).length,
  };
}

/**
 * Hook simples para persistir preferências
 */
export function usePreferences<T extends Record<string, any>>(
  key: string,
  defaults: T
) {
  const [preferences, setPreferences] = usePersistedState<T>(
    `preferences-${key}`,
    defaults
  );

  const updatePreference = useCallback(<K extends keyof T>(
    field: K,
    value: T[K]
  ) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  }, [setPreferences]);

  const updatePreferences = useCallback((updates: Partial<T>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaults);
  }, [setPreferences, defaults]);

  return {
    preferences,
    setPreferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  };
}
