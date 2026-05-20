import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  seconds: number;
  className?: string;
  onComplete?: () => void;
  label?: string;
}

export function CountdownTimer({ seconds, className, onComplete, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {label && (
        <span className="font-heading text-[#8b9dc3] uppercase tracking-widest text-sm">
          {label}
        </span>
      )}
      <div className="bg-[rgba(15,23,41,0.9)] border border-[rgba(0,212,255,0.3)] rounded-lg px-4 py-2">
        <span className={cn(
          'font-heading text-2xl font-bold tabular-nums',
          timeLeft <= 10 ? 'text-[#ff00aa] animate-pulse' : 'text-[#ff00aa]'
        )}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}
