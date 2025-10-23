/**
 * Theme Configuration
 * Utilities for theme management and color scheme handling
 */

export type Theme = 'light' | 'dark' | 'system';

export const themeConfig = {
  defaultTheme: 'system' as Theme,
  storageKey: 'arena-theme',
  attribute: 'class',
  enableSystem: true,
  disableTransitionOnChange: false,
};

// Color palette with semantic naming
export const colorPalette = {
  // Brand Colors
  brand: {
    primary: 'hsl(142, 76%, 36%)',     // Arena Green
    secondary: 'hsl(217, 91%, 60%)',   // Arena Blue
    accent: 'hsl(220, 70%, 50%)',      // Arena Blue Dark
  },

  // Semantic Colors
  semantic: {
    success: 'hsl(142, 76%, 36%)',
    warning: 'hsl(38, 92%, 50%)',
    error: 'hsl(0, 84%, 60%)',
    info: 'hsl(217, 91%, 60%)',
  },

  // Neutral Colors
  neutral: {
    50: 'hsl(0, 0%, 98%)',
    100: 'hsl(240, 5%, 96%)',
    200: 'hsl(240, 6%, 90%)',
    300: 'hsl(240, 5%, 84%)',
    400: 'hsl(240, 5%, 65%)',
    500: 'hsl(240, 4%, 46%)',
    600: 'hsl(240, 5%, 34%)',
    700: 'hsl(240, 5%, 26%)',
    800: 'hsl(240, 4%, 16%)',
    900: 'hsl(240, 6%, 10%)',
    950: 'hsl(240, 10%, 4%)',
  },
} as const;

// Theme utilities
export const getThemeColors = (theme: 'light' | 'dark') => {
  const base = {
    primary: colorPalette.brand.primary,
    secondary: colorPalette.brand.secondary,
    accent: colorPalette.brand.accent,
    success: colorPalette.semantic.success,
    warning: colorPalette.semantic.warning,
    error: colorPalette.semantic.error,
    info: colorPalette.semantic.info,
  };

  if (theme === 'light') {
    return {
      ...base,
      background: colorPalette.neutral[50],
      foreground: colorPalette.neutral[900],
      muted: colorPalette.neutral[100],
      mutedForeground: colorPalette.neutral[500],
      border: colorPalette.neutral[200],
      input: colorPalette.neutral[200],
    };
  }

  return {
    ...base,
    background: colorPalette.neutral[950],
    foreground: colorPalette.neutral[50],
    muted: colorPalette.neutral[800],
    mutedForeground: colorPalette.neutral[400],
    border: colorPalette.neutral[800],
    input: colorPalette.neutral[800],
  };
};

// CSS custom properties generator
export const generateCSSVariables = (theme: 'light' | 'dark') => {
  const colors = getThemeColors(theme);
  
  return Object.entries(colors).reduce((acc, [key, value]) => {
    // Convert HSL to individual values for CSS variables
    const hslMatch = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      acc[`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = `${h} ${s}% ${l}%`;
    }
    return acc;
  }, {} as Record<string, string>);
};