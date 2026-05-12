'use client';

import { useCart } from './CartProvider';

export function CartIcon() {
  const { itemCount, toggle } = useCart();
  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors cursor-pointer"
    >
      Cart ({itemCount})
    </button>
  );
}
