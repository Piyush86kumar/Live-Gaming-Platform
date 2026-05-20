import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface GlowTextProps {
  children: ReactNode;
  variant?: 'blue' | 'gold' | 'white' | 'pink';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export function GlowText({ 
  children, 
  variant = 'blue', 
  size = 'md', 
  className,
  as: Component = 'div'
}: GlowTextProps) {
  const variants = {
    blue: 'text-[#00d4ff] drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]',
    gold: 'text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]',
    white: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]',
    pink: 'text-[#ff00d4] drop-shadow-[0_0_10px_rgba(255,0,212,0.5)]',
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  return (
    <Component className={cn(
      'font-heading font-bold tracking-wide',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </Component>
  );
}
