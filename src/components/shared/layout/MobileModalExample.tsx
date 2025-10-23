"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MobileModal } from "./MobileModal";
import { Save, Plus } from "lucide-react";

export function MobileModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleSave = () => {
    console.log("Salvando:", formData);
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      <Button 
        onClick={() => setIsOpen(true)}
        className="mobile-button"
      >
        <Plus className="w-4 h-4 mr-2" />
        Abrir Modal Mobile
      </Button>

      <MobileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Novo Item"
        actions={
          <Button 
            onClick={handleSave}
            size="sm"
            className="mobile-button-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        }
      >
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título"
              className="mobile-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mobile-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Digite a descrição"
              rows={4}
              className="mobile-input resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleSave}
              className="mobile-button w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Item
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mobile-button w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </MobileModal>
    </div>
  );
}