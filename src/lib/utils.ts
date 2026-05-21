/* ===== FILE OVERVIEW ===== */
/* Summary: Shared utility functions — currently provides the Tailwind class merger helper */

import { clsx, type ClassValue } from 'clsx';         /* Conditional class string builder */
import { twMerge } from 'tailwind-merge';              /* Resolves conflicting Tailwind classes */

/* ===== TAILWIND CLASS MERGER ===== */
/* Merges multiple class values (strings, objects, arrays) into a single deduplicated className string */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));  /* clsx builds string → twMerge removes conflicts */
}
