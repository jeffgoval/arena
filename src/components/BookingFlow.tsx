import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  MapPin,
  CreditCard,
  Check,
  X,
  Info
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { useBookingPersistence } from "../hooks/useBookingPersistence";
import { ROUTES } from "../config/routes";
import { toast } from "sonner@2.0.3";

const courts = [
  {
    id: 1,
    name: "Quadra 1 - Society",
    type: "Futebol Society",
    image: "https://images.unsplash.com/photo-1680537732560-7dd5f9b1ed53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzb2NjZXIlMjBjb3VydHxlbnwxfHx8fDE3NjAzODkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    capacity: "10 jogadores",
    floor: "Grama sintética"
  },
  {
    id: 2,
    name: "Quadra 2 - Poliesportiva",
    type: "Vôlei, Basquete, Futsal",
    image: "https://images.unsplash.com/photo-1759365840088-cdb7f739aa7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb3VydCUyMGFyZW5hfGVufDF8fHx8MTc2MDM4OTE2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    capacity: "12 jogadores",
    floor: "Piso sintético"
  },
  {
    id: 3,
    name: "Quadra 3 - Beach Tennis",
    type: "Beach Tennis",
    image: "https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzYwMzI4ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    capacity: "4 jogadores",
    floor: "Areia"
  }
];

const timeSlots = [
  { time: "06:00", status: "available", price: 100 },
  { time: "07:00", status: "available", price: 100 },
  { time: "08:00", status: "occupied", price: 120 },
  { time: "09:00", status: "available", price: 120 },
  { time: "10:00", status: "available", price: 120 },
  { time: "11:00", status: "occupied", price: 120 },
  { time: "12:00", status: "available", price: 100 },
  { time: "13:00", status: "available", price: 100 },
  { time: "14:00", status: "available", price: 100 },
  { time: "15:00", status: "occupied", price: 120 },
  { time: "16:00", status: "available", price: 120 },
  { time: "17:00", status: "available", price: 120 },
  { time: "18:00", status: "occupied", price: 150 },
  { time: "19:00", status: "available", price: 150 },
  { time: "20:00", status: "available", price: 150 },
  { time: "21:00", status: "blocked", price: 150 },
  { time: "22:00", status: "available", price: 130 },
];

interface BookingFlowProps {
  onBack: () => void;
}

