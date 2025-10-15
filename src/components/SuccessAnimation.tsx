import { motion } from "motion/react";
import { CheckCircle, Sparkles } from "lucide-react";

interface SuccessAnimationProps {
  title: string;
  message?: string;
}

export function SuccessAnimation({ title, message }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
      className="text-center py-12"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          duration: 0.8, 
          bounce: 0.6,
          delay: 0.2 
        }}
        className="relative inline-flex items-center justify-center mb-6"
      >
        {/* Pulsing background circle */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
        
        {/* Main circle */}
        <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CheckCircle className="h-12 w-12 text-primary" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: Math.cos((i / 8) * Math.PI * 2) * 60,
              y: Math.sin((i / 8) * Math.PI * 2) * 60,
            }}
            transition={{ 
              duration: 1.5,
              delay: 0.5 + (i * 0.1),
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </motion.div>
        ))}
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-2 text-primary">
          {title}
        </h2>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-muted-foreground"
          >
            {message}
          </motion.p>
        )}
      </motion.div>

      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -20, 
              x: Math.random() * window.innerWidth,
              opacity: 1
            }}
            animate={{ 
              y: window.innerHeight + 20,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              delay: 0.5 + Math.random() * 0.5,
              ease: "easeIn"
            }}
            className="absolute"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#16a34a', '#f97316', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 4)]
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
