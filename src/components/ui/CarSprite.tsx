/* ===== FILE: CarSprite.tsx ===== */
/* Summary: Renders a car sprite for a given country with a progress-based headlight drop-shadow effect. */

import { cn } from '@/lib/utils';

/* ===== PROPS INTERFACE ===== */
/* Summary: countryCode = 2-letter ISO code for asset lookup; progress = 0-100 used to scale the glow intensity. */
interface CarSpriteProps {
  countryCode: string;
  progress?: number;
  className?: string;
}

/* ===== COMPONENT ===== */
export function CarSprite({ countryCode, progress = 0, className }: CarSpriteProps) {
  /* Build asset path from country code — sprites stored as /cars/f1_car_livery_sprites/{code}.png */
  const imageSrc = `/cars/f1_car_livery_sprites/${countryCode.toLowerCase()}.png`;

  return (
    <div className={cn('relative car-sprite-container', className)}>
      <img
        src={imageSrc}
        alt={`${countryCode} car`}
        className="car-sprite"
        style={{
          /* Headlight glow scales with progress: at 0% → 0 opacity, at 100% → 0.4 opacity */
          filter: `drop-shadow(-8px 0px 6px rgba(255,255,255,${Math.min(progress / 100, 0.4)}))`
        }}
      />
    </div>
  );
}
