'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealImageProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Parallax image reveal — scales from 1.1 to 1 as the image scrolls into view.
 * Wrap the <Image> or <img> element with this. Parent must have overflow:hidden.
 */
export function RevealImage({ children, delay = 0, duration = 1.1, className }: RevealImageProps) {
  return (
    <div style={{ overflow: 'hidden' }} className={className}>
      <motion.div
        initial={{ scale: 1.1, opacity: 0.85 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
