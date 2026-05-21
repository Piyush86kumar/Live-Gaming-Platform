/* ===== FILE OVERVIEW ===== */
/* Summary: Provides the stadium/track gradient background that wraps every page */

import { cn } from '@/lib/utils';       /* Utility for merging Tailwind classes */
import { type ReactNode } from 'react';  /* Type for children prop */

/* ===== PROPS INTERFACE ===== */
interface GameBackgroundProps {
  children: ReactNode;    /* Page content rendered on top of background */
  className?: string;     /* Additional custom CSS classes */
  variant?: 'stadium' | 'track';  /* Background style variant */
}

/* ===== COMPONENT ===== */
export function GameBackground({ children, className, variant = 'stadium' }: GameBackgroundProps) {
  return (
    <div className={cn('w-full h-full overflow-hidden', className)}>
      {variant === 'stadium' ? (
        <div className="bg-stadium w-full h-full">
          <div className="relative z-10 w-full h-full flex flex-col">
            {children}
          </div>
        </div>
      ) : (
        <div className="bg-track w-full h-full">
          <div className="relative z-10 w-full h-full flex flex-col">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
