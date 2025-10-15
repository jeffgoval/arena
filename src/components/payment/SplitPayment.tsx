import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Users, Plus, X, DollarSign, Mail, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface Participant {
  id: string;
  name: string;
  email: string;
  amount: number;
  status: "pending" | "accepted" | "paid";
}

interface SplitPaymentProps {
  totalAmount: number;
  onContinue: (participants: Participant[]) => void;
}

export function SplitPayment({ totalAmount, onContinue }: SplitPaymentProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "me",
      name: "Você",
      email: "seu@email.com",
      amount: totalAmount,
      status: "accepted",
    },
  ]);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal");

  const handleAddParticipant = () => {
    if (!newParticipant.name || !newParticipant.email) {
      toast.error("Preencha nome e email do participante");
      return;
    }

    const newPart: Participant = {
      id: Date.now().toString(),
      name: newParticipant.name,
      email: newParticipant.email,
      amount: 0,
      status: "pending",
    };

    setParticipants([...participants, newPart]);
    setNewParticipant({ name: "", email: "" });
    toast.success(`${newParticipant.name} adicionado!`);

    // Recalculate equal split
    if (splitMethod === "equal") {
      distributeSplitEqually([...participants, newPart]);
    }
  };

  const handleRemoveParticipant = (id: string) => {
    if (id === "me") {
      toast.error("Você não pode se remover!");
      return;
    }
    const updated = participants.filter((p) => p.id !== id);
    setParticipants(updated);

    if (splitMethod === "equal") {
      distributeSplitEqually(updated);
    }
  };

  const distributeSplitEqually = (parts: Participant[]) => {
    const amountPerPerson = totalAmount / parts.length;
    const updated = parts.map((p) => ({ ...p, amount: amountPerPerson }));
    setParticipants(updated);
  };

  const handleSplitMethodChange = (method: "equal" | "custom") => {
    setSplitMethod(method);
    if (method === "equal") {
      distributeSplitEqually(participants);
    }
  };

  const handleCustomAmountChange = (id: string, amount: number) => {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, amount } : p
    );
    setParticipants(updated);
  };

  const currentTotal = participants.reduce((sum, p) => sum + p.amount, 0);
  const isValidTotal = Math.abs(currentTotal - totalAmount) < 0.01;

  const getStatusColor = (status: Participant["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-success text-success-foreground";
      case "paid":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-warning text-warning-foreground";
    }
  };

  const getStatusLabel = (status: Participant["status"]) => {
    switch (status) {
      case "accepted":
        return "Aceito";
      case "paid":
        return "Pago";
      default:
        return "Pendente";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-medium">Dividir Pagamento</p>
              <p className="text-sm text-muted-foreground">
                Compartilhe os custos com seus amigos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Amount */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
        <div>
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-bold">R$ {totalAmount.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Participantes</p>
          <p className="text-2xl font-bold">{participants.length}</p>
        </div>
      </div>

      {/* Split Method */}
      <div className="space-y-3">
        <Label>Método de Divisão</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={splitMethod === "equal" ? "default" : "outline"}
            onClick={() => handleSplitMethodChange("equal")}
            className="justify-start"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Dividir Igualmente
          </Button>
          <Button
            variant={splitMethod === "custom" ? "default" : "outline"}
            onClick={() => handleSplitMethodChange("custom")}
            className="justify-start"
          >
            Valores Personalizados
          </Button>
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Participantes</Label>
          {splitMethod === "custom" && (
            <Badge variant={isValidTotal ? "default" : "destructive"}>
              {isValidTotal
                ? "✓ Total correto"
                : `Faltam R$ ${(totalAmount - currentTotal).toFixed(2)}`}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{participant.name}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(participant.status)}`}
                          >
                            {getStatusLabel(participant.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {participant.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {splitMethod === "custom" ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm">R$</span>
                            <Input
                              type="number"
                              value={participant.amount}
                              onChange={(e) =>
                                handleCustomAmountChange(
                                  participant.id,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 h-8 text-right"
                              step="0.01"
                            />
                          </div>
                        ) : (
                          <p className="font-bold text-primary">
                            R$ {participant.amount.toFixed(2)}
                          </p>
                        )}
                        {participant.id !== "me" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Participant */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Plus className="h-4 w-4" />
              Adicionar Participante
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Nome"
                value={newParticipant.name}
                onChange={(e) =>
                  setNewParticipant({ ...newParticipant, name: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Email"
                value={newParticipant.email}
                onChange={(e) =>
                  setNewParticipant({ ...newParticipant, email: e.target.value })
                }
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddParticipant}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Como funciona?
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                <li>• Convites serão enviados por email para cada participante</li>
                <li>• Cada um paga sua parte diretamente no app</li>
                <li>• A reserva é confirmada quando todos pagarem</li>
                <li>• Você pode acompanhar o status em tempo real</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button
        onClick={() => onContinue(participants)}
        disabled={!isValidTotal || participants.length < 2}
        className="w-full"
        size="lg"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        Continuar com {participants.length} participantes
      </Button>
    </div>
  );
}
