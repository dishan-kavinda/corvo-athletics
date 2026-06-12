import { cookies } from 'next/headers';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { FadeIn } from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { ScrubReveal } from '@/components/motion/ScrubReveal';
import { CategoryGrid } from '@/components/ui/CategoryGrid';
import { FeaturedProducts } from '@/components/ui/FeaturedProducts';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { EKGPulse } from '@/components/svg/EKGPulse';
import { Reticle } from '@/components/svg/Reticle';
import { GoldFlourish } from '@/components/svg/GoldFlourish';
import { DustField } from '@/components/svg/DustField';
import { SavageHeroCinematic } from '@/components/hero/SavageHeroCinematic';
import { LuxuryHeroCinematic } from '@/components/hero/LuxuryHeroCinematic';

export const metadata = {
  title: 'Home',
  alternates: { canonical: '/home' },
};

/* ── Data ─────────────────────────────────────────── */

const standardsSavage = [
  {
    num: '01',
    title: 'Lab Tested',
    desc: 'Every batch independently verified for purity and potency. No hidden fillers, no shortcuts, no exceptions.',
  },
  {
    num: '02',
    title: 'Athlete Built',
    desc: 'Designed with strength coaches and competitive athletes. Tested in the gym, not just on paper.',
  },
  {
    num: '03',
    title: 'No Compromise',
    desc: 'Premium ingredients, premium materials, premium execution. Quality demands you never cut corners.',
  },
];

const standardsLuxury = [
  {
    num: '01',
    title: 'Certified Purity',
    desc: 'Every batch independently verified by third-party laboratories before it carries the Corvo name. Full certificates of analysis available on request, without exception.',
  },
  {
    num: '02',
    title: 'Athlete Informed',
    desc: 'Developed alongside strength coaches and competitive athletes. Every decision made on the floor, under competition conditions — not in a boardroom.',
  },
  {
    num: '03',
    title: 'Enduring Quality',
    desc: 'We hold a single standard: the highest. Premium ingredients, precision performance fabrics, stitching built to outlast seasons. If it does not meet our benchmark, it does not leave our hands.',
  },
];

const statsSavage = [
  { value: '10K+', label: 'Athletes Worldwide' },
  { value: '5★',   label: 'Average Rating' },
  { value: '100%', label: 'Lab Verified' },
  { value: '0',    label: 'Compromises Made' },
];

const statsLuxury = [
  { value: '10K+', label: 'Members Worldwide' },
  { value: '5★',   label: 'Average Rating' },
  { value: '100%', label: 'Lab Certified' },
  { value: '0',    label: 'Exceptions Made' },
];

/* ── Page ─────────────────────────────────────────── */

