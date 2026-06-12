/* Rising particle field — server-safe (deterministic positions + CSS animation).
   Use inside a position:relative container with overflow:hidden. */

interface DustFieldProps {
  count?: number;
  color?: string;
  className?: string;
}

export function DustField({ count = 16, color = '#C9A961', className }: DustFieldProps) {
  const motes = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 61.8 + 7) % 96}%`,
    bottom: `${(i * 13) % 30}%`,
    size: 1.5 + (i % 3),
    delay: (i * 0.6) % 5,
    duration: 4.5 + (i % 4) * 1.2,
    opacity: 0.35 + ((i * 7) % 5) * 0.1,
  }));

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {motes.map((m, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: m.left,
            bottom: m.bottom,
            width: m.size,
            height: m.size,
            borderRadius: '50%',
            background: color,
            opacity: 0,
            '--dust-o': m.opacity,
            animation: `dust-rise ${m.duration}s linear ${m.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
