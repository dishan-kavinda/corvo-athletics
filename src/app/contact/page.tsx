import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Corvo Athletic. Questions about orders, products, or partnerships — we reply within one business day.',
  alternates: { canonical: '/contact' },
};

const channels = [
  {
    label: 'Support',
    value: 'support@corvoathletic.com',
    href: 'mailto:support@corvoathletic.com',
    note: 'Orders, shipping, returns — anything about your gear.',
  },
  {
    label: 'Partnerships',
    value: 'support@corvoathletic.com',
    href: 'mailto:support@corvoathletic.com?subject=Partnership',
    note: 'Athletes, coaches, and collaborators.',
  },
  {
    label: 'Instagram',
    value: '@corvoathletic',
    href: 'https://instagram.com/corvoathletic',
    note: 'Drops, training, behind the scenes.',
  },
];

export default function ContactPage() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--page-bg)' }}>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-end justify-end overflow-hidden pointer-events-none" aria-hidden>
        <span
          className="font-display uppercase select-none"
          style={{
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            color: 'var(--page-fg)',
            opacity: 0.025,
            lineHeight: 0.85,
            paddingRight: '2rem',
          }}
        >
          TALK
        </span>
      </div>

      <div className="relative shell">
        <FadeIn>
          <p className="eyebrow mb-4">── Get in Touch</p>
          <h1
            className="font-display uppercase leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.01em' }}
          >
            Contact
          </h1>
          <p className="text-sm leading-relaxed mb-16 max-w-md" style={{ color: 'var(--muted)' }}>
            Questions about an order, a product, or working together — reach out.
            We reply within one business day.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px max-w-4xl" style={{ background: 'var(--border)' }}>
          {channels.map((c, i) => (
            <FadeIn key={c.label} delay={i * 0.1}>
              <a
                href={c.href}
                className="group block h-full p-8 transition-colors duration-300"
                style={{ background: 'var(--surface)' }}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <p className="eyebrow mb-5" style={{ letterSpacing: '0.34em' }}>{c.label}</p>
                <p
                  className="font-display mb-3 transition-colors duration-300 group-hover:text-blade"
                  style={{ fontSize: '1.05rem', color: 'var(--page-fg)', wordBreak: 'break-word' }}
                >
                  {c.value}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{c.note}</p>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
