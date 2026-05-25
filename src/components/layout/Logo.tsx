import type { CSSProperties } from 'react';

interface LogoProps {
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export function Logo({ height = 36, className, style }: LogoProps) {
  const aspectRatio = 2400 / 1200; // viewBox "700 240 2400 1200"
  const width = Math.round(height * aspectRatio);

  return (
    <div
      className={className}
      aria-label="Corvo Athletic"
      style={{
        width,
        height,
        background: 'currentColor',
        WebkitMaskImage: 'url(/logo-savage-clean.svg)',
        maskImage: 'url(/logo-savage-clean.svg)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center left',
        maskPosition: 'center left',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
