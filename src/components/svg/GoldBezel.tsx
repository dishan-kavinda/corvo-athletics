/* Rotating gold watch bezel — server-safe (pure CSS animation).
   Two counter-rotating hairline rings with fine minute ticks and diamond
   quarter markers. The luxury counterpart to the savage Reticle:
   horology instead of weaponry. */

interface GoldBezelProps {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function GoldBezel({ color = '#C9A961', className, style }: GoldBezelProps) {
  const ticks = Array.from({ length: 60 }, (_, i) => (i * 360) / 60);
  const quarters = [0, 90, 180, 270];

  return (
    <svg
      viewBox="0 0 500 500"
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    >
      {/* Outer minute ring — slow clockwise */}
      <g
        style={{
          transformOrigin: 'center',
          transformBox: 'view-box',
          animation: 'spin-slow 130s linear infinite',
        }}
      >
        <circle cx="250" cy="250" r="238" stroke={color} strokeWidth="0.7" fill="none" opacity="0.5" />
        <circle cx="250" cy="250" r="226" stroke={color} strokeWidth="0.4" fill="none" opacity="0.3" />
        {ticks.map((deg) => (
          <line
            key={deg}
            x1="250" y1="14" x2="250" y2={deg % 30 === 0 ? 26 : 20}
            stroke={color}
            strokeWidth={deg % 30 === 0 ? 1.1 : 0.5}
            opacity={deg % 30 === 0 ? 0.75 : 0.4}
            transform={`rotate(${deg} 250 250)`}
          />
        ))}
      </g>

      {/* Inner ring — counter-clockwise, with diamond quarter markers */}
      <g
        style={{
          transformOrigin: 'center',
          transformBox: 'view-box',
          animation: 'spin-slow 90s linear infinite reverse',
        }}
      >
        <circle
          cx="250" cy="250" r="172"
          stroke={color} strokeWidth="0.6" fill="none"
          strokeDasharray="1 9" opacity="0.45"
        />
        {quarters.map((deg) => (
          <path
            key={deg}
            d="M250,70 L256,78 L250,86 L244,78 Z"
            fill={color}
            opacity="0.7"
            transform={`rotate(${deg} 250 250)`}
          />
        ))}
      </g>

      {/* Still center ring */}
      <circle cx="250" cy="250" r="120" stroke={color} strokeWidth="0.5" fill="none" opacity="0.25" />
    </svg>
  );
}
