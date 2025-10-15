/**
 * WhatsApp Template Management Component
 * Manages WhatsApp message templates for automated communication
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Send,
  TrendingUp,
  Users,
  X,
  Eye
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  mockWhatsAppTemplates,
  TEMPLATE_VARIABLES,
  type WhatsAppTemplate,
  type TemplateCategory,
  type TemplateStatus,
} from "../../data/mockData";
import { WhatsAppPreview } from "../WhatsAppPreview";

const CATEGORY_CONFIG: Record<TemplateCategory, { label: string; color: string }> = {
  confirmation: { label: "Confirmação", color: "bg-success text-success-foreground" },
  reminder: { label: "Lembrete", color: "bg-warning text-warning-foreground" },
  invite: { label: "Convite", color: "bg-info text-info-foreground" },
  cancellation: { label: "Cancelamento", color: "bg-destructive text-destructive-foreground" },
  payment: { label: "Pagamento", color: "bg-accent text-accent-foreground" },
  promotional: { label: "Promocional", color: "bg-primary text-primary-foreground" },
  welcome: { label: "Boas-vindas", color: "bg-secondary text-secondary-foreground" },
  other: { label: "Outro", color: "bg-muted text-muted-foreground" },
};

const STATUS_CONFIG: Record<TemplateStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: typeof CheckCircle2 }> = {
  active: { label: "Ativo", variant: "default", icon: CheckCircle2 },
  inactive: { label: "Inativo", variant: "secondary", icon: XCircle },
  draft: { label: "Rascunho", variant: "outline", icon: FileText },
};

export function WhatsAppTemplateManagement() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(mockWhatsAppTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<WhatsAppTemplate | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; templateId: number | null }>({
    open: false,
    templateId: null,
  });

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<TemplateCategory>("confirmation");
  const [formStatus, setFormStatus] = useState<TemplateStatus>("active");
  const [formMessage, setFormMessage] = useState("");

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || template.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [templates, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const active = templates.filter((t) => t.status === "active").length;
    const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
    const avgUsage = templates.length > 0 ? Math.round(totalUsage / templates.length) : 0;
    const mostUsed = templates.reduce((max, t) => (t.usageCount > max.usageCount ? t : max), templates[0]);

    return { total: templates.length, active, totalUsage, avgUsage, mostUsed };
  }, [templates]);

  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setFormName("");
    setFormCategory("confirmation");
    setFormStatus("active");
    setFormMessage("");
    setShowFormDialog(true);
  };

  const handleEditTemplate = (template: WhatsAppTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormCategory(template.category);
    setFormStatus(template.status);
    setFormMessage(template.message);
    setShowFormDialog(true);
  };

  const handlePreviewTemplate = (template: WhatsAppTemplate) => {
    setPreviewTemplate(template);
    setShowPreviewDialog(true);
  };

  const handleDeleteTemplate = (templateId: number) => {
    setDeleteDialog({ open: true, templateId });
  };

  const confirmDelete = () => {
    if (deleteDialog.templateId) {
      setTemplates((prev) => prev.filter((t) => t.id !== deleteDialog.templateId));
      toast.success("Template excluído com sucesso!");
      setDeleteDialog({ open: false, templateId: null });
    }
  };

  const handleDuplicateTemplate = (template: WhatsAppTemplate) => {
    const newTemplate: WhatsAppTemplate = {
      ...template,
      id: Math.max(...templates.map((t) => t.id), 0) + 1,
      name: `${template.name} (Cópia)`,
      usageCount: 0,
      lastUsed: undefined,
      createdAt: new Date().toISOString(),
      updatedBy: "Admin",
    };
    setTemplates((prev) => [...prev, newTemplate]);
    toast.success("Template duplicado com sucesso!");
  };

  const handleSaveTemplate = () => {
    if (!formName.trim() || !formMessage.trim()) {
      toast.error("Preencha nome e mensagem do template!");
      return;
    }

    // Extract variables from message
    const variableMatches = formMessage.match(/\{[^}]+\}/g) || [];
    const variables = [...new Set(variableMatches)];

    if (editingTemplate) {
      // Update existing template
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                name: formName,
                category: formCategory,
                status: formStatus,
                message: formMessage,
                variables,
                updatedBy: "Admin",
              }
            : t
        )
      );
      toast.success("Template atualizado com sucesso!");
    } else {
      // Create new template
      const newTemplate: WhatsAppTemplate = {
        id: Math.max(...templates.map((t) => t.id), 0) + 1,
        name: formName,
        category: formCategory,
        status: formStatus,
        message: formMessage,
        variables,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedBy: "Admin",
      };
      setTemplates((prev) => [...prev, newTemplate]);
      toast.success("Template criado com sucesso!");
    }

    setShowFormDialog(false);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = formMessage.substring(0, start) + variable + formMessage.substring(end);
      setFormMessage(newMessage);
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryBadge = (category: TemplateCategory) => {
    const config = CATEGORY_CONFIG[category];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: TemplateStatus) => {
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Templates WhatsApp
            </h2>
            <p className="text-muted-foreground mt-1">
              Gerencie mensagens automáticas para comunicação com clientes
            </p>
          </div>
          <Button onClick={handleCreateTemplate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Templates</p>
                  <p className="mt-1">{stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Templates Ativos</p>
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
                  <p className="text-sm text-muted-foreground">Total de Envios</p>
                  <p className="mt-1">{stats.totalUsage}</p>
                </div>
                <Send className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Média de Uso</p>
                  <p className="mt-1">{stats.avgUsage} envios</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates Cadastrados</CardTitle>
          <CardDescription>
            {filteredTemplates.length} template(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Último Uso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div>{template.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {template.message.substring(0, 60)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(template.category)}</TableCell>
                      <TableCell>{getStatusBadge(template.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {template.usageCount}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(template.lastUsed)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewTemplate(template)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
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
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Nenhum template encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a busca"
                  : "Comece criando um novo template de mensagem"}
              </p>
              {!hasActiveFilters && (
                <Button onClick={handleCreateTemplate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Template
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Template" : "Novo Template WhatsApp"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Atualize as informações do template"
                : "Crie um novo template de mensagem automatizada"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  placeholder="Ex: Confirmação de Reserva"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formCategory}
                    onValueChange={(value) => setFormCategory(value as TemplateCategory)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formStatus}
                    onValueChange={(value) => setFormStatus(value as TemplateStatus)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Digite a mensagem do template..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Variáveis Disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATE_VARIABLES.slice(0, 6).map((variable) => (
                    <Button
                      key={variable.key}
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable.key)}
                      className="text-xs"
                    >
                      {variable.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Clique para inserir a variável na mensagem
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div>
                <Label>Preview da Mensagem</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Visualização com dados de exemplo
                </p>
                <WhatsAppPreview message={formMessage} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFormDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? "Atualizar Template" : "Criar Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              {CATEGORY_CONFIG[previewTemplate?.category || "other"].label}
            </DialogDescription>
          </DialogHeader>

          {previewTemplate && <WhatsAppPreview message={previewTemplate.message} />}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, templateId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
