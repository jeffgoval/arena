"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Loader2 } from "lucide-react";

export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  observacoes?: string;
  status: "ativo" | "inativo" | "bloqueado";
}

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  mode: "view" | "edit" | "create";
  onSave: (cliente: Cliente) => void;
}

export function ClienteModal({ isOpen, onClose, cliente, mode, onSave }: ClienteModalProps) {
  const [formData, setFormData] = useState<Cliente>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: ""
    },
    observacoes: "",
    status: "ativo"
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(mode === "edit" || mode === "create");

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    }
    setIsEditing(mode === "edit" || mode === "create");
  }, [cliente, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(formData);
    setLoading(false);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    if (field.startsWith("endereco.")) {
      const enderecoField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "create" ? "Novo Cliente" : mode === "edit" ? "Editar Cliente" : "Detalhes do Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Dados Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  disabled={!isEditing}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleChange("dataNascimento", e.target.value)}
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
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Contato</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={formData.endereco.cep}
                  onChange={(e) => handleChange("endereco.cep", e.target.value)}
                  disabled={!isEditing}
                  placeholder="00000-000"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logradouro">Logradouro *</Label>
                <Input
                  id="logradouro"
                  value={formData.endereco.logradouro}
                  onChange={(e) => handleChange("endereco.logradouro", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.endereco.numero}
                  onChange={(e) => handleChange("endereco.numero", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.endereco.complemento}
                  onChange={(e) => handleChange("endereco.complemento", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleChange("endereco.bairro", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleChange("endereco.cidade", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  value={formData.endereco.estado}
                  onChange={(e) => handleChange("endereco.estado", e.target.value)}
                  disabled={!isEditing}
                  maxLength={2}
                  placeholder="MG"
                  required
                />
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
              placeholder="Observações sobre o cliente..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              {isEditing ? "Cancelar" : "Fechar"}
            </Button>
            
            {mode === "view" && (
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
