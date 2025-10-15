/**
 * LocalStorageManager Component
 * Interface para gerenciar localStorage
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  HardDrive,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Check,
  FileText,
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
  useLocalStorageQuota,
  useLocalStorageNamespace,
  useLocalStorageCleanup,
} from '../../hooks/useLocalStorageSync';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
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
import { toast } from 'sonner@2.0.3';

interface LocalStorageManagerProps {
  namespace?: string;
  showQuota?: boolean;
  showCleanup?: boolean;
  showExportImport?: boolean;
  className?: string;
}

export function LocalStorageManager({
  namespace = 'app',
  showQuota = true,
  showCleanup = true,
  showExportImport = true,
  className,
}: LocalStorageManagerProps) {
  const { usage, quota, usagePercent, refresh } = useLocalStorageQuota();
  const { listKeys, clearNamespace, getNamespaceSize, count } =
    useLocalStorageNamespace(namespace);
  const { cleanupByAge, cleanupAll } = useLocalStorageCleanup();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(listKeys());
  }, [listKeys]);

  const handleClearNamespace = () => {
    clearNamespace();
    setItems([]);
    refresh();
    toast.success('Dados limpos com sucesso');
    setShowClearDialog(false);
  };

  const handleCleanupOld = () => {
    const cleaned = cleanupByAge(30 * 24 * 60 * 60 * 1000); // 30 dias
    refresh();
    setItems(listKeys());
    toast.success(`${cleaned} item(ns) antigo(s) removido(s)`);
  };

  const handleExport = () => {
    const data: Record<string, any> = {};
    items.forEach(key => {
      const fullKey = `${namespace}:${key}`;
      const value = localStorage.getItem(fullKey);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${namespace}-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          Object.entries(data).forEach(([key, value]) => {
            const fullKey = `${namespace}:${key}`;
            localStorage.setItem(fullKey, JSON.stringify(value));
          });
          setItems(listKeys());
          refresh();
          toast.success('Backup importado com sucesso');
        } catch (error) {
          toast.error('Erro ao importar backup');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <div className={cn('space-y-6', className)}>
        {/* Storage Quota */}
        {showQuota && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Armazenamento Local
                  </CardTitle>
                  <CardDescription>
                    Uso do localStorage do navegador
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refresh}>
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uso: {formatBytes(usage)}</span>
                  <span className="text-muted-foreground">
                    {formatBytes(quota)} disponível
                  </span>
                </div>
                <Progress value={usagePercent} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{usagePercent.toFixed(1)}% utilizado</span>
                  {usagePercent > 80 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Espaço baixo
                    </Badge>
                  )}
                </div>
              </div>

              {/* Namespace Stats */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Namespace</p>
                    <p className="text-lg font-semibold">{namespace}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="text-lg font-semibold">{count}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Tamanho</p>
                    <p className="text-lg font-semibold">
                      {formatBytes(getNamespaceSize())}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cleanup Options */}
        {showCleanup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Limpeza de Dados
              </CardTitle>
              <CardDescription>
                Remover dados antigos ou desnecessários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCleanupOld}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar dados com mais de 30 dias
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => setShowClearDialog(true)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Limpar todos os dados ({namespace})
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Export/Import */}
        {showExportImport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Backup e Restauração
              </CardTitle>
              <CardDescription>
                Exportar ou importar seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExport}
                disabled={count === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar dados ({count} items)
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleImport}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar dados
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Items Armazenados</CardTitle>
            <CardDescription>
              {count} item(ns) no namespace "{namespace}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum item armazenado
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <span className="text-sm truncate flex-1">{key}</span>
                    <Badge variant="secondary" className="ml-2">
                      {formatBytes(
                        new Blob([
                          localStorage.getItem(`${namespace}:${key}`) || '',
                        ]).size
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar todos os dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente todos os dados armazenados
              localmente no namespace "{namespace}". Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearNamespace}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Limpar Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Simple Storage Quota Indicator
 */
export function StorageQuotaIndicator({ className }: { className?: string }) {
  const { usage, quota, usagePercent } = useLocalStorageQuota();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Armazenamento</span>
        <span>
          {formatBytes(usage)} / {formatBytes(quota)}
        </span>
      </div>
      <Progress value={usagePercent} className="h-1" />
    </div>
  );
}
