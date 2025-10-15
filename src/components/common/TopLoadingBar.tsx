/**
 * Top Loading Bar
 * Shows loading progress at top of page during navigation
 */

import { useEffect, useState } from "react";

interface TopLoadingBarProps {
  isLoading: boolean;
}

export function TopLoadingBar({ isLoading }: TopLoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(timer);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-[9999]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Carregando página"
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px var(--primary), 0 0 5px var(--primary)'
        }}
      />
    </div>
  );
}
