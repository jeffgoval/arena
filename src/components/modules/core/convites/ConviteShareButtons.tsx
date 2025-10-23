"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Convite } from "@/types/convites.types";
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Mail, 
  Facebook,
  Twitter,
  Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConviteShareButtonsProps {
  convite: Convite;
  baseUrl?: string;
  className?: string;
  variant?: "default" | "compact";
}

export function ConviteShareButtons({
  convite,
  baseUrl = typeof window !== "undefined" ? window.location.origin : "",
  className,
  variant = "default",
}: ConviteShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // Gerar URL do convite
  const conviteUrl = `${baseUrl}/convites/${convite.token}`;
  
  // Mensagem padrão para compartilhamento
  const mensagemPadrao = `Olá! Você foi convidado para participar de uma partida.
${convite.reserva?.quadra?.nome || "Quadra"} - ${convite.reserva?.data || ""}
${convite.vagas_disponiveis} vagas disponíveis!
Aceite o convite: ${conviteUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(conviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  };

  const handleWhatsAppShare = () => {
    const mensagem = encodeURIComponent(mensagemPadrao);
    window.open(`https://wa.me/?text=${mensagem}`, "_blank");
  };

  const handleEmailShare = () => {
    const assunto = encodeURIComponent("Convite para Partida");
    const corpo = encodeURIComponent(mensagemPadrao);
    window.location.href = `mailto:?subject=${assunto}&body=${corpo}`;
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(conviteUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const handleTwitterShare = () => {
    const texto = encodeURIComponent(
      `Convite para partida! ${convite.vagas_disponiveis} vagas disponíveis.`
    );
    const url = encodeURIComponent(conviteUrl);
    window.open(`https://twitter.com/intent/tweet?text=${texto}&url=${url}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Convite para Partida",
          text: mensagemPadrao,
          url: conviteUrl,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    }
  };

  // Versão compacta - apenas botões principais
  if (variant === "compact") {
    return (
      <div className={cn("flex gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="flex-1"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>

        {navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Versão completa
  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Link do Convite */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Link do Convite
          </Label>
          <div className="flex gap-2">
            <Input
              value={conviteUrl}
              readOnly
              className="font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Botões de Compartilhamento */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar via
          </Label>
          
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <Button
              variant="outline"
              onClick={handleWhatsAppShare}
              className="justify-start"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </Button>

            {/* Email */}
            <Button
              variant="outline"
              onClick={handleEmailShare}
              className="justify-start"
            >
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              Email
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              onClick={handleFacebookShare}
              className="justify-start"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-700" />
              Facebook
            </Button>

            {/* Twitter */}
            <Button
              variant="outline"
              onClick={handleTwitterShare}
              className="justify-start"
            >
              <Twitter className="h-4 w-4 mr-2 text-sky-500" />
              Twitter
            </Button>
          </div>

          {/* Botão de compartilhamento nativo (mobile) */}
          {navigator.share && (
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Mais opções de compartilhamento
            </Button>
          )}
        </div>

        {/* Dica */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Dica: Compartilhe o link com seus amigos para que eles possam aceitar o convite
            e participar da partida.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
