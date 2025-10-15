import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Camera,
  Edit,
  Key,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  DollarSign,
  Star,
  Settings,
  Shield,
  Check,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { EditProfileModal } from "./EditProfileModal";
import { ChangePasswordModal } from "./ChangePasswordModal";

interface UserProfileProps {
  onBack: () => void;
  onSettings?: () => void;
}

export function UserProfile({ onBack, onSettings }: UserProfileProps) {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="font-semibold">Meu Perfil</h1>
            {onSettings && (
              <Button variant="ghost" size="icon" onClick={onSettings}>
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants}>
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={() => setIsHoveringAvatar(true)}
                    onHoverEnd={() => setIsHoveringAvatar(false)}
                    className="relative cursor-pointer"
                  >
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHoveringAvatar ? 1 : 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">
                        <Star className="mr-1 h-3 w-3" />
                        {user.stats.rating}
                      </Badge>
                    </div>
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                    <p className="text-muted-foreground mb-4">
                      {user.role === "client" ? "Atleta" : "Gestor"} • Membro desde {memberSince}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                        <div className="text-2xl font-bold text-primary">{user.stats.gamesPlayed}</div>
                        <div className="text-xs text-muted-foreground">Jogos</div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                        <div className="text-2xl font-bold text-primary">{user.stats.hoursPlayed}h</div>
                        <div className="text-xs text-muted-foreground">Horas</div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                        <div className="text-2xl font-bold text-primary">R$ {user.credits.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Créditos</div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          R$ {user.stats.totalSpent.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Gasto</div>
                      </motion.div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={() => setShowEditModal(true)} className="flex-1">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordModal(true)}
                        className="flex-1"
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Trocar Senha
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    <Check className="mr-1 h-3 w-3" />
                    Verificado
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Telefone</div>
                    <div className="font-medium">{user.phone}</div>
                  </div>
                </div>

                {user.birthDate && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Data de Nascimento</div>
                      <div className="font-medium">
                        {new Date(user.birthDate).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Localização</div>
                      <div className="font-medium">{user.address}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sports & Bio */}
          {user.role === "client" && (
            <>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Esportes Favoritos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.sports.map((sport, index) => (
                        <motion.div
                          key={sport}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge variant="secondary" className="text-sm py-1.5 px-3">
                            {sport}
                          </Badge>
                        </motion.div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                        + Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {user.bio && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Sobre Mim</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}

          {/* Privacy Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Perfil Público</div>
                    <div className="text-sm text-muted-foreground">
                      Outros usuários podem ver seu perfil
                    </div>
                  </div>
                  <Badge variant={user.preferences.privacy.profilePublic ? "default" : "secondary"}>
                    {user.preferences.privacy.profilePublic ? "Ativo" : "Desativado"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Mostrar Estatísticas</div>
                    <div className="text-sm text-muted-foreground">
                      Exibir jogos e avaliações no perfil
                    </div>
                  </div>
                  <Badge variant={user.preferences.privacy.showStats ? "default" : "secondary"}>
                    {user.preferences.privacy.showStats ? "Ativo" : "Desativado"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
