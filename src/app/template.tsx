'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* Route transition — every navigation arrives like a scene change:
   an accent veil sweeps off the incoming page while the content
   settles up into place. Reads the theme accent via CSS var, so it's
   crimson in savage and gold in luxury automatically. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
      >
        {children}
      </motion.div>

      {/* Accent veil — wipes upward off the new page */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'var(--accent)',
          transformOrigin: 'top',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
