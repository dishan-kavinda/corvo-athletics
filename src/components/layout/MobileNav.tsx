'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Protein & Supplements', href: '/shop/supplements' },
  { label: 'Apparel', href: '/shop/apparel' },
  { label: 'About', href: '/about' },
  { label: 'Account', href: '/account' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-full max-w-sm bg-black border-r border-graphite shadow-2xl transition-transform duration-500 ease-out flex flex-col md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-graphite">
          <Link
            href="/"
            onClick={close}
            className="font-display text-2xl tracking-[0.3em] uppercase hover:text-gold transition-colors"
          >
            Corvo
          </Link>
          <button
            type="button"
            onClick={close}
            className="text-ash hover:text-bone transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="px-6 py-6 border-t border-graphite">
          <p className="font-display text-xs text-gold tracking-[0.3em] uppercase">
            Corvo Athletics
          </p>
          <p className="text-xs text-ash mt-2">Engineered for athletes who don&apos;t quit.</p>
        </footer>
      </aside>
    </>
  );
}
