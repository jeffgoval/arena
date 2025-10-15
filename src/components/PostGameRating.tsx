import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Star, 
  Smile, 
  Meh, 
  Frown, 
  ThumbsUp,
  X,
  CheckCircle
} from "lucide-react";
import { Separator } from "./ui/separator";

interface PostGameRatingProps {
  isOpen: boolean;
  onClose: () => void;
  gameDetails: {
    court: string;
    date: string;
    time: string;
  };
  participants?: Array<{
    id: number;
    name: string;
    initials: string;
  }>;
  isOrganizer?: boolean;
}

const ratingOptions = [
  { value: "excellent", label: "Excelente", icon: Smile, color: "text-primary", bgColor: "bg-primary/10" },
  { value: "good", label: "Boa", icon: ThumbsUp, color: "text-info", bgColor: "bg-info/10" },
  { value: "regular", label: "Regular", icon: Meh, color: "text-warning", bgColor: "bg-warning/10" },
  { value: "bad", label: "Ruim", icon: Frown, color: "text-destructive", bgColor: "bg-destructive/10" }
];

export function PostGameRating({ 
  isOpen, 
  onClose, 
  gameDetails,
  participants = [],
  isOrganizer = false
}: PostGameRatingProps) {
  const [overallRating, setOverallRating] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [participantRatings, setParticipantRatings] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleParticipantRating = (participantId: number, rating: number) => {
    setParticipantRatings(prev => ({ ...prev, [participantId]: rating }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset state
      setTimeout(() => {
        setSubmitted(false);
        setOverallRating(null);
        setComment("");
        setParticipantRatings({});
      }, 300);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-2">
                {!submitted ? (
                  <>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">Como foi o jogo?</CardTitle>
                          <CardDescription className="mt-2">
                            {gameDetails.court} • {gameDetails.date} às {gameDetails.time}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Overall Rating */}
                      <div>
                        <h3 className="font-semibold mb-4">Avalie a experiência geral</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {ratingOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isSelected = overallRating === option.value;
                            
                            return (
                              <motion.button
                                key={option.value}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setOverallRating(option.value)}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? `${option.bgColor} border-current ${option.color}`
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? option.color : "text-muted-foreground"}`} />
                                <div className={`text-sm font-medium ${isSelected ? option.color : ""}`}>
                                  {option.label}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comment */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="font-semibold mb-2">Comentário (opcional)</h3>
                        <Textarea
                          placeholder="Conte-nos mais sobre sua experiência..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </motion.div>

                      {/* Participant Ratings (if organizer) */}
                      {isOrganizer && participants.length > 0 && (
                        <>
                          <Separator />
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h3 className="font-semibold mb-4">Avaliar Participantes</h3>
                            <div className="space-y-3">
                              {participants.map((participant, index) => (
                                <motion.div
                                  key={participant.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.6 + index * 0.05 }}
                                  className="flex items-center justify-between p-3 rounded-lg border"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarFallback>{participant.initials}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{participant.name}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <motion.button
                                        key={rating}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleParticipantRating(participant.id, rating)}
                                      >
                                        <Star
                                          className={`h-5 w-5 transition-colors ${
                                            (participantRatings[participant.id] || 0) >= rating
                                              ? "fill-accent text-accent"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      </motion.button>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}

                      {/* Submit Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          className="w-full bg-accent hover:bg-accent/90"
                          size="lg"
                          onClick={handleSubmit}
                          disabled={!overallRating}
                        >
                          Enviar Avaliação
                        </Button>
                      </motion.div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="py-16">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", duration: 0.6, bounce: 0.5 }}
                        className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4"
                      >
                        <CheckCircle className="h-10 w-10 text-primary" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold mb-2"
                      >
                        Obrigado!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground"
                      >
                        Sua avaliação foi enviada com sucesso
                      </motion.p>
                    </motion.div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
