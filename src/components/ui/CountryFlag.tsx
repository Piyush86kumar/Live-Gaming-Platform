import { cn } from '@/lib/utils';

interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'banner' | 'full';
  className?: string;
  alt?: string;
}

const FLAG_DIMENSIONS = {
  sm: { width: 32, height: 22 },
  md: { width: 48, height: 32 },
  lg: { width: 80, height: 53 },
  xl: { width: 72, height: 48 },
  full: { width: 240, height: 160 },
  banner: { width: 24, height: 16 },
};

export function CountryFlag({ countryCode, size = 'md', className, alt }: CountryFlagProps) {
  const { width, height } = FLAG_DIMENSIONS[size];
  const imageSrc = `/flags/country_flag/${countryCode.toLowerCase()}.png`;

  return (
    <img
      src={imageSrc}
      alt={alt || countryCode.toUpperCase()}
      width={width}
      height={height}
      className={cn(
        size === 'full' ? 'w-full h-auto max-w-full' : '',
        size !== 'full' && 'object-contain',
        className
      )}
    />
  );
}