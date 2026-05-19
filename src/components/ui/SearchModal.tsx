'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores';

type SearchProduct = {
  slug: string;
  name: string;
  price: string;
  image?: string;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [fetched, setFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) { setQuery(''); return; }
    document.body.style.overflow = 'hidden';
    setTimeout(() => inputRef.current?.focus(), 100);
    if (fetched) return;
    const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID!;
    const wix = createClient({ modules: { products }, auth: OAuthStrategy({ clientId }) });
    wix.products.queryProducts().find().then((res) => {
      setAllProducts(
        res.items.map((p) => ({
          slug: p.slug ?? '',
          name: p.name ?? '',
          price: p.priceData?.formatted?.price ?? '',
          image: p.media?.mainMedia?.image?.url,
        }))
      );
      setFetched(true);
    }).catch(() => {});
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, fetched]);

  useEffect(() => {
    if (!isOpen) document.body.style.overflow = '';
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!mounted) return null;

  const filtered = query.trim().length > 0
    ? allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : allProducts;

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
        aria-label="Search products"
        style={{
          position: 'fixed',
          top: isOpen ? '10vh' : '8vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: '580px',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease, top 300ms ease',
        }}
      >
        {/* Input bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0 1rem',
          background: 'var(--surface)',
          border: '1px solid var(--accent)',
          marginBottom: '2px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            style={{
              flex: 1,
              padding: '1rem 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--page-fg)',
            }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          )}
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px', marginLeft: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>ESC</span>
          </button>
        </div>

        {/* Results */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          maxHeight: '55vh',
          overflowY: 'auto',
        }}>
          {!fetched && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-rajdhani)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Loading…
            </div>
          )}
          {fetched && filtered.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-rajdhani)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {query ? 'No results found' : 'No products yet'}
            </div>
          )}
          {fetched && filtered.map((p, i) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                color: 'var(--page-fg)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(128,128,128,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {p.image ? (
                <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0, background: 'var(--page-bg)', overflow: 'hidden' }}>
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                </div>
              ) : (
                <div style={{ width: 48, height: 48, flexShrink: 0, background: 'var(--border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {p.name}
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant, serif)', fontSize: '1rem', color: 'var(--accent)' }}>
                  {p.price}
                </p>
              </div>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M5 10h10M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
