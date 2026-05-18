import { cookies } from 'next/headers';
import { Button } from '@/components/ui/Button';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { HeroSceneClient } from '@/components/3d/HeroSceneClient';
import { LuxuryHeroSceneClient } from '@/components/3d/LuxuryHeroSceneClient';
import { NewsletterForm } from '@/components/ui/NewsletterForm';

export const metadata = {
  title: 'Home',
  alternates: { canonical: '/home' },
};

/* ── Data ─────────────────────────────────────────── */

const categories = [
  { label: 'Training', sub: 'Performance Apparel', href: '/shop', shade: 'rgba(216,24,41,0.06)' },
  { label: 'Supplements', sub: 'Elite Nutrition',  href: '/shop', shade: 'rgba(0,189,172,0.05)' },
  { label: 'Recovery', sub: 'Gear & Accessories',  href: '/shop', shade: 'rgba(216,24,41,0.04)' },
  { label: 'Lifestyle', sub: 'Athleisure Collection', href: '/shop', shade: 'rgba(0,189,172,0.04)' },
];

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

/* ── Hero mark SVG ────────────────────────────────── */

function RavenMark() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <circle cx="250" cy="250" r="210" stroke="#D81829" strokeWidth="0.6" strokeDasharray="5 8" opacity="0.3" />
      <circle cx="250" cy="250" r="135" stroke="#00BDAC" strokeWidth="0.5" opacity="0.22" />
      <circle cx="250" cy="250" r="60"  stroke="#D81829" strokeWidth="0.8" opacity="0.25" />
      <circle cx="250" cy="250" r="12"  fill="#00BDAC" opacity="0.7" />
      <circle cx="250" cy="250" r="5"   fill="#FFFFFF"  opacity="0.9" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 250 + Math.cos(angle) * 68;
        const y1 = 250 + Math.sin(angle) * 68;
        const x2 = 250 + Math.cos(angle) * 200;
        const y2 = 250 + Math.sin(angle) * 200;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 3 === 0 ? '#D81829' : '#00BDAC'}
            strokeWidth="0.5"
            opacity={i % 3 === 0 ? '0.35' : '0.18'}
          />
        );
      })}
      <line x1="60"  y1="60"  x2="440" y2="440" stroke="#D81829" strokeWidth="1.2" opacity="0.2" />
      <line x1="440" y1="60"  x2="60"  y2="440" stroke="#D81829" strokeWidth="0.4" opacity="0.08" />
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 225 : 220;
        const r2 = 235;
        return (
          <line
            key={i}
            x1={250 + Math.cos(angle) * r1}
            y1={250 + Math.sin(angle) * r1}
            x2={250 + Math.cos(angle) * r2}
            y2={250 + Math.sin(angle) * r2}
            stroke="#D81829"
            strokeWidth={i % 3 === 0 ? '1' : '0.4'}
            opacity="0.25"
          />
        );
      })}
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────── */

