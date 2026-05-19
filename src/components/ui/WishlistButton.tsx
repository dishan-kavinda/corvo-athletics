'use client';

import { useWishlist } from '@/hooks/useWishlist';

interface WishlistButtonProps {
  slug: string;
  size?: number;
  className?: string;
}

export function WishlistButton({ slug, size = 20, className = '' }: WishlistButtonProps) {
  const { toggle, isWishlisted } = useWishlist();
  const active = isWishlisted(slug);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      title={active ? 'Remove from wishlist' : 'Save to wishlist'}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 12,
        height: size + 12,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
        padding: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? 'var(--accent)' : 'none'}
        stroke={active ? 'var(--accent)' : 'var(--muted)'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
