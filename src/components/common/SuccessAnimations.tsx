/**
 * Success Animations
 * Animated feedback for successful actions
 */

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Check, Sparkles, Trophy, Gift, Star, PartyPopper, Heart } from "lucide-react";
import { cn } from "../../lib/utils";

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  variant?: "checkmark" | "celebration" | "subtle" | "badge" | "heart";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Animated Checkmark
 * Classic success animation with checkmark
 */
export function AnimatedCheckmark({
  show,
  onComplete,
  size = "md",
  className,
}: SuccessAnimationProps) {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className={cn("relative", sizeClasses[size], className)}
        >
          {/* Circle background */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="absolute inset-0 bg-success rounded-full"
          />

          {/* Checkmark */}
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckCircle2 className="h-full w-full text-success-foreground p-3" />
          </motion.div>

          {/* Ripple effect */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-success rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Celebration Animation
 * Confetti-like animation for major achievements
 */
export function CelebrationAnimation({
  show,
  onComplete,
  size = "lg",
  className,
}: SuccessAnimationProps) {
  const confettiColors = [
    "bg-primary",
    "bg-accent",
    "bg-warning",
    "bg-info",
    "bg-success",
  ];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn("relative flex items-center justify-center", className)}
        >
          {/* Trophy/Star icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <Trophy className="h-16 w-16 text-warning" />
          </motion.div>

          {/* Confetti particles */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x,
                  y,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.02,
                  ease: "easeOut",
                }}
                className={cn(
                  "absolute h-2 w-2 rounded-full",
                  confettiColors[i % confettiColors.length]
                )}
              />
            );
          })}

          {/* Sparkles */}
          {Array.from({ length: 4 }).map((_, i) => {
            const positions = [
              { x: -40, y: -40 },
              { x: 40, y: -40 },
              { x: -40, y: 40 },
              { x: 40, y: 40 },
            ];

            return (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.1,
                }}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${positions[i].x}px)`,
                  top: `calc(50% + ${positions[i].y}px)`,
                }}
              >
                <Sparkles className="h-4 w-4 text-warning" />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Subtle Success
 * Minimal animation for frequent actions
 */
export function SubtleSuccess({
  show,
  onComplete,
  className,
}: SuccessAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("inline-flex items-center gap-2 text-success", className)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Check className="h-5 w-5" />
          </motion.div>
          <span className="text-sm">Salvo</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Badge Earned Animation
 * For achievements and unlocks
 */
export function BadgeEarnedAnimation({
  show,
  onComplete,
  badgeIcon: BadgeIcon = Star,
  badgeName = "Conquista",
  className,
}: SuccessAnimationProps & {
  badgeIcon?: React.ComponentType<{ className?: string }>;
  badgeName?: string;
}) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "bg-gradient-to-br from-warning via-accent to-primary p-6 rounded-2xl shadow-lg",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex flex-col items-center gap-3"
          >
            {/* Badge icon with glow */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255, 255, 255, 0)",
                  "0 0 20px rgba(255, 255, 255, 0.5)",
                  "0 0 0px rgba(255, 255, 255, 0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative p-4 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <BadgeIcon className="h-12 w-12 text-white" />
              
              {/* Rotating stars */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.3 + i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  style={{
                    position: "absolute",
                    left: `${50 + Math.cos((i / 3) * Math.PI * 2) * 150}%`,
                    top: `${50 + Math.sin((i / 3) * Math.PI * 2) * 150}%`,
                  }}
                >
                  <Sparkles className="h-3 w-3 text-white" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-white/80 text-sm">Nova conquista!</p>
              <p className="text-white font-semibold">{badgeName}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Heart Animation
 * For favorites, likes, and love actions
 */
export function HeartAnimation({
  show,
  onComplete,
  size = "md",
  className,
}: SuccessAnimationProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1.2, 0.9, 1],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.6,
            times: [0, 0.4, 0.7, 1],
          }}
          className={cn("relative", className)}
        >
          <Heart
            className={cn(sizeClasses[size], "fill-destructive text-destructive")}
          />

          {/* Particles */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x,
                  y,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                }}
                className="absolute top-1/2 left-1/2 h-1 w-1 bg-destructive rounded-full"
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Success Overlay
 * Full-screen success animation
 */
export function SuccessOverlay({
  show,
  onComplete,
  title = "Sucesso!",
  description,
  variant = "checkmark",
}: SuccessAnimationProps & {
  title?: string;
  description?: string;
}) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-6 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animation */}
            {variant === "checkmark" && (
              <AnimatedCheckmark show={true} size="xl" />
            )}
            {variant === "celebration" && (
              <CelebrationAnimation show={true} size="xl" />
            )}

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-2"
            >
              <h2 className="text-2xl font-semibold">{title}</h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Loading to Success
 * Morphs from loading spinner to checkmark
 */
export function LoadingToSuccess({
  loading,
  success,
  onComplete,
  className,
}: {
  loading: boolean;
  success: boolean;
  onComplete?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative h-16 w-16", className)}>
      <AnimatePresence mode="wait" onExitComplete={onComplete}>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <div className="h-full w-full border-4 border-primary/30 border-t-primary rounded-full" />
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute inset-0"
          >
            <AnimatedCheckmark show={true} size="md" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
