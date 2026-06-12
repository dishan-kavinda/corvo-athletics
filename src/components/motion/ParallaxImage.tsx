'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { ReactNode, CSSProperties } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  height?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  strength?: number;
  priority?: boolean;
  overlay?: string;
}

export function ParallaxImage({
  src,
  alt,
  height = '100svh',
  className,
  style,
  children,
  strength = 80,
  priority = false,
  overlay = 'linear-gradient(to bottom, rgba(7,9,15,0.58) 0%, rgba(7,9,15,0.12) 42%, rgba(7,9,15,0.72) 100%)',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.08]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', height, ...style }}
    >
      <motion.div
        style={{
          y,
          position: 'absolute',
          top: '-15%',
          bottom: '-15%',
          left: '-5%',
          right: '-5%',
          willChange: 'transform',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="120vw"
          className="object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
      </motion.div>

      {/* Gradient overlay — customisable via prop for per-aesthetic tinting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: overlay,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {children && (
        <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
          {children}
        </div>
      )}
    </div>
  );
}
