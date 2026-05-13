'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const navItems = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Protein & Supplements', href: '/shop/supplements' },
  { label: 'Apparel', href: '/shop/apparel' },
  { label: 'About', href: '/about' },
  { label: 'Account', href: '/account' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const panel = (
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
        className="md:hidden"
      />
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          maxWidth: '24rem',
          backgroundColor: '#000000',
          borderRight: '1px solid #262626',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
        aria-hidden={!isOpen}
        className="md:hidden"
      >
        <header
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid #262626' }}
        >
          <Link
            href="/"
            onClick={close}
            className="font-display text-2xl tracking-[0.3em] uppercase hover:text-gold transition-colors"
            style={{ color: '#FAFAFA' }}
          >
            Corvo
          </Link>
          <button
            type="button"
            onClick={close}
            className="hover:text-bone transition-colors cursor-pointer"
            style={{ color: '#737373' }}
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </header>

        <nav className="flex-1 px-6 py-10">
          <ul className="space-y-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block font-display text-2xl uppercase tracking-wider hover:text-gold transition-colors"
                  style={{ color: '#FAFAFA' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer
          className="px-6 py-6"
          style={{ borderTop: '1px solid #262626' }}
        >
          <p
            className="font-display text-xs tracking-[0.3em] uppercase"
            style={{ color: '#C9A961' }}
          >
            Corvo Athletics
          </p>
          <p className="text-xs mt-2" style={{ color: '#737373' }}>
            Engineered for athletes who don&apos;t quit.
          </p>
        </footer>
      </aside>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden flex flex-col justify-center gap-[5px] cursor-pointer p-2 -ml-2"
        aria-label="Open navigation menu"
      >
        <span className="block h-[1.5px] w-5 bg-bone"></span>
        <span className="block h-[1.5px] w-5 bg-bone"></span>
        <span className="block h-[1.5px] w-5 bg-bone"></span>
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
