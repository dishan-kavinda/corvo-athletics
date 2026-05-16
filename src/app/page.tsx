import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { TiltCard } from '@/components/ui/TiltCard';
import { HeroSceneClient } from '@/components/3d/HeroSceneClient';

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

const stats = [
  { value: '10K+', label: 'Athletes' },
  { value: '5★', label: 'Rated' },
  { value: '3rd', label: 'Party Tested' },
  { value: '0', label: 'Compromise' },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{ background: 'var(--page-bg)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 72% 50%, rgba(201,169,97,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Hero visual — desktop right side */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden md:flex items-center justify-center">
          {/* Outer ambient glow */}
          <div
            className="absolute"
            style={{
              width: '78%',
              aspectRatio: '1',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(201,169,97,0.14) 0%, rgba(201,169,97,0.04) 55%, transparent 75%)',
              animation: 'pulse-glow 6s ease-in-out infinite',
            }}
          />
          {/* CSS premium gold orb — studio-lit look */}
          <div
            className="absolute"
            style={{
              width: '58%',
              aspectRatio: '1',
              borderRadius: '50%',
              animation: 'float 7s ease-in-out infinite',
              background: `radial-gradient(
                circle at 36% 30%,
                #FFFDF2 0%,
                #F9E07A 7%,
                #D4AF62 22%,
                #C9A961 36%,
                #9A7530 58%,
                #422008 82%,
                #180900 100%
              )`,
              boxShadow: '0 0 80px rgba(201,169,97,0.25), inset 0 0 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Specular highlight */}
            <div
              style={{
                position: 'absolute',
                top: '16%',
                left: '22%',
                width: '24%',
                aspectRatio: '1',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,252,210,0.4) 45%, transparent 75%)',
                filter: 'blur(4px)',
              }}
            />
            {/* Edge rim light */}
            <div
              style={{
                position: 'absolute',
                inset: '-1px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 68% 68%, rgba(201,169,97,0.35) 0%, transparent 35%)',
              }}
            />
          </div>
          {/* WebGL particle field orbiting the orb */}
          <div className="absolute inset-0">
            <HeroSceneClient />
          </div>
        </div>

        {/* Mobile — subtle particles background */}
        <div className="absolute inset-0 pointer-events-none md:hidden opacity-25">
          <HeroSceneClient />
        </div>

        <Container className="relative z-10">
          <div className="max-w-2xl lg:max-w-[54rem]">
            <HeroReveal delay={0.08} y={12}>
              <p className="text-gold font-display tracking-[0.5em] uppercase text-xs mb-8 flex items-center gap-3">
                <span className="block w-8 h-px bg-gold shrink-0" />
                Engineered for Athletes
              </p>
            </HeroReveal>

            <HeroReveal delay={0.22} y={55} duration={1.05}>
              <h1
                className="font-display uppercase leading-[1] tracking-tight mb-8"
                style={{ fontSize: 'clamp(4.5rem, 13vw, 10.5rem)' }}
              >
                <span className="block">FORGE</span>
                <span className="block">YOUR</span>
                <span
                  className="block"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #B89653 0%, #C9A961 30%, #F0D080 55%, #C9A961 75%, #B89653 100%)',
                    backgroundSize: '300% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer-gold 4.5s linear infinite',
                  }}
                >
                  EDGE.
                </span>
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.52}>
              <p className="text-lg max-w-md mb-10 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Premium protein, supplements, and training apparel for those who don&apos;t accept
                average.
              </p>
            </HeroReveal>

            <HeroReveal delay={0.72}>
              <div className="flex flex-wrap gap-4 items-center">
                <Button href="/shop" size="lg" variant="gold">
                  Shop Now
                </Button>
                <Button href="/about" size="lg" variant="ghost">
                  Our Story
                </Button>
              </div>
            </HeroReveal>

            <HeroReveal delay={1.05}>
              <div className="flex items-center gap-3 mt-16" style={{ color: 'var(--muted)' }}>
                <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent shrink-0" />
                <span className="text-xs uppercase tracking-[0.3em]">Scroll to explore</span>
              </div>
            </HeroReveal>
          </div>
        </Container>
      </section>

      {/* ── Marquee ──────────────────────────────────── */}
      <div
        className="border-y py-5 overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <MarqueeStrip />
      </div>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--page-bg)' }}>
        <Container>
          <Stagger staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div
                  className="text-center py-10 px-4 rounded-xl"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--card-shadow)',
                  }}
                >
                  <p
                    className="font-display mb-2 leading-none"
                    style={{
                      fontSize: 'clamp(2.5rem,5vw,4rem)',
                      backgroundImage:
                        'linear-gradient(135deg, #B89653 0%, #C9A961 50%, #F0D080 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-xs uppercase tracking-[0.25em]"
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

      {/* ── Feature Pillars ──────────────────────────── */}
      <section
        className="py-28 border-t"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <Container>
          <FadeIn className="text-center mb-4">
            <h2
              className="font-display uppercase"
              style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}
            >
              The Corvo Standard
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="text-center mb-16">
            <p className="max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
              Every product meets our uncompromising benchmark. Nothing ships until it exceeds
              expectations.
            </p>
          </FadeIn>

          <Stagger staggerDelay={0.14} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <StaggerItem key={p.num}>
                <TiltCard intensity={7}>
                  <div
                    className="h-full p-8 rounded-xl relative overflow-hidden group cursor-default"
                    style={{
                      background: 'var(--surface-elevated)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--card-shadow)',
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,169,97,0.1) 0%, transparent 70%)',
                      }}
                    />
                    {/* Gold rule */}
                    <div className="w-8 h-px bg-gold mb-8" />
                    {/* Number */}
                    <p
                      className="font-display leading-none mb-5 select-none"
                      style={{ fontSize: '4.5rem', color: 'rgba(201,169,97,0.15)' }}
                    >
                      {p.num}
                    </p>
                    <h3 className="font-display text-lg uppercase tracking-wider mb-4">{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {p.desc}
                    </p>
                    {/* Bottom shimmer line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(201,169,97,0.5), transparent)',
                      }}
                    />
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ── Reverse Marquee ──────────────────────────── */}
      <div
        className="border-y py-5 overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--page-bg)' }}
      >
        <MarqueeStrip reverse />
      </div>

      {/* ── CTA ──────────────────────────────────────── */}
      <section
        className="relative py-36 overflow-hidden"
        style={{ background: 'var(--surface)' }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,97,0.06) 0%, transparent 70%)',
            transform: 'translate(-50%, -40%)',
            animation: 'pulse-glow 5s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,97,0.05) 0%, transparent 70%)',
            transform: 'translate(40%, 40%)',
            animation: 'pulse-glow 6s ease-in-out infinite 1s',
          }}
        />

        <Container className="relative text-center">
          <FadeIn>
            <p className="text-gold font-display tracking-[0.45em] uppercase text-xs mb-6 flex items-center justify-center gap-3">
              <span className="block w-6 h-px bg-gold" />
              Ready to Elevate?
              <span className="block w-6 h-px bg-gold" />
            </p>
          </FadeIn>

          <FadeIn delay={0.12}>
            <h2
              className="font-display uppercase leading-[0.88] tracking-tight mb-10"
              style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}
            >
              UNLOCK YOUR
              <br />
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #B89653 0%, #C9A961 25%, #F0D080 50%, #C9A961 75%, #B89653 100%)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer-gold 3.5s linear infinite',
                }}
              >
                POTENTIAL.
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.26}>
            <Button href="/shop" size="lg" variant="gold">
              Shop the Collection
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
