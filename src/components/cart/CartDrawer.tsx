'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { cart, isOpen, close, removeFromCart, updateQuantity, checkout, loading } = useCart();

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

  const lineItems = cart?.lineItems ?? [];
  const subtotal = cart?.subtotal?.formattedAmount ?? '$0.00';

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-onyx border-l border-graphite shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
          {lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-ash text-sm uppercase tracking-widest mb-6">Your cart is empty</p>
              <Button href="/shop" variant="ghost" size="md" className="cursor-pointer">
                Continue Shopping
              </Button>
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
}
