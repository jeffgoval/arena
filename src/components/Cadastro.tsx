import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Trophy, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { useBookingPersistence } from "../hooks/useBookingPersistence";
import { ROUTES } from "../config/routes";
import { toast } from "sonner@2.0.3";

interface CadastroProps {
  onBack: () => void;
  onComplete: () => void;
}

export function Cadastro({ onBack, onComplete }: CadastroProps) {
  const { login, isLoading } = useAuth();
  const { pendingBooking } = useBookingPersistence();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    cep: "",
    street: "",
    number: "",
    city: "",
    state: ""
  });

  const progress = (step / 3) * 100;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete registration and auto-login
      try {
        await login(formData.email, formData.password, "client");
        
        // If there's a pending booking, redirect to booking flow
        if (pendingBooking) {
          toast.success("Cadastro realizado! Finalize sua reserva.", {
            description: "Redirecionando para o pagamento...",
          });
          setTimeout(() => {
            window.location.hash = `#${ROUTES.BOOKING}`;
          }, 1000);
        } else {
          toast.success("Cadastro realizado com sucesso!");
          onComplete();
        }
      } catch (error) {
        toast.error("Erro ao completar cadastro. Tente novamente.");
      }
    }
  };

  const stepTitles = ["Dados Pessoais", "Contato", "Endereço"];

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
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription className="mt-1.5">
                Preencha seus dados para começar
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            {/* Pending Booking Alert - Only on step 1 */}
            {step === 1 && pendingBooking && (
              <Alert className="mb-5 border-primary/50 bg-primary/5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle>Complete seu cadastro</AlertTitle>
                <AlertDescription>
                  Você está a poucos passos de confirmar sua reserva da{" "}
                  <strong>{pendingBooking.courtName}</strong>!
                </AlertDescription>
              </Alert>
            )}

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Etapa {step} de 3</span>
                <span className="text-xs text-muted-foreground">{stepTitles[step - 1]}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <form onSubmit={handleNext} className="space-y-4">
              {/* Step 1: Dados Pessoais */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* CPF */}
                  <div className="space-y-1.5">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => handleChange("cpf", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Senha */}
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Confirmar Senha */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite novamente"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contato */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone/WhatsApp</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Para confirmações e convites
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Endereço */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* CEP */}
                  <div className="space-y-1.5">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={(e) => handleChange("cep", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Rua */}
                  <div className="space-y-1.5">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      placeholder="Nome da rua"
                      value={formData.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Número e Cidade (grid compacto) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        value={formData.number}
                        onChange={(e) => handleChange("number", e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="SP"
                        maxLength={2}
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
                        required
                        className="h-11 uppercase"
                      />
                    </div>
                  </div>

                  {/* Cidade */}
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="Sua cidade"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-5">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 h-11"
                  >
                    Voltar
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className={`${step === 1 ? 'w-full' : 'flex-1'} h-11`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : step === 3 ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Criar Conta
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </div>
            </form>

            {/* Benefits - Only on Step 1 */}
            {step === 1 && (
              <div className="mt-6 pt-5 border-t">
                <p className="text-sm font-medium mb-2.5">O que você ganha:</p>
                <div className="space-y-2">
                  {[
                    "Reservas online 24/7",
                    "Organize jogos com amigos",
                    "R$ 20 de bônus na 1ª reserva",
                    "Programa de indicação"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Já tem uma conta?{" "}
          <button onClick={onBack} className="text-primary hover:underline font-medium">
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}
