/* ===== FILE: CountryFlag.tsx ===== */
/* Summary: Renders a country flag image from the public assets folder at a predefined size. */

import { cn } from '@/lib/utils';

/* ===== PROPS INTERFACE ===== */
/* Summary: countryCode = lowercase 2-letter ISO code; size = one of six preset dimensions; alt = accessible label override. */
interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'banner' | 'full';
  className?: string;
  alt?: string;
}

/* ===== DIMENSION PRESETS ===== */
/* All sizes in px except `full` which uses responsive CSS via className. */
const FLAG_DIMENSIONS = {
  sm: { width: 32, height: 22 },
  md: { width: 48, height: 32 },
  lg: { width: 80, height: 53 },
  xl: { width: 72, height: 48 },
  full: { width: 240, height: 160 },
  banner: { width: 24, height: 16 },
};

/* ===== COMPONENT ===== */
export function CountryFlag({ countryCode, size = 'md', className, alt }: CountryFlagProps) {
  const { width, height } = FLAG_DIMENSIONS[size];    /* Look up pixel dimensions for chosen size */
  const imageSrc = `/flags/country_flag/${countryCode.toLowerCase()}.png`;    /* Build path from country code */

  return (
    <img
      src={imageSrc}
      alt={alt || countryCode.toUpperCase()}    /* Fallback alt: uppercase country code */
      width={width}
      height={height}
      className={cn(
        size === 'full' ? 'w-full h-auto max-w-full' : '',
        size !== 'full' && size !== 'banner' && 'object-contain',
        size === 'banner' && 'object-cover',
        className
      )}
    />
  );
}
