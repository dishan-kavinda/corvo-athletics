'use client';

const WORDS = [
  'CORVO',
  '✦',
  'HUNT WITHOUT MERCY',
  '✦',
  'TRAIN HARDER',
  '✦',
  'RECOVER SMARTER',
  '✦',
  'BORN IN THE DARK',
  '✦',
  'NO COMPROMISE',
  '✦',
  'THE RAVEN STANDARD',
  '✦',
  'PREMIUM PERFORMANCE',
  '✦',
];

interface MarqueeStripProps {
  reverse?: boolean;
  light?: boolean;
  className?: string;
}

export function MarqueeStrip({ reverse = false, light = false, className = '' }: MarqueeStripProps) {
  const doubled = [...WORDS, ...WORDS];

  return (
    <div className={`overflow-hidden select-none ${className}`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          width: 'max-content',
          gap: '2rem',
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} 28s linear infinite`,
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            style={{
              fontFamily: word === '✦' ? 'inherit' : 'var(--font-rajdhani)',
              fontSize: word === '✦' ? '10px' : '11px',
              fontWeight: 700,
              letterSpacing: word === '✦' ? '0' : '0.42em',
              textTransform: 'uppercase',
              color: light
                ? word === '✦'
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.82)'
                : word === '✦'
                ? 'var(--accent)'
                : 'var(--muted)',
              flexShrink: 0,
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
