'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion.create(Link);

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const cats = [
  {
    label: 'Training',
    sub: 'Performance Apparel',
    href: '/shop',
    glow: 'rgba(255,43,58,0.14)',
  },
  {
    label: 'Supplements',
    sub: 'Elite Nutrition',
    href: '/shop',
    glow: 'rgba(0,189,172,0.1)',
  },
  {
    label: 'Recovery',
    sub: 'Gear & Accessories',
    href: '/shop',
    glow: 'rgba(255,43,58,0.1)',
  },
  {
    label: 'Lifestyle',
    sub: 'Athleisure Collection',
    href: '/shop',
    glow: 'rgba(0,189,172,0.07)',
  },
];

const linkVariants = {
  rest: {},
  hover: {},
};

const glowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4 } },
};

const bladeVariants = {
  rest: { scaleY: 0, transition: { duration: 0.25, ease: EASE } },
  hover: { scaleY: 1, transition: { duration: 0.38, ease: EASE } },
};

const bottomLineVariants = {
  rest: { scaleX: 0, transition: { duration: 0.25 } },
  hover: { scaleX: 1, transition: { duration: 0.45, ease: EASE } },
};

const labelVariants = {
  rest: { y: 0, transition: { duration: 0.35, ease: EASE } },
  hover: { y: -6, transition: { duration: 0.4, ease: EASE } },
};

const arrowVariants = {
  rest: { x: 0, opacity: 0.25, transition: { duration: 0.3, ease: EASE } },
  hover: { x: 6, opacity: 1, transition: { duration: 0.32, ease: EASE } },
};

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {cats.map((cat, i) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.62, delay: i * 0.09, ease: EASE }}
        >
          <MotionLink
            href={cat.href}
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={linkVariants}
            style={{
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
              height: 'clamp(260px, 30vw, 440px)',
              background: 'var(--section-dark)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
            }}
          >
            {/* Left accent blade */}
            <motion.div
              variants={bladeVariants}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'var(--accent)',
                transformOrigin: 'top',
              }}
            />

            {/* Hover glow */}
            <motion.div
              variants={glowVariants}
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 15% 85%, ${cat.glow} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Index number */}
            <div
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.15)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Arrow */}
            <motion.div
              variants={arrowVariants}
              style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                color: 'var(--accent)',
                fontSize: '1.1rem',
              }}
            >
              →
            </motion.div>

            {/* Label + sub */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2rem 2.2rem' }}>
              <motion.p
                variants={labelVariants}
                className="font-display uppercase leading-none"
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                  color: '#FFFFFF',
                  marginBottom: '0.55rem',
                }}
              >
                {cat.label}
              </motion.p>
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                {cat.sub}
              </p>
            </div>

            {/* Bottom accent line */}
            <motion.div
              variants={bottomLineVariants}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1.5px',
                background: 'linear-gradient(90deg, var(--accent), transparent)',
                transformOrigin: 'left',
              }}
            />
          </MotionLink>
        </motion.div>
      ))}
    </div>
  );
}