export default async function Home() {
  const cookieStore = await cookies();
  const isLuxury = cookieStore.get('corvo_aesthetic')?.value === 'luxury';
  const standards = isLuxury ? standardsLuxury : standardsSavage;
  const stats = isLuxury ? statsLuxury : statsSavage;
  // Theme-matched scroll-scrub transition: blade slash (savage) / curtains (luxury)
  const variant = isLuxury ? ('curtain' as const) : ('slash' as const);

  return (
    <>
      {/* §1 · HERO — brand-native typography, no photography */}
      {isLuxury ? <LuxuryHeroCinematic /> : <SavageHeroCinematic />}

      {/* §2 · MOTION TICKER — hazard-striped edges in savage */}
      <div style={{ background: 'var(--accent)' }}>
        {!isLuxury && <div className="hazard-stripes" style={{ height: '8px' }} />}
        <div className="overflow-hidden py-[1rem]">
          <MarqueeStrip light />
        </div>
        {!isLuxury && <div className="hazard-stripes" style={{ height: '8px' }} />}
      </div>

      {/* §3 · COLLECTION FEATURE */}
      <section
        className="py-20 md:py-28 border-y"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <ScrubReveal variant={variant} panelColor="var(--surface)">
        <div className="shell">
          <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-20">
            <FadeIn className="flex-1">
              <p className="eyebrow mb-6">── The Collection</p>
              <h2
                className={`font-display leading-[0.9]${isLuxury ? '' : ' uppercase'}`}
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.01em' }}
              >
                {isLuxury ? (
                  <>
                    <span style={{ color: 'var(--page-fg)' }}>Made</span>
                    <br />
                    <span style={{ color: 'var(--page-fg)', fontStyle: 'italic' }}>to</span>
                    <br />
                    <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Endure.</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--page-fg)' }}>FORGED</span>
                    <br />
                    <span className="text-outline">IN THE</span>
                    <br />
                    <span style={{ color: 'var(--accent)' }}>DARK.</span>
                  </>
                )}
              </h2>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:max-w-sm">
              <div className="mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {isLuxury
                    ? 'Each piece is a considered investment in performance and longevity. Crafted with the precision of a master and the discipline of a champion.'
                    : 'Every piece engineered at the intersection of obsession and precision. Built for the before-dawn sessions, the last-rep moments, the never-quit mentality.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/shop" variant="primary" size="md">Shop All →</Button>
                <Button href="/about" variant="outline" size="md">Our Story</Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {(isLuxury
                  ? ['Artisan Craft', 'Athlete Endorsed', 'Timeless Design']
                  : ['Lab Tested', 'Athlete Built', 'No Compromise']
                ).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.32em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      padding: '0.35rem 0.75rem',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
        </ScrubReveal>
      </section>

      {/* §4 · CATEGORY GRID */}
      <section style={{ background: 'var(--page-bg)' }}>
        <div className="shell pt-14 pb-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="eyebrow mb-3">── Shop by Category</p>
                <h2
                  className={`font-display leading-none${isLuxury ? '' : ' uppercase'}`}
                  style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
                >
                  {isLuxury ? <>The Art of<br />Performance</> : <>What Are You<br />Training For?</>}
                </h2>
              </div>
              <Button href="/shop" variant="ghost" size="sm">View All →</Button>
            </div>
          </FadeIn>
        </div>

        <CategoryGrid />
      </section>

      {/* §5 · FEATURED PRODUCTS — real catalog on the homepage */}
      <FeaturedProducts isLuxury={isLuxury} />

      {/* §6 · MANIFESTO */}
      <section className="relative py-40 md:py-60 overflow-hidden" style={{ background: 'var(--section-dark)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
          {isLuxury ? (
            <DustField count={14} color="#C9A961" />
          ) : (
            <div style={{ width: 'min(760px, 90vw)', height: 'min(760px, 90vw)', opacity: 0.13 }}>
              <Reticle color="#FF2B3A" accentColor="#C8FF2E" />
            </div>
          )}
        </div>
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '12%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }} />
        <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: '12%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }} />

        <ScrubReveal variant={variant} panelColor="var(--section-dark)">
        <div className="relative shell text-center">
          <FadeIn>
            <p className="eyebrow" style={{ letterSpacing: '0.52em', marginBottom: '3rem' }}>
              {isLuxury ? '· The Corvo House ·' : '· The Raven Standard ·'}
            </p>
            {isLuxury && (
              <GoldFlourish color="#C9A961" width={230} style={{ margin: '-1.5rem auto 2.5rem' }} />
            )}
            <blockquote>
              {isLuxury ? (
                <p
                  className="font-display leading-[1.15] mx-auto"
                  style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3rem)', color: 'var(--footer-fg)', maxWidth: '780px', letterSpacing: '0.01em' }}
                >
                  &ldquo;True quality requires no announcement.
                  <br />
                  <span style={{ color: 'var(--footer-accent)', fontStyle: 'italic' }}>It simply endures.&rdquo;</span>
                </p>
              ) : (
                <p
                  className="font-display uppercase leading-[0.9] mx-auto"
                  style={{ fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)', color: 'var(--footer-fg)', maxWidth: '900px', letterSpacing: '-0.01em' }}
                >
                  <span>&ldquo;THE RAVEN</span>{' '}
                  <span style={{ color: 'var(--accent)' }}>NEVER RESTS.</span>
                  <br />
                  <span>NEITHER DO</span>{' '}
                  <span style={{ color: 'var(--color-pulse)' }}>WE.&rdquo;</span>
                </p>
              )}
              <footer className="mt-10">
                <p
                  className="tech-label"
                  style={{ fontSize: '13px', letterSpacing: '0.3em', color: 'var(--footer-muted)', fontWeight: 600 }}
                >
                  — Corvo Athletic, Est. New Zealand
                </p>
              </footer>
            </blockquote>
          </FadeIn>
        </div>
        </ScrubReveal>
      </section>

      {/* §7 · STANDARDS — fabric texture background */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${isLuxury ? '/fabric_luxury.png' : '/fabric_savage.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'var(--surface)', opacity: 0.82 }}
        />

        <ScrubReveal variant={variant} panelColor="var(--surface)">
        <div className="relative shell">
          <FadeIn className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div>
                <p className="eyebrow mb-3">── Why Corvo</p>
                <h2 className="font-display uppercase leading-none" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                  The Corvo Standard
                </h2>
              </div>
              <p className="md:pb-1 leading-relaxed text-sm max-w-xs" style={{ color: 'var(--muted)' }}>
                Three non-negotiables behind every product we put our name on.
              </p>
            </div>
          </FadeIn>

          <Stagger staggerDelay={0.12}>
            {standards.map((s, i) => (
              <StaggerItem key={s.num}>
                <div
                  className="group flex flex-col md:flex-row md:items-start gap-6 md:gap-12 py-10 transition-colors duration-300"
                  style={{
                    borderTop: '1px solid var(--border)',
                    borderBottom: i === standards.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span
                    className="font-display leading-none shrink-0 transition-colors duration-300 group-hover:text-blade"
                    style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--border)' }}
                  >
                    {s.num}
                  </span>
                  <div className="flex-1 md:pt-2">
                    <h3 className="font-display uppercase mb-4" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                      {s.desc}
                    </p>
                  </div>
                  <div
                    className="hidden md:flex items-center self-center text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    →
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        </ScrubReveal>
      </section>

      {/* §8 · STATS — alive divider above the numbers */}
      <section className="py-24" style={{ background: 'var(--page-bg)', borderTop: '1px solid var(--border)' }}>
        <ScrubReveal variant={variant} panelColor="var(--page-bg)">
        <div className="shell">
          <div className="mb-14">
            {isLuxury ? (
              <GoldFlourish width={240} style={{ margin: '0 auto' }} />
            ) : (
              <EKGPulse height={44} style={{ opacity: 0.5 }} />
            )}
          </div>
          <Stagger staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-px">
            {stats.map((s, i) => (
              <StaggerItem key={s.label}>
                <div className="py-12 px-6 text-center relative" style={{ background: 'var(--surface)' }}>
                  {i > 0 && (
                    <div className="absolute left-0 top-6 bottom-6 w-px hidden md:block" style={{ background: 'var(--border)' }} />
                  )}
                  <p className="font-display leading-none mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--accent)' }}>
                    {s.value}
                  </p>
                  <p
                    className="tech-label"
                    style={{ fontSize: '10px', letterSpacing: '0.3em', fontWeight: 700 }}
                  >
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        </ScrubReveal>
      </section>

      {/* §9 · NEWSLETTER */}
      <section className="border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <ScrubReveal variant={variant} panelColor="var(--surface)">
        <div className="shell">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 py-20 lg:py-28">
              <FadeIn>
                <p className="eyebrow" style={{ letterSpacing: '0.52em', marginBottom: '1.5rem' }}>
                  · Inner Circle ·
                </p>
                <h2 className={`font-display leading-[0.9] mb-6${isLuxury ? '' : ' uppercase'}`} style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}>
                  {isLuxury ? (
                    <>The Inner <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Circle.</span></>
                  ) : (
                    <>JOIN THE<br /><span className="text-outline-accent">INNER</span><br />CIRCLE.</>
                  )}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', maxWidth: '320px' }}>
                  {isLuxury
                    ? 'Access reserved for those who appreciate quality over quantity. First sight of new arrivals, members-only pieces, and private events. No noise — only what matters.'
                    : 'First access to exclusive drops, athlete programs, and Corvo updates. No spam. Just signal.'}
                </p>
              </FadeIn>
            </div>
            <div className="flex-1 py-20 lg:py-28 lg:pl-16 flex flex-col justify-center" style={{ borderLeft: '1px solid var(--border)' }}>
              <FadeIn delay={0.15}><NewsletterForm /></FadeIn>
            </div>
          </div>
        </div>
        </ScrubReveal>
      </section>

      {/* §10 · FINAL CTA */}
      <section className="relative py-40 md:py-56 overflow-hidden" style={{ background: 'var(--accent)' }}>
        {!isLuxury && (
          <div className="absolute top-0 left-0 right-0 hazard-stripes" style={{ height: '12px' }} />
        )}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {isLuxury ? (
            <DustField count={20} color="rgba(255,255,255,0.75)" />
          ) : (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', opacity: 0.1 }}>
              <Reticle color="#FFFFFF" accentColor="#FFFFFF" />
            </div>
          )}
        </div>
        {!isLuxury && (
          <div className="absolute bottom-0 left-0 right-0 hazard-stripes" style={{ height: '12px' }} />
        )}
        <div
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, right: 0, height: '100%', backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)' }}
        />
        <ScrubReveal variant={variant} panelColor="var(--accent)">
        <div className="relative shell text-center">
          <FadeIn>
            <Logo
              height={40}
              style={{ color: 'rgba(255,255,255,0.38)', margin: '0 auto 2.25rem' }}
            />
            <p
              className="eyebrow"
              style={{ letterSpacing: '0.52em', color: 'rgba(255,255,255,0.55)', marginBottom: '2rem' }}
            >
              {isLuxury ? '· The Collection ·' : '· Corvo Elite ·'}
            </p>
            <h2
              className={`font-display leading-[0.88] mb-14${isLuxury ? '' : ' uppercase'}`}
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: '#FFFFFF', letterSpacing: '-0.01em' }}
            >
              {isLuxury ? <>The Collection<br /><span style={{ fontStyle: 'italic' }}>Awaits.</span></> : <>CLAIM<br />YOUR EDGE.</>}
            </h2>
            <Button href="/shop" size="lg" variant="outline">
              {isLuxury ? 'View the Collection →' : 'Shop the Collection →'}
            </Button>
            <p
              className="tech-label mt-8"
              style={{ letterSpacing: '0.32em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}
            >
              {isLuxury
                ? 'Reserved for those who know the value of excellence.'
                : "Engineered for athletes who don’t quit."}
            </p>
          </FadeIn>
        </div>
        </ScrubReveal>
      </section>
    </>
  );
}
