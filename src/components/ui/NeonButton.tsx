/* ===== FILE: NeonButton.tsx ===== */
/* Summary: A styled button with neon glow variants (primary/danger/secondary/ghost) and three sizes. */

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

/* ===== PROPS INTERFACE ===== */
/* Summary: variant controls color scheme; size controls padding/font; icon adds a leading icon slot. */
interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

/* ===== COMPONENT ===== */
export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  icon,
}: NeonButtonProps) {
  /* ===== COLOR VARIANTS ===== */
  /* Each variant defines background, text, border, and neon box-shadow with hover/active transitions. */
  const variants = {
    primary: 'bg-[#22c55e] text-white hover:bg-[#16a34a] border border-[#16a34a] shadow-[0_0_12px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] active:scale-[0.98]',
    danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c] border border-[#b91c1c] shadow-[0_0_12px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] active:scale-[0.98]',
    secondary: 'bg-[rgba(0,212,255,0.15)] text-[#00d4ff] border border-[rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.25)] hover:border-[rgba(0,212,255,0.5)] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#8b9dc3] hover:text-white hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]',
  };

  /* ===== SIZE PRESETS ===== */
  /* Padding and font-size scale across sm/md/lg. gap used for icon-text spacing. */
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-8 py-3 text-lg gap-3',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-[8px] font-heading font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
