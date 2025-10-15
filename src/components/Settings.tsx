import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ArrowLeft, Bell, Shield, Globe, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { user, updateUser } = useAuth();

  if (!user) return null;

  const handleToggle = (key: string, value: boolean) => {
    const keys = key.split(".");
    if (keys.length === 3) {
      updateUser({
        preferences: {
          ...user.preferences,
          [keys[1]]: {
            ...user.preferences[keys[1] as keyof typeof user.preferences],
            [keys[2]]: value,
          },
        },
      });
    }
    toast.success("Configuração atualizada!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="font-semibold">Configurações</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações por email
                  </p>
                </div>
                <Switch
                  checked={user.preferences.notifications.email}
                  onCheckedChange={(checked) =>
                    handleToggle("preferences.notifications.email", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes via WhatsApp
                  </p>
                </div>
                <Switch
                  checked={user.preferences.notifications.whatsapp}
                  onCheckedChange={(checked) =>
                    handleToggle("preferences.notifications.whatsapp", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={user.preferences.notifications.push}
                  onCheckedChange={(checked) =>
                    handleToggle("preferences.notifications.push", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Perfil Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que outros vejam seu perfil
                  </p>
                </div>
                <Switch
                  checked={user.preferences.privacy.profilePublic}
                  onCheckedChange={(checked) =>
                    handleToggle("preferences.privacy.profilePublic", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mostrar Estatísticas</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir suas estatísticas no perfil
                  </p>
                </div>
                <Switch
                  checked={user.preferences.privacy.showStats}
                  onCheckedChange={(checked) =>
                    handleToggle("preferences.privacy.showStats", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Esta ação é irreversível. Todos os seus dados serão permanentemente deletados.
                </p>
                <Button variant="destructive" className="w-full">
                  Deletar Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
