import { useNavigate } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { GlowText } from '@/components/ui/GlowText';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  showHome?: boolean;
  showSettings?: boolean;
  className?: string;
}

export function GameHeader({ showHome = true, showSettings = true, className }: GameHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn('flex items-center justify-between px-6 py-4 relative z-10', className)}>
      {showHome ? (
        <button
          onClick={() => navigate('/lobby')}
          className="icon-button"
        >
          <Home className="w-5 h-5 text-[#00d4ff]" />
        </button>
      ) : (
        <div className="w-12" />
      )}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <GlowText variant="white" size="3xl" className="uppercase tracking-[0.2em] italic">
          <span className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl">
            RACE <span className="text-[#00d4ff]">OF</span> NATIONS
          </span>
        </GlowText>
      </div>

      {showSettings ? (
        <button
          onClick={() => navigate('/settings')}
          className="icon-button"
        >
          <Settings className="w-5 h-5 text-[#00d4ff]" />
        </button>
      ) : (
        <div className="w-12" />
      )}
    </header>
  );
}
