import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface LoadingDemoButtonProps {
  onClick: () => void;
}

/**
 * Floating button to access Loading States Demo
 * Always visible in bottom-right corner
 */
export function LoadingDemoButton({ onClick }: LoadingDemoButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="fixed bottom-6 right-6 z-[100]"
          >
            <Button
              onClick={onClick}
              size="lg"
              className="h-14 w-14 rounded-full shadow-2xl hover:shadow-xl transition-shadow"
              aria-label="Ver demonstração de Loading States"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6" />
              </motion.div>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="font-medium">Loading States Demo</p>
          <p className="text-xs text-muted-foreground mt-1">
            Clique para ver spinners, skeletons e progress bars
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
