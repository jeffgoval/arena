import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import {
  Crown,
  Calendar,
  Clock,
  CreditCard,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Settings as SettingsIcon,
  Zap,
  Gift,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Plan } from "./SubscriptionPlans";

interface SubscriptionManagementProps {
  currentPlan: Plan;
  onBack: () => void;
  onChangePlan: () => void;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  planName: string;
  downloadUrl: string;
}

export function SubscriptionManagement({
  currentPlan,
  onBack,
  onChangePlan,
}: SubscriptionManagementProps) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);

  // Mock data
  const subscriptionData = {
    startDate: "01/10/2025",
    renewDate: "01/11/2025",
    hoursUsed: 5.5,
    hoursTotal: parseInt(currentPlan.features[0].value || "0"),
    daysRemaining: 17,
    status: "active" as const,
  };

  const invoices: Invoice[] = [
    {
      id: "INV-2025-10",
      date: "01/10/2025",
      amount: currentPlan.price,
      status: "paid",
      planName: currentPlan.name,
      downloadUrl: "#",
    },
    {
      id: "INV-2025-09",
      date: "01/09/2025",
      amount: currentPlan.price,
      status: "paid",
      planName: currentPlan.name,
      downloadUrl: "#",
    },
    {
      id: "INV-2025-08",
      date: "01/08/2025",
      amount: currentPlan.price,
      status: "paid",
      planName: currentPlan.name,
      downloadUrl: "#",
    },
  ];

  const handleCancelSubscription = () => {
    toast.loading("Cancelando assinatura...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Assinatura cancelada. Válida até " + subscriptionData.renewDate);
      setAutoRenew(false);
      setShowCancelDialog(false);
    }, 1500);
  };

  const handleRenewSubscription = () => {
    toast.loading("Processando renovação...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Assinatura renovada com sucesso!");
      setAutoRenew(true);
      setShowRenewDialog(false);
    }, 1500);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Fatura ${invoiceId} baixada com sucesso!`);
  };

  const hoursPercentage = (subscriptionData.hoursUsed / subscriptionData.hoursTotal) * 100;
  const Icon = currentPlan.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <SettingsIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl">Gerenciar Assinatura</h1>
              <p className="text-muted-foreground">
                Acompanhe e gerencie seu plano {currentPlan.name}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2">
                <CardHeader className={currentPlan.bgColor}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-10 w-10 ${currentPlan.color}`} />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Plano {currentPlan.name}
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Desde {subscriptionData.startDate}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">R$ {currentPlan.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">/mês</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Usage Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Horas Utilizadas</Label>
                      <span className="text-sm font-medium">
                        {subscriptionData.hoursUsed} / {subscriptionData.hoursTotal}h
                      </span>
                    </div>
                    <Progress value={hoursPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(subscriptionData.hoursTotal - subscriptionData.hoursUsed).toFixed(1)}h
                      restantes neste ciclo
                    </p>
                  </div>

                  <Separator />

                  {/* Renewal Info */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Próxima Renovação</p>
                      <p className="text-sm text-muted-foreground">
                        {subscriptionData.renewDate} ({subscriptionData.daysRemaining} dias)
                      </p>
                    </div>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {subscriptionData.daysRemaining}d
                    </Badge>
                  </div>

                  {/* Auto-Renew Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label htmlFor="auto-renew">Renovação Automática</Label>
                        <p className="text-xs text-muted-foreground">
                          Renove automaticamente no final do ciclo
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="auto-renew"
                      checked={autoRenew}
                      onCheckedChange={(checked) => {
                        setAutoRenew(checked);
                        toast.success(
                          checked
                            ? "Renovação automática ativada"
                            : "Renovação automática desativada"
                        );
                      }}
                    />
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button onClick={onChangePlan} className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Alterar Plano
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowRenewDialog(true)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renovar Agora
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Assinatura
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Invoices History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Histórico de Faturas
                  </CardTitle>
                  <CardDescription>
                    Suas últimas faturas e pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.map((invoice, index) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{invoice.id}</p>
                              <p className="text-sm text-muted-foreground">
                                Plano {invoice.planName} • {invoice.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-medium">
                                R$ {invoice.amount.toFixed(2)}
                              </p>
                              <Badge
                                variant={
                                  invoice.status === "paid"
                                    ? "default"
                                    : invoice.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {invoice.status === "paid"
                                  ? "Pago"
                                  : invoice.status === "pending"
                                  ? "Pendente"
                                  : "Falhou"}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Benefícios Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentPlan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{benefit}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Referral Program */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    Programa de Indicação
                  </CardTitle>
                  <CardDescription>
                    Ganhe benefícios indicando amigos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-2">
                      Suas indicações
                    </p>
                    <p className="text-3xl">2 / 3</p>
                    <Progress value={66} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Mais 1 indicação para ganhar 1 mês grátis!
                    </p>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Indicar Amigos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estatísticas do Mês</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Jogos realizados
                    </span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Economia total
                    </span>
                    <span className="font-medium text-success">R$ 48,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Horas acumuladas
                    </span>
                    <span className="font-medium">2.5h</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center">
                        <span className="text-white text-xs">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">•••• 4242</p>
                        <p className="text-xs text-muted-foreground">
                          Expira 12/26
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Alterar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancelar Assinatura?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Você tem certeza que deseja cancelar sua assinatura do plano{" "}
                  {currentPlan.name}?
                </p>
                <p className="font-medium">
                  Você continuará tendo acesso até {subscriptionData.renewDate} e
                  ainda tem {(subscriptionData.hoursTotal - subscriptionData.hoursUsed).toFixed(1)}h
                  para usar.
                </p>
                <p className="text-destructive">
                  Após o cancelamento, você perderá todos os benefícios do plano.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter Assinatura</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sim, Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Renew Subscription Dialog */}
      <AlertDialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Renovar Assinatura Agora?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Deseja renovar sua assinatura do plano {currentPlan.name} agora?
                </p>
                <p>
                  O valor de R$ {currentPlan.price.toFixed(2)} será cobrado e você
                  ganhará mais {subscriptionData.hoursTotal}h para usar.
                </p>
                <p className="text-success font-medium">
                  Suas horas atuais ({(subscriptionData.hoursTotal - subscriptionData.hoursUsed).toFixed(1)}h)
                  serão acumuladas!
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenewSubscription}>
              Renovar Agora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
