'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/Button';
import { fmtMoney } from '@/lib/format';

export function CartDrawer() {
  const { cart, isOpen, close, removeFromCart, updateQuantity, checkout, loading, error, clearError } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const lineItems = cart?.lineItems ?? [];
  const currency = cart?.currency ?? 'NZD';
  const subtotalNum = lineItems.reduce((sum, item) => {
    const amount = parseFloat(item.price?.amount ?? '0');
    return sum + amount * (item.quantity ?? 0);
  }, 0);
  const subtotal = fmtMoney(subtotalNum, currency);

  const drawer = (
    <>
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7,9,15,0.82)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
        aria-hidden="true"
      />
      <aside
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
        aria-hidden={!isOpen}
      >
        <header
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <span className="block w-4 h-[1.5px]" style={{ background: 'var(--accent)' }} />
            <h2
              className="font-display uppercase"
              style={{ fontSize: '1.1rem', letterSpacing: '0.28em' }}
            >
              Cart
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer transition-colors duration-200 hover:text-blade"
            style={{ color: 'var(--muted)' }}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div
              className="mb-6 p-4"
              style={{
                border: '1px solid var(--accent)',
                background: 'rgba(255,43,58,0.08)',
              }}
            >
              <p
                className="text-xs uppercase font-display mb-2"
                style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
              >
                Couldn&apos;t add to cart
              </p>
              <p className="text-xs leading-relaxed break-words" style={{ color: 'var(--muted)' }}>
                {error}
              </p>
              <button
                type="button"
                onClick={clearError}
                style={{
                  marginTop: '0.75rem',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                }}
                className="hover:text-blade transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}
          {lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p
                className="text-sm uppercase mb-6"
                style={{ color: 'var(--muted)', letterSpacing: '0.22em', fontFamily: 'var(--font-rajdhani)', fontWeight: 700 }}
              >
                Your cart is empty
              </p>
              <button
                type="button"
                onClick={close}
                className="font-display uppercase cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] active:scale-100"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.14em',
                  border: '1px solid var(--border)',
                  color: 'var(--page-fg)',
                  height: '2.75rem',
                  padding: '0 1.5rem',
                  fontSize: '0.875rem',
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {lineItems.map((item) => {
                const img = item.image;
                return (
                  <li key={item._id} className="flex gap-4">
                    {img && (
                      <div
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{
                          width: '5rem',
                          height: '5rem',
                          background: 'var(--surface-elevated)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <Image
                          src={img}
                          alt={item.productName?.original ?? ''}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate uppercase"
                        style={{ letterSpacing: '0.1em' }}
                      >
                        {item.productName?.original}
                      </p>
                      <p className="font-display text-sm mt-1" style={{ color: 'var(--accent)' }}>
                        {item.price?.formattedAmount}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() =>
                            item._id && updateQuantity(item._id, (item.quantity ?? 1) - 1)
                          }
                          disabled={loading}
                          className="text-sm cursor-pointer transition-colors disabled:opacity-50"
                          style={{
                            width: '1.75rem',
                            height: '1.75rem',
                            border: '1px solid var(--border)',
                            color: 'var(--page-fg)',
                          }}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            item._id && updateQuantity(item._id, (item.quantity ?? 1) + 1)
                          }
                          disabled={loading}
                          className="text-sm cursor-pointer transition-colors disabled:opacity-50"
                          style={{
                            width: '1.75rem',
                            height: '1.75rem',
                            border: '1px solid var(--border)',
                            color: 'var(--page-fg)',
                          }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => item._id && removeFromCart(item._id)}
                          disabled={loading}
                          className="ml-auto text-xs uppercase cursor-pointer transition-colors disabled:opacity-50 hover:text-blade"
                          style={{
                            color: 'var(--muted)',
                            letterSpacing: '0.18em',
                            fontFamily: 'var(--font-rajdhani)',
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lineItems.length > 0 && (
          <footer className="px-6 py-6" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-baseline mb-5">
              <span
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Subtotal
              </span>
              <span className="font-display text-2xl" style={{ color: 'var(--accent)' }}>{subtotal}</span>
            </div>
            <Button
              onClick={checkout}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Checkout'}
            </Button>
            <p
              className="text-center mt-3"
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '10px',
                color: 'var(--muted)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Taxes &amp; shipping calculated at checkout
            </p>
          </footer>
        )}
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}
