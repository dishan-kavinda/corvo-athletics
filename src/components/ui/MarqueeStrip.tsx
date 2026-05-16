'use client';

const WORDS = [
  'PERFORMANCE', 'PRECISION', 'POWER', 'PURITY',
  'PERSEVERANCE', 'PROGRESS', 'PREMIUM', 'POTENTIAL',
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
              style={{ color: i % 2 === 0 ? '#C9A961' : 'var(--muted)', opacity: i % 2 === 0 ? 1 : 0.5 }}
            >
              {word}
            </span>
            <span style={{ color: '#C9A961', opacity: 0.3 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
