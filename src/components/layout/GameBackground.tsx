import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface GameBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'stadium' | 'track';
}

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