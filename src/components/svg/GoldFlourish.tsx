'use client';

import { motion } from 'framer-motion';

/* Calligraphic hairline ornament that draws itself in on scroll.
   Two sweeping curves meeting a center diamond — fashion-house divider. */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface GoldFlourishProps {
  color?: string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** Delay before the draw starts (s) */
  delay?: number;
}

export function GoldFlourish({
  color = 'var(--accent)',
  width = 220,
  className,
  style,
  delay = 0.1,
}: GoldFlourishProps) {
  const draw = (d: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 1.4, delay: d, ease: EASE },
  });

  return (
    <svg
      viewBox="0 0 240 36"
      fill="none"
      aria-hidden
      className={className}
      style={{ display: 'block', width, height: 'auto', overflow: 'visible', ...style }}
    >
      {/* Left sweep */}
      <motion.path
        d="M4,18 C40,18 52,6 74,6 C94,6 100,18 112,18"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        {...draw(delay)}
      />
      {/* Right sweep */}
      <motion.path
        d="M236,18 C200,18 188,30 166,30 C146,30 140,18 128,18"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        {...draw(delay + 0.15)}
      />
      {/* Center diamond */}
      <motion.path
        d="M120,11 L127,18 L120,25 L113,18 Z"
        stroke={color}
        strokeWidth="1"
        {...draw(delay + 0.55)}
      />
    </svg>
  );
}
