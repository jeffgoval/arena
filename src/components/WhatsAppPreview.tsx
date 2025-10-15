import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCheck,
  Edit,
  Send,
  X,
  Bell,
  Link as LinkIcon,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../lib/clipboard";
import { TEMPLATE_VARIABLES } from "../data/mockData";

interface WhatsAppPreviewProps {
  message?: string;
  bookingDetails?: {
    court: string;
    date: string;
    time: string;
    duration: string;
    price: number;
  };
  customerName?: string;
  customerPhone?: string;
  onClose?: () => void;
  onSend?: () => void;
}

export function WhatsAppPreview({
  message,
  bookingDetails,
  customerName = "João Silva",
  customerPhone = "+55 11 98765-4321",
  onClose,
  onSend,
}: WhatsAppPreviewProps) {
  // If message is provided directly (template mode), use simplified preview
  if (message && !bookingDetails) {
    // Replace template variables with examples
    let previewMessage = message;
    TEMPLATE_VARIABLES.forEach((variable) => {
      previewMessage = previewMessage.replaceAll(variable.key, variable.example);
    });

    return (
      <div className="bg-[#E5DDD5] rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto relative">
        {/* WhatsApp Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23000' fill-opacity='0.05'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Message Bubble */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg rounded-tl-none shadow-md p-3 mb-2 relative max-w-[90%]"
          >
            {/* Message Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-medium">AS</span>
              </div>
              <div>
                <p className="text-xs font-medium">Arena Dona Santa</p>
                <p className="text-xs text-muted-foreground">Empresa Verificada ✓</p>
              </div>
            </div>

            {/* Message Content */}
            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {previewMessage}
            </div>

            {/* Message Footer */}
            <div className="flex items-center justify-end gap-1 mt-2 text-xs text-muted-foreground">
              <span>14:32</span>
              <CheckCheck className="h-4 w-4 text-[#25D366]" />
            </div>

            {/* Message Tail */}
            <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-white border-r-[10px] border-r-transparent" />
          </motion.div>
        </div>
      </div>
    );
  }

  // Booking details mode - ensure bookingDetails exists
  if (!bookingDetails) {
    return null;
  }

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [reminderSettings, setReminderSettings] = useState({
    oneHourBefore: true,
    oneDayBefore: true,
    threeDaysBefore: false,
  });
  
  const defaultMessage = `🎾 *Reserva Confirmada - Arena Dona Santa*

Olá ${customerName.split(" ")[0]}! 👋

Sua reserva foi confirmada com sucesso!

📍 *Quadra:* ${bookingDetails.court}
📅 *Data:* ${bookingDetails.date}
🕐 *Horário:* ${bookingDetails.time}
⏱️ *Duração:* ${bookingDetails.duration}
💰 *Valor:* R$ ${bookingDetails.price.toFixed(2)}

✅ *Status:* CONFIRMADO E PAGO

🔗 *Adicionar ao Calendário:*
https://arena.com/calendar/add?id=RSV123

📱 *Detalhes da Reserva:*
https://arena.com/booking/RSV123

⚠️ *Política de Cancelamento:*
Cancelamentos com até 24h de antecedência: reembolso de 100%

Nos vemos em quadra! 🏟️

_Arena Dona Santa_
_Rua Exemplo, 123 - São Paulo_
_(11) 98765-4321_`;

  const [customMessage, setCustomMessage] = useState(defaultMessage);

  const handleSendMessage = () => {
    toast.loading("Enviando mensagem WhatsApp...");
    
    setTimeout(() => {
      toast.dismiss();
      toast.success("Mensagem enviada com sucesso para " + customerPhone);
      
      if (onSend) {
        onSend();
      }
    }, 1500);
  };

  const handleCopyMessage = async () => {
    const message = isCustomizing ? customMessage : defaultMessage;
    const success = await copyToClipboard(message);
    if (success) {
      toast.success("Mensagem copiada para a área de transferência!");
    } else {
      toast.error("Não foi possível copiar a mensagem");
    }
  };

  const handleDownloadVCard = () => {
    toast.success("Arquivo .ics baixado para adicionar ao calendário!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl my-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Confirmação por WhatsApp
                    <Badge className="bg-[#25D366]">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Entregue
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Preview da mensagem que será enviada para {customerName}
                  </CardDescription>
                </div>
              </div>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Preview da Mensagem</h3>
                  <div className="flex items-center gap-2">
                    {!isCustomizing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCustomizing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Personalizar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsCustomizing(false);
                          setCustomMessage(defaultMessage);
                        }}
                      >
                        Resetar
                      </Button>
                    )}
                  </div>
                </div>

                {/* WhatsApp Chat Simulator */}
                <div className="bg-[#E5DDD5] rounded-lg p-4 min-h-[500px] max-h-[600px] overflow-y-auto relative">
                  {/* WhatsApp Background Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23000' fill-opacity='0.05'/%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }} />
                  </div>

                  {/* Message Bubble */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg rounded-tl-none shadow-md p-3 mb-2 relative max-w-[90%]"
                    >
                      {/* Message Header */}
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs font-medium">AS</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium">Arena Dona Santa</p>
                          <p className="text-xs text-muted-foreground">Empresa Verificada ✓</p>
                        </div>
                      </div>

                      {/* Message Content */}
                      {isCustomizing ? (
                        <Textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="min-h-[400px] font-sans text-sm resize-none border-0 p-0 focus-visible:ring-0"
                        />
                      ) : (
                        <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {defaultMessage}
                        </div>
                      )}

                      {/* Message Footer */}
                      <div className="flex items-center justify-end gap-1 mt-2 text-xs text-muted-foreground">
                        <span>14:32</span>
                        <CheckCheck className="h-4 w-4 text-[#25D366]" />
                      </div>

                      {/* Message Tail */}
                      <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-white border-r-[10px] border-r-transparent" />
                    </motion.div>

                    {/* Action Buttons in Chat */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-lg shadow-sm p-3 mb-2 space-y-2 max-w-[90%]"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleDownloadVCard}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Adicionar ao Calendário
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Ver Detalhes da Reserva
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className="space-y-4">
                <h3 className="font-medium">Configurações de Envio</h3>

                {/* Recipient Info */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{customerName}</p>
                        <p className="text-xs text-muted-foreground">{customerPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Resumo da Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Quadra</p>
                        <p className="font-medium">{bookingDetails.court}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Data</p>
                        <p className="font-medium">{bookingDetails.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Horário</p>
                        <p className="font-medium">{bookingDetails.time} ({bookingDetails.duration})</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reminder Settings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Lembretes Automáticos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminder-1h" className="text-sm">
                        1 hora antes
                      </Label>
                      <Switch
                        id="reminder-1h"
                        checked={reminderSettings.oneHourBefore}
                        onCheckedChange={(checked) =>
                          setReminderSettings({ ...reminderSettings, oneHourBefore: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminder-1d" className="text-sm">
                        1 dia antes
                      </Label>
                      <Switch
                        id="reminder-1d"
                        checked={reminderSettings.oneDayBefore}
                        onCheckedChange={(checked) =>
                          setReminderSettings({ ...reminderSettings, oneDayBefore: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminder-3d" className="text-sm">
                        3 dias antes
                      </Label>
                      <Switch
                        id="reminder-3d"
                        checked={reminderSettings.threeDaysBefore}
                        onCheckedChange={(checked) =>
                          setReminderSettings({ ...reminderSettings, threeDaysBefore: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Links Included */}
                <Card className="border-dashed">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCheck className="h-4 w-4 text-success" />
                      <span>Link para adicionar ao calendário (.ics)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCheck className="h-4 w-4 text-success" />
                      <span>Link para detalhes da reserva</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCheck className="h-4 w-4 text-success" />
                      <span>Informações de contato da arena</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Notice */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      Mensagem Automática
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Esta mensagem será enviada automaticamente após a confirmação do pagamento.
                      Lembretes serão enviados conforme configurado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleCopyMessage}>
                <Download className="h-4 w-4 mr-2" />
                Copiar Mensagem
              </Button>
              <div className="flex gap-3">
                {onClose && (
                  <Button variant="outline" onClick={onClose}>
                    Fechar
                  </Button>
                )}
                <Button onClick={handleSendMessage} className="bg-[#25D366] hover:bg-[#20BD5A]">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
