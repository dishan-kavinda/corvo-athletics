'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/ui/ProductCard';

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  inStock: boolean;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price · Low to High' },
  { value: 'price-desc', label: 'Price · High to Low' },
  { value: 'name',       label: 'Name · A–Z' },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ShopGrid({ products }: { products: ShopProduct[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
      : [...products];
    switch (sort) {
      case 'price-asc':  filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name':       filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break; // featured = catalog order
    }
    return filtered;
  }, [products, query, sort]);

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 pb-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Search */}
        <div className="relative flex-1" style={{ maxWidth: '420px' }}>
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--muted)' }}
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection…"
            aria-label="Search products"
            className="field"
            style={{ paddingLeft: '2.75rem', paddingTop: '0.7rem', paddingBottom: '0.7rem' }}
          />
        </div>

        {/* Sort */}
        <label className="flex items-center gap-3">
          <span className="tech-label" style={{ fontSize: '10px' }}>Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field"
            style={{
              width: 'auto',
              paddingTop: '0.7rem',
              paddingBottom: '0.7rem',
              paddingRight: '2rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '12px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23838DAA\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        {/* Count */}
        <p className="tech-label sm:ml-auto" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* ── Grid ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {visible.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="py-28 text-center"
          >
            <p className="font-display uppercase text-3xl mb-4" style={{ color: 'var(--muted)' }}>
              Nothing found
            </p>
            <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
              No products match &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="tech-label cursor-pointer"
              style={{
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid var(--accent)',
                padding: '0.7rem 1.6rem',
              }}
            >
              Clear Search
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${sort}-${query}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                price={p.priceFormatted}
                image={p.image}
                imageAlt={p.name}
                productId={p.id}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
