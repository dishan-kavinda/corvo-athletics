'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

/* Scroll-velocity page warp — the whole content plane shears slightly with
   scroll speed, making the page feel like a physical object being dragged.
   Mounted around the routed pages in the root layout.

   Safe because every fixed-position UI element (CartDrawer, MobileNav,
   StickyAddToCart, SearchModal) is portaled to document.body — a transform
   here never becomes their containing block. */

interface VelocityWarpProps {
  children: React.ReactNode;
  /** 1 = savage (pronounced), ~0.35 = luxury (restrained) */
  intensity?: number;
}

export function VelocityWarp({ children, intensity = 1 }: VelocityWarpProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(
    useTransform(velocity, [-3200, 3200], [-1.7 * intensity, 1.7 * intensity]),
    { stiffness: 260, damping: 42, mass: 0.8 },
  );

  return (
    <motion.div style={mounted ? { skewY: skew, transformOrigin: '50% 50%' } : undefined}>
      {children}
    </motion.div>
  );
}
