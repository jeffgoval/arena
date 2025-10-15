import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Ruler,
  Droplet,
  Sun,
  Wind,
  ShowerHead,
  ParkingCircle,
  Wifi,
  Camera,
  Trophy,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CourtDetailsProps {
  courtId: string;
  onBack: () => void;
  onBookNow: () => void;
}

// Mock data
const courtData = {
  id: "1",
  name: "Quadra 1 - Society Premium",
  sport: "Futebol Society",
  rating: 4.8,
  reviewCount: 156,
  pricePerHour: 120,
  images: [
    "https://images.unsplash.com/photo-1680537732560-7dd5f9b1ed53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzb2NjZXIlMjBjb3VydHxlbnwxfHx8fDE3NjAzODkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1628314200733-5f7785cdc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZvbGxleWJhbGwlMjBjb3VydHxlbnwxfHx8fDE3NjAzMDY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1448743133657-f67644da3008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydHxlbnwxfHx8fDE3NjAzMzk5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzYwMjg0ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  description:
    "Quadra de futebol society coberta com grama sintética de última geração. Ambiente climatizado e iluminação profissional para jogos noturnos.",
  specifications: {
    size: "40m x 20m",
    surface: "Grama Sintética Premium",
    lighting: "LED Profissional 800 lux",
    capacity: "12 jogadores",
    covered: true,
    climate: "Climatizado",
  },
  amenities: [
    { icon: ShowerHead, label: "Vestiários", available: true },
    { icon: ParkingCircle, label: "Estacionamento", available: true },
    { icon: Wifi, label: "Wi-Fi Gratuito", available: true },
    { icon: Camera, label: "Câmeras de Segurança", available: true },
    { icon: Droplet, label: "Bebedouros", available: true },
    { icon: Wind, label: "Ventilação", available: true },
  ],
  rules: [
    "Uso obrigatório de tênis apropriado",
    "Proibido fumar nas dependências",
    "Respeitar horário de início e término",
    "Manter a quadra limpa e organizada",
    "Crianças devem estar acompanhadas",
  ],
  availability: [
    { day: "Seg", slots: 12, total: 14 },
    { day: "Ter", slots: 8, total: 14 },
    { day: "Qua", slots: 10, total: 14 },
    { day: "Qui", slots: 6, total: 14 },
    { day: "Sex", slots: 4, total: 14 },
    { day: "Sáb", slots: 9, total: 14 },
    { day: "Dom", slots: 11, total: 14 },
  ],
  pricing: [
    { period: "06:00 - 12:00", price: 100, label: "Manhã" },
    { period: "12:00 - 18:00", price: 120, label: "Tarde" },
    { period: "18:00 - 23:00", price: 150, label: "Noite" },
  ],
  reviews: [
    {
      id: 1,
      name: "Carlos Silva",
      initials: "CS",
      rating: 5,
      date: "2025-10-10",
      comment:
        "Excelente quadra! Grama sintética de ótima qualidade, vestiários limpos e bem equipados. Recomendo!",
    },
    {
      id: 2,
      name: "Ana Paula",
      initials: "AP",
      rating: 5,
      date: "2025-10-08",
      comment:
        "Melhor quadra da região. Iluminação perfeita para jogos noturnos e estacionamento fácil.",
    },
    {
      id: 3,
      name: "Roberto Santos",
      initials: "RS",
      rating: 4,
      date: "2025-10-05",
      comment:
        "Muito boa! Apenas o preço que é um pouco salgado, mas vale a pena pela qualidade.",
    },
  ],
};

export function CourtDetails({ courtId, onBack, onBookNow }: CourtDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % courtData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? courtData.images.length - 1 : prev - 1
    );
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
          <Button onClick={onBookNow} size="lg">
            Reservar Agora
          </Button>
        </div>
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
            <ImageWithFallback
              src={courtData.images[currentImageIndex]}
              alt={courtData.name}
              className="w-full h-full object-cover"
            />

            {/* Navigation arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-background/80 rounded-lg px-3 py-1.5 text-sm">
              {currentImageIndex + 1} / {courtData.images.length}
            </div>

            {/* View all button */}
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 left-4 bg-background/80 hover:bg-background rounded-lg px-4 py-2 text-sm transition-colors"
            >
              Ver todas as fotos
            </button>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {courtData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-video rounded-lg overflow-hidden ${
                  currentImageIndex === index
                    ? "ring-2 ring-primary"
                    : "opacity-60 hover:opacity-100"
                } transition-all`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${courtData.name} - Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-2">{courtData.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Arena Dona Santa</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">
                    {courtData.rating} ({courtData.reviewCount} avaliações)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">A partir de</div>
              <div className="text-3xl text-primary">
                R$ {courtData.pricePerHour}
              </div>
              <div className="text-sm text-muted-foreground">por hora</div>
            </div>
          </div>

          <p className="text-muted-foreground">{courtData.description}</p>
        </motion.div>

        {/* Tabs Content */}
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specs">Especificações</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
            <TabsTrigger value="pricing">Preços</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>

          {/* Specifications */}
          <TabsContent value="specs" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4">Especificações Técnicas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Ruler className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Dimensões</div>
                      <div>{courtData.specifications.size}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Piso</div>
                      <div>{courtData.specifications.surface}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Iluminação</div>
                      <div>{courtData.specifications.lighting}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Capacidade</div>
                      <div>{courtData.specifications.capacity}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wind className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Ambiente</div>
                      <div>{courtData.specifications.climate}</div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {courtData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <amenity.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>

                <h3 className="mb-4">Regras da Quadra</h3>
                <ul className="space-y-2">
                  {courtData.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-sm text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability */}
          <TabsContent value="availability">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4">Disponibilidade Semanal</h3>
                <div className="space-y-4">
                  {courtData.availability.map((day, index) => {
                    const percentage = (day.slots / day.total) * 100;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span>{day.day}</span>
                          <span className="text-sm text-muted-foreground">
                            {day.slots} de {day.total} horários disponíveis
                          </span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4">Preços por Período</h3>
                <div className="space-y-3">
                  {courtData.pricing.map((period, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{period.label}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {period.period}
                        </div>
                      </div>
                      <div className="text-2xl text-primary">R$ {period.price}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="mb-2">Descontos Disponíveis</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 10% de desconto para reservas mensais</li>
                    <li>• 15% de desconto para assinantes Premium</li>
                    <li>• 5% de desconto em horários de manhã (6h-12h)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="mb-1">Avaliações dos Usuários</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= courtData.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {courtData.rating} de 5 ({courtData.reviewCount} avaliações)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {courtData.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>{review.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{review.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1">Pronto para reservar?</h3>
              <p className="text-sm text-muted-foreground">
                Reserve agora e garanta seu horário favorito
              </p>
            </div>
            <Button onClick={onBookNow} size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Fazer Reserva
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2>Galeria de Fotos</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGallery(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
              {courtData.images.map((image, index) => (
                <div key={index} className="aspect-video rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={image}
                    alt={`${courtData.name} - Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
