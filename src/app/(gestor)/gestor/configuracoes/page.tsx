"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Clock, CreditCard, MessageSquare, Bell, Shield, DollarSign, XCircle, Gift, Percent, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useConfiguracoes,
  useSaveConfiguracoes,
  useRestaurarConfiguracoespadrao,
  useTemplates,
  useSaveTemplates,
} from "@/hooks/core/useConfiguracoes";
import type { Configuracoes, ConfiguracoesTemplate } from "@/services/core/configuracoes.service";

export default function ConfiguracoesPage() {
  const { data: config, isLoading } = useConfiguracoes();
  const { data: templates, isLoading: loadingTemplates } = useTemplates();
  const saveConfig = useSaveConfiguracoes();
  const saveTemplates = useSaveTemplates();
  const restaurar = useRestaurarConfiguracoespadrao();

  // Estados locais para edição
  const [localConfig, setLocalConfig] = useState<Partial<Configuracoes>>({});
  const [localTemplates, setLocalTemplates] = useState<Partial<ConfiguracoesTemplate>>({});

  // Sincronizar com dados carregados
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  useEffect(() => {
    if (templates) {
      setLocalTemplates(templates);
    }
  }, [templates]);

  const handleSave = () => {
    saveConfig.mutate(localConfig);
  };

  const handleSaveTemplates = () => {
    saveTemplates.mutate(localTemplates);
  };

  const handleRestore = () => {
    restaurar.mutate();
  };

  const updateConfig = (key: keyof Configuracoes, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateTemplate = (key: keyof ConfiguracoesTemplate, value: string) => {
    setLocalTemplates(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading || loadingTemplates) {
    return (
      <div className="container-custom page-padding flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

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
          <Button
            variant="outline"
            onClick={handleRestore}
            disabled={restaurar.isPending}
          >
            {restaurar.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Restaurar Padrões
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveConfig.isPending}
          >
            {saveConfig.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
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
                      value={localConfig.antecedencia_minima || 0}
                      onChange={(e) => updateConfig('antecedencia_minima', parseInt(e.target.value))}
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
                      value={localConfig.antecedencia_maxima || 0}
                      onChange={(e) => updateConfig('antecedencia_maxima', parseInt(e.target.value))}
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
                      value={localConfig.dia_vencimento || 0}
                      onChange={(e) => updateConfig('dia_vencimento', parseInt(e.target.value))}
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
                      value={localConfig.hora_limite_reserva || 0}
                      onChange={(e) => updateConfig('hora_limite_reserva', parseInt(e.target.value))}
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
                        value={localConfig.lembrete_antes || 0}
                        onChange={(e) => updateConfig('lembrete_antes', parseInt(e.target.value))}
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
                        value={localConfig.lembrete_final || 0}
                        onChange={(e) => updateConfig('lembrete_final', parseInt(e.target.value))}
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
                    <Switch
                      checked={localConfig.notif_whatsapp || false}
                      onCheckedChange={(checked) => updateConfig('notif_whatsapp', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="font-medium">Notificações Email</Label>
                      <p className="text-xs text-muted-foreground">Enviar emails automáticos</p>
                    </div>
                    <Switch
                      checked={localConfig.notif_email || false}
                      onCheckedChange={(checked) => updateConfig('notif_email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="font-medium">Notificações SMS</Label>
                      <p className="text-xs text-muted-foreground">Enviar SMS (custo adicional)</p>
                    </div>
                    <Switch
                      checked={localConfig.notif_sms || false}
                      onCheckedChange={(checked) => updateConfig('notif_sms', checked)}
                    />
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
                  <Switch
                    checked={localConfig.permite_cancelamento || false}
                    onCheckedChange={(checked) => updateConfig('permite_cancelamento', checked)}
                  />
                </div>

                {localConfig.permite_cancelamento && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cancelamentoGratuito">Cancelamento Gratuito Até</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cancelamentoGratuito"
                          type="number"
                          value={localConfig.cancelamento_gratuito || 0}
                          onChange={(e) => updateConfig('cancelamento_gratuito', parseInt(e.target.value))}
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
                          value={localConfig.reembolso_total || 0}
                          onChange={(e) => updateConfig('reembolso_total', parseInt(e.target.value))}
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
                          value={localConfig.multa_cancelamento || 0}
                          onChange={(e) => updateConfig('multa_cancelamento', parseInt(e.target.value))}
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
                          <strong>Até {localConfig.cancelamento_gratuito || 0}h antes:</strong> Reembolso total (R$ 150,00)
                        </p>
                        <p className="text-sm text-warning">
                          <strong>Após {localConfig.cancelamento_gratuito || 0}h:</strong> Multa de {localConfig.multa_cancelamento || 0}% (R$ {(150 * (localConfig.multa_cancelamento || 0) / 100).toFixed(2)})
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
                  <Switch
                    checked={localConfig.pagamento_pix || false}
                    onCheckedChange={(checked) => updateConfig('pagamento_pix', checked)}
                  />
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
                  <Switch
                    checked={localConfig.pagamento_cartao || false}
                    onCheckedChange={(checked) => updateConfig('pagamento_cartao', checked)}
                  />
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
                  <Switch
                    checked={localConfig.pagamento_dinheiro || false}
                    onCheckedChange={(checked) => updateConfig('pagamento_dinheiro', checked)}
                  />
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
                  <Switch
                    checked={localConfig.pagamento_transferencia || false}
                    onCheckedChange={(checked) => updateConfig('pagamento_transferencia', checked)}
                  />
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
                      value={localConfig.taxa_conveniencia || 0}
                      onChange={(e) => updateConfig('taxa_conveniencia', parseFloat(e.target.value))}
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
                      value={localConfig.valor_minimo || 0}
                      onChange={(e) => updateConfig('valor_minimo', parseFloat(e.target.value))}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEMPLATES DE MENSAGENS */}
        <TabsContent value="mensagens" className="space-y-6 mt-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="heading-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-success" />
                  </div>
                  Templates de Mensagens WhatsApp
                </CardTitle>
                <Button
                  onClick={handleSaveTemplates}
                  disabled={saveTemplates.isPending}
                  variant="outline"
                >
                  {saveTemplates.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Salvar Templates
                </Button>
              </div>
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
                    value={localTemplates.template_confirmacao || ''}
                    onChange={(e) => updateTemplate('template_confirmacao', e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateLembrete">Lembrete Antes do Jogo</Label>
                  <Textarea
                    id="templateLembrete"
                    value={localTemplates.template_lembrete || ''}
                    onChange={(e) => updateTemplate('template_lembrete', e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateConvite">Convite para Jogo</Label>
                  <Textarea
                    id="templateConvite"
                    value={localTemplates.template_convite || ''}
                    onChange={(e) => updateTemplate('template_convite', e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateCancelamento">Cancelamento de Reserva</Label>
                  <Textarea
                    id="templateCancelamento"
                    value={localTemplates.template_cancelamento || ''}
                    onChange={(e) => updateTemplate('template_cancelamento', e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateAvaliacao">Solicitação de Avaliação</Label>
                  <Textarea
                    id="templateAvaliacao"
                    value={localTemplates.template_avaliacao || ''}
                    onChange={(e) => updateTemplate('template_avaliacao', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
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
                      value={localConfig.desconto_mensalista || 0}
                      onChange={(e) => updateConfig('desconto_mensalista', parseFloat(e.target.value))}
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
                      value={localConfig.desconto_primeira_reserva || 0}
                      onChange={(e) => updateConfig('desconto_primeira_reserva', parseFloat(e.target.value))}
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
                      value={localConfig.desconto_recorrente || 0}
                      onChange={(e) => updateConfig('desconto_recorrente', parseFloat(e.target.value))}
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
                      value={localConfig.desconto_grupo || 0}
                      onChange={(e) => updateConfig('desconto_grupo', parseFloat(e.target.value))}
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
                      value={localConfig.minimo_participantes_desconto || 0}
                      onChange={(e) => updateConfig('minimo_participantes_desconto', parseInt(e.target.value))}
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
                      value={localConfig.bonus_indicacao || 0}
                      onChange={(e) => updateConfig('bonus_indicacao', parseFloat(e.target.value))}
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
                      value={localConfig.bonus_aniversario || 0}
                      onChange={(e) => updateConfig('bonus_aniversario', parseFloat(e.target.value))}
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
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          onClick={handleSave}
          size="lg"
          disabled={saveConfig.isPending}
        >
          {saveConfig.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Salvar Todas as Configurações
        </Button>
        <Button
          variant="outline"
          onClick={handleRestore}
          size="lg"
          disabled={restaurar.isPending}
        >
          {restaurar.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Restaurar Padrões
        </Button>
      </div>
    </div>
  );
}
