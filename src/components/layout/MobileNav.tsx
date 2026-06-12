'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/layout/Logo';

const navItems = [
  { label: 'Shop All', href: '/shop', num: '01' },
  { label: 'About', href: '/about', num: '02' },
  { label: 'Contact', href: '/contact', num: '03' },
  { label: 'Account', href: '/account', num: '04' },
];

const panelVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 36, mass: 0.9 },
  },
  exit: {
    x: '-100%',
    transition: { ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.38 },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.22 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -22 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.5 },
  },
};

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38 }}
            onClick={close}
            aria-hidden="true"
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(2,3,4,0.88)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9998,
            }}
          />

          <motion.aside
            key="panel"
            className="md:hidden"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal
            aria-label="Navigation menu"
            style={{
              position: 'fixed', left: 0, top: 0,
              height: '100%', width: '100%', maxWidth: '26rem',
              background: 'var(--page-bg)',
              borderRight: '1px solid var(--border)',
              zIndex: 9999,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)' }}>
              <Link href="/home" onClick={close} style={{ textDecoration: 'none', color: 'var(--page-fg)', display: 'flex', alignItems: 'center' }}>
                <Logo height={34} />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                style={{ color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  Search products
                </button>
              </div>
            )}

            <nav style={{ flex: 1, padding: '2rem 1.75rem' }}>
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'flex', flexDirection: 'column', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}
              >
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    variants={itemVariants}
                    style={{ borderBottom: i < navItems.length - 1 ? '1px solid var(--border)' : 'none' }}
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
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div style={{ padding: '1.5rem 1.75rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ display: 'block', width: '1rem', height: '1.5px', background: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>Corvo Athletic</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--muted)' }}>No compromise.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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