export function BookingFlow({ onBack }: BookingFlowProps) {
  const { isAuthenticated } = useAuth();
  const { pendingBooking, saveBooking, clearBooking } = useBookingPersistence();
  
  const [step, setStep] = useState(1);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState("avulsa");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const selectedSlot = timeSlots.find(slot => slot.time === selectedTime);
  const selectedCourtData = courts.find(court => court.id === selectedCourt);
  const totalPrice = selectedSlot?.price || 0;
  const discount = couponApplied ? 10 : 0;
  const finalPrice = totalPrice - discount;

  // Restore pending booking after login
  useEffect(() => {
    if (pendingBooking && isAuthenticated) {
      // Restore booking data
      const courtData = courts.find(c => c.id.toString() === pendingBooking.courtId);
      if (courtData) {
        setSelectedCourt(courtData.id);
        setSelectedTime(pendingBooking.timeSlot);
        setSelectedDate(new Date(pendingBooking.date));
        setStep(3); // Go to confirmation step
        
        toast.success("Reserva restaurada!", {
          description: "Continue de onde você parou.",
        });
        
        // Clear pending booking
        clearBooking();
      }
    }
  }, [pendingBooking, isAuthenticated, clearBooking]);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "primeira") {
      setCouponApplied(true);
    }
  };

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      // Save booking data and redirect to login
      if (selectedCourtData && selectedDate && selectedTime && selectedSlot) {
        saveBooking({
          courtId: selectedCourtData.id.toString(),
          courtName: selectedCourtData.name,
          date: selectedDate.toISOString(),
          timeSlot: selectedTime,
          duration: 1,
          price: finalPrice,
        });
        
        toast.info("Faça login para confirmar sua reserva", {
          description: "Seus dados foram salvos e você poderá continuar após o login.",
          duration: 5000,
        });
        
        // Redirect to login (use window location for now)
        window.location.hash = `#${ROUTES.LOGIN}`;
      }
    } else {
      // User is authenticated - proceed to payment
      toast.success("Reserva confirmada com sucesso!");
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Main Content */}
          <div>
            {/* Step 1: Seleção de Quadra e Data */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Escolha a Quadra</h1>
                  <p className="text-muted-foreground">Selecione a quadra e o tipo de reserva</p>
                </div>

                {/* Tipo de Reserva */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tipo de Reserva</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={bookingType} onValueChange={setBookingType}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                        <RadioGroupItem value="avulsa" id="avulsa" />
                        <Label htmlFor="avulsa" className="flex-1 cursor-pointer">
                          <div className="font-medium">Reserva Avulsa</div>
                          <div className="text-sm text-muted-foreground">Para um único horário</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                        <RadioGroupItem value="mensalista" id="mensalista" />
                        <Label htmlFor="mensalista" className="flex-1 cursor-pointer">
                          <div className="font-medium">Mensalista</div>
                          <div className="text-sm text-muted-foreground">Mesmo horário todo mês</div>
                        </Label>
                        <Badge variant="secondary">15% OFF</Badge>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                        <RadioGroupItem value="recorrente" id="recorrente" />
                        <Label htmlFor="recorrente" className="flex-1 cursor-pointer">
                          <div className="font-medium">Recorrente</div>
                          <div className="text-sm text-muted-foreground">Mesmo horário toda semana</div>
                        </Label>
                        <Badge variant="secondary">10% OFF</Badge>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Quadras */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courts.map((court) => (
                    <Card 
                      key={court.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedCourt === court.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedCourt(court.id)}
                    >
                      <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                        <ImageWithFallback
                          src={court.image}
                          alt={court.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{court.name}</CardTitle>
                        <CardDescription>{court.type}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          {court.floor}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {court.capacity}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Calendário */}
                {selectedCourt && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Escolha a Data</CardTitle>
                      <CardDescription>Selecione o dia desejado</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button 
                    size="lg"
                    onClick={() => setStep(2)}
                    disabled={!selectedCourt || !selectedDate}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Escolha de Horários */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Escolha o Horário</h1>
                  <p className="text-muted-foreground">Selecione o melhor horário para você</p>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Horários Disponíveis</CardTitle>
                        <CardDescription>
                          {selectedDate?.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: '2-digit', 
                            month: 'long' 
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded bg-available" />
                          <span>Disponível</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded bg-occupied" />
                          <span>Ocupado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded bg-blocked" />
                          <span>Bloqueado</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={slot.status !== 'available'}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            slot.status === 'available' 
                              ? selectedTime === slot.time
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                              : 'border-border opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="font-semibold">{slot.time}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {slot.status === 'available' ? (
                              <span className="text-primary font-medium">R$ {slot.price}</span>
                            ) : slot.status === 'occupied' ? (
                              <span>Ocupado</span>
                            ) : (
                              <span>Bloqueado</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!selectedTime}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pagamento */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Pagamento</h1>
                  <p className="text-muted-foreground">Confirme sua reserva e escolha a forma de pagamento</p>
                </div>

                {/* Login Required Alert - Only show if not authenticated */}
                {!isAuthenticated && (
                  <Alert className="border-primary/50 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertTitle>Próximo passo: Login</AlertTitle>
                    <AlertDescription>
                      Para confirmar sua reserva, você precisará fazer login ou criar uma conta.
                      Não se preocupe, salvaremos todos os seus dados!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Cupom de Desconto */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cupom de Desconto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Digite o código do cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !couponCode}
                        variant={couponApplied ? "secondary" : "default"}
                      >
                        {couponApplied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Aplicado
                          </>
                        ) : (
                          "Aplicar"
                        )}
                      </Button>
                    </div>
                    {couponApplied && (
                      <p className="text-sm text-primary mt-2">
                        Desconto de R$ {discount} aplicado!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Forma de Pagamento */}
                <Card>
                  <CardHeader>
                    <CardTitle>Forma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5" />
                              <div>
                                <div className="font-medium">Cartão de Crédito</div>
                                <div className="text-sm text-muted-foreground">À vista ou parcelado</div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                          <RadioGroupItem value="pix" id="pix" />
                          <Label htmlFor="pix" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                PIX
                              </div>
                              <div>
                                <div className="font-medium">PIX</div>
                                <div className="text-sm text-muted-foreground">Aprovação imediata</div>
                              </div>
                            </div>
                          </Label>
                          <Badge variant="secondary">5% OFF</Badge>
                        </div>

                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary cursor-pointer">
                          <RadioGroupItem value="creditos" id="creditos" />
                          <Label htmlFor="creditos" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-5 rounded-full bg-primary/10" />
                              <div>
                                <div className="font-medium">Usar Créditos</div>
                                <div className="text-sm text-muted-foreground">Saldo disponível: R$ 250,00</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {paymentMethod === "credit" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Dados do Cartão</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Número do Cartão</Label>
                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Validade</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Nome no Cartão</Label>
                        <Input id="card-name" placeholder="Nome como está no cartão" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button 
                    size="lg"
                    onClick={handleConfirmBooking}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Confirmar Reserva
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Resumo */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCourtData && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Quadra</div>
                      <div className="font-medium">{selectedCourtData.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedCourtData.type}</div>
                    </div>
                    <Separator />
                  </>
                )}

                {selectedDate && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Data</div>
                      <div className="font-medium">
                        {selectedDate.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {selectedTime && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Horário</div>
                      <div className="font-medium">{selectedTime}</div>
                    </div>
                    <Separator />
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor</span>
                        <span>R$ {totalPrice.toFixed(2)}</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-primary">
                          <span>Desconto</span>
                          <span>- R$ {discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">R$ {finalPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {!selectedCourt && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Selecione uma quadra para começar
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
