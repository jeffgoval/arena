'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { validarCPF, formatarCPF, limparCPF } from '@/lib/utils/validators';

interface ModalCPFProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (cpf: string) => void;
  loading?: boolean;
}

export function ModalCPF({ open, onClose, onConfirm, loading = false }: ModalCPFProps) {
  const [cpf, setCpf] = useState('');
  const [erro, setErro] = useState('');

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const cpfFormatado = formatarCPF(valor);
    setCpf(cpfFormatado);
    setErro('');
  };

  const handleConfirm = () => {
    const cpfLimpo = limparCPF(cpf);
    
    if (!cpfLimpo) {
      setErro('Por favor, informe seu CPF');
      return;
    }

    if (!validarCPF(cpfLimpo)) {
      setErro('CPF inválido. Verifique os números digitados');
      return;
    }

    onConfirm(cpfLimpo);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>CPF Necessário</DialogTitle>
          <DialogDescription>
            Para realizar a compra de créditos, precisamos do seu CPF conforme exigido pelo sistema de pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              onKeyPress={handleKeyPress}
              maxLength={14}
              disabled={loading}
              autoFocus
            />
          </div>

          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription className="text-sm">
              Seu CPF será usado apenas para processamento de pagamentos e estará protegido conforme a LGPD.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
