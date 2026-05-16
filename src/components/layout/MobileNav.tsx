'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const navItems = [
  { label: 'Shop All', href: '/shop', num: '01' },
  { label: 'Training', href: '/shop/apparel', num: '02' },
  { label: 'Supplements', href: '/shop/supplements', num: '03' },
  { label: 'About', href: '/about', num: '04' },
  { label: 'Account', href: '/account', num: '05' },
];

export function MobileNav() {
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
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 3, 4, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 400ms ease',
        }}
      />

      {/* Panel — fullscreen slide from left */}
      <aside
        aria-hidden={!isOpen}
        className="md:hidden"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          maxWidth: '26rem',
          backgroundColor: '#07090F',
          borderRight: '1px solid #1B2038',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid #1B2038',
          }}
        >
          <Link
            href="/"
            onClick={close}
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: '1.4rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#CDD4EA',
            }}
          >
            Corvo
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="cursor-pointer transition-colors duration-200 hover:text-blade"
            style={{ color: '#47516B', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '3rem 1.75rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {navItems.map((item, i) => (
              <li
                key={item.href}
                style={{
                  borderBottom: i < navItems.length - 1 ? '1px solid #1B2038' : 'none',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-16px)',
                  transition: `opacity 400ms ease ${i * 60 + 200}ms, transform 400ms ease ${i * 60 + 200}ms`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  className="group flex items-center justify-between py-5 transition-colors duration-200 hover:text-blade"
                  style={{ color: '#CDD4EA' }}
                >
                  <span
                    className="font-display uppercase"
                    style={{ fontSize: 'clamp(1.6rem, 6vw, 2rem)', letterSpacing: '0.04em' }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                      color: '#D81829',
                      fontWeight: 700,
                    }}
                  >
                    {item.num}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderTop: '1px solid #1B2038',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="block w-4 h-[1.5px]" style={{ background: '#D81829' }} />
            <span
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '10px',
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: '#D81829',
                fontWeight: 700,
              }}
            >
              Corvo Athletics
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#2E3450' }}>
            Hunt without mercy.
          </p>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {/* Hamburger trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden cursor-pointer p-2 -ml-2 flex flex-col justify-center gap-[5px] transition-opacity hover:opacity-70"
      >
        <span className="block h-[1.5px] w-5" style={{ background: 'var(--page-fg)' }} />
        <span className="block h-[1.5px] w-4" style={{ background: 'var(--page-fg)' }} />
        <span className="block h-[1.5px] w-5" style={{ background: 'var(--page-fg)' }} />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
