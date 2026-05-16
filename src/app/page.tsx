import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { TiltCard } from '@/components/ui/TiltCard';
import { HeroSceneClient } from '@/components/3d/HeroSceneClient';
import { NewsletterForm } from '@/components/ui/NewsletterForm';

/* ── Data ────────────────────────────────────────────── */

const pillars = [
  {
    num: '01',
    title: 'Lab Tested',
    desc: 'Every batch independently verified for purity and potency. No hidden fillers, no shortcuts.',
  },
  {
    num: '02',
    title: 'Athlete Formulated',
    desc: 'Built alongside strength coaches and competitive athletes. Real-world performance, proven results.',
  },
  {
    num: '03',
    title: 'No Compromise',
    desc: 'Premium ingredients, premium materials, premium execution. Luxury means zero cutting corners.',
  },
];

const categories = [
  {
    label: 'Training',
    sub: 'Performance Apparel',
    icon: '⚡',
    href: '/shop',
    accent: '#7B5FFF',
  },
  {
    label: 'Supplements',
    sub: 'Elite Nutrition',
    icon: '◈',
    href: '/shop',
    accent: '#C9A961',
  },
  {
    label: 'Recovery',
    sub: 'Gear & Accessories',
    icon: '◎',
    href: '/shop',
    accent: '#4A9EFF',
  },
  {
    label: 'Lifestyle',
    sub: 'Athleisure Collection',
    icon: '▲',
    href: '/shop',
    accent: '#7B5FFF',
  },
];

const stats = [
  { value: '10K+', label: 'Athletes Worldwide' },
  { value: '5★', label: 'Average Rating' },
  { value: '3rd Party', label: 'Lab Verified' },
  { value: '0', label: 'Compromises' },
];

