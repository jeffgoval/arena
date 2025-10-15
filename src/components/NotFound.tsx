import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Home, ArrowLeft, Search, MapPin } from "lucide-react";

interface NotFoundProps {
  onGoHome?: () => void;
  onGoBack?: () => void;
  title?: string;
  message?: string;
  showSearch?: boolean;
}

/**
 * 404 Not Found Page
 * Displayed when user navigates to a non-existent route
 */
export function NotFound({
  onGoHome,
  onGoBack,
  title = "Página não encontrada",
  message = "A página que você está procurando não existe ou foi movida.",
  showSearch = false,
}: NotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Large 404 Text */}
          <div className="relative">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-[150px] md:text-[200px] font-bold text-muted/20 leading-none select-none"
            >
              404
            </motion.h1>

            {/* Animated Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="p-6 rounded-full bg-primary/10">
                <MapPin className="h-16 w-16 md:h-20 md:w-20 text-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {message}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {onGoHome && (
            <Button onClick={onGoHome} size="lg" className="gap-2 min-w-[200px]">
              <Home className="h-5 w-5" />
              Ir para Início
            </Button>
          )}
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline" size="lg" className="gap-2 min-w-[200px]">
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Button>
          )}
        </motion.div>

        {/* Search Suggestion */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-8 border-t border-border max-w-md mx-auto"
          >
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground text-left">
                Experimente usar a busca para encontrar o que você procura.
              </p>
            </div>
          </motion.div>
        )}

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="pt-4"
        >
          <p className="text-sm text-muted-foreground mb-3">
            Páginas úteis:
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="text-primary hover:underline"
              >
                Início
              </button>
            )}
            <span className="text-muted-foreground">•</span>
            <button
              onClick={onGoHome}
              className="text-primary hover:underline"
            >
              Reservas
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              onClick={onGoHome}
              className="text-primary hover:underline"
            >
              FAQ
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              onClick={onGoHome}
              className="text-primary hover:underline"
            >
              Contato
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Simple 404 Component (inline usage)
 */
export function Simple404({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="py-16 text-center">
      <h1 className="text-6xl font-bold text-muted mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Página não encontrada</p>
      <Button onClick={onGoHome} className="gap-2">
        <Home className="h-4 w-4" />
        Ir para Início
      </Button>
    </div>
  );
}
