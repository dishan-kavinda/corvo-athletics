'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';

export interface QuickViewProduct {
  productId: string;
  slug: string;
  name: string;
  price: string;
  image?: string;
}

interface QuickViewProps {
  product: QuickViewProduct | null;
  onClose: () => void;
}

export function QuickView({ product, onClose }: QuickViewProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const isOpen = !!product;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  const handle = async () => {
    if (!product) return;
    setLoading(true);
    try { await addToCart(product.productId, 1); }
    finally { setLoading(false); }
  };

  const modal = (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product?.name ?? 'Quick view'}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -47%)',
          width: '90vw',
          maxWidth: '720px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease, transform 300ms ease',
          display: 'flex',
          flexDirection: 'column' as const,
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--muted)',
            zIndex: 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {product && (
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: '320px' }} className="flex-col sm:flex-row">
            {/* Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '280px',
                minHeight: '280px',
                flexShrink: 0,
                background: 'var(--page-bg)',
                overflow: 'hidden',
              }}
              className="hidden sm:block"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              ) : (
                <div style={{ inset: 0, position: 'absolute', background: 'var(--border)' }} />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
              <p style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.42em', textTransform: 'uppercase',
                color: 'var(--accent)',
              }}>
                Corvo Athletic
              </p>
              <h2 style={{
                fontFamily: 'var(--font-cormorant, var(--font-anton), serif)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: 'var(--page-fg)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}>
                {product.name}
              </h2>
              <p style={{
                fontFamily: 'var(--font-cormorant, serif)',
                fontSize: '1.5rem',
                color: 'var(--accent)',
              }}>
                {product.price}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handle}
                  disabled={loading}
                  style={{
                    padding: '0.85rem 1.5rem',
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? 'Adding…' : 'Add to Cart →'}
                </button>
                <Link
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    color: 'var(--page-fg)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
