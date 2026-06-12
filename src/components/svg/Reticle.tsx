/* Rotating targeting reticle — server-safe (pure CSS animation).
   Two ring groups counter-rotate slowly; the center dot breathes.
   Sized by its parent — render inside a square container. */

interface ReticleProps {
  color?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Reticle({
  color = 'var(--accent)',
  accentColor = 'var(--color-pulse)',
  className,
  style,
}: ReticleProps) {
  const ticks = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);

  return (
    <svg
      viewBox="0 0 500 500"
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    >
      {/* Outer tick ring — rotates clockwise */}
      <g
        style={{
          transformOrigin: 'center',
          transformBox: 'view-box',
          animation: 'spin-slow 70s linear infinite',
        }}
      >
        <circle cx="250" cy="250" r="225" stroke={color} strokeWidth="0.6" fill="none" opacity="0.3" />
        {ticks.map((deg) => (
          <line
            key={deg}
            x1="250" y1="20" x2="250" y2={deg % 90 === 0 ? 40 : 30}
            stroke={deg % 90 === 0 ? accentColor : color}
            strokeWidth={deg % 90 === 0 ? 1.4 : 0.7}
            opacity={deg % 90 === 0 ? 0.7 : 0.35}
            transform={`rotate(${deg} 250 250)`}
          />
        ))}
      </g>

      {/* Middle dashed ring — rotates counter-clockwise */}
      <g
        style={{
          transformOrigin: 'center',
          transformBox: 'view-box',
          animation: 'spin-slow 48s linear infinite reverse',
        }}
      >
        <circle
          cx="250" cy="250" r="160"
          stroke={color} strokeWidth="0.8" fill="none"
          strokeDasharray="4 14" opacity="0.4"
        />
        {/* Bracket arcs */}
        {[45, 135, 225, 315].map((deg) => (
          <path
            key={deg}
            d="M 250 105 A 145 145 0 0 1 352 147"
            stroke={accentColor}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
            transform={`rotate(${deg} 250 250)`}
          />
        ))}
      </g>

      {/* Static crosshair */}
      <line x1="250" y1="130" x2="250" y2="200" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="250" y1="300" x2="250" y2="370" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="130" y1="250" x2="200" y2="250" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="300" y1="250" x2="370" y2="250" stroke={color} strokeWidth="0.8" opacity="0.5" />

      {/* Breathing center */}
      <circle
        cx="250" cy="250" r="6"
        fill={color}
        style={{ animation: 'breathe 2.4s ease-in-out infinite', transformOrigin: 'center' }}
      />
      <circle cx="250" cy="250" r="22" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}
