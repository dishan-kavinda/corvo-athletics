'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { EKGPulse } from '@/components/svg/EKGPulse';
import { Reticle } from '@/components/svg/Reticle';
import { HoloRaven } from '@/components/hero/HoloRaven';

/* THE DESCENT — pinned cinematic hero.
   The scene holds for 100svh while the wrapper provides 260vh of scroll
   runway. Scrolling tears the composition apart: the headline diverges,
   warp speedlines erupt, a crimson rift swallows the viewport, and the
   visitor passes THROUGH the hero into the dark.

   Hydration note: scroll-driven MotionValues are attached to style only
   AFTER mount (`dyn`); the server renders the identical composition at
   its rest state. This avoids SSR/client style mismatches (see
   .wolf/cerebrum.md, 2026-06-12). */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function SpeedLines() {
  const lines = Array.from({ length: 32 }, (_, i) => {
    const angle = (i * 360) / 32 + (i % 3) * 4;
    const r1 = 90 + (i % 5) * 22;
    const r2 = r1 + 160 + (i % 4) * 70;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: 500 + Math.cos(rad) * r1,
      y1: 500 + Math.sin(rad) * r1,
      x2: 500 + Math.cos(rad) * r2,
      y2: 500 + Math.sin(rad) * r2,
      color: i % 6 === 0 ? '#C8FF2E' : i % 2 === 0 ? '#FF2B3A' : '#F2F1EC',
      w: i % 4 === 0 ? 2 : 1,
      o: 0.25 + (i % 4) * 0.18,
    };
  });
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden style={{ width: '100%', height: '100%' }}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.w} opacity={l.o} strokeLinecap="round" />
      ))}
    </svg>
  );
}

const entrance = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

/* Static positioning for the full-viewport effect layers */
const CENTER: React.CSSProperties = {
  top: '50%',
  left: '50%',
  translateX: '-50%',
  translateY: '-50%',
} as React.CSSProperties;

