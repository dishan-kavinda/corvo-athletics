import Link from 'next/link';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Supplements', href: '/shop/supplements' },
    { label: 'Apparel', href: '/shop/apparel' },
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
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }}>
      {/* ── Wordmark hero ─────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--footer-border)' }}>
        <div
          className="mx-auto px-6 md:px-10 lg:px-14 py-16"
          style={{ maxWidth: '1440px' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="overflow-hidden">
              <p
                className="font-display uppercase leading-[0.88]"
                style={{
                  fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                  color: 'var(--footer-fg)',
                  letterSpacing: '-0.01em',
                }}
              >
                CORVO
              </p>
              <p
                className="font-display uppercase leading-[0.88]"
                style={{
                  fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                  color: 'var(--footer-accent)',
                  letterSpacing: '-0.01em',
                }}
              >
                ATHLETIC
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

      {/* ── Links grid ─────────────────────────────────── */}
      <div
        className="mx-auto px-6 md:px-10 lg:px-14 py-14"
        style={{ maxWidth: '1440px' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
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
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-blade"
                      style={{ color: 'var(--footer-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Legal row ──────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8"
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
        </div>
      </div>
    </footer>
  );
}
