'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { CartIcon } from '@/components/cart/CartIcon';
import { Logo } from '@/components/layout/Logo';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchModal } from '@/components/ui/SearchModal';

const navItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 28, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.38);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.38);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Announcement bar — scrolls away while the header below sticks */}
      <div
        className="section-dark"
        style={{ borderBottom: '1px solid var(--footer-border)' }}
      >
        <p
          className="text-center py-2 px-4"
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'var(--footer-fg)',
          }}
        >
          Free NZ Shipping on Orders Over <span style={{ color: 'var(--footer-accent)' }}>$100</span>
        </p>
      </div>

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
            <MobileNav onSearchOpen={() => setSearchOpen(true)} />
            <Link href="/home" className="group flex items-center leading-none select-none transition-opacity duration-200 hover:opacity-80">
              <Logo height={38} />
            </Link>
          </div>

          {/* ── Center: nav links ───────────────────────── */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.label}
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
            <MagneticButton>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                title="Search (⌘K)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--page-fg)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </MagneticButton>

            <ThemeToggle />

            <MagneticButton>
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
            </MagneticButton>

            <MagneticButton>
              <CartIcon />
            </MagneticButton>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
