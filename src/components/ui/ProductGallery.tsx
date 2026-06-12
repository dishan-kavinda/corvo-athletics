'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div
      className="sticky top-[72px]"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Main image — crossfade on thumbnail switch */}
      <div className="relative" style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
        {current ? (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={current}
                alt={alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'var(--surface-elevated)' }}
          >
            <span
              className="font-display uppercase"
              style={{ fontSize: '5rem', color: 'var(--border)', opacity: 0.3 }}
            >
              C
            </span>
          </div>
        )}
        {/* Accent left bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: 'var(--accent)' }} />
      </div>

      {/* Thumbnails — clickable */}
      {images.length > 1 && (
        <div className="flex gap-[1px]" style={{ background: 'var(--border)' }}>
          {images.slice(0, 4).map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={active === i}
              className="relative flex-1 cursor-pointer"
              style={{
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                background: 'var(--surface-elevated)',
                border: 'none',
                padding: 0,
                opacity: active === i ? 1 : 0.55,
                transition: 'opacity 0.25s ease',
              }}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              {active === i && (
                <span
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: '2px', background: 'var(--accent)' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
