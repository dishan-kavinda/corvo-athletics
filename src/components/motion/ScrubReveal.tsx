'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/* ScrubReveal — scroll-scrubbed section entrance.
   The reveal is driven directly by the section's scroll position (no
   IntersectionObserver triggers), so it plays forward as the section
   enters the viewport and reverses if you scroll back — the page feels
   like one continuous animated sequence.

   savage  → diagonal blade cut chased by a red/volt edge
   luxury  → curtains parting along a glowing gold seam

   Pre-mount (SSR + hydration) renders children fully visible — a section
   can never be blank if JS is slow or fails. */

interface ScrubRevealProps {
  children: React.ReactNode;
  variant: 'slash' | 'curtain';
  className?: string;
  /** Curtain panel color — match the section background */
  panelColor?: string;
}

export function ScrubReveal({ children, variant, className, panelColor = 'var(--page-bg)' }: ScrubRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 0 → 1 as the section's top travels from 96% to 50% of the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.96', 'start 0.5'] });
  const t = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.7 });

  /* Slash */
  const slashClip = useTransform(
    t,
    [0, 0.85],
    ['polygon(-35% 0%, 0% 0%, -35% 100%, -70% 100%)', 'polygon(-35% 0%, 135% 0%, 100% 100%, -70% 100%)'],
  );
  const bladeX = useTransform(t, [0, 0.85], ['-130%', '880%']);
  const bladeOpacity = useTransform(t, [0, 0.7, 0.9], [1, 1, 0]);

  /* Curtain */
  const leftX = useTransform(t, [0.05, 0.9], ['0%', '-103%']);
  const rightX = useTransform(t, [0.05, 0.9], ['0%', '103%']);
  const seamOpacity = useTransform(t, [0, 0.55, 0.9], [1, 1, 0]);
  const innerOpacity = useTransform(t, [0.15, 0.75], [0, 1]);
  const innerY = useTransform(t, [0.15, 0.85], [26, 0]);
  const innerScale = useTransform(t, [0.15, 0.9], [0.985, 1]);

  const panel: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50.5%',
    background: panelColor,
    pointerEvents: 'none',
  };

  if (variant === 'slash') {
    return (
      <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div style={mounted ? { clipPath: slashClip } : undefined}>{children}</motion.div>
        {mounted && (
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
            <motion.div
              style={{
                position: 'absolute',
                top: '-12%',
                bottom: '-12%',
                left: 0,
                width: '13%',
                x: bladeX,
                opacity: bladeOpacity,
                transform: 'skewX(-16deg)',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,43,58,0.5) 35%, rgba(200,255,46,0.55) 60%, transparent 100%)',
                filter: 'blur(7px)',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  /* curtain */
  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div style={mounted ? { opacity: innerOpacity, y: innerY, scale: innerScale } : undefined}>
        {children}
      </motion.div>
      {mounted && (
        <>
          <motion.div aria-hidden style={{ ...panel, left: 0, x: leftX }} />
          <motion.div aria-hidden style={{ ...panel, right: 0, x: rightX }} />
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1px',
              marginLeft: '-0.5px',
              opacity: seamOpacity,
              background: 'linear-gradient(to bottom, transparent, #C9A961 18%, #C9A961 82%, transparent)',
              boxShadow: '0 0 12px rgba(201,169,97,0.6)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </div>
  );
}
