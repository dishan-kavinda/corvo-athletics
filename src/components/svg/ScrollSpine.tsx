'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'framer-motion';

/* ScrollSpine — the site's continuous companion animation.
   A fixed thread on the right edge of the viewport that draws itself
   with scroll progress and persists across page navigations (mounted
   in the root layout, outside the page-transition template).

   savage  → "Vital Spine": jagged crimson seismograph line; the leading
             tip flares volt and swells with scroll VELOCITY.
   luxury  → "Golden Thread": smooth silk S-curve hairline with a small
             diamond charm gliding at its tip. */

interface ScrollSpineProps {
  variant: 'savage' | 'luxury';
}

const H = 1000; // internal viewBox height; stretched to 100svh

/* Deterministic jagged seismograph path (savage). */
function buildSeismographPath(): string {
  const cx = 22;
  let d = `M${cx},0`;
  const steps = 26;
  for (let i = 1; i <= steps; i++) {
    const y = (H / steps) * i;
    // Pseudo-random spike pattern — bigger spikes every few steps
    const seed = (i * 73) % 17;
    const big = i % 5 === 0;
    const dir = seed % 2 === 0 ? 1 : -1;
    const amp = big ? 13 + (seed % 4) * 1.5 : 2.5 + (seed % 3) * 1.6;
    const midY = y - H / steps / 2;
    d += ` L${cx + dir * amp},${midY} L${cx},${y}`;
  }
  return d;
}

/* Smooth silk S-curve path (luxury). */
function buildThreadPath(): string {
  const cx = 22;
  let d = `M${cx},0`;
  const waves = 7;
  const seg = H / waves;
  for (let i = 0; i < waves; i++) {
    const y0 = seg * i;
    const dir = i % 2 === 0 ? 1 : -1;
    d += ` C${cx + dir * 13},${y0 + seg * 0.33} ${cx - dir * 13},${y0 + seg * 0.66} ${cx},${y0 + seg}`;
  }
  return d;
}

export function ScrollSpine({ variant }: ScrollSpineProps) {
  // Mount-gate: motion values inside SVG styles don't serialize identically
  // on the server, so render nothing until hydration completes. The thread
  // fades in immediately after — no hydration surface, no mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const reduced = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();

  // Smoothed draw progress — never fully empty so the thread is always present
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const drawn = useTransform(progress, [0, 1], [0.05, 1]);

  // Scroll energy 0..1 from velocity (px/s), smoothed
  const velocity = useVelocity(scrollY);
  const energy = useSpring(
    useTransform(velocity, (v) => Math.min(Math.abs(v) / 1800, 1)),
    { stiffness: 220, damping: 32 },
  );

  // Tip position + reactions
  const tipTop = useTransform(progress, (p) => `calc(${(0.05 + p * 0.95) * 100}% - 6px)`);
  const tipScale = useTransform(energy, [0, 1], [1, 1.9]);
  const tipGlow = useTransform(
    energy,
    [0, 1],
    variant === 'savage'
      ? ['0 0 6px rgba(255,43,58,0.7)', '0 0 18px rgba(200,255,46,0.95)']
      : ['0 0 5px rgba(156,124,38,0.45)', '0 0 12px rgba(201,169,97,0.8)'],
  );
  const tipBg = useTransform(
    energy,
    [0, 0.55, 1],
    variant === 'savage' ? ['#FF2B3A', '#FF2B3A', '#C8FF2E'] : ['#9C7C26', '#9C7C26', '#C9A961'],
  );
  const lean = useTransform(energy, [0, 1], [0, variant === 'savage' ? 3 : 1.5]);

  const path = useMemo(
    () => (variant === 'savage' ? buildSeismographPath() : buildThreadPath()),
    [variant],
  );

  const stroke = variant === 'savage' ? '#FF2B3A' : '#9C7C26';

  if (!mounted) return null;

  if (reduced) {
    // Static hairline for reduced-motion users
    return (
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 'clamp(6px, 1.2vw, 18px)',
          width: '1px',
          background: stroke,
          opacity: 0.25,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="scroll-spine"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100svh',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <motion.svg
        viewBox={`0 0 44 ${H}`}
        preserveAspectRatio="none"
        style={{
          display: 'block',
          height: '100%',
          x: lean,
          overflow: 'visible',
        }}
        className="scroll-spine-svg"
      >
        {/* Faint full track */}
        <path d={path} fill="none" stroke={stroke} strokeWidth="1" opacity="0.14" />
        {/* Drawn-by-scroll thread */}
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={variant === 'savage' ? 1.6 : 1.1}
          strokeLinejoin="round"
          style={{
            pathLength: drawn,
            filter:
              variant === 'savage'
                ? 'drop-shadow(0 0 4px rgba(255,43,58,0.55))'
                : 'drop-shadow(0 0 3px rgba(156,124,38,0.35))',
          }}
        />
      </motion.svg>

      {/* Living tip */}
      <motion.div
        style={{
          position: 'absolute',
          top: tipTop,
          left: '50%',
          marginLeft: '-6px',
          width: 12,
          height: 12,
          scale: tipScale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.span
          style={{
            display: 'block',
            width: variant === 'savage' ? 7 : 6,
            height: variant === 'savage' ? 7 : 6,
            background: tipBg,
            boxShadow: tipGlow,
            borderRadius: variant === 'savage' ? '50%' : 0,
            transform: variant === 'luxury' ? 'rotate(45deg)' : undefined,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
