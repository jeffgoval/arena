'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAplicarCodigo } from '@/hooks/core/useIndicacoes';

interface FormAplicarCodigoProps {
  onSucesso?: () => void;
}

export function FormAplicarCodigo({ onSucesso }: FormAplicarCodigoProps) {
  const [codigo, setCodigo] = useState('');
  const aplicarCodigo = useAplicarCodigo();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      toast({
        title: "Erro",
        description: "Código de indicação é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await aplicarCodigo.mutateAsync(codigo.trim().toUpperCase());
      setCodigo('');
      onSucesso?.();
    } catch (error) {
      // Error handling é feito pelo hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Aplicar Código de Indicação
        </CardTitle>
        <CardDescription>
          Tem um código de indicação? Use aqui e ganhe créditos!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código de Indicação</Label>
            <Input
              id="codigo"
              type="text"
              placeholder="Digite o código aqui"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="font-mono text-center"
              maxLength={20}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={aplicarCodigo.isPending}>
            {aplicarCodigo.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Aplicando código...
              </>
            ) : (
              <>
                <Gift className="h-4 w-4 mr-2" />
                Aplicar Código
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">Benefícios:</p>
          <ul className="space-y-1 text-xs">
            <li>• Ganhe créditos para usar em reservas</li>
            <li>• Ajude um amigo a ganhar créditos também</li>
            <li>• Códigos são válidos apenas uma vez por usuário</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}