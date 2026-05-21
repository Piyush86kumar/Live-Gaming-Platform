/* ===== FILE: CountdownTimer.tsx ===== */
/* Summary: Displays a countdown timer with MM:SS format, optional label, and completion callback. */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/* ===== PROPS INTERFACE ===== */
/* Summary: seconds = initial countdown value; onComplete = fires when timer hits zero; label = optional text prefix. */
interface CountdownTimerProps {
  seconds: number;
  className?: string;
  onComplete?: () => void;
  label?: string;
}

/* ===== COMPONENT ===== */
export function CountdownTimer({ seconds, className, onComplete, label }: CountdownTimerProps) {
  /* Sync internal timeLeft when parent changes `seconds` prop */
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);    /* Reset timer to new duration on prop change */
  }, [seconds]);

  /* Tick every 1s; fire callback and stop when timeLeft reaches 0 */
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();       /* Notify parent, no-op if undefined */
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);    /* Decrement by 1 second */
    }, 1000);
    return () => clearInterval(timer);    /* Cleanup interval on unmount / timer change */
  }, [timeLeft, onComplete]);

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
