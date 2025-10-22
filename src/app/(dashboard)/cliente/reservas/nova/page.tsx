"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function NovaReservaPage() {
  return (
    <div className="container-custom page-padding space-y-8">
      <div>
        <h1 className="heading-2">Nova Reserva</h1>
        <p className="body-medium text-muted-foreground">Reserve uma quadra para seu jogo</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Detalhes da Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Data do Jogo</Label>
              <Input type="date" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Horário Início</Label>
                <Input type="time" defaultValue="19:00" />
              </div>
              <div className="space-y-2">
                <Label>Horário Fim</Label>
                <Input type="time" defaultValue="20:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quadra</Label>
              <select className="w-full p-3 border border-border rounded-lg">
                <option>Quadra Society 1</option>
                <option>Quadra Society 2</option>
                <option>Quadra Futsal</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <textarea 
                className="w-full p-3 border border-border rounded-lg h-20"
                placeholder="Informações adicionais sobre o jogo..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="heading-3">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Quadra Society 1</span>
                <span className="font-semibold">R$ 80,00</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 hora</span>
                <span>19:00 - 20:00</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">R$ 80,00</span>
              </div>
            </div>

            <Button className="w-full">Confirmar Reserva</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}