export function SavageHeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /* Phase A (0 → .35): hold + breathe.  Phase B (.35 → 1): the Descent. */
  const huntX = useTransform(p, [0.35, 0.8], ['0%', '-140%']);
  const withoutX = useTransform(p, [0.35, 0.8], ['0%', '140%']);
  const mercyScale = useTransform(p, [0.35, 0.85], [1, 2.6]);
  const mercyOpacity = useTransform(p, [0.55, 0.82], [1, 0]);
  const bodyOpacity = useTransform(p, [0.4, 0.62], [1, 0]);
  const bodyY = useTransform(p, [0.35, 0.65], [0, 60]);
  const holoX = useTransform(p, [0.35, 0.78], ['0%', '70%']);
  const holoOpacity = useTransform(p, [0.42, 0.72], [1, 0]);
  const reticleScale = useTransform(p, [0, 1], [1, 3.4]);
  const reticleRotate = useTransform(p, [0, 1], [0, 140]);
  const reticleOpacity = useTransform(p, [0, 0.55, 0.9], [0.12, 0.32, 0]);
  const speedOpacity = useTransform(p, [0.42, 0.68, 0.95], [0, 0.85, 0.15]);
  const speedScale = useTransform(p, [0.38, 1], [0.55, 3]);
  const riftScale = useTransform(p, [0.52, 1], [0.001, 6.5]);
  const flashOpacity = useTransform(p, [0.74, 0.86, 0.98], [0, 0.9, 0]);
  const blackoutOpacity = useTransform(p, [0.84, 0.98], [0, 1]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  /* Attach scroll-driven values only after hydration */
  const dyn = mounted;
  const pin: React.CSSProperties = dyn
    ? { position: 'sticky', top: 0, height: '100svh' }
    : { position: 'relative', minHeight: '100svh' };

  return (
    <section ref={ref} style={{ height: dyn ? '260vh' : 'auto', background: 'var(--page-bg)' }}>
      <div className="flex flex-col justify-center overflow-hidden" style={pin}>
        {/* Scanlines */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)',
          }}
        />

        {/* Reticle — accelerates and engulfs as you descend */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={
            dyn
              ? { ...CENTER, width: 'min(900px, 90vw)', aspectRatio: '1 / 1', scale: reticleScale, rotate: reticleRotate, opacity: reticleOpacity }
              : { ...CENTER, width: 'min(900px, 90vw)', aspectRatio: '1 / 1', opacity: 0.12 }
          }
        >
          <Reticle />
        </motion.div>

        {/* Warp speedlines */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={
            dyn
              ? { ...CENTER, width: 'min(1200px, 130vw)', aspectRatio: '1 / 1', scale: speedScale, opacity: speedOpacity }
              : { ...CENTER, width: 'min(1200px, 130vw)', aspectRatio: '1 / 1', opacity: 0 }
          }
        >
          <SpeedLines />
        </motion.div>

        {/* Content */}
        <div className="relative shell w-full grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-10">
          <div>
            <motion.div {...entrance(0.05)}>
              <motion.div className="flex items-center gap-3 mb-10" style={dyn ? { opacity: bodyOpacity } : undefined}>
                <Logo height={20} style={{ color: 'var(--accent)', opacity: 0.88, flexShrink: 0 }} />
                <span className="block" style={{ width: '26px', height: '1.5px', background: 'var(--accent)', flexShrink: 0 }} />
                <span className="eyebrow" style={{ letterSpacing: '0.52em' }}>Corvo Athletic</span>
                <span className="live-dot" aria-hidden />
              </motion.div>
            </motion.div>

            <motion.h1
              {...entrance(0.18)}
              className="font-display uppercase leading-[0.82] mb-8"
              style={{ fontSize: 'clamp(3.4rem, 10.5vw, 10rem)', letterSpacing: '-0.01em' }}
            >
              <motion.span className="block" style={dyn ? { x: huntX, color: 'var(--page-fg)' } : { color: 'var(--page-fg)' }}>
                HUNT
              </motion.span>
              <motion.span className="block text-outline" style={dyn ? { x: withoutX } : undefined}>
                WITHOUT
              </motion.span>
              <motion.span
                className="block text-gradient-blade"
                style={
                  dyn
                    ? { scale: mercyScale, opacity: mercyOpacity, transformOrigin: '18% 50%' }
                    : { transformOrigin: '18% 50%' }
                }
              >
                MERCY.
              </motion.span>
            </motion.h1>

            <motion.div style={dyn ? { opacity: bodyOpacity, y: bodyY } : undefined}>
              <motion.p
                {...entrance(0.42)}
                className="text-base md:text-lg leading-relaxed mb-10"
                style={{ color: 'var(--muted)', maxWidth: '420px' }}
              >
                Elite training gear for those who thrive where others fold.
                No shortcuts. Zero compromise.
              </motion.p>

              <motion.div {...entrance(0.6)} className="flex flex-wrap gap-4 items-center">
                <Button href="/shop" size="lg" variant="primary">Enter the Collection →</Button>
                <Button href="/about" size="lg" variant="ghost">Our Story</Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Specimen chamber — fills the right column */}
          <motion.div
            {...entrance(0.5)}
            className="hidden lg:flex justify-center"
            style={dyn ? { x: holoX, opacity: holoOpacity } : undefined}
          >
            <HoloRaven />
          </motion.div>
        </div>

        {/* Heartbeat */}
        <div
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{ bottom: '78px', opacity: 0.5 }}
        >
          <EKGPulse height={46} />
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={dyn ? { bottom: '22px', opacity: cueOpacity } : { bottom: '22px' }}
        >
          <p className="tech-label" style={{ fontSize: '9px', letterSpacing: '0.42em', color: 'var(--accent)' }}>
            Scroll to Descend
          </p>
          <span
            aria-hidden
            style={{
              display: 'block',
              width: '1.5px',
              height: '34px',
              background: 'var(--accent)',
              animation: 'cue-drop 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          />
        </motion.div>

        {/* The Rift — crimson tear that swallows the viewport */}
        {dyn && (
          <motion.div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              ...CENTER,
              width: '42vmax',
              height: '42vmax',
              borderRadius: '50%',
              scale: riftScale,
              background:
                'radial-gradient(circle, rgba(5,5,6,1) 0%, rgba(5,5,6,0.92) 38%, rgba(255,43,58,0.5) 58%, rgba(255,43,58,0.12) 72%, transparent 82%)',
            }}
          />
        )}

        {/* Pass-through flash */}
        {dyn && (
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: flashOpacity,
              background: 'radial-gradient(circle at 50% 50%, rgba(255,43,58,0.65) 0%, rgba(5,5,6,0.95) 65%)',
            }}
          />
        )}

        {/* Final blackout — hands off to the next section */}
        {dyn && (
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: blackoutOpacity, background: '#050506' }}
          />
        )}
      </div>
    </section>
  );
}
