import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Theme } from "../types";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("arena_theme");
    return (stored as Theme) || "auto";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    
    let computed: "light" | "dark" = "light";
    
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      computed = mediaQuery.matches ? "dark" : "light";
      
      const handler = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light";
        setEffectiveTheme(newTheme);
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
      };
      
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      computed = theme;
    }
    
    setEffectiveTheme(computed);
    root.classList.remove("light", "dark");
    root.classList.add(computed);
    localStorage.setItem("arena_theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
