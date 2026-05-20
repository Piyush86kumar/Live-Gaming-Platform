import { cn } from '@/lib/utils';

interface CarSpriteProps {
  countryCode: string;
  progress?: number;
  className?: string;
}

export function CarSprite({ countryCode, progress = 0, className }: CarSpriteProps) {
  const imageSrc = `/cars/f1_car_livery_sprites/${countryCode.toLowerCase()}.png`;

  return (
    <div className={cn('relative car-sprite-container', className)}>
      <img
        src={imageSrc}
        alt={`${countryCode} car`}
        className="car-sprite"
        style={{
          filter: `drop-shadow(-8px 0px 6px rgba(255,255,255,${Math.min(progress / 100, 0.4)}))`
        }}
      />
    </div>
  );
}