/* ── Page ────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ─────────────────────────────────────────────────
          SECTION 1 · HERO
      ───────────────────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[640px] flex items-center overflow-hidden">
        {/* Solid base bg — prevents flash */}
        <div className="absolute inset-0" style={{ background: 'var(--page-bg)' }} />

        {/* 3D canvas — full bleed */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroSceneClient />
        </div>

        {/* Gradient mask — text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'var(--hero-gradient)' }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--page-bg), transparent)',
          }}
        />

        {/* Hero content */}
        <Container className="relative z-10 pt-20">
          <div className="max-w-[640px]">

            {/* Eyebrow badge */}
            <HeroReveal delay={0.05} y={10}>
              <div className="inline-flex items-center gap-3 mb-10">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: '#7B5FFF', boxShadow: '0 0 10px rgba(123,95,255,0.8)' }}
                />
                <span
                  className="font-display text-xs tracking-[0.5em] uppercase"
                  style={{ color: '#7B5FFF' }}
                >
                  Corvo Athletics
                </span>
                <span
                  className="h-px w-12 shrink-0"
                  style={{ background: 'linear-gradient(90deg, #7B5FFF, transparent)' }}
                />
              </div>
            </HeroReveal>

            {/* Main headline */}
            <HeroReveal delay={0.18} y={60} duration={1.1}>
              <h1
                className="font-display uppercase tracking-tight leading-[0.9] mb-8"
                style={{ fontSize: 'clamp(4.2rem, 12vw, 10rem)' }}
              >
                <span
                  className="block"
                  style={{ color: 'var(--page-fg)' }}
                >
                  BUILT
                </span>
                <span
                  className="block"
                  style={{ color: 'var(--page-fg)' }}
                >
                  FOR THE
                </span>
                <span
                  className="block"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #4A35C7 0%, #7B5FFF 22%, #F0D080 52%, #7B5FFF 80%, #4A35C7 100%)',
                    backgroundSize: '300% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer-gold 4.5s linear infinite',
                  }}
                >
                  RELENTLESS.
                </span>
              </h1>
            </HeroReveal>

            {/* Sub copy */}
            <HeroReveal delay={0.48}>
              <p
                className="text-base md:text-lg max-w-[440px] mb-10 leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                Elite training gear and supplements engineered for those who refuse to be average.
                Dark discipline. Proven results.
              </p>
            </HeroReveal>

            {/* CTAs */}
            <HeroReveal delay={0.68}>
              <div className="flex flex-wrap gap-4 items-center">
                <Button href="/shop" size="lg" variant="gold">
                  Shop Now →
                </Button>
                <Button href="/about" size="lg" variant="ghost">
                  Our Story
                </Button>
              </div>
            </HeroReveal>

            {/* Scroll indicator */}
            <HeroReveal delay={1.1}>
              <div className="mt-16 flex items-center gap-4" style={{ color: 'var(--muted)' }}>
                <div
                  className="h-px w-12"
                  style={{
                    background: 'linear-gradient(90deg, rgba(123,95,255,0.7), transparent)',
                  }}
                />
                <span className="text-xs uppercase tracking-[0.35em]">Scroll</span>
              </div>
            </HeroReveal>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────
          SECTION 2 · MARQUEE
      ───────────────────────────────────────────────── */}
      <div
        className="border-y py-5 overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <MarqueeStrip />
      </div>

      {/* ─────────────────────────────────────────────────
          SECTION 3 · STATS
      ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--page-bg)' }}>
        <Container>
          <Stagger staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-px">
            {stats.map((s, i) => (
              <StaggerItem key={s.label}>
                <div
                  className="py-10 px-6 text-center relative"
                  style={{
                    background: 'var(--surface)',
                    ...(i < stats.length - 1
                      ? {}
                      : {}),
                  }}
                >
                  {/* Side border accent */}
                  {i > 0 && (
                    <div
                      className="absolute left-0 top-4 bottom-4 w-px hidden md:block"
                      style={{ background: 'var(--border)' }}
                    />
                  )}
                  <p
                    className="font-display leading-none mb-3"
                    style={{
                      fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                      backgroundImage:
                        'linear-gradient(135deg, #4A35C7 0%, #7B5FFF 48%, #C9A961 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-xs uppercase tracking-[0.22em]"
                    style={{ color: 'var(--muted)' }}
                  >
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────
          SECTION 4 · SHOP CATEGORIES
      ───────────────────────────────────────────────── */}
      <section
        className="py-24 border-t"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <FadeIn>
              <div>
                <p
                  className="text-xs font-display uppercase tracking-[0.45em] mb-3"
                  style={{ color: '#7B5FFF' }}
                >
                  — Collections
                </p>
                <h2
                  className="font-display uppercase leading-[0.92]"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                >
                  Shop by Category
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Button href="/shop" variant="ghost" size="sm">
                View All →
              </Button>
            </FadeIn>
          </div>

          <Stagger
            staggerDelay={0.1}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {categories.map((cat) => (
              <StaggerItem key={cat.label}>
                <a href={cat.href} className="group block h-full">
                  <TiltCard intensity={6}>
                    <div
                      className="relative h-full min-h-[200px] md:min-h-[260px] p-6 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer"
                      style={{
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {/* Hover fill glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse 90% 80% at 20% 20%, ${cat.accent}1A 0%, transparent 70%)`,
                        }}
                      />

                      {/* Icon */}
                      <div
                        className="text-3xl mb-4 relative z-10"
                        style={{ color: cat.accent }}
                      >
                        {cat.icon}
                      </div>

                      {/* Label */}
                      <div className="relative z-10">
                        <h3 className="font-display text-xl uppercase tracking-wide mb-1">
                          {cat.label}
                        </h3>
                        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
                          {cat.sub}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div
                        className="absolute bottom-5 right-5 text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        style={{ color: cat.accent }}
                      >
                        →
                      </div>

                      {/* Bottom border shimmer */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                        style={{
                          background: `linear-gradient(90deg, ${cat.accent}, transparent)`,
                        }}
                      />
                    </div>
                  </TiltCard>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────
          SECTION 5 · MANIFESTO
      ───────────────────────────────────────────────── */}
      <section
        className="relative py-36 md:py-52 overflow-hidden"
        style={{ background: 'var(--page-bg)' }}
      >
        {/* Background watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          aria-hidden
        >
          <span
            className="font-display uppercase text-center select-none"
            style={{
              fontSize: 'clamp(10rem, 28vw, 26rem)',
              color: 'var(--page-fg)',
              opacity: 0.025,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            CORVO
          </span>
        </div>

        {/* Violet glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(123,95,255,0.06) 0%, transparent 70%)',
          }}
        />

        <Container className="relative">
          <FadeIn>
            <blockquote className="text-center max-w-4xl mx-auto">
              <p
                className="font-display uppercase leading-[1.0] mb-8"
                style={{ fontSize: 'clamp(1.9rem, 5.5vw, 5rem)' }}
              >
                <span style={{ color: 'var(--page-fg)' }}>&ldquo;WE DON&apos;T BUILD GEAR </span>
                <span
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #4A35C7 0%, #7B5FFF 50%, #4A9EFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  FOR THE CASUAL.
                </span>
                <br />
                <span style={{ color: 'var(--page-fg)' }}>WE FORGE TOOLS </span>
                <span
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #B89653 0%, #C9A961 40%, #F0D080 65%, #C9A961 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer-gold 3s linear infinite',
                  }}
                >
                  FOR THE OBSESSED.&rdquo;
                </span>
              </p>

              <footer
                className="flex items-center justify-center gap-4"
                style={{ color: 'var(--muted)' }}
              >
                <span
                  className="block h-px w-8"
                  style={{ background: 'linear-gradient(90deg, transparent, #7B5FFF)' }}
                />
                <cite
                  className="text-xs uppercase tracking-[0.4em] not-italic"
                  style={{ color: '#7B5FFF' }}
                >
                  The Corvo Standard
                </cite>
                <span
                  className="block h-px w-8"
                  style={{ background: 'linear-gradient(90deg, #7B5FFF, transparent)' }}
                />
              </footer>
            </blockquote>
          </FadeIn>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────
          SECTION 6 · REVERSE MARQUEE
      ───────────────────────────────────────────────── */}
      <div
        className="border-y py-5 overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <MarqueeStrip reverse />
      </div>

      {/* ─────────────────────────────────────────────────
          SECTION 7 · THE CORVO STANDARD (Pillars)
      ───────────────────────────────────────────────── */}
      <section
        className="py-28"
        style={{ background: 'var(--surface)' }}
      >
        <Container>
          {/* Header */}
          <FadeIn className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
              <div>
                <p
                  className="text-xs font-display uppercase tracking-[0.45em] mb-3"
                  style={{ color: '#7B5FFF' }}
                >
                  — Why Corvo
                </p>
                <h2
                  className="font-display uppercase leading-[0.92]"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                >
                  The Corvo Standard
                </h2>
              </div>
              <p
                className="max-w-xs leading-relaxed text-sm md:pb-1"
                style={{ color: 'var(--muted)' }}
              >
                Every product meets our uncompromising benchmark. Nothing ships until it
                exceeds expectations.
              </p>
            </div>
          </FadeIn>

          {/* Pillar cards */}
          <Stagger staggerDelay={0.14} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <StaggerItem key={p.num}>
                <TiltCard intensity={7}>
                  <div
                    className="h-full p-8 rounded-2xl relative overflow-hidden group cursor-default"
                    style={{
                      background: 'var(--surface-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse 100% 60% at 0% 0%, rgba(123,95,255,0.1) 0%, transparent 70%)',
                      }}
                    />

                    {/* Number + line */}
                    <div className="flex items-center gap-4 mb-8">
                      <span
                        className="font-display text-5xl leading-none select-none"
                        style={{ color: 'rgba(123,95,255,0.18)' }}
                      >
                        {p.num}
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{
                          background:
                            'linear-gradient(90deg, rgba(123,95,255,0.5), transparent)',
                        }}
                      />
                    </div>

                    <h3 className="font-display text-xl uppercase tracking-wider mb-4">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {p.desc}
                    </p>

                    {/* Bottom shimmer */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(123,95,255,0.5), rgba(201,169,97,0.35), transparent)',
                      }}
                    />
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────
          SECTION 8 · NEWSLETTER
      ───────────────────────────────────────────────── */}
      <section
        className="relative py-32 overflow-hidden border-t"
        style={{ background: 'var(--page-bg)', borderColor: 'var(--border)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <div
            style={{
              width: '700px',
              height: '500px',
              background:
                'radial-gradient(ellipse, rgba(123,95,255,0.1) 0%, transparent 70%)',
            }}
          />
        </div>

        <Container className="relative">
          <FadeIn className="text-center">
            <p
              className="text-xs font-display uppercase tracking-[0.45em] mb-5"
              style={{ color: '#7B5FFF' }}
            >
              · Inner Circle ·
            </p>

            <h2
              className="font-display uppercase leading-[0.9] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
            >
              ENTER THE
              <br />
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #4A35C7 0%, #7B5FFF 25%, #C9A961 55%, #7B5FFF 80%, #4A35C7 100%)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer-gold 4s linear infinite',
                }}
              >
                DARKNESS.
              </span>
            </h2>

            <p
              className="max-w-md mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              First access to exclusive drops, athlete programs, and Corvo updates. No spam.
              Just signal.
            </p>

            <NewsletterForm />
          </FadeIn>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────
          SECTION 9 · FINAL CTA
      ───────────────────────────────────────────────── */}
      <section
        className="relative py-40 overflow-hidden"
        style={{ background: 'var(--surface)' }}
      >
        {/* Decorative ambient blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(123,95,255,0.07) 0%, transparent 70%)',
            animation: 'pulse-glow 5s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(201,169,97,0.05) 0%, transparent 70%)',
            animation: 'pulse-glow 7s ease-in-out infinite 1.5s',
          }}
        />

        <Container className="relative text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span
                className="h-px w-8"
                style={{ background: 'linear-gradient(90deg, transparent, #C9A961)' }}
              />
              <p
                className="font-display text-xs tracking-[0.5em] uppercase"
                style={{ color: '#C9A961' }}
              >
                Corvo Elite
              </p>
              <span
                className="h-px w-8"
                style={{ background: 'linear-gradient(90deg, #C9A961, transparent)' }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <h2
              className="font-display uppercase leading-[0.88] tracking-tight mb-12"
              style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
            >
              CLAIM
              <br />
              YOUR{' '}
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #4A35C7 0%, #7B5FFF 25%, #C9A961 55%, #7B5FFF 80%, #4A35C7 100%)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer-gold 3.5s linear infinite',
                }}
              >
                EDGE.
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.26}>
            <Button href="/shop" size="lg" variant="gold">
              Shop the Collection →
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
