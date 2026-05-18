import { cookies } from 'next/headers';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';

export const metadata = {
  title: 'About',
  description:
    'Corvo Athletic is a luxury sports brand built for serious athletes. Premium gym apparel, athleisure, and lab-tested supplements. No compromise.',
  keywords: ['Corvo Athletic', 'luxury gym brand', 'premium athleisure', 'sports brand story'],
  alternates: { canonical: '/about' },
};

const pillars = [
  {
    num: '01',
    title: 'Lab Tested. Every Batch.',
    body: "We don't guess. Independent third-party labs verify the purity, potency, and composition of every supplement we ship. Full certificate of analysis available for any product on request. No exceptions.",
  },
  {
    num: '02',
    title: 'Built by Athletes.',
    body: "Our formulas and apparel are designed with strength coaches and competitive athletes. If it doesn't hold up in the gym, on the track, or in the cage, it doesn't carry our name.",
  },
  {
    num: '03',
    title: 'Premium. Always.',
    body: 'Cold-pressed isolates. Brushed performance knits. Heavy-duty zippers and stitching that lasts seasons. We will not compete on price by cutting corners. Not once.',
  },
  {
    num: '04',
    title: 'Engineered Forever.',
    body: "Trends fade. Real performance gear doesn't. Our apparel is built to outlast seasons. Our supplements deliver exactly what the label says. Every detail is intentional.",
  },
];

