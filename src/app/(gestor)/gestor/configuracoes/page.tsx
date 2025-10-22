"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Clock, CreditCard, MessageSquare, Bell, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ConfiguracoesPage() {
  const configSections = [
    {
      title: "Reservas",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10",
      settings: [
        { label: "Antecedência mínima para reservas", value: "1", unit: "hora(s)" },
        { label: "Antecedência máxima para reservas", value: "30", unit: "dias" },
        { label: "Tempo limite para confirmação", value: "2", unit: "hora(s)" },
        { label: "Cancelamento gratuito até", value: "24", unit: "hora(s)" }
      ]
    },
    {
      title: "Pagamentos",
      icon: CreditCard,
      color: "text-success",
      bgColor: "bg-success/10",
      settings: [
        { label: "Taxa de conveniência (%)", value: "3.5", unit: "%" },
        { label: "Valor mínimo para reserva", value: "50", unit: "R$" },
        { label: "Dia de cobrança mensalista", value: "25", unit: "dia do mês" },
        { label: "Desconto mensalista (%)", value: "15", unit: "%" }
      ]
    },
    {
      title: "Notificações",
      icon: Bell,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      settings: [
        { label: "Lembrete antes do jogo", value: "45", unit: "minutos" },
        { label: "Lembrete final", value: "10", unit: "minutos" },
        { label: "Avaliação após o jogo", value: "60", unit: "minutos" },
        { label: "Cobrança mensalista", value: "3", unit: "dias antes" }
      ]
    }
  ];

  const toggleSettings = [
    { label: "Permitir reservas recorrentes", enabled: true },
    { label: "Permitir pagamento via Pix", enabled: true },
    { label: "Permitir pagamento via cartão", enabled: true },
    { label: "Enviar notificações WhatsApp", enabled: true },
    { label: "Permitir convites públicos", enabled: true },
    { label: "Sistema de avaliações", enabled: true },
    { label: "Programa de indicação", enabled: false },
    { label: "Modo manutenção", enabled: false }
  ];

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configurações do Sistema
          </h1>
          <p className="body-medium text-muted-foreground">
            Configure parâmetros gerais da arena
          </p>
        </div>
        
        <Button>Salvar Alterações</Button>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-8">
        {configSections.map((section, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${section.bgColor} flex items-center justify-center`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="space-y-2">
                    <Label>{setting.label}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        defaultValue={setting.value}
                        className="flex-1"
                      />
                      <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                        {setting.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toggle Settings */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {toggleSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <Label className="font-medium">{setting.label}</Label>
                <Switch defaultChecked={setting.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Templates */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-success" />
            </div>
            Templates de Mensagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Lembrete antes do jogo</Label>
              <textarea
                className="w-full p-3 border border-border rounded-lg h-20"
                defaultValue="Oi {nome}! Seu jogo começa às {horario}. Não esqueça da chuteira society! 🏟️"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Confirmação de reserva</Label>
              <textarea
                className="w-full p-3 border border-border rounded-lg h-20"
                defaultValue="Reserva confirmada! {quadra} no dia {data} às {horario}. Valor: {valor}. Nos vemos lá! ⚽"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Aceite de convite</Label>
              <textarea
                className="w-full p-3 border border-border rounded-lg h-20"
                defaultValue="{nome} aceitou seu convite para jogar! Agora vocês são {total} confirmados. 🎉"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Avaliação pós-jogo</Label>
              <textarea
                className="w-full p-3 border border-border rounded-lg h-20"
                defaultValue="Como foi o jogo de hoje? Sua opinião é importante! Avalie: {link_avaliacao}"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3">Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versão:</span>
                <span className="font-medium">2.0.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização:</span>
                <span className="font-medium">20/12/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Banco de dados:</span>
                <span className="font-medium">PostgreSQL 15</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-medium">15 dias, 8h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de usuários:</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reservas hoje:</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button>Salvar Configurações</Button>
        <Button variant="outline">Restaurar Padrões</Button>
        <Button variant="outline">Backup do Sistema</Button>
      </div>
    </div>
  );
}