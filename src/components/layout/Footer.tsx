import Link from 'next/link';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { BackToTop } from '@/components/layout/BackToTop';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Account', href: '/account' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
  ],
  Follow: [
    { label: 'Instagram', href: 'https://instagram.com/corvoathletic', external: true },
    { label: 'TikTok', href: 'https://tiktok.com/@corvoathletic', external: true },
  ],
} as const;

export function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }}>
      {/* ── Wordmark hero ─────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--footer-border)' }}>
        <div className="shell py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <img
                src="/logo-savage-clean.svg"
                alt="Corvo Athletic"
                style={{
                  height: 'clamp(72px, 10vw, 128px)',
                  width: 'auto',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              />
              <p
                className="font-display uppercase"
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
                  color: 'var(--footer-accent)',
                  letterSpacing: '0.22em',
                  lineHeight: 1,
                }}
              >
                Athletic
              </p>
            </div>
            <div className="max-w-xs">
              <p style={{ color: 'var(--footer-muted)', lineHeight: '1.7', fontSize: '0.875rem' }}>
                Elite training gear and supplements engineered for those who refuse to be average.
                Dark discipline. Proven performance.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--footer-accent)' }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '10px',
                    letterSpacing: '0.42em',
                    textTransform: 'uppercase',
                    color: 'var(--footer-muted)',
                    fontWeight: 700,
                  }}
                >
                  Est. New Zealand
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Links + newsletter ─────────────────────────── */}
      <div className="shell py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 mb-14">
          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h4
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                    color: 'var(--footer-accent)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {title}
                </h4>
                <ul className="space-y-3">
                  {items.map((link) => (
                    <li key={link.label}>
                      {'external' in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm transition-colors duration-200 hover:text-blade"
                          style={{ color: 'var(--footer-muted)' }}
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm transition-colors duration-200 hover:text-blade"
                          style={{ color: 'var(--footer-muted)' }}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'var(--footer-accent)',
                marginBottom: '1.25rem',
              }}
            >
              The Inner Circle
            </h4>
            <p style={{ color: 'var(--footer-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              First access to drops, athlete programs, and Corvo updates.
            </p>
            {/* Footer is always dark — re-scope the page-level vars the form reads */}
            <div
              style={{
                '--surface-elevated': 'rgba(255,255,255,0.05)',
                '--border': 'var(--footer-border)',
                '--page-fg': 'var(--footer-fg)',
                '--muted': 'var(--footer-muted)',
                '--accent': 'var(--footer-accent)',
              } as React.CSSProperties}
            >
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* ── Legal row ──────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8"
          style={{ borderTop: '1px solid var(--footer-border)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="block w-5 h-[1.5px]"
              style={{ background: 'var(--footer-accent)' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '10px',
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: 'var(--footer-muted)',
                fontWeight: 700,
              }}
            >
              Corvo Athletic
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--footer-muted)' }}>
            &copy; {new Date().getFullYear()} Corvo Athletic. Built for those who don&apos;t quit.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
