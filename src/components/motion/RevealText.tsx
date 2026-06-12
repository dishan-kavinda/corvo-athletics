'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Clip-mask text reveal — container clips at its border, text slides up into view.
 * Use for hero headlines, section eyebrows, and display typography.
 */
export function RevealText({ children, delay = 0, duration = 0.72, className }: RevealTextProps) {
  return (
    <div style={{ overflow: 'hidden', display: 'block' }} className={className}>
      <motion.div
        initial={{ y: '105%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
