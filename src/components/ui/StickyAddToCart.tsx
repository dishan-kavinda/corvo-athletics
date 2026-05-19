'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/components/cart/CartProvider';

interface StickyAddToCartProps {
  productId: string;
  variantId?: string;
  productName: string;
  price: string;
  inStock: boolean;
}

export function StickyAddToCart({ productId, variantId, productName, price, inStock }: StickyAddToCartProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handle = async () => {
    if (!inStock) return;
    setLoading(true);
    try { await addToCart(productId, 1, variantId); }
    finally { setLoading(false); }
  };

  const stickyBar = mounted ? createPortal(
    <div
      aria-hidden={!showSticky}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        background: 'var(--page-bg)',
        borderTop: '1px solid var(--border)',
        transform: showSticky ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--page-fg)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {productName}
          </p>
          <p style={{
            fontFamily: 'var(--font-cormorant, serif)',
            fontSize: '1.1rem',
            color: 'var(--accent)',
          }}>
            {price}
          </p>
        </div>
        <button
          type="button"
          onClick={handle}
          disabled={loading || !inStock}
          style={{
            padding: '0.7rem 1.5rem',
            background: inStock ? 'var(--accent)' : 'var(--border)',
            color: inStock ? '#fff' : 'var(--muted)',
            border: 'none',
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            cursor: inStock ? 'pointer' : 'not-allowed',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
        >
          {loading ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1, pointerEvents: 'none' }} aria-hidden="true" />
      {stickyBar}
    </>
  );
}
