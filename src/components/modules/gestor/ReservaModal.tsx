"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Loader2, DollarSign, MessageSquare, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Reserva {
  id?: string;
  clienteId: string;
  clienteNome: string;
  quadra: string;
  data: string;
  horario: string;
  duracao: number;
  valor: number;
  status: "confirmada" | "pendente" | "cancelada" | "concluida";
  formaPagamento?: "dinheiro" | "pix" | "cartao" | "transferencia";
  pagamentoStatus: "pago" | "pendente" | "parcial";
  valorPago: number;
  observacoes?: string;
  motivoCancelamento?: string;
}

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: Reserva | null;
  mode: "view" | "edit" | "create";
  onSave: (reserva: Reserva) => void;
  onCancel?: (id: string, motivo: string) => void;
  onSendMessage?: (id: string, message: string) => void;
  clientes?: Array<{ id: string; nome: string }>;
  quadras?: string[];
}

export function ReservaModal({ 
  isOpen, 
  onClose, 
  reserva, 
  mode, 
  onSave,
  onCancel,
  onSendMessage,
  clientes = [],
  quadras = []
}: ReservaModalProps) {
  const [formData, setFormData] = useState<Reserva>({
    clienteId: "",
    clienteNome: "",
    quadra: "",
    data: "",
    horario: "",
    duracao: 1,
    valor: 0,
    status: "pendente",
    pagamentoStatus: "pendente",
    valorPago: 0,
    observacoes: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(mode === "edit" || mode === "create");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [message, setMessage] = useState("");
  const [pagamentoValor, setPagamentoValor] = useState(0);
  const [pagamentoForma, setPagamentoForma] = useState<"dinheiro" | "pix" | "cartao" | "transferencia">("dinheiro");

  useEffect(() => {
    if (reserva) {
      setFormData(reserva);
    }
    setIsEditing(mode === "edit" || mode === "create");
  }, [reserva, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(formData);
    setLoading(false);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-select cliente nome when clienteId changes
    if (field === "clienteId") {
      const cliente = clientes.find(c => c.id === value);
      if (cliente) {
        setFormData(prev => ({ ...prev, clienteNome: cliente.nome }));
      }
    }
  };

  const handleCancelReserva = async () => {
    if (!reserva?.id || !cancelMotivo.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onCancel?.(reserva.id, cancelMotivo);
    setLoading(false);
    setShowCancelDialog(false);
    onClose();
  };

  const handleSendMessage = async () => {
    if (!reserva?.id || !message.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSendMessage?.(reserva.id, message);
    setLoading(false);
    setShowMessageDialog(false);
    setMessage("");
  };

  const handleRegistrarPagamento = async () => {
    if (pagamentoValor <= 0) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const novoValorPago = formData.valorPago + pagamentoValor;
    const novoPagamentoStatus = novoValorPago >= formData.valor ? "pago" : "parcial";
    
    setFormData(prev => ({
      ...prev,
      valorPago: novoValorPago,
      pagamentoStatus: novoPagamentoStatus,
      formaPagamento: pagamentoForma
    }));
    
    setLoading(false);
    setShowPaymentDialog(false);
    setPagamentoValor(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-success">Confirmada</Badge>;
      case "pendente":
        return <Badge className="bg-warning">Pendente</Badge>;
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "concluida":
        return <Badge className="bg-primary">Concluída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPagamentoStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return <Badge className="bg-success">Pago</Badge>;
      case "parcial":
        return <Badge className="bg-warning">Parcial</Badge>;
      case "pendente":
        return <Badge variant="destructive">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (showCancelDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe o motivo do cancelamento desta reserva:
            </p>
            
            <Textarea
              value={cancelMotivo}
              onChange={(e) => setCancelMotivo(e.target.value)}
              placeholder="Motivo do cancelamento..."
              rows={4}
            />
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Voltar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelReserva}
                disabled={!cancelMotivo.trim() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Confirmar Cancelamento
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showMessageDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Mensagem</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enviar mensagem para: <strong>{formData.clienteNome}</strong>
            </p>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={6}
            />
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showPaymentDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Valor Total:</span>
                <span className="font-semibold">R$ {formData.valor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Já Pago:</span>
                <span className="font-semibold text-success">R$ {formData.valorPago.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span>Restante:</span>
                <span className="font-semibold text-destructive">
                  R$ {(formData.valor - formData.valorPago).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pagamentoValor">Valor do Pagamento</Label>
              <Input
                id="pagamentoValor"
                type="number"
                step="0.01"
                value={pagamentoValor}
                onChange={(e) => setPagamentoValor(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pagamentoForma">Forma de Pagamento</Label>
              <select
                id="pagamentoForma"
                value={pagamentoForma}
                onChange={(e) => setPagamentoForma(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleRegistrarPagamento}
                disabled={pagamentoValor <= 0 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Registrar Pagamento
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "create" ? "Nova Reserva" : mode === "edit" ? "Editar Reserva" : "Detalhes da Reserva"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status e Pagamento */}
          {mode === "view" && (
            <div className="flex gap-4 p-4 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                {getStatusBadge(formData.status)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Pagamento</p>
                {getPagamentoStatusBadge(formData.pagamentoStatus)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Valor Pago</p>
                <p className="font-semibold">R$ {formData.valorPago.toFixed(2)} / R$ {formData.valor.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Cliente</h3>
            
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente *</Label>
              {isEditing ? (
                <select
                  id="clienteId"
                  value={formData.clienteId}
                  onChange={(e) => handleChange("clienteId", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              ) : (
                <Input value={formData.clienteNome} disabled />
              )}
            </div>
          </div>

          {/* Reserva */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Detalhes da Reserva</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quadra">Quadra *</Label>
                {isEditing ? (
                  <select
                    id="quadra"
                    value={formData.quadra}
                    onChange={(e) => handleChange("quadra", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    required
                  >
                    <option value="">Selecione uma quadra</option>
                    {quadras.map(quadra => (
                      <option key={quadra} value={quadra}>
                        {quadra}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input value={formData.quadra} disabled />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario">Horário *</Label>
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleChange("horario", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (horas) *</Label>
                <Input
                  id="duracao"
                  type="number"
                  min="1"
                  value={formData.duracao}
                  onChange={(e) => handleChange("duracao", parseInt(e.target.value))}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleChange("valor", parseFloat(e.target.value))}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Observações</h3>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              disabled={!isEditing}
              placeholder="Observações sobre a reserva..."
              rows={3}
            />
          </div>

          {/* Motivo Cancelamento */}
          {formData.status === "cancelada" && formData.motivoCancelamento && (
            <div className="space-y-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h3 className="font-semibold text-destructive">Motivo do Cancelamento</h3>
              <p className="text-sm">{formData.motivoCancelamento}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <div className="flex gap-2">
              {mode === "view" && formData.status !== "cancelada" && (
                <>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pagamento
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowMessageDialog(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mensagem
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                {isEditing ? "Cancelar" : "Fechar"}
              </Button>
              
              {mode === "view" && formData.status !== "cancelada" && (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
              
              {isEditing && (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
