import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CartIcon } from '@/components/cart/CartIcon';

const navItems = [
  { label: 'Protein & Supplements', href: '/shop/supplements' },
  { label: 'Apparel', href: '/shop/apparel' },
  { label: 'About', href: '/about' },
  { label: 'Shop All', href: '/shop' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-graphite/50 bg-ink/80 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-[0.3em] uppercase hover:text-gold transition-colors"
        >
          Corvo
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-bone transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <Link
            href="/account"
            className="hidden sm:block text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-bone transition-colors"
          >
            Account
          </Link>
          <CartIcon />
        </div>
      </Container>
    </header>
  );
}
