'use client';

import { useCart } from './CartProvider';

export function CartIcon() {
  const { itemCount, toggle } = useCart();
  return (
    <button
      type="button"
      onClick={toggle}
      className="relative cursor-pointer transition-opacity duration-200 hover:opacity-70"
      aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
    >
      {/* Bag icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Count badge */}
      {itemCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-rajdhani)',
            letterSpacing: 0,
          }}
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