export default async function AboutPage() {
  const cookieStore = await cookies();
  const isLuxury = cookieStore.get('corvo_aesthetic')?.value === 'luxury';
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden"
        style={{ background: 'var(--section-dark)' }}
      >
        {/* Giant watermark */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none"
          aria-hidden
        >
          <span
            className="font-display uppercase select-none"
            style={{
              fontSize: 'clamp(10rem, 26vw, 22rem)',
              color: 'var(--footer-fg)',
              opacity: 0.03,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              paddingLeft: '2rem',
              whiteSpace: 'nowrap',
            }}
          >
            CORVO
          </span>
        </div>

        {/* Crimson diagonal line */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(135deg, transparent 0%, transparent 49.5%, rgba(216,24,41,0.12) 49.5%, rgba(216,24,41,0.12) 50.5%, transparent 50.5%)',
          }}
        />

        <div
          className="relative mx-auto px-6 md:px-10 lg:px-14 py-24 w-full"
          style={{ maxWidth: '1440px' }}
        >
          <HeroReveal delay={0.08} y={12}>
            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.52em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '1.5rem',
              }}
            >
              {isLuxury ? '── The House' : '── The Brand'}
            </p>
          </HeroReveal>

          <HeroReveal delay={0.22} y={50} duration={1.0}>
            <h1
              className={`font-display leading-[0.88] mb-10${isLuxury ? '' : ' uppercase'}`}
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                color: 'var(--footer-fg)',
                letterSpacing: '-0.01em',
                maxWidth: '900px',
              }}
            >
              {isLuxury ? (
                <>
                  Excellence,
                  <br />
                  <span style={{ color: 'var(--accent)' }}>Refined.</span>
                </>
              ) : (
                <>
                  NO
                  <br />
                  <span style={{ color: 'var(--accent)' }}>COMPROMISE.</span>
                </>
              )}
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.55}>
            <div style={{ maxWidth: '520px' }}>
              {isLuxury ? (
                <>
                  <p className="text-base md:text-lg leading-relaxed mb-5" style={{ color: 'var(--footer-muted)' }}>
                    Corvo Athletic was founded on a singular principle: those who commit to
                    excellence deserve equipment crafted to the same standard. No concessions,
                    no approximations.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--footer-muted)' }}>
                    Every product carries our name because it was held to the Corvo standard
                    before it ever reached you.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base md:text-lg leading-relaxed mb-5" style={{ color: 'var(--footer-muted)' }}>
                    Corvo Athletic was built for one reason: the gear and fuel athletes deserved
                    didn&apos;t exist. Cheap supplements, generic apparel, hollow promises. We were
                    done with it.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--footer-muted)' }}>
                    Every product carries our name because we built it, tested it, and stand behind it.
                  </p>
                </>
              )}
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ── Divider ticker ───────────────────────────── */}
      <div
        className="overflow-hidden py-[0.9rem]"
        style={{ background: 'var(--accent)' }}
      >
        <MarqueeStrip light />
      </div>

      {/* ── Pillars ──────────────────────────────────── */}
      <section
        className="py-24"
        style={{ background: 'var(--page-bg)' }}
      >
        <div
          className="mx-auto px-6 md:px-10 lg:px-14"
          style={{ maxWidth: '1440px' }}
        >
          <FadeIn className="mb-16">
            <h2
              className="font-display uppercase leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              What We Stand For
            </h2>
          </FadeIn>

          <Stagger staggerDelay={0.12}>
            {pillars.map((p, i) => (
              <StaggerItem key={p.num}>
                <div
                  className="group flex flex-col md:flex-row md:items-start gap-6 md:gap-12 py-10 transition-colors duration-300"
                  style={{
                    borderTop: '1px solid var(--border)',
                    borderBottom: i === pillars.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {/* Number */}
                  <span
                    className="font-display leading-none shrink-0 transition-colors duration-300 group-hover:text-blade"
                    style={{
                      fontSize: 'clamp(3rem, 6vw, 5rem)',
                      color: 'var(--border)',
                    }}
                  >
                    {p.num}
                  </span>

                  {/* Content */}
                  <div className="flex-1 md:pt-1.5">
                    <h3
                      className="font-display uppercase mb-4"
                      style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)' }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed max-w-xl"
                      style={{ color: 'var(--muted)' }}
                    >
                      {p.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Manifesto ────────────────────────────────── */}
      <section
        className="relative py-40 overflow-hidden"
        style={{ background: 'var(--section-dark)' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }}
        />

        <div
          className="relative mx-auto px-6 md:px-10 lg:px-14"
          style={{ maxWidth: '1440px' }}
        >
          <FadeIn>
            {isLuxury ? (
              <>
                <p
                  className="font-display leading-[1.2] mb-8"
                  style={{ fontSize: 'clamp(1.5rem, 3.8vw, 3rem)', color: 'var(--footer-fg)', maxWidth: '760px', letterSpacing: '0.01em' }}
                >
                  &ldquo;We build for those who understand that quality is not a luxury.
                  <br />
                  <span style={{ color: 'var(--accent)' }}>It is the only acceptable standard.&rdquo;</span>
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                    color: 'var(--footer-muted)',
                  }}
                >
                  — The Corvo Founding Principle
                </p>
              </>
            ) : (
              <>
                <p
                  className="font-display uppercase leading-[0.9] mb-8"
                  style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', color: 'var(--footer-fg)', maxWidth: '800px' }}
                >
                  &ldquo;WE BUILD FOR THE{' '}
                  <span style={{ color: 'var(--accent)' }}>OBSESSED.</span>
                  <br />
                  NOT THE{' '}
                  <span style={{ color: 'var(--color-pulse)' }}>CASUAL.&rdquo;</span>
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                    color: 'var(--footer-muted)',
                  }}
                >
                  — The Corvo Standard
                </p>
              </>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section
        className="py-28 border-t text-center"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="mx-auto px-6 md:px-10 lg:px-14"
          style={{ maxWidth: '1440px' }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.52em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '1.5rem',
              }}
            >
              {isLuxury ? '· The House of Corvo ·' : "· See What We\u2019ve Built ·"}
            </p>
            <h2
              className={`font-display leading-[0.9] mb-10${isLuxury ? '' : ' uppercase'}`}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {isLuxury ? (
                <>
                  The Standard.
                  <br />
                  <span style={{ color: 'var(--accent)' }}>The Collection.</span>
                </>
              ) : (
                <>
                  Train Harder.
                  <br />
                  <span style={{ color: 'var(--accent)' }}>Recover Smarter.</span>
                </>
              )}
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/shop" variant="primary" size="lg">
                Shop the Range →
              </Button>
              <Button href="/home" variant="ghost" size="lg">
                Back to Home
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
