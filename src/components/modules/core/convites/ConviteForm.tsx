"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Users, DollarSign, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConviteFormData {
  reserva_id: string;
  vagas_totais: number;
  mensagem?: string;
  valor_por_pessoa?: number;
  data_expiracao?: Date;
}

interface ConviteFormProps {
  reservaId?: string;
  onSubmit: (data: ConviteFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ConviteForm({
  reservaId = "",
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: ConviteFormProps) {
  const [formData, setFormData] = useState<ConviteFormData>({
    reserva_id: reservaId,
    vagas_totais: 4,
    mensagem: "",
    valor_por_pessoa: undefined,
    data_expiracao: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ConviteFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const newErrors: Partial<Record<keyof ConviteFormData, string>> = {};
    
    if (!formData.reserva_id) {
      newErrors.reserva_id = "Selecione uma reserva";
    }
    
    if (formData.vagas_totais < 1) {
      newErrors.vagas_totais = "Deve haver pelo menos 1 vaga";
    }
    
    if (formData.vagas_totais > 50) {
      newErrors.vagas_totais = "Máximo de 50 vagas";
    }

    if (formData.valor_por_pessoa && formData.valor_por_pessoa < 0) {
      newErrors.valor_por_pessoa = "Valor não pode ser negativo";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  const updateField = <K extends keyof ConviteFormData>(
    field: K,
    value: ConviteFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Criar Convite Público
        </CardTitle>
        <CardDescription>
          Compartilhe sua reserva e convide pessoas para participar
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número de Vagas */}
          <div className="space-y-2">
            <Label htmlFor="vagas_totais" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Número de Vagas
            </Label>
            <Input
              id="vagas_totais"
              type="number"
              min="1"
              max="50"
              value={formData.vagas_totais}
              onChange={(e) => updateField("vagas_totais", parseInt(e.target.value) || 0)}
              className={cn(errors.vagas_totais && "border-red-500")}
              disabled={isLoading}
            />
            {errors.vagas_totais && (
              <p className="text-sm text-red-500">{errors.vagas_totais}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Quantas pessoas podem aceitar este convite
            </p>
          </div>

          {/* Valor por Pessoa (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="valor_por_pessoa" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor por Pessoa (Opcional)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="valor_por_pessoa"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.valor_por_pessoa || ""}
                onChange={(e) =>
                  updateField("valor_por_pessoa", e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className={cn("pl-10", errors.valor_por_pessoa && "border-red-500")}
                disabled={isLoading}
              />
            </div>
            {errors.valor_por_pessoa && (
              <p className="text-sm text-red-500">{errors.valor_por_pessoa}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Valor sugerido para divisão de custos
            </p>
          </div>

          {/* Mensagem (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="mensagem" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mensagem (Opcional)
            </Label>
            <Textarea
              id="mensagem"
              placeholder="Ex: Vamos jogar um futebol! Todos os níveis são bem-vindos."
              value={formData.mensagem}
              onChange={(e) => updateField("mensagem", e.target.value)}
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {formData.mensagem?.length || 0}/500 caracteres
            </p>
          </div>

          {/* Data de Expiração (Opcional) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Data de Expiração (Opcional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.data_expiracao && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data_expiracao ? (
                    format(formData.data_expiracao, "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data_expiracao}
                  onSelect={(date) => updateField("data_expiracao", date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Após esta data, o convite não poderá mais ser aceito
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Criando..." : "Criar Convite"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
