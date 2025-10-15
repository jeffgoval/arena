/**
 * Referral Program Component
 * Client-facing referral program interface
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { copyToClipboard } from "../../lib/clipboard";
import {
  Users,
  Copy,
  Share2,
  Gift,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Mail,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Target,
  Award
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { mockReferrals, type Referral, type ReferralStatus } from "../../data/mockData";

const REFERRAL_REWARD = 20; // Valor da recompensa por indicação
const REFERRAL_CODE = "CARLOS2024"; // Código único do usuário

const STATUS_CONFIG: Record<ReferralStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: typeof CheckCircle2 }> = {
  pending: { label: "Aguardando 1ª reserva", variant: "secondary", icon: Clock },
  active: { label: "Ativo", variant: "default", icon: CheckCircle2 },
  rewarded: { label: "Recompensado", variant: "default", icon: Gift },
  expired: { label: "Expirado", variant: "outline", icon: AlertCircle },
};

export function ReferralProgram() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter referrals for current user (Carlos Silva - id: 1)
  const userReferrals = mockReferrals.filter((r) => r.referrerId === 1);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = userReferrals.length;
    const active = userReferrals.filter((r) => r.status === "active" || r.status === "rewarded").length;
    const pending = userReferrals.filter((r) => r.status === "pending").length;
    const rewarded = userReferrals.filter((r) => r.status === "rewarded").length;
    const totalEarned = userReferrals
      .filter((r) => r.rewardClaimed)
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    const conversionRate = total > 0 ? Math.round((rewarded / total) * 100) : 0;

    return { total, active, pending, rewarded, totalEarned, conversionRate };
  }, [userReferrals]);

  const referralLink = `https://arenadona santa.com.br/cadastro?ref=${REFERRAL_CODE}`;

  const handleCopyCode = async () => {
    const success = await copyToClipboard(REFERRAL_CODE);
    if (success) {
      setCopiedCode(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      toast.error("Não foi possível copiar o código");
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopiedLink(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      toast.error("Não foi possível copiar o link");
    }
  };

  const handleShareWhatsApp = () => {
    const message = `🎾 Venha jogar na Arena Dona Santa!\n\nUse meu código ${REFERRAL_CODE} e ganhe R$ ${REFERRAL_REWARD} de desconto na primeira reserva!\n\nCadastre-se: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    toast.success("Compartilhando no WhatsApp...");
  };

  const handleShareEmail = () => {
    const subject = "Convite: Jogue na Arena Dona Santa com desconto!";
    const body = `Olá!\n\nEstou te convidando para conhecer a Arena Dona Santa, o melhor lugar para jogar futebol society, beach tennis e muito mais!\n\nUse meu código de indicação ${REFERRAL_CODE} no cadastro e ganhe R$ ${REFERRAL_REWARD} de desconto na sua primeira reserva!\n\nCadastre-se aqui: ${referralLink}\n\nNos vemos nas quadras! 🎾⚽`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    toast.success("Abrindo cliente de email...");
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: ReferralStatus) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-6 w-6 text-primary" />
          <h2>Programa de Indicação</h2>
        </div>
        <p className="text-muted-foreground">
          Indique amigos e ganhe recompensas! Você e seu amigo ganham R$ {REFERRAL_REWARD} cada.
        </p>
      </div>

      {/* How it Works */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Como Funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2">1. Compartilhe</h4>
              <p className="text-sm text-muted-foreground">
                Envie seu código ou link de indicação para amigos
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2">2. Amigo se cadastra</h4>
              <p className="text-sm text-muted-foreground">
                Seu amigo usa seu código ao criar a conta
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2">3. Ganhem juntos</h4>
              <p className="text-sm text-muted-foreground">
                Vocês dois recebem R$ {REFERRAL_REWARD} de crédito
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Indicações</p>
                <p className="mt-1">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="mt-1">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ganho</p>
                <p className="mt-1">R$ {stats.totalEarned}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                <p className="mt-1">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Card */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Código de Indicação</CardTitle>
          <CardDescription>
            Compartilhe este código com seus amigos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Display */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={REFERRAL_CODE}
                  readOnly
                  className="pr-10 text-center text-lg font-mono tracking-wider"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleCopyCode}
                >
                  {copiedCode ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button onClick={() => setShowShareDialog(true)} className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>

          <Separator />

          {/* Link Display */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Ou compartilhe o link direto:
            </label>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2 flex-shrink-0"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Minhas Indicações</CardTitle>
              <CardDescription>
                {userReferrals.length} indicação(ões) realizada(s)
              </CardDescription>
            </div>
            {stats.pending > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {stats.pending} pendente(s)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {userReferrals.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amigo Indicado</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead>1ª Reserva</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Recompensa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div>{referral.referredName}</div>
                          <div className="text-xs text-muted-foreground">
                            {referral.referredEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(referral.signupDate)}</TableCell>
                      <TableCell>{formatDate(referral.firstBookingDate)}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={
                              referral.rewardClaimed
                                ? "text-success"
                                : "text-muted-foreground"
                            }
                          >
                            R$ {referral.rewardAmount}
                          </span>
                          {referral.rewardClaimed && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Nenhuma indicação ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece a indicar amigos e ganhe recompensas!
              </p>
              <Button onClick={() => setShowShareDialog(true)} className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar Código
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Código de Indicação</DialogTitle>
            <DialogDescription>
              Escolha como deseja compartilhar seu código {REFERRAL_CODE}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={handleShareWhatsApp}
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div className="text-left flex-1">
                <div>Compartilhar no WhatsApp</div>
                <div className="text-xs text-muted-foreground">
                  Envie para seus contatos
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={handleShareEmail}
            >
              <Mail className="h-5 w-5 text-blue-600" />
              <div className="text-left flex-1">
                <div>Compartilhar por Email</div>
                <div className="text-xs text-muted-foreground">
                  Envie um convite por email
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={handleCopyLink}
            >
              <Copy className="h-5 w-5 text-primary" />
              <div className="text-left flex-1">
                <div>Copiar Link</div>
                <div className="text-xs text-muted-foreground">
                  Compartilhe em qualquer lugar
                </div>
              </div>
              {copiedLink && <CheckCircle2 className="h-4 w-4 text-success" />}
            </Button>
          </div>

          <Separator />

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Dica:</strong> Quanto mais amigos você
                  indicar, mais créditos você ganha! Sem limite de indicações.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
