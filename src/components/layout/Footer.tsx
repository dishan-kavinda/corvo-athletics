import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const cols = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'Supplements', href: '/shop/supplements' },
      { label: 'Apparel', href: '/shop/apparel' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'TikTok', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-graphite mt-32">
      <Container className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-xs tracking-[0.3em] uppercase mb-5 text-gold">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm text-ash">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-bone transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-graphite">
          <p className="font-display tracking-[0.3em] uppercase text-bone">Corvo Athletics</p>
          <p className="text-xs text-ash">
            &copy; 2026 Corvo Athletics. Engineered for athletes who don&apos;t quit.
          </p>
        </div>
      </Container>
    </footer>
  );
}
