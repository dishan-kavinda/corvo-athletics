'use client';

const WORDS = [
  'CORVO', 'RAVEN', 'RELENTLESS', 'DARK ELITE',
  'FORGE', 'PRECISION', 'POWER', 'ASCEND',
];

interface MarqueeStripProps {
  reverse?: boolean;
  className?: string;
}

export function MarqueeStrip({ reverse = false, className = '' }: MarqueeStripProps) {
  const repeated = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

  return (
    <div className={`overflow-hidden select-none ${className}`}>
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'max-content',
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} 28s linear infinite`,
        }}
      >
        {repeated.map((word, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-3">
            <span
              className="font-display text-xs tracking-[0.35em]"
              style={{
                color: i % 3 === 0 ? '#7B5FFF' : i % 3 === 1 ? '#C9A961' : 'var(--muted)',
                opacity: i % 3 === 2 ? 0.4 : 1,
              }}
            >
              {word}
            </span>
            <span style={{ color: i % 2 === 0 ? '#7B5FFF' : '#C9A961', opacity: 0.3 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
