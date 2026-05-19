'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const navItems = [
  { label: 'Shop All', href: '/shop', num: '01' },
  { label: 'Training', href: '/shop', num: '02' },
  { label: 'Supplements', href: '/shop', num: '03' },
  { label: 'About', href: '/about', num: '04' },
  { label: 'Account', href: '/account', num: '05' },
];

interface MobileNavProps {
  onSearchOpen?: () => void;
}

export function MobileNav({ onSearchOpen }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const panel = (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className="md:hidden"
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(2,3,4,0.88)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 400ms ease',
        }}
      />
      <aside
        aria-hidden={!isOpen}
        className="md:hidden"
        style={{
          position: 'fixed', left: 0, top: 0,
          height: '100%', width: '100%', maxWidth: '26rem',
          background: 'var(--page-bg)',
          borderRight: '1px solid var(--border)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/home" onClick={close} className="font-display uppercase" style={{ fontSize: '1.4rem', letterSpacing: '0.32em', color: 'var(--page-fg)', textDecoration: 'none' }}>
            Corvo
          </Link>
          <button type="button" onClick={close} aria-label="Close menu" style={{ color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {onSearchOpen && (
          <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => { close(); onSearchOpen(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.65rem 0.9rem', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-rajdhani)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              Search products
            </button>
          </div>
        )}

        <nav style={{ flex: 1, padding: '2rem 1.75rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {navItems.map((item, i) => (
              <li
                key={item.label}
                style={{ borderBottom: i < navItems.length - 1 ? '1px solid var(--border)' : 'none', opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateX(0)' : 'translateX(-16px)', transition: `opacity 400ms ease ${i * 60 + 200}ms, transform 400ms ease ${i * 60 + 200}ms` }}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', color: 'var(--page-fg)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--page-fg)')}
                >
                  <span className="font-display uppercase" style={{ fontSize: 'clamp(1.5rem, 6vw, 1.9rem)', letterSpacing: '0.04em' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', letterSpacing: '0.3em', color: 'var(--accent)', fontWeight: 700 }}>{item.num}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem 1.75rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ display: 'block', width: '1rem', height: '1.5px', background: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>Corvo Athletic</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--muted)' }}>No compromise.</p>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden cursor-pointer p-2 -ml-2 flex flex-col justify-center gap-[5px] transition-opacity hover:opacity-70"
      >
        <span style={{ display: 'block', height: '1.5px', width: '20px', background: 'var(--page-fg)' }} />
        <span style={{ display: 'block', height: '1.5px', width: '14px', background: 'var(--page-fg)' }} />
        <span style={{ display: 'block', height: '1.5px', width: '20px', background: 'var(--page-fg)' }} />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
