/* ===== FILE OVERVIEW ===== */
/* Summary: Top navigation bar with Home/Settings buttons and centered "RACE OF NATIONS" title */

import { useNavigate } from 'react-router-dom';  /* Navigation hook for button clicks */
import { Home, Settings } from 'lucide-react';  /* Icon components for nav buttons */
import { GlowText } from '@/components/ui/GlowText';  /* Glowing text effect wrapper */
import { cn } from '@/lib/utils';               /* Tailwind class merger */

/* ===== PROPS INTERFACE ===== */
interface GameHeaderProps {
  showHome?: boolean;      /* Whether to render the Home button */
  showSettings?: boolean;  /* Whether to render the Settings button */
  className?: string;      /* Additional CSS classes */
}

/* ===== COMPONENT ===== */
export function GameHeader({ showHome = true, showSettings = true, className }: GameHeaderProps) {
  const navigate = useNavigate();  /* Get navigate function for route changes */

  return (
    <header className={cn('game-header', className)}>
      {/* ===== LEFT CORNER: HOME BUTTON ===== */}
      {showHome && (
        <button
          onClick={() => navigate('/lobby')}
          className="game-header-btn game-header-btn--left"
        >
          <Home className="game-header-btn__icon" />
        </button>
      )}

      {/* ===== CENTER: GAME TITLE ===== */}
      <GlowText variant="white" size="3xl" className="uppercase tracking-[0.2em] italic">
        <span className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl">
          RACE <span className="text-[#00d4ff]">OF</span> NATIONS
        </span>
      </GlowText>

      {/* ===== RIGHT CORNER: SETTINGS BUTTON ===== */}
      {showSettings && (
        <button
          onClick={() => navigate('/settings')}
          className="game-header-btn game-header-btn--right"
        >
          <Settings className="game-header-btn__icon" />
        </button>
      )}
    </header>
  );
}
