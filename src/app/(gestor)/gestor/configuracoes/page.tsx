"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Clock, CreditCard, MessageSquare, Bell, Shield, DollarSign, XCircle, Gift, Percent } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function ConfiguracoesPage() {
  const { toast } = useToast();

  // Parâmetros do Sistema
  const [antecedenciaMinima, setAntecedenciaMinima] = useState("2");
  const [antecedenciaMaxima, setAntecedenciaMaxima] = useState("30");
  const [diaVencimento, setDiaVencimento] = useState("25");
  const [horaLimiteReserva, setHoraLimiteReserva] = useState("22");

  // Política de Cancelamento
  const [cancelamentoGratuito, setCancelamentoGratuito] = useState("24");
  const [multaCancelamento, setMultaCancelamento] = useState("30");
  const [reembolsoTotal, setReembolsoTotal] = useState("48");
  const [permiteCancelamento, setPermiteCancelamento] = useState(true);

  // Formas de Pagamento
  const [pagamentoPix, setPagamentoPix] = useState(true);
  const [pagamentoCartao, setPagamentoCartao] = useState(true);
  const [pagamentoDinheiro, setPagamentoDinheiro] = useState(true);
  const [pagamentoTransferencia, setPagamentoTransferencia] = useState(true);
  const [taxaConveniencia, setTaxaConveniencia] = useState("3.5");
  const [valorMinimo, setValorMinimo] = useState("50");

  // Templates WhatsApp
  const [templateConfirmacao, setTemplateConfirmacao] = useState(
    "✅ Reserva confirmada!\n\n📍 {quadra}\n📅 {data} às {horario}\n💰 Valor: {valor}\n\nNos vemos lá! ⚽"
  );
  const [templateLembrete, setTemplateLembrete] = useState(
    "⏰ Oi {nome}! Seu jogo começa em {tempo}.\n\n📍 {quadra}\n🕐 {horario}\n\nNão esqueça da chuteira! 🏟️"
  );
  const [templateConvite, setTemplateConvite] = useState(
    "🎉 {organizador} te convidou para jogar!\n\n📍 {quadra}\n📅 {data} às {horario}\n👥 {participantes} confirmados\n\nAceitar: {link}"
  );
  const [templateCancelamento, setTemplateCancelamento] = useState(
    "❌ Reserva cancelada\n\n📍 {quadra}\n📅 {data} às {horario}\n\nMotivo: {motivo}\n💰 Reembolso: {valor}"
  );
  const [templateAvaliacao, setTemplateAvaliacao] = useState(
    "⭐ Como foi o jogo de hoje?\n\nSua opinião é importante!\nAvalie: {link}"
  );

  // Descontos e Bônus
  const [descontoMensalista, setDescontoMensalista] = useState("15");
  const [descontoPrimeiraReserva, setDescontoPrimeiraReserva] = useState("10");
  const [bonusIndicacao, setBonusIndicacao] = useState("20");
  const [descontoRecorrente, setDescontoRecorrente] = useState("5");
  const [bonusAniversario, setBonusAniversario] = useState("50");
  const [descontoGrupo, setDescontoGrupo] = useState("8");
  const [minimoParticipantesDesconto, setMinimoParticipantesDesconto] = useState("10");

  // Notificações
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [lembreteAntes, setLembreteAntes] = useState("45");
  const [lembreteFinal, setLembreteFinal] = useState("10");

  const handleSave = () => {
    toast({
      title: "Configurações Salvas",
      description: "Todas as alterações foram salvas com sucesso!"
    });
  };

  const handleRestore = () => {
    toast({
      title: "Configurações Restauradas",
      description: "Valores padrão foram restaurados",
      variant: "default"
    });
  };

  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configurações do Sistema
          </h1>
          <p className="body-medium text-muted-foreground">
            Configure parâmetros gerais da arena
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRestore}>
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="parametros" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
          <TabsTrigger value="cancelamento">Cancelamento</TabsTrigger>
          <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="descontos">Descontos</TabsTrigger>
        </TabsList>

        {/* PARÂMETROS DO SISTEMA */}
        <TabsContent value="parametros" className="space-y-6 mt-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                Parâmetros de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="antecedenciaMinima">Antecedência Mínima para Reservas</Label>
                  <div className="flex gap-2">
                    <Input
                      id="antecedenciaMinima"
                      type="number"
                      value={antecedenciaMinima}
                      onChange={(e) => setAntecedenciaMinima(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      hora(s)
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tempo mínimo de antecedência para fazer uma reserva
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="antecedenciaMaxima">Antecedência Máxima para Reservas</Label>
                  <div className="flex gap-2">
                    <Input
                      id="antecedenciaMaxima"
                      type="number"
                      value={antecedenciaMaxima}
                      onChange={(e) => setAntecedenciaMaxima(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      dia(s)
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quantos dias no futuro é possível reservar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diaVencimento">Dia de Vencimento (Mensalistas)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="diaVencimento"
                      type="number"
                      min="1"
                      max="31"
                      value={diaVencimento}
                      onChange={(e) => setDiaVencimento(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      dia do mês
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dia do mês para cobrança de mensalidades
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaLimite">Horário Limite para Reservas</Label>
                  <div className="flex gap-2">
                    <Input
                      id="horaLimite"
                      type="number"
                      min="0"
                      max="23"
                      value={horaLimiteReserva}
                      onChange={(e) => setHoraLimiteReserva(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      horas
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última hora do dia disponível para reservas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lembreteAntes">Lembrete Antes do Jogo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="lembreteAntes"
                        type="number"
                        value={lembreteAntes}
                        onChange={(e) => setLembreteAntes(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                        minutos
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lembreteFinal">Lembrete Final</Label>
                    <div className="flex gap-2">
                      <Input
                        id="lembreteFinal"
                        type="number"
                        value={lembreteFinal}
                        onChange={(e) => setLembreteFinal(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                        minutos
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="font-medium">Notificações WhatsApp</Label>
                      <p className="text-xs text-muted-foreground">Enviar mensagens via WhatsApp</p>
                    </div>
                    <Switch checked={notifWhatsApp} onCheckedChange={setNotifWhatsApp} />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="font-medium">Notificações Email</Label>
                      <p className="text-xs text-muted-foreground">Enviar emails automáticos</p>
                    </div>
                    <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="font-medium">Notificações SMS</Label>
                      <p className="text-xs text-muted-foreground">Enviar SMS (custo adicional)</p>
                    </div>
                    <Switch checked={notifSMS} onCheckedChange={setNotifSMS} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* POLÍTICA DE CANCELAMENTO */}
        <TabsContent value="cancelamento" className="space-y-6 mt-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                Política de Cancelamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="font-medium">Permitir Cancelamento de Reservas</Label>
                    <p className="text-xs text-muted-foreground">Clientes podem cancelar suas reservas</p>
                  </div>
                  <Switch checked={permiteCancelamento} onCheckedChange={setPermiteCancelamento} />
                </div>

                {permiteCancelamento && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cancelamentoGratuito">Cancelamento Gratuito Até</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cancelamentoGratuito"
                          type="number"
                          value={cancelamentoGratuito}
                          onChange={(e) => setCancelamentoGratuito(e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                          hora(s) antes
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cancelamento sem multa até este prazo
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reembolsoTotal">Reembolso Total Até</Label>
                      <div className="flex gap-2">
                        <Input
                          id="reembolsoTotal"
                          type="number"
                          value={reembolsoTotal}
                          onChange={(e) => setReembolsoTotal(e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                          hora(s) antes
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reembolso de 100% do valor pago
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="multaCancelamento">Multa de Cancelamento</Label>
                      <div className="flex gap-2">
                        <Input
                          id="multaCancelamento"
                          type="number"
                          value={multaCancelamento}
                          onChange={(e) => setMultaCancelamento(e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                          % do valor
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Percentual cobrado após o prazo gratuito
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Exemplo de Cálculo</Label>
                      <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                        <p className="text-sm">
                          <strong>Reserva:</strong> R$ 150,00
                        </p>
                        <p className="text-sm text-success">
                          <strong>Até {cancelamentoGratuito}h antes:</strong> Reembolso total (R$ 150,00)
                        </p>
                        <p className="text-sm text-warning">
                          <strong>Após {cancelamentoGratuito}h:</strong> Multa de {multaCancelamento}% (R$ {(150 * parseFloat(multaCancelamento) / 100).toFixed(2)})
                        </p>
                        <p className="text-sm text-destructive">
                          <strong>Menos de 2h antes:</strong> Sem reembolso
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Regras Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <Label className="font-medium mb-2 block">Cancelamento por Condições Climáticas</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Em caso de chuva forte ou condições adversas, o cancelamento é gratuito com reembolso total.
                  </p>
                  <Badge variant="outline">Reembolso: 100%</Badge>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <Label className="font-medium mb-2 block">Cancelamento por Manutenção</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Se a arena cancelar por manutenção, o cliente recebe reembolso total + crédito de 10%.
                  </p>
                  <Badge variant="outline">Reembolso: 100% + 10% crédito</Badge>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <Label className="font-medium mb-2 block">No-Show (Não Comparecimento)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cliente que não comparecer sem cancelar perde o valor total e pode ter restrições.
                  </p>
                  <Badge variant="destructive">Sem reembolso</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FORMAS DE PAGAMENTO */}
        <TabsContent value="pagamento" className="space-y-6 mt-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-success" />
                </div>
                Formas de Pagamento Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <Label className="font-medium">PIX</Label>
                      <p className="text-xs text-muted-foreground">Pagamento instantâneo</p>
                    </div>
                  </div>
                  <Switch checked={pagamentoPix} onCheckedChange={setPagamentoPix} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <Label className="font-medium">Cartão de Crédito/Débito</Label>
                      <p className="text-xs text-muted-foreground">Visa, Master, Elo</p>
                    </div>
                  </div>
                  <Switch checked={pagamentoCartao} onCheckedChange={setPagamentoCartao} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💵</span>
                    </div>
                    <div>
                      <Label className="font-medium">Dinheiro</Label>
                      <p className="text-xs text-muted-foreground">Pagamento presencial</p>
                    </div>
                  </div>
                  <Switch checked={pagamentoDinheiro} onCheckedChange={setPagamentoDinheiro} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏦</span>
                    </div>
                    <div>
                      <Label className="font-medium">Transferência Bancária</Label>
                      <p className="text-xs text-muted-foreground">TED/DOC</p>
                    </div>
                  </div>
                  <Switch checked={pagamentoTransferencia} onCheckedChange={setPagamentoTransferencia} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                Valores e Taxas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxaConveniencia">Taxa de Conveniência</Label>
                  <div className="flex gap-2">
                    <Input
                      id="taxaConveniencia"
                      type="number"
                      step="0.1"
                      value={taxaConveniencia}
                      onChange={(e) => setTaxaConveniencia(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      %
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Taxa cobrada em pagamentos online
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorMinimo">Valor Mínimo de Reserva</Label>
                  <div className="flex gap-2">
                    <Input
                      id="valorMinimo"
                      type="number"
                      value={valorMinimo}
                      onChange={(e) => setValorMinimo(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      R$
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor mínimo para criar uma reserva
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <Label className="font-medium mb-3 block">Exemplo de Cálculo</Label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor da Reserva:</span>
                    <span className="font-semibold">R$ 150,00</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxa de Conveniência ({taxaConveniencia}%):</span>
                    <span>R$ {(150 * parseFloat(taxaConveniencia) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t text-lg font-bold">
                    <span>Total a Pagar:</span>
                    <span className="text-success">R$ {(150 + (150 * parseFloat(taxaConveniencia) / 100)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEMPLATES DE MENSAGENS */}
        <TabsContent value="mensagens" className="space-y-6 mt-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-success" />
                </div>
                Templates de Mensagens WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-2">Variáveis Disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{"{nome}"}</Badge>
                    <Badge variant="outline">{"{quadra}"}</Badge>
                    <Badge variant="outline">{"{data}"}</Badge>
                    <Badge variant="outline">{"{horario}"}</Badge>
                    <Badge variant="outline">{"{valor}"}</Badge>
                    <Badge variant="outline">{"{participantes}"}</Badge>
                    <Badge variant="outline">{"{organizador}"}</Badge>
                    <Badge variant="outline">{"{tempo}"}</Badge>
                    <Badge variant="outline">{"{motivo}"}</Badge>
                    <Badge variant="outline">{"{link}"}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateConfirmacao">Confirmação de Reserva</Label>
                  <Textarea
                    id="templateConfirmacao"
                    value={templateConfirmacao}
                    onChange={(e) => setTemplateConfirmacao(e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviado quando uma reserva é confirmada
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateLembrete">Lembrete Antes do Jogo</Label>
                  <Textarea
                    id="templateLembrete"
                    value={templateLembrete}
                    onChange={(e) => setTemplateLembrete(e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviado {lembreteAntes} minutos antes do jogo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateConvite">Convite para Jogo</Label>
                  <Textarea
                    id="templateConvite"
                    value={templateConvite}
                    onChange={(e) => setTemplateConvite(e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviado quando um jogador é convidado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateCancelamento">Cancelamento de Reserva</Label>
                  <Textarea
                    id="templateCancelamento"
                    value={templateCancelamento}
                    onChange={(e) => setTemplateCancelamento(e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviado quando uma reserva é cancelada
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateAvaliacao">Solicitação de Avaliação</Label>
                  <Textarea
                    id="templateAvaliacao"
                    value={templateAvaliacao}
                    onChange={(e) => setTemplateAvaliacao(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviado após o jogo para solicitar avaliação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-3">Exemplo de Mensagem (Confirmação):</p>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <pre className="text-sm whitespace-pre-wrap">
                    {templateConfirmacao
                      .replace("{quadra}", "Society 1")
                      .replace("{data}", "20/12/2024")
                      .replace("{horario}", "19:00")
                      .replace("{valor}", "R$ 150,00")}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DESCONTOS E BÔNUS */}
        <TabsContent value="descontos" className="space-y-6 mt-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-success" />
                </div>
                Descontos Automáticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="descontoMensalista">Desconto Mensalista</Label>
                  <div className="flex gap-2">
                    <Input
                      id="descontoMensalista"
                      type="number"
                      value={descontoMensalista}
                      onChange={(e) => setDescontoMensalista(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      %
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desconto para clientes mensalistas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descontoPrimeiraReserva">Desconto Primeira Reserva</Label>
                  <div className="flex gap-2">
                    <Input
                      id="descontoPrimeiraReserva"
                      type="number"
                      value={descontoPrimeiraReserva}
                      onChange={(e) => setDescontoPrimeiraReserva(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      %
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desconto para novos clientes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descontoRecorrente">Desconto Reserva Recorrente</Label>
                  <div className="flex gap-2">
                    <Input
                      id="descontoRecorrente"
                      type="number"
                      value={descontoRecorrente}
                      onChange={(e) => setDescontoRecorrente(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      %
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desconto para reservas semanais fixas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descontoGrupo">Desconto para Grupos</Label>
                  <div className="flex gap-2">
                    <Input
                      id="descontoGrupo"
                      type="number"
                      value={descontoGrupo}
                      onChange={(e) => setDescontoGrupo(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      %
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desconto para grupos grandes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimoParticipantes">Mínimo de Participantes para Desconto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="minimoParticipantes"
                      type="number"
                      value={minimoParticipantesDesconto}
                      onChange={(e) => setMinimoParticipantesDesconto(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      pessoas
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quantidade mínima para desconto de grupo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-warning" />
                </div>
                Bônus e Promoções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bonusIndicacao">Bônus por Indicação</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bonusIndicacao"
                      type="number"
                      value={bonusIndicacao}
                      onChange={(e) => setBonusIndicacao(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      R$
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Crédito para quem indica novos clientes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonusAniversario">Bônus de Aniversário</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bonusAniversario"
                      type="number"
                      value={bonusAniversario}
                      onChange={(e) => setBonusAniversario(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-fit">
                      R$
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Crédito no mês de aniversário do cliente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3">Simulador de Descontos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-3">Exemplo: Reserva de R$ 150,00</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Cliente Mensalista ({descontoMensalista}%)</span>
                      <span className="font-semibold text-success">
                        R$ {(150 - (150 * parseFloat(descontoMensalista) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Primeira Reserva ({descontoPrimeiraReserva}%)</span>
                      <span className="font-semibold text-success">
                        R$ {(150 - (150 * parseFloat(descontoPrimeiraReserva) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Grupo {minimoParticipantesDesconto}+ pessoas ({descontoGrupo}%)</span>
                      <span className="font-semibold text-success">
                        R$ {(150 - (150 * parseFloat(descontoGrupo) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-background rounded">
                      <span>Reserva Recorrente ({descontoRecorrente}%)</span>
                      <span className="font-semibold text-success">
                        R$ {(150 - (150 * parseFloat(descontoRecorrente) / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-2">💡 Dica:</p>
                  <p className="text-sm text-muted-foreground">
                    Descontos não são cumulativos. O sistema aplica automaticamente o maior desconto disponível para o cliente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Button onClick={handleSave} size="lg">
          Salvar Todas as Configurações
        </Button>
        <Button variant="outline" onClick={handleRestore} size="lg">
          Restaurar Padrões
        </Button>
      </div>
    </div>
  );
}
