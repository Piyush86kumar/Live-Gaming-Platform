/* ===== FILE: NeonPanel.tsx ===== */
/* Summary: A container card with configurable glow border colour and padding, backing blurred glass effect. */

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

/* ===== PROPS INTERFACE ===== */
/* Summary: glowColor = border/shadow accent colour; padding = inner spacing preset; onClick/onMouse* = interaction handlers. */
interface NeonPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'gold' | 'green' | 'red';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/* ===== COMPONENT ===== */
export function NeonPanel({ 
  children, 
  className, 
  glowColor = 'blue',
  padding = 'md',
  onClick,
  onMouseEnter,
  onMouseLeave
}: NeonPanelProps) {
  /* ===== GLOW COLOUR STYLES ===== */
  /* Each colour sets border opacity, inner shadow, and hover-intensified glow with outer spread. */
  const glowStyles = {
    blue: 'border-[rgba(0,212,255,0.3)] shadow-[inset_0_0_20px_rgba(0,212,255,0.05)] hover:border-[rgba(0,212,255,0.6)] hover:shadow-[inset_0_0_30px_rgba(0,212,255,0.1),0_0_20px_rgba(0,212,255,0.2)]',
    gold: 'border-[rgba(255,215,0,0.3)] shadow-[inset_0_0_20px_rgba(255,215,0,0.05)] hover:border-[rgba(255,215,0,0.6)] hover:shadow-[inset_0_0_30px_rgba(255,215,0,0.1),0_0_20px_rgba(255,215,0,0.2)]',
    green: 'border-[rgba(0,200,83,0.3)] shadow-[inset_0_0_20px_rgba(0,200,83,0.05)] hover:border-[rgba(0,200,83,0.6)] hover:shadow-[inset_0_0_30px_rgba(0,200,83,0.1),0_0_20px_rgba(0,200,83,0.2)]',
    red: 'border-[rgba(255,23,68,0.3)] shadow-[inset_0_0_20px_rgba(255,23,68,0.05)] hover:border-[rgba(255,23,68,0.6)] hover:shadow-[inset_0_0_30px_rgba(255,23,68,0.1),0_0_20px_rgba(255,23,68,0.2)]',
  };

  /* ===== PADDING PRESETS ===== */
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'bg-[rgba(15,23,41,0.85)] backdrop-blur-[12px] rounded-[12px] border transition-all duration-300',
        onClick && 'cursor-pointer',          /* Show pointer only when onClick is provided */
        glowStyles[glowColor],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
