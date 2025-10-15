import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Trophy, ArrowLeft, Loader2, Clock } from "lucide-react";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { useBookingPersistence } from "../hooks/useBookingPersistence";
import { ROUTES } from "../config/routes";
import { toast } from "sonner@2.0.3";

interface LoginProps {
  onBack: () => void;
  onLoginClient: () => void;
  onLoginManager: () => void;
  onSignup: () => void;
}

export function Login({ onBack, onLoginClient, onLoginManager, onSignup }: LoginProps) {
  const { login, isLoading } = useAuth();
  const { pendingBooking } = useBookingPersistence();
  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(clientEmail, clientPassword, "client");
      
      // If there's a pending booking, redirect to booking flow
      if (pendingBooking) {
        toast.success("Login realizado! Finalize sua reserva.", {
          description: "Redirecionando para o pagamento...",
        });
        setTimeout(() => {
          window.location.hash = `#${ROUTES.BOOKING}`;
        }, 1000);
      } else {
        toast.success("Login realizado com sucesso!");
        onLoginClient();
      }
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    }
  };

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(managerEmail, managerPassword, "manager");
      toast.success("Login realizado com sucesso!");
      onLoginManager();
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {/* Container: 360px max (reduzido ~6% de 384px) */}
      <div className="w-full max-w-[360px]">
        {/* Botão Voltar */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Card Principal */}
        <Card>
          <CardHeader className="text-center space-y-3 pb-4">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-7 w-7 text-primary flex-shrink-0" />
              <span className="text-xl font-bold">Arena Dona Santa</span>
            </div>
            
            {/* Títulos */}
            <div>
              <CardTitle>Bem-vindo de volta!</CardTitle>
              <CardDescription className="mt-1.5">
                Entre com sua conta para continuar
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            {/* Pending Booking Alert */}
            {pendingBooking && (
              <Alert className="mb-5 border-primary/50 bg-primary/5">
                <Clock className="h-4 w-4 text-primary" />
                <AlertTitle>Reserva em Andamento</AlertTitle>
                <AlertDescription>
                  Faça login para confirmar sua reserva da{" "}
                  <strong>{pendingBooking.courtName}</strong> para{" "}
                  <strong>{new Date(pendingBooking.date).toLocaleDateString('pt-BR')}</strong> às{" "}
                  <strong>{pendingBooking.timeSlot}</strong>.
                </AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="client" className="w-full">
              {/* Tabs Switch */}
              <TabsList className="grid w-full grid-cols-2 mb-5">
                <TabsTrigger value="client">Cliente</TabsTrigger>
                <TabsTrigger value="manager">Gestor</TabsTrigger>
              </TabsList>

              {/* Cliente Login */}
              <TabsContent value="client" className="mt-0">
                <form onSubmit={handleClientLogin} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="client-email">Email ou CPF</Label>
                    <Input
                      id="client-email"
                      type="text"
                      placeholder="seu@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Senha */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-password">Senha</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Esqueceu?
                      </a>
                    </div>
                    <Input
                      id="client-password"
                      type="password"
                      placeholder="••••••••"
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Botão Entrar */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 mt-6" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>

                  <Separator className="my-5" />

                  {/* Link Criar Conta */}
                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Não tem uma conta? </span>
                    <button
                      type="button"
                      onClick={onSignup}
                      className="text-primary hover:underline font-medium"
                    >
                      Criar conta
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* Gestor Login */}
              <TabsContent value="manager" className="mt-0">
                <form onSubmit={handleManagerLogin} className="space-y-4">
                  {/* Login */}
                  <div className="space-y-1.5">
                    <Label htmlFor="manager-email">Login</Label>
                    <Input
                      id="manager-email"
                      type="text"
                      placeholder="admin"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Senha */}
                  <div className="space-y-1.5">
                    <Label htmlFor="manager-password">Senha</Label>
                    <Input
                      id="manager-password"
                      type="password"
                      placeholder="••••••••"
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Botão Entrar */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 mt-6 bg-secondary hover:bg-secondary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar como Gestor"
                    )}
                  </Button>

                  {/* Aviso */}
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Acesso restrito a administradores
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-4 px-2">
          Ao entrar, você concorda com nossos{" "}
          <span className="text-primary hover:underline cursor-pointer">Termos de Uso</span>
          {" "}e{" "}
          <span className="text-primary hover:underline cursor-pointer">Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
}
