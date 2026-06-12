'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Reticle } from '@/components/svg/Reticle';

/* Holographic raven containment field — CSS-3D specimen hologram.
   Seven depth-stacked copies of the raven mark inside a perspective
   chamber that tilts toward the cursor, wrapped in HUD brackets,
   threat readouts, and a sweeping scan line. Fills the savage hero's
   right column. Pure CSS 3D — no WebGL cost. */

const LAYERS = [-90, -60, -30, 0, 30, 60, 90];

function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: 'var(--accent)',
    borderStyle: 'solid',
    borderWidth: 0,
    opacity: 0.9,
  };
  const map: Record<string, React.CSSProperties> = {
    tl: { top: 0, left: 0, borderTopWidth: 1.5, borderLeftWidth: 1.5 },
    tr: { top: 0, right: 0, borderTopWidth: 1.5, borderRightWidth: 1.5 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
    br: { bottom: 0, right: 0, borderBottomWidth: 1.5, borderRightWidth: 1.5 },
  };
  return <span aria-hidden style={{ ...base, ...map[pos] }} />;
}

export function HoloRaven() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      className="relative w-full"
      style={{ aspectRatio: '0.92 / 1', maxWidth: '520px' }}
    >
      {/* Chamber frame */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ border: '1px solid rgba(255,43,58,0.18)', background: 'rgba(255,255,255,0.012)' }}
      />
      <Bracket pos="tl" /><Bracket pos="tr" /><Bracket pos="bl" /><Bracket pos="br" />

      {/* Faint reticle behind the specimen */}
      <div aria-hidden className="absolute" style={{ inset: '8%', opacity: 0.22 }}>
        <Reticle />
      </div>

      {/* Specimen — depth-stacked hologram */}
      <div className="absolute" style={{ inset: '12%', perspective: '950px' }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%' }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              animation: 'holo-flicker 6s linear infinite',
            }}
          >
            {LAYERS.map((z, i) => {
              const isFront = i === LAYERS.length - 1;
              return (
                <div
                  key={z}
                  aria-hidden={!isFront}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translateZ(${z}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-savage-clean.svg"
                    alt={isFront ? 'Corvo raven hologram' : ''}
                    style={{
                      width: '88%',
                      height: 'auto',
                      opacity: isFront ? 1 : 0.07 + i * 0.05,
                      filter: isFront
                        ? 'drop-shadow(0 0 18px rgba(255,43,58,0.45))'
                        : `blur(${(LAYERS.length - 1 - i) * 0.4}px) drop-shadow(0 0 6px rgba(255,43,58,0.25))`,
                    }}
                  />
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scan line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(200,255,46,0.75), transparent)',
          animation: 'scan-sweep 3.8s ease-in-out infinite',
        }}
      />

      {/* Readouts */}
      <p className="tech-label absolute" style={{ top: 10, left: 12, fontSize: '9px', color: 'var(--muted)' }}>
        Specimen // Corvus-01
      </p>
      <p className="tech-label absolute flex items-center gap-2" style={{ top: 10, right: 12, fontSize: '9px', color: 'var(--color-pulse)' }}>
        <span className="live-dot" style={{ width: 5, height: 5 }} /> Tracking
      </p>
      <p className="tech-label absolute" style={{ bottom: 10, left: 12, fontSize: '9px', color: 'var(--muted)' }}>
        Status: Apex Predator
      </p>
      <p className="tech-label absolute" style={{ bottom: 10, right: 12, fontSize: '9px', color: 'var(--accent)' }}>
        Threat: Maximum
      </p>
    </div>
  );
}
