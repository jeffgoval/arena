import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Plus, Users, Trophy, Calendar, ArrowLeft } from "lucide-react";
import { Team } from "../types";
import { toast } from "sonner@2.0.3";

const mockTeams: Team[] = [
  {
    id: "team_1",
    name: "Raça FC",
    description: "Time de futebol society de quinta-feira",
    sport: "Futebol Society",
    ownerId: "user_1",
    members: [
      { userId: "1", name: "Carlos Silva", avatar: undefined, role: "owner", joinedAt: new Date("2024-01-01"), stats: { gamesPlayed: 42, attendance: 98 } },
      { userId: "2", name: "Ana Paula", avatar: undefined, role: "member", joinedAt: new Date("2024-01-15"), stats: { gamesPlayed: 38, attendance: 85 } },
      { userId: "3", name: "João Silva", avatar: undefined, role: "member", joinedAt: new Date("2024-02-01"), stats: { gamesPlayed: 35, attendance: 92 } },
      { userId: "4", name: "Maria Santos", avatar: undefined, role: "member", joinedAt: new Date("2024-02-15"), stats: { gamesPlayed: 30, attendance: 88 } },
      { userId: "5", name: "Pedro Costa", avatar: undefined, role: "member", joinedAt: new Date("2024-03-01"), stats: { gamesPlayed: 28, attendance: 85 } },
    ],
    maxMembers: 15,
    isPrivate: false,
    createdAt: new Date("2024-01-01"),
    stats: { gamesPlayed: 45, nextGame: new Date("2025-10-24") },
  },
];

interface TeamsPageProps {
  onBack: () => void;
}

export function TeamsPage({ onBack }: TeamsPageProps) {
  const [teams] = useState<Team[]>(mockTeams);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sport: "",
    maxMembers: 15,
    isPrivate: false,
  });

  const handleCreateTeam = () => {
    // Validação básica
    if (!formData.name.trim()) {
      toast.error("Por favor, insira um nome para a turma");
      return;
    }
    if (!formData.sport) {
      toast.error("Por favor, selecione um esporte");
      return;
    }

    // Aqui você faria a chamada para a API
    toast.success("Turma criada com sucesso!", {
      description: `${formData.name} foi criada e está pronta para receber membros.`,
    });

    // Resetar formulário e fechar modal
    setFormData({
      name: "",
      description: "",
      sport: "",
      maxMembers: 15,
      isPrivate: false,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="font-semibold">Minhas Turmas</h1>
          <Button className="bg-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Turma
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{team.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{team.sport}</p>
                      </div>
                    </div>
                    <Badge variant={team.isPrivate ? "secondary" : "default"}>
                      {team.isPrivate ? "Privada" : "Pública"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{team.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {team.members.length}/{team.maxMembers} membros
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{team.stats.gamesPlayed} jogos</span>
                    </div>
                  </div>

                  {team.stats.nextGame && (
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        Próximo jogo: {team.stats.nextGame.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  )}

                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((member) => {
                      const initials = member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      return (
                        <Avatar key={member.userId} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {team.members.length > 5 && (
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {teams.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma turma ainda</h3>
            <p className="text-muted-foreground mb-6">Crie sua primeira turma para organizar jogos recorrentes</p>
            <Button className="bg-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Turma
            </Button>
          </motion.div>
        )}

        {/* Modal de Criar Turma */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Turma</DialogTitle>
              <DialogDescription>
                Organize jogos recorrentes e gerencie seus membros facilmente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Nome da Turma */}
              <div className="space-y-2">
                <Label htmlFor="team-name">Nome da Turma *</Label>
                <Input
                  id="team-name"
                  placeholder="Ex: Raça FC"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="team-description">Descrição</Label>
                <Textarea
                  id="team-description"
                  placeholder="Ex: Time de futebol society de quinta-feira"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Esporte */}
              <div className="space-y-2">
                <Label htmlFor="team-sport">Esporte *</Label>
                <Select
                  value={formData.sport}
                  onValueChange={(value) => setFormData({ ...formData, sport: value })}
                >
                  <SelectTrigger id="team-sport">
                    <SelectValue placeholder="Selecione um esporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Futebol Society">Futebol Society</SelectItem>
                    <SelectItem value="Futsal">Futsal</SelectItem>
                    <SelectItem value="Vôlei">Vôlei</SelectItem>
                    <SelectItem value="Basquete">Basquete</SelectItem>
                    <SelectItem value="Beach Tennis">Beach Tennis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Máximo de Membros */}
              <div className="space-y-2">
                <Label htmlFor="team-max-members">Máximo de Membros</Label>
                <Input
                  id="team-max-members"
                  type="number"
                  min="5"
                  max="50"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 15 })}
                />
              </div>

              {/* Turma Privada */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="team-private">Turma Privada</Label>
                  <p className="text-sm text-muted-foreground">
                    Apenas membros convidados podem entrar
                  </p>
                </div>
                <Switch
                  id="team-private"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-primary" onClick={handleCreateTeam}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Turma
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
