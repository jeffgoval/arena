/**
 * Time Block Management Component
 * Manages time blocks for courts (maintenance, private events, holidays, etc.)
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { 
  Ban, 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  Pencil, 
  Trash2,
  Clock,
  Wrench,
  PartyPopper,
  Sun,
  MoreHorizontal,
  RefreshCw,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { mockTimeBlocks, mockCourts, type TimeBlock, type TimeBlockType, type TimeBlockStatus } from "../../data/mockData";
import { TimeBlockFormModal } from "./TimeBlockFormModal";

const TIME_BLOCK_TYPES: { value: TimeBlockType; label: string; icon: typeof Wrench }[] = [
  { value: "maintenance", label: "Manutenção", icon: Wrench },
  { value: "private-event", label: "Evento Privado", icon: PartyPopper },
  { value: "holiday", label: "Feriado", icon: Sun },
  { value: "other", label: "Outro", icon: MoreHorizontal },
];

const TIME_BLOCK_STATUS: { value: TimeBlockStatus; label: string; variant: "default" | "secondary" | "outline" }[] = [
  { value: "active", label: "Ativo", variant: "default" },
  { value: "past", label: "Passado", variant: "secondary" },
  { value: "canceled", label: "Cancelado", variant: "outline" },
];

export function TimeBlockManagement() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(mockTimeBlocks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; blockId: number | null }>({
    open: false,
    blockId: null,
  });

  // Filter time blocks
  const filteredBlocks = useMemo(() => {
    return timeBlocks.filter((block) => {
      const matchesSearch =
        block.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourt = selectedCourt === "all" || block.courtId === parseInt(selectedCourt);
      const matchesType = selectedType === "all" || block.type === selectedType;
      const matchesStatus = selectedStatus === "all" || block.status === selectedStatus;

      return matchesSearch && matchesCourt && matchesType && matchesStatus;
    });
  }, [timeBlocks, searchTerm, selectedCourt, selectedType, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const activeBlocks = timeBlocks.filter((b) => b.status === "active").length;
    const maintenanceBlocks = timeBlocks.filter((b) => b.type === "maintenance" && b.status === "active").length;
    const eventBlocks = timeBlocks.filter((b) => b.type === "private-event" && b.status === "active").length;

    return {
      total: timeBlocks.length,
      active: activeBlocks,
      maintenance: maintenanceBlocks,
      events: eventBlocks,
    };
  }, [timeBlocks]);

  const handleCreateBlock = () => {
    setEditingBlock(null);
    setShowFormModal(true);
  };

  const handleEditBlock = (block: TimeBlock) => {
    setEditingBlock(block);
    setShowFormModal(true);
  };

  const handleDeleteBlock = (blockId: number) => {
    setDeleteDialog({ open: true, blockId });
  };

  const confirmDelete = () => {
    if (deleteDialog.blockId) {
      setTimeBlocks((prev) => prev.filter((b) => b.id !== deleteDialog.blockId));
      toast.success("Bloqueio excluído com sucesso!");
      setDeleteDialog({ open: false, blockId: null });
    }
  };

  const handleSaveBlock = (blockData: Partial<TimeBlock>) => {
    if (editingBlock) {
      // Update existing block
      setTimeBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlock.id
            ? { ...b, ...blockData, id: b.id }
            : b
        )
      );
      toast.success("Bloqueio atualizado com sucesso!");
    } else {
      // Create new block
      const newBlock: TimeBlock = {
        id: Math.max(...timeBlocks.map((b) => b.id), 0) + 1,
        ...blockData,
        status: "active",
        createdAt: new Date().toISOString(),
        createdBy: "Admin",
      } as TimeBlock;
      setTimeBlocks((prev) => [...prev, newBlock]);
      toast.success("Bloqueio criado com sucesso!");
    }
    setShowFormModal(false);
    setEditingBlock(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourt("all");
    setSelectedType("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCourt !== "all" ||
    selectedType !== "all" ||
    selectedStatus !== "all";

  const getTypeIcon = (type: TimeBlockType) => {
    const typeConfig = TIME_BLOCK_TYPES.find((t) => t.value === type);
    if (!typeConfig) return null;
    const Icon = typeConfig.icon;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeLabel = (type: TimeBlockType) => {
    return TIME_BLOCK_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getStatusBadge = (status: TimeBlockStatus) => {
    const statusConfig = TIME_BLOCK_STATUS.find((s) => s.value === status);
    if (!statusConfig) return null;
    return (
      <Badge variant={statusConfig.variant} className="gap-1">
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatRecurrence = (recurrence: string) => {
    const labels: Record<string, string> = {
      none: "Não se repete",
      daily: "Diariamente",
      weekly: "Semanalmente",
      monthly: "Mensalmente",
    };
    return labels[recurrence] || recurrence;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="flex items-center gap-2">
              <Ban className="h-6 w-6 text-primary" />
              Bloqueio de Horários
            </h2>
            <p className="text-muted-foreground mt-1">
              Gerencie bloqueios de horários para manutenção, eventos e feriados
            </p>
          </div>
          <Button onClick={handleCreateBlock} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Bloqueio
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Bloqueios</p>
                  <p className="mt-1">{stats.total}</p>
                </div>
                <Ban className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bloqueios Ativos</p>
                  <p className="mt-1">{stats.active}</p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Manutenções</p>
                  <p className="mt-1">{stats.maintenance}</p>
                </div>
                <Wrench className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Eventos</p>
                  <p className="mt-1">{stats.events}</p>
                </div>
                <PartyPopper className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtros</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar bloqueios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Court Filter */}
            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as quadras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as quadras</SelectItem>
                {mockCourts.map((court) => (
                  <SelectItem key={court.id} value={court.id.toString()}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {TIME_BLOCK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {TIME_BLOCK_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Time Blocks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bloqueios Cadastrados</CardTitle>
          <CardDescription>
            {filteredBlocks.length} bloqueio(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBlocks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quadra</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Recorrência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell>
                        <div>
                          <div>{block.courtName}</div>
                          {block.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {block.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(block.type)}
                          <span className="text-sm">{getTypeLabel(block.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(block.startDate)}</div>
                          {block.startDate !== block.endDate && (
                            <div className="text-muted-foreground">
                              até {formatDate(block.endDate)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {block.startTime} - {block.endTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="text-sm truncate">{block.reason}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {block.recurrence !== "none" && (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          {formatRecurrence(block.recurrence)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(block.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBlock(block)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlock(block.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Ban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Nenhum bloqueio encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a busca"
                  : "Comece criando um novo bloqueio de horário"}
              </p>
              {!hasActiveFilters && (
                <Button onClick={handleCreateBlock} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Bloqueio
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <TimeBlockFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        onSave={handleSaveBlock}
        editingBlock={editingBlock}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, blockId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este bloqueio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
