import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Shipping',
  description: 'Corvo Athletic shipping — free NZ delivery on orders over $100, dispatched within 1–2 business days.',
  alternates: { canonical: '/shipping' },
};

const rows = [
  { region: 'New Zealand — orders over $100', time: '2–5 business days', cost: 'Free' },
  { region: 'New Zealand — orders under $100', time: '2–5 business days', cost: 'Calculated at checkout' },
  { region: 'Rural addresses', time: '+1–2 business days', cost: 'Same as above' },
];

export default function ShippingPage() {
  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--page-bg)' }}>
      <div className="shell">
        <FadeIn>
          <p className="eyebrow mb-4">── Delivery</p>
          <h1
            className="font-display uppercase leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.01em' }}
          >
            Shipping
          </h1>
          <p className="text-sm leading-relaxed mb-16 max-w-md" style={{ color: 'var(--muted)' }}>
            Every order is dispatched from New Zealand within 1–2 business days.
            You&apos;ll receive tracking the moment it leaves our hands.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-3xl" style={{ border: '1px solid var(--border)' }}>
            {/* Table header */}
            <div
              className="grid grid-cols-3 gap-4 px-6 py-4"
              style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)' }}
            >
              {['Destination', 'Delivery Time', 'Cost'].map((h) => (
                <p key={h} className="eyebrow" style={{ letterSpacing: '0.24em', fontSize: '10px' }}>{h}</p>
              ))}
            </div>
            {rows.map((r, i) => (
              <div
                key={r.region}
                className="grid grid-cols-3 gap-4 px-6 py-5"
                style={{
                  background: 'var(--surface)',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <p className="text-sm" style={{ color: 'var(--page-fg)' }}>{r.region}</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{r.time}</p>
                <p className="text-sm" style={{ color: r.cost === 'Free' ? 'var(--accent)' : 'var(--muted)', fontWeight: r.cost === 'Free' ? 600 : 400 }}>
                  {r.cost}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-12 max-w-3xl">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Questions about your delivery?{' '}
              <a
                href="/contact"
                style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Contact support
              </a>{' '}
              with your order number and we&apos;ll track it down.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
