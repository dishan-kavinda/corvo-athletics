'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CartIcon } from '@/components/cart/CartIcon';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Training', href: '/shop/apparel' },
  { label: 'Supplements', href: '/shop/supplements' },
  { label: 'About', href: '/about' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: scrolled ? 'var(--header-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <div
        className="mx-auto flex h-[72px] items-center justify-between gap-6 px-6 md:px-10 lg:px-14"
        style={{ maxWidth: '1440px' }}
      >
        {/* ── Left: hamburger + wordmark ──────────────── */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="group flex flex-col items-center leading-none select-none">
            <span
              className="font-display uppercase transition-colors duration-200 group-hover:text-blade"
              style={{ fontSize: '1.2rem', letterSpacing: '0.32em', marginRight: '-0.32em' }}
            >
              Corvo
            </span>
            <span
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '8.5px',
                letterSpacing: '0.32em',
                marginRight: '-0.32em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Athletic
            </span>
          </Link>
        </div>

        {/* ── Center: nav links ───────────────────────── */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative group transition-colors duration-200 hover:text-blade"
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              {item.label}
              <span
                className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300"
                style={{ background: 'var(--accent)' }}
              />
            </Link>
          ))}
        </nav>

        {/* ── Right: utilities ─────────────────────────── */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/account"
            className="hidden sm:flex transition-colors duration-200 hover:text-blade"
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
          >
            Account
          </Link>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
