'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { QuickView, type QuickViewProduct } from '@/components/ui/QuickView';

interface ProductCardProps {
  slug: string;
  name: string;
  price: string;
  image: string;
  imageAlt?: string;
  className?: string;
  productId?: string;
}

export function ProductCard({ slug, name, price, image, imageAlt, className, productId }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickView, setQuickView] = useState<QuickViewProduct | null>(null);

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;
    setQuickView({ productId, slug, name, price, image });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
      <Link
        href={`/shop/${slug}`}
        className={cn('group block', className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: 'relative',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: hovered ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'border-color 0.25s ease, transform 0.3s ease, box-shadow 0.3s ease',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: hovered
              ? '0 16px 40px rgba(0,0,0,0.18), -2px 0 0 var(--accent)'
              : 'var(--card-shadow)',
          }}
        >
          {/* Image */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              background: 'var(--surface-elevated)',
            }}
          >
            {image && (
              <Image
                src={image}
                alt={imageAlt || name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out"
                style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              />
            )}

            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7,9,15,0.35) 0%, transparent 55%)',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.35s ease',
                pointerEvents: 'none',
              }}
            />

            {/* Wishlist button — top right */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(-4px)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
              }}
            >
              <WishlistButton slug={slug} size={18} />
            </div>

            {/* Bottom actions */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                transition: 'all 0.3s ease',
              }}
            >
              {productId ? (
                <button
                  type="button"
                  onClick={openQuickView}
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.36em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    background: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '0.35rem 0.85rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Quick View
                </button>
              ) : (
                <span style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}>
                  VIEW PRODUCT
                </span>
              )}
            </div>
          </div>

          {/* Info bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.1rem',
            }}
          >
            <h3
              className="truncate mr-3"
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--page-fg)',
              }}
            >
              {name}
            </h3>
            <p className="font-display shrink-0 text-base" style={{ color: 'var(--accent)' }}>
              {price}
            </p>
          </div>

          {/* Bottom blade line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1.5px',
              background: 'linear-gradient(90deg, var(--accent), transparent)',
              transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>
      </Link>

      </motion.div>
      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
