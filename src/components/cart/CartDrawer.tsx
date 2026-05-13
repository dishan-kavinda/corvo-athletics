'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/Button';

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
  const subtotal = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency,
  }).format(subtotalNum);

  const drawer = (
    <>
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.85)',
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
          backgroundColor: '#000000',
          borderLeft: '1px solid #262626',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
        aria-hidden={!isOpen}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-graphite">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em]">Cart</h2>
          <button
            type="button"
            onClick={close}
            className="text-ash hover:text-bone transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-6 border border-red-500/40 bg-red-500/10 p-4">
              <p className="text-red-300 text-xs uppercase tracking-wider font-display mb-2">
                Couldn&apos;t add to cart
              </p>
              <p className="text-red-200/80 text-xs leading-relaxed break-words">{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="mt-3 text-[10px] text-red-300/70 hover:text-red-200 uppercase tracking-wider cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
          {lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-ash text-sm uppercase tracking-widest mb-6">Your cart is empty</p>
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center font-display uppercase tracking-wider transition-all duration-300 ease-out hover:scale-[1.02] active:scale-100 cursor-pointer border border-graphite text-bone hover:border-bone hover:bg-onyx h-11 px-6 text-sm"
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
                      <div className="relative w-20 h-20 bg-ink flex-shrink-0 overflow-hidden border border-graphite">
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
                      <p className="text-sm font-medium truncate uppercase tracking-wider">
                        {item.productName?.original}
                      </p>
                      <p className="text-gold text-sm mt-1 font-display">
                        {item.price?.formattedAmount}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() =>
                            item._id && updateQuantity(item._id, (item.quantity ?? 1) - 1)
                          }
                          disabled={loading}
                          className="w-7 h-7 border border-graphite hover:border-bone text-bone transition-colors text-sm cursor-pointer disabled:opacity-50"
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
                          className="w-7 h-7 border border-graphite hover:border-bone text-bone transition-colors text-sm cursor-pointer disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => item._id && removeFromCart(item._id)}
                          disabled={loading}
                          className="ml-auto text-xs text-ash hover:text-bone transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-50"
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
          <footer className="px-6 py-6 border-t border-graphite">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-sm uppercase tracking-widest">Subtotal</span>
              <span className="font-display text-2xl text-gold">{subtotal}</span>
            </div>
            <Button
              onClick={checkout}
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Checkout'}
            </Button>
            <p className="text-[10px] text-ash text-center mt-3 uppercase tracking-[0.2em]">
              Taxes & shipping calculated at checkout
            </p>
          </footer>
        )}
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}
