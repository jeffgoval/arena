"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";

export default function CriarTurmaPage() {
  return (
    <div className="container-custom page-padding space-y-8">
      <div>
        <h1 className="heading-2">Criar Nova Turma</h1>
        <p className="body-medium text-muted-foreground">Monte seu time fixo para facilitar as reservas</p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Informações da Turma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Nome da Turma *</Label>
              <Input placeholder="Ex: Time dos Amigos" />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <textarea 
                className="w-full p-3 border border-border rounded-lg h-20"
                placeholder="Descreva sua turma..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Membros da Turma</Label>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Membro
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input placeholder="Nome do jogador" />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input placeholder="(33) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <select className="w-full p-3 border border-border rounded-lg">
                        <option>Fixo</option>
                        <option>Variável</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1">Cancelar</Button>
              <Button className="flex-1">Criar Turma</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}