export default async function Home() {
  const cookieStore = await cookies();
  const isLuxury = cookieStore.get('corvo_aesthetic')?.value === 'luxury';
  const standards = isLuxury ? standardsLuxury : standardsSavage;
  const stats = isLuxury ? statsLuxury : statsSavage;

  return (
    <>
      {/* §1 · HERO */}
      <section
        className="relative h-[100svh] min-h-[640px] flex items-center overflow-hidden"
        style={{ background: 'var(--page-bg)' }}
      >
        <div
          className="absolute right-0 top-0 h-full pointer-events-none"
          style={{
            width: 'clamp(300px, 52%, 800px)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
            opacity: 0.85,
          }}
        >
          {isLuxury ? <LuxuryHeroSceneClient /> : <HeroSceneClient />}
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'var(--hero-gradient)' }}
        />

        <div
          className="absolute left-0 md:left-[max(1.5rem,_calc(50vw_-_680px))] top-0 bottom-0 w-[2px] hidden lg:block"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, var(--accent) 15%, var(--accent) 85%, transparent 100%)',
            opacity: 0.5,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--page-bg), transparent)' }}
        />

        <div
          className="relative z-10 px-6 md:px-10 lg:px-14 pt-10"
          style={{ maxWidth: '1440px', width: '100%', margin: '0 auto' }}
        >
          <div style={{ maxWidth: '580px' }}>
            <HeroReveal delay={0.05} y={10}>
              <div className="flex items-center gap-3 mb-10">
                <span
                  className="block"
                  style={{ width: '40px', height: '1.5px', background: 'var(--accent)', flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.52em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}
                >
                  Corvo Athletic
                </span>
              </div>
            </HeroReveal>

            <HeroReveal delay={0.18} y={60} duration={1.1}>
              <h1
                className={`font-display leading-[0.88] mb-8${isLuxury ? '' : ' uppercase'}`}
                style={{ fontSize: 'clamp(3.8rem, 11vw, 9rem)', letterSpacing: '-0.01em' }}
              >
                {isLuxury ? (
                  <>
                    <span className="block" style={{ color: 'var(--page-fg)' }}>The Pursuit</span>
                    <span className="block" style={{ color: 'var(--page-fg)' }}>of</span>
                    <span className="block" style={{ color: 'var(--accent)' }}>Excellence.</span>
                  </>
                ) : (
                  <>
                    <span className="block" style={{ color: 'var(--page-fg)' }}>HUNT</span>
                    <span className="block" style={{ color: 'var(--page-fg)' }}>WITHOUT</span>
                    <span className="block" style={{ color: 'var(--accent)' }}>MERCY.</span>
                  </>
                )}
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.45}>
              <p
                className="text-base md:text-lg leading-relaxed mb-10"
                style={{ color: 'var(--muted)', maxWidth: '380px' }}
              >
                {isLuxury
                  ? 'Meticulously crafted performance wear for athletes who understand that true excellence requires no compromise.'
                  : 'Elite training gear for those who thrive where others fold. No shortcuts. Zero compromise.'}
              </p>
            </HeroReveal>

            <HeroReveal delay={0.65}>
              <div className="flex flex-wrap gap-4 items-center">
                <Button href="/shop" size="lg" variant="primary">
                  Enter the Collection →
                </Button>
                <Button href="/about" size="lg" variant="ghost">
                  Our Story
                </Button>
              </div>
            </HeroReveal>

            <HeroReveal delay={1.05}>
              <div className="mt-16 flex items-center gap-6 sm:gap-10">
                {[
                  { v: '10K+', l: 'Athletes' },
                  { v: '5★',   l: 'Rated' },
                  { v: 'NZ',   l: 'Based' },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-6 sm:gap-10">
                    {i > 0 && (
                      <span
                        className="block"
                        style={{ width: '1px', height: '24px', background: 'var(--border)', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <p
                        className="font-display leading-none"
                        style={{ fontSize: '1rem', color: 'var(--accent)' }}
                      >
                        {s.v}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-rajdhani)',
                          fontSize: '9px',
                          letterSpacing: '0.32em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)',
                          marginTop: '2px',
                          fontWeight: 600,
                        }}
                      >
                        {s.l}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </HeroReveal>
          </div>
        </div>
      </section>

      {/* §2 · MOTION TICKER */}
      <div
        className="overflow-hidden py-[1.1rem]"
        style={{ background: 'var(--accent)' }}
      >
        <MarqueeStrip light />
      </div>

      {/* §3 · COLLECTION FEATURE */}
      <section
        className="py-32 md:py-44 border-y"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto px-6 md:px-10 lg:px-14" style={{ maxWidth: '1440px' }}>
          <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-20">
            <FadeIn className="flex-1">
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.48em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '1.5rem',
                }}
              >
                ── The Collection
              </p>
              <h2
                className={`font-display leading-[0.9]${isLuxury ? '' : ' uppercase'}`}
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.01em' }}
              >
                {isLuxury ? (
                  <>
                    <span style={{ color: 'var(--page-fg)' }}>Made</span>
                    <br />
                    <span style={{ color: 'var(--page-fg)' }}>to</span>
                    <br />
                    <span style={{ color: 'var(--accent)' }}>Endure.</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--page-fg)' }}>FORGED</span>
                    <br />
                    <span style={{ color: 'var(--page-fg)' }}>IN THE</span>
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
      </section>

      {/* §4 · CATEGORY PANELS */}
      <section style={{ background: 'var(--page-bg)' }}>
        <div className="mx-auto px-6 md:px-10 lg:px-14 pt-24 pb-10" style={{ maxWidth: '1440px' }}>
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.48em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: '0.75rem',
                  }}
                >
                  ── Shop by Category
                </p>
                <h2 className={`font-display leading-none${isLuxury ? '' : ' uppercase'}`} style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                  {isLuxury ? <>The Art of<br />Performance</> : <>What Are You<br />Training For?</>}
                </h2>
              </div>
              <Button href="/shop" variant="ghost" size="sm">View All →</Button>
            </div>
          </FadeIn>
        </div>

        <Stagger staggerDelay={0.08} className="flex flex-col sm:flex-row">
          {categories.map((cat, i) => (
            <StaggerItem key={cat.label} className="flex-1">
              <a
                href={cat.href}
                className="group block relative overflow-hidden"
                style={{
                  height: 'clamp(220px, 30vw, 380px)',
                  background: 'var(--surface)',
                  borderRight: i < categories.length - 1 ? '1px solid var(--border)' : 'none',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: cat.shade }}
                />
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform duration-400 origin-top"
                  style={{ background: 'var(--accent)' }}
                />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 transition-transform duration-300 group-hover:-translate-y-1">
                  <p className="font-display uppercase leading-none mb-2" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'var(--page-fg)' }}>
                    {cat.label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}>
                    {cat.sub}
                  </p>
                </div>
                <div
                  className="absolute top-5 right-5 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{ color: 'var(--muted)', fontSize: '1.1rem' }}
                >
                  →
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
                />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* §5 · MANIFESTO */}
      <section className="relative py-40 md:py-60 overflow-hidden" style={{ background: 'var(--section-dark)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
          <div style={{ width: 'min(800px, 90vw)', height: 'min(800px, 90vw)', opacity: 0.06 }}>
            <RavenMark />
          </div>
        </div>
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '12%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }} />
        <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: '12%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }} />

        <div className="relative mx-auto px-6 md:px-10 lg:px-14 text-center" style={{ maxWidth: '1440px' }}>
          <FadeIn>
            <p style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '3rem',
            }}>
              {isLuxury ? '· The Corvo House ·' : '· The Raven Standard ·'}
            </p>
            <blockquote>
              {isLuxury ? (
                <p
                  className="font-display leading-[1.15] mx-auto"
                  style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3rem)', color: 'var(--footer-fg)', maxWidth: '780px', letterSpacing: '0.01em' }}
                >
                  &ldquo;True quality requires no announcement.
                  <br />
                  <span style={{ color: 'var(--accent)' }}>It simply endures.&rdquo;</span>
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
                <p style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--footer-muted)',
                }}>
                  — Corvo Athletic, Est. New Zealand
                </p>
              </footer>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* §6 · STANDARDS */}
      <section className="py-28" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto px-6 md:px-10 lg:px-14" style={{ maxWidth: '1440px' }}>
          <FadeIn className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div>
                <p style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.48em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '0.75rem',
                }}>
                  ── Why Corvo
                </p>
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
      </section>

      {/* §7 · STATS */}
      <section className="py-24" style={{ background: 'var(--page-bg)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto px-6 md:px-10 lg:px-14" style={{ maxWidth: '1440px' }}>
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
                  <p style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}>
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* §8 · NEWSLETTER */}
      <section className="border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="mx-auto px-6 md:px-10 lg:px-14" style={{ maxWidth: '1440px' }}>
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 py-20 lg:py-28">
              <FadeIn>
                <p style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.52em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '1.5rem',
                }}>
                  · Inner Circle ·
                </p>
                <h2 className={`font-display leading-[0.9] mb-6${isLuxury ? '' : ' uppercase'}`} style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}>
                  {isLuxury ? (
                    <>The Inner <span style={{ color: 'var(--accent)' }}>Circle.</span></>
                  ) : (
                    <>JOIN THE<br /><span style={{ color: 'var(--accent)' }}>INNER</span><br />CIRCLE.</>
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
      </section>

      {/* §9 · FINAL CTA */}
      <section className="relative py-40 md:py-56 overflow-hidden" style={{ background: 'var(--accent)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', opacity: 0.15 }}>
            <RavenMark />
          </div>
        </div>
        <div
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, right: 0, height: '100%', backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)' }}
        />
        <div className="relative mx-auto px-6 md:px-10 lg:px-14 text-center" style={{ maxWidth: '1440px' }}>
          <FadeIn>
            <p style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '2rem',
            }}>
              {isLuxury ? '· The Collection ·' : '· Corvo Elite ·'}
            </p>
            <h2
              className={`font-display leading-[0.88] mb-14${isLuxury ? '' : ' uppercase'}`}
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: '#FFFFFF', letterSpacing: '-0.01em' }}
            >
              {isLuxury ? <>The Collection<br />Awaits.</> : <>CLAIM<br />YOUR EDGE.</>}
            </h2>
            <Button href="/shop" size="lg" variant="outline">
              {isLuxury ? 'View the Collection →' : 'Shop the Collection →'}
            </Button>
            <p className="mt-8" style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              {isLuxury
                ? 'Reserved for those who know the value of excellence.'
                : "Engineered for athletes who don\u2019t quit."}
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
