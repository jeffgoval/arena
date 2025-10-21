import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export all utilities for easy access
export * from './utils/currency'
export * from './utils/date'
export * from './utils/cpf'
