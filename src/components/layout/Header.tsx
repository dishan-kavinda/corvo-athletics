import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CartIcon } from '@/components/cart/CartIcon';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { label: 'Protein & Supplements', href: '/shop/supplements' },
  { label: 'Apparel', href: '/shop/apparel' },
  { label: 'About', href: '/about' },
  { label: 'Shop All', href: '/shop' },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        background: 'var(--header-bg)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-0">
          <MobileNav />
          <Link
            href="/"
            className="font-display text-2xl tracking-[0.3em] uppercase transition-colors hover:text-gold"
          >
            Corvo
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-xs uppercase tracking-[0.2em] transition-opacity opacity-60 hover:opacity-100 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/account"
            className="hidden sm:block text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity"
          >
            Account
          </Link>
          <CartIcon />
        </div>
      </Container>
    </header>
  );
}
