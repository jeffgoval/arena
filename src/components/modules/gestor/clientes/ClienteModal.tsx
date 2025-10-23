"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  cadastro?: string;
  ultimoJogo?: string;
  totalJogos?: number;
  saldo?: number;
  status?: "ativo" | "devedor" | "novo" | "inativo";
  observacoes?: string;
}

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  mode: "view" | "edit" | "create";
  onSave: (cliente: Cliente) => void;
  onDelete?: (clienteId: string) => void;
}

export function ClienteModal({ isOpen, onClose, cliente, mode, onSave, onDelete }: ClienteModalProps) {
  const [formData, setFormData] = useState<Cliente>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: {},
    observacoes: "",
    status: "novo"
  });
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    } else {
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dataNascimento: "",
        endereco: {},
        observacoes: "",
        status: "novo"
      });
    }
    setCurrentMode(mode);
  }, [cliente, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cliente?.id || !onDelete) return;
    
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        onDelete(cliente.id);
        onClose();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isViewMode = currentMode === "view";
  const isCreateMode = currentMode === "create";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {isCreateMode ? "Novo Cliente" : isViewMode ? "Detalhes do Cliente" : "Editar Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-primary" />
              Dados Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="João da Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf || ""}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  disabled={isViewMode}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento || ""}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
              <Mail className="w-4 h-4 text-primary" />
              Contato
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="joao@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="(33) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Endereço
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.endereco?.cep || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, cep: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="00000-000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  value={formData.endereco?.logradouro || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, logradouro: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="Rua, Avenida, etc"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.endereco?.numero || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, numero: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.endereco?.complemento || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, complemento: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="Apto, Bloco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.endereco?.bairro || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, bairro: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="Centro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.endereco?.cidade || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, cidade: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="Governador Valadares"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.endereco?.estado || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, estado: e.target.value }
                  })}
                  disabled={isViewMode}
                  placeholder="MG"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          {/* Status e Informações */}
          {!isCreateMode && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
                <Calendar className="w-4 h-4 text-primary" />
                Informações
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  {isViewMode ? (
                    <div>
                      <Badge variant={formData.status === "ativo" ? "default" : "secondary"}>
                        {formData.status}
                      </Badge>
                    </div>
                  ) : (
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="devedor">Devedor</option>
                      <option value="novo">Novo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Total de Jogos</Label>
                  <p className="text-lg font-semibold">{formData.totalJogos || 0}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Saldo</Label>
                  <p className={`text-lg font-semibold ${
                    (formData.saldo || 0) > 0 ? 'text-success' : 
                    (formData.saldo || 0) < 0 ? 'text-destructive' : ''
                  }`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(formData.saldo || 0)}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Último Jogo</Label>
                  <p className="text-sm">
                    {formData.ultimoJogo ? new Date(formData.ultimoJogo).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              disabled={isViewMode}
              placeholder="Informações adicionais sobre o cliente..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            {isViewMode ? (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button type="button" onClick={() => setCurrentMode("edit")}>
                  Editar
                </Button>
              </>
            ) : (
              <>
                {!isCreateMode && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                    className="mr-auto"
                  >
                    Excluir
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
