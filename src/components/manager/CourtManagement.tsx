import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Search,
  Edit,
  Power,
  Settings2,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Wrench,
  CheckSquare,
  Square,
} from "lucide-react";
import { CourtFormModal } from "./CourtFormModal";
import { EmptyState } from "../EmptyState";
import { mockCourts, type Court, type CourtType, type CourtStatus } from "../../data/mockData";

interface CourtManagementProps {
  onBack: () => void;
}

const courtTypeLabels: Record<CourtType, string> = {
  society: "Society",
  poliesportiva: "Poliesportiva",
  "beach-tennis": "Beach Tennis",
  volei: "Vôlei",
  futsal: "Futsal",
};

const courtTypeColors: Record<CourtType, string> = {
  society: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  poliesportiva: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "beach-tennis": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  volei: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  futsal: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
};

const statusLabels: Record<CourtStatus, string> = {
  active: "Ativa",
  inactive: "Inativa",
  maintenance: "Manutenção",
};

const statusIcons: Record<CourtStatus, any> = {
  active: CheckCircle,
  inactive: XCircle,
  maintenance: Wrench,
};

const statusColors: Record<CourtStatus, string> = {
  active: "text-green-600 dark:text-green-400",
  inactive: "text-gray-400 dark:text-gray-500",
  maintenance: "text-orange-500 dark:text-orange-400",
};

export function CourtManagement({ onBack }: CourtManagementProps) {
  const [courts, setCourts] = useState<Court[]>(mockCourts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<CourtType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<CourtStatus | "all">("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | undefined>();

  // Filter courts
  const filteredCourts = courts.filter((court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || court.type === filterType;
    const matchesStatus = filterStatus === "all" || court.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddCourt = () => {
    setEditingCourt(undefined);
    setShowFormModal(true);
  };

  const handleEditCourt = (court: Court) => {
    setEditingCourt(court);
    setShowFormModal(true);
  };

  const handleSaveCourt = (courtData: Partial<Court>) => {
    if (editingCourt) {
      // Update existing court
      setCourts(courts.map((c) => (c.id === editingCourt.id ? { ...c, ...courtData } : c)));
    } else {
      // Add new court
      const newCourt: Court = {
        id: Math.max(...courts.map((c) => c.id)) + 1,
        name: courtData.name || "",
        type: courtData.type || "society",
        status: courtData.status || "active",
        description: courtData.description,
        capacity: courtData.capacity || 10,
        features: courtData.features || {
          covered: false,
          lighting: false,
          lockerRoom: false,
          parking: false,
        },
        workingHours: courtData.workingHours || {
          monday: { enabled: true, open: "06:00", close: "23:00" },
          tuesday: { enabled: true, open: "06:00", close: "23:00" },
          wednesday: { enabled: true, open: "06:00", close: "23:00" },
          thursday: { enabled: true, open: "06:00", close: "23:00" },
          friday: { enabled: true, open: "06:00", close: "23:00" },
          saturday: { enabled: true, open: "07:00", close: "22:00" },
          sunday: { enabled: true, open: "07:00", close: "20:00" },
        },
        occupancy: 0,
      };
      setCourts([...courts, newCourt]);
    }
    setShowFormModal(false);
    setEditingCourt(undefined);
  };

  const handleToggleStatus = (courtId: number) => {
    setCourts(
      courts.map((c) =>
        c.id === courtId
          ? {
              ...c,
              status: c.status === "active" ? "inactive" : "active",
            }
          : c
      )
    );
  };

  // Statistics
  const totalCourts = courts.length;
  const activeCourts = courts.filter((c) => c.status === "active").length;
  const avgOccupancy =
    courts.reduce((sum, c) => sum + (c.occupancy || 0), 0) / courts.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Gestão de Quadras</h1>
          <p className="text-muted-foreground">
            Gerencie todas as quadras da arena
          </p>
        </div>
        <Button onClick={handleAddCourt} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Adicionar Quadra
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Quadras</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourts}</div>
            <p className="text-xs text-muted-foreground">
              {activeCourts} ativas, {totalCourts - activeCourts} inativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quadras Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourts}</div>
            <p className="text-xs text-muted-foreground">
              {((activeCourts / totalCourts) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {avgOccupancy >= 75 ? "Excelente" : avgOccupancy >= 50 ? "Boa" : "Baixa"}{" "}
              utilização
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar quadras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as CourtType | "all")}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo de quadra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="society">Society</SelectItem>
                <SelectItem value="poliesportiva">Poliesportiva</SelectItem>
                <SelectItem value="beach-tennis">Beach Tennis</SelectItem>
                <SelectItem value="volei">Vôlei</SelectItem>
                <SelectItem value="futsal">Futsal</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as CourtStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="inactive">Inativa</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courts Grid */}
      {filteredCourts.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={
            searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Nenhuma quadra encontrada"
              : "Nenhuma quadra cadastrada"
          }
          description={
            searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Adicione sua primeira quadra para começar"
          }
          action={
            searchTerm || filterType !== "all" || filterStatus !== "all" ? undefined : (
              <Button onClick={handleAddCourt} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Primeira Quadra
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourts.map((court) => {
            const StatusIcon = statusIcons[court.status];
            return (
              <Card key={court.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1">{court.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {court.description || "Sem descrição"}
                      </CardDescription>
                    </div>
                    <Badge className={courtTypeColors[court.type]} variant="secondary">
                      {courtTypeLabels[court.type]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${statusColors[court.status]}`} />
                      <span className="text-sm font-medium">
                        {statusLabels[court.status]}
                      </span>
                    </div>
                    {court.occupancy !== undefined && court.status === "active" && (
                      <span className="text-sm text-muted-foreground">
                        {court.occupancy}% ocupação
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{court.capacity} pessoas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {court.features.covered ? (
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Cobertura</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {court.features.lighting ? (
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Iluminação</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {court.features.lockerRoom ? (
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Vestiário</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEditCourt(court)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEditCourt(court)}
                    >
                      <Settings2 className="h-4 w-4" />
                      Horários
                    </Button>
                    <Button
                      variant={court.status === "active" ? "destructive" : "default"}
                      size="sm"
                      className="gap-2"
                      onClick={() => handleToggleStatus(court.id)}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <CourtFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        court={editingCourt}
        onSave={handleSaveCourt}
      />
    </div>
  );
}
