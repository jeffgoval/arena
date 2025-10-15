import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";

interface TransactionHistoryProps {
  onBack: () => void;
  onAddCredits: () => void;
}

const mockTransactions = [
  {
    id: 1,
    date: "2025-10-12",
    description: "Reserva Quadra 1 - Society",
    type: "debit" as const,
    value: 120,
    status: "completed",
    category: "reserva",
  },
  {
    id: 2,
    date: "2025-10-10",
    description: "Convite João Santos - Jogo 15/10",
    type: "credit" as const,
    value: 15,
    status: "completed",
    category: "convite",
  },
  {
    id: 3,
    date: "2025-10-08",
    description: "Bônus Indicação - Ana Paula",
    type: "credit" as const,
    value: 30,
    status: "completed",
    category: "bonus",
  },
  {
    id: 4,
    date: "2025-10-05",
    description: "Reserva Quadra 2 - Poliesportiva",
    type: "debit" as const,
    value: 100,
    status: "completed",
    category: "reserva",
  },
  {
    id: 5,
    date: "2025-10-03",
    description: "Recarga de Créditos",
    type: "credit" as const,
    value: 200,
    status: "completed",
    category: "recarga",
  },
  {
    id: 6,
    date: "2025-09-28",
    description: "Convite Maria - Jogo 02/10",
    type: "credit" as const,
    value: 20,
    status: "completed",
    category: "convite",
  },
  {
    id: 7,
    date: "2025-09-25",
    description: "Reserva Quadra 1 - Society",
    type: "debit" as const,
    value: 120,
    status: "completed",
    category: "reserva",
  },
  {
    id: 8,
    date: "2025-09-20",
    description: "Reembolso - Cancelamento",
    type: "credit" as const,
    value: 100,
    status: "completed",
    category: "reembolso",
  },
];

export function TransactionHistory({ onBack, onAddCredits }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Calculate balance
  const balance = mockTransactions.reduce((acc, transaction) => {
    return transaction.type === "credit" ? acc + transaction.value : acc - transaction.value;
  }, 0);

  const totalCredits = mockTransactions
    .filter((t) => t.type === "credit")
    .reduce((acc, t) => acc + t.value, 0);

  const totalDebits = mockTransactions
    .filter((t) => t.type === "debit")
    .reduce((acc, t) => acc + t.value, 0);

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm" onClick={onAddCredits}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Créditos
            </Button>
          </div>
        </div>
        {/* Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-primary mb-1">{formatCurrency(balance)}</div>
              <p className="text-xs text-muted-foreground">
                Disponível para uso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Total de Créditos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl mb-1">{formatCurrency(totalCredits)}</div>
              <p className="text-xs text-muted-foreground">
                {mockTransactions.filter((t) => t.type === "credit").length}{" "}
                transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Total de Débitos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl mb-1">{formatCurrency(totalDebits)}</div>
              <p className="text-xs text-muted-foreground">
                {mockTransactions.filter((t) => t.type === "debit").length}{" "}
                transações
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="credit">Créditos</SelectItem>
                    <SelectItem value="debit">Débitos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    <SelectItem value="reserva">Reservas</SelectItem>
                    <SelectItem value="convite">Convites</SelectItem>
                    <SelectItem value="bonus">Bônus</SelectItem>
                    <SelectItem value="recarga">Recargas</SelectItem>
                    <SelectItem value="reembolso">Reembolsos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros de busca
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === "credit"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingDown className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg ${
                            transaction.type === "credit"
                              ? "text-success"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.value)}
                        </div>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {transaction.status === "completed"
                            ? "Concluído"
                            : "Pendente"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
