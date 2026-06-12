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
        {doubled.map((word, i) =>
          word === '✦' ? (
            <span
              key={i}
              aria-hidden
              style={{
                display: 'block',
                width: '5px',
                height: '5px',
                transform: 'rotate(45deg)',
                background: light ? 'rgba(255,255,255,0.45)' : 'var(--accent)',
                flexShrink: 0,
              }}
            />
          ) : (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: light ? 'rgba(255,255,255,0.82)' : 'var(--muted)',
                flexShrink: 0,
              }}
            >
              {word}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
