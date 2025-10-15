import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { 
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  UserCircle,
  CheckCircle,
  Repeat
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface InviteViewProps {
  inviteData: {
    id: string;
    organizer: {
      name: string;
      initials: string;
      rating?: number;
    };
    game: {
      court: string;
      courtImage: string;
      date: string;
      time: string;
      duration: string;
      sport: string;
    };
    participants: {
      confirmed: number;
      total: number;
      avatars: string[];
    };
    pricing: {
      value: number;
      isRecurring?: boolean;
      recurringDates?: string[];
    };
  };
  onAccept?: (acceptAll?: boolean) => void;
  onDecline?: () => void;
}

export function InviteView({ inviteData, onAccept, onDecline }: InviteViewProps) {
  const [acceptType, setAcceptType] = useState<"single" | "all">("single");
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      onAccept?.(acceptType === "all");
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4"
          >
            <Trophy className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Você foi convidado!</h1>
          <p className="text-muted-foreground">
            {inviteData.organizer.name} te convidou para jogar
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 overflow-hidden">
            {/* Court Image */}
            <div className="aspect-video overflow-hidden bg-muted relative">
              <ImageWithFallback
                src={inviteData.game.courtImage}
                alt={inviteData.game.court}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary">
                  {inviteData.game.sport}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl">{inviteData.game.court}</CardTitle>
              <CardDescription>Confirme sua participação</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Game Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="font-medium">{inviteData.game.date}</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Horário</div>
                    <div className="font-medium">{inviteData.game.time}</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duração</div>
                    <div className="font-medium">{inviteData.game.duration}</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Valor</div>
                    <div className="font-medium text-primary">R$ {inviteData.pricing.value.toFixed(2)}</div>
                  </div>
                </motion.div>
              </div>

              <Separator />

              {/* Organizer */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  Organizador
                </h3>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {inviteData.organizer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{inviteData.organizer.name}</div>
                    {inviteData.organizer.rating && (
                      <div className="text-sm text-muted-foreground">
                        ⭐ {inviteData.organizer.rating}/5.0 avaliação
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Participants */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participantes
                </h3>
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="flex -space-x-2">
                    {inviteData.participants.avatars.slice(0, 4).map((avatar, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring", bounce: 0.5 }}
                      >
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarFallback>{avatar}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium">
                      {inviteData.participants.confirmed} de {inviteData.participants.total} confirmados
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {inviteData.participants.total - inviteData.participants.confirmed} vagas disponíveis
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring Options */}
              {inviteData.pricing.isRecurring && inviteData.pricing.recurringDates && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Repeat className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">Jogo Recorrente</h3>
                      <Badge variant="secondary">Desconto 10%</Badge>
                    </div>
                    <RadioGroup value={acceptType} onValueChange={(value) => setAcceptType(value as "single" | "all")}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer"
                      >
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single" className="flex-1 cursor-pointer">
                          <div className="font-medium">Aceitar apenas este jogo</div>
                          <div className="text-sm text-muted-foreground">
                            Somente {inviteData.game.date}
                          </div>
                        </Label>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer"
                      >
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="flex-1 cursor-pointer">
                          <div className="font-medium flex items-center gap-2">
                            Aceitar todos os jogos
                            <Badge variant="secondary" className="bg-accent/10 text-accent">
                              Recomendado
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {inviteData.pricing.recurringDates.length} jogos • Economia de R${" "}
                            {(inviteData.pricing.value * 0.1 * inviteData.pricing.recurringDates.length).toFixed(2)}
                          </div>
                        </Label>
                      </motion.div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={onDecline}
                  disabled={isAccepting}
                >
                  Recusar
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={handleAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                      Confirmando...
                    </motion.div>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Aceitar Convite
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Ao aceitar, você será direcionado para o pagamento
        </motion.p>
      </motion.div>
    </div>
  );
}
