/* ===== FILE: CountdownTimer.tsx ===== */
/* Summary: Displays a countdown timer with MM:SS format, optional label, and completion callback. */

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  seconds: number;
  className?: string;
  onComplete?: () => void;
  label?: string;
}

export function CountdownTimer({ seconds, className, onComplete, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const loaded = useRef(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (completedRef.current) return;
    if (timeLeft <= 0) {
      completedRef.current = true;
      onCompleteRef.current?.();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ===== TIME FORMATTING ===== */
  /* Convert raw seconds into zero-padded MM:SS display string */
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Label shown inline before the digits */}
      {label && (
        <span className="text-white uppercase font-heading font-semibold text-[clamp(0.7rem,1vw,0.9rem)] tracking-[0.1em]">
          {label}
        </span>
      )}
      {/* Countdown digits — neon magenta, monospace-width */}
      <span className={cn(
        'text-[#ff00aa] font-bold font-heading tabular-nums text-[clamp(1.4rem,2.2vw,2rem)]',
        timeLeft <= 10 && 'animate-pulse'
      )}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
