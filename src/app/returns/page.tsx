import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Returns',
  description: 'Corvo Athletic returns — 30 days, no questions, full refund or exchange on unworn items.',
  alternates: { canonical: '/returns' },
};

const steps = [
  {
    num: '01',
    title: 'Email Us',
    desc: 'Send your order number to support@corvoathletic.com within 30 days of delivery. No forms, no friction.',
  },
  {
    num: '02',
    title: 'Ship It Back',
    desc: 'We’ll reply with a return address within one business day. Items must be unworn, unwashed, and in original condition.',
  },
  {
    num: '03',
    title: 'Refund or Exchange',
    desc: 'Once received, your refund is processed within 3–5 business days — or we ship your exchange immediately.',
  },
];

export default function ReturnsPage() {
  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--page-bg)' }}>
      <div className="shell">
        <FadeIn>
          <p className="eyebrow mb-4">── 30-Day Guarantee</p>
          <h1
            className="font-display uppercase leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.01em' }}
          >
            Returns
          </h1>
          <p className="text-sm leading-relaxed mb-16 max-w-md" style={{ color: 'var(--muted)' }}>
            Not right? You have 30 days from delivery for a full refund or exchange.
            If it doesn&apos;t meet your standard, it doesn&apos;t meet ours.
          </p>
        </FadeIn>

        <div className="max-w-3xl">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.1}>
              <div
                className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-8"
                style={{
                  borderTop: '1px solid var(--border)',
                  borderBottom: i === steps.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span
                  className="font-display leading-none shrink-0 transition-colors duration-300 group-hover:text-blade"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--border)' }}
                >
                  {s.num}
                </span>
                <div className="flex-1 md:pt-1">
                  <h2 className="font-display uppercase mb-3" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}>
                    {s.title}
                  </h2>
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-12">
            <a href="/contact" className="tech-label" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Start a Return →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
