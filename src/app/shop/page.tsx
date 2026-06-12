import { cookies } from 'next/headers';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { Logo } from '@/components/layout/Logo';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { ShopGrid, type ShopProduct } from '@/components/ui/ShopGrid';
import { getAllProducts } from '@/lib/wix-products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop All',
  description:
    'Shop premium gym apparel, luxury athleisure, sports gear, and supplements from Corvo Athletic. Engineered for athletes who refuse average.',
  keywords: ['gym apparel', 'athleisure', 'luxury sportswear', 'sports gear', 'supplements'],
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const cookieStore = await cookies();
  const isLuxury = cookieStore.get('corvo_aesthetic')?.value === 'luxury';

  let raw: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    raw = await getAllProducts();
  } catch {
    raw = [];
  }

  // Serialize to plain objects for the client grid
  const products: ShopProduct[] = raw.map((p) => ({
    id: p._id ?? '',
    slug: p.slug ?? '',
    name: p.name ?? '',
    price: p.priceData?.price ?? 0,
    priceFormatted: p.priceData?.formatted?.price ?? '',
    image: p.media?.mainMedia?.image?.url ?? '',
    inStock: p.stock?.inStock !== false,
  }));

  return (
    <>
      {/* ── Shop hero ───────────────────────────────── */}
      <section
        className="relative pt-24 pb-14 overflow-hidden"
        style={{ background: 'var(--page-bg)', borderBottom: '1px solid var(--border)' }}
      >
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-end justify-end overflow-hidden pointer-events-none"
          aria-hidden
        >
          <span
            className="font-display uppercase select-none"
            style={{
              fontSize: 'clamp(8rem, 20vw, 18rem)',
              color: 'var(--page-fg)',
              opacity: 0.025,
              lineHeight: 0.85,
              letterSpacing: '-0.02em',
              paddingRight: '2rem',
            }}
          >
            SHOP
          </span>
        </div>

        <div className="relative shell">
          <HeroReveal delay={0.05} y={15}>
            <p className="eyebrow mb-4">── Corvo Athletic</p>
          </HeroReveal>

          <HeroReveal delay={0.18} y={40} duration={0.9}>
            <h1
              className={`font-display leading-[0.9] mb-6${isLuxury ? '' : ' uppercase'}`}
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.01em' }}
            >
              {isLuxury ? 'The Collection' : 'All Products'}
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.4}>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--muted)' }}>
              {isLuxury
                ? 'Every piece in the house collection, assembled in one place. Considered, certified, built to endure.'
                : 'The full arsenal. Training gear, supplements, and recovery — everything carries the same standard.'}
            </p>
          </HeroReveal>
        </div>
      </section>

      {/* ── Ticker ──────────────────────────────────── */}
      <div
        className="overflow-hidden py-[0.9rem]"
        style={{ background: 'var(--section-dark)', borderBottom: '1px solid var(--border)' }}
      >
        <MarqueeStrip reverse />
      </div>

      {/* ── Product grid ────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--page-bg)' }}>
        <div className="shell">
          {products.length === 0 ? (
            <FadeIn>
              <div className="py-24 md:py-32 text-center max-w-xl mx-auto">
                <Logo
                  height={44}
                  style={{ color: 'var(--accent)', opacity: 0.7, margin: '0 auto 2.5rem' }}
                />
                <p className="eyebrow mb-5">{isLuxury ? '· In Preparation ·' : '· Stand By ·'}</p>
                <h2
                  className={`font-display leading-[0.95] mb-6${isLuxury ? '' : ' uppercase'}`}
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
                >
                  {isLuxury ? (
                    <>The First Collection<br />Is Coming.</>
                  ) : (
                    <>THE FIRST DROP<br />IS COMING.</>
                  )}
                </h2>
                <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--muted)', maxWidth: '380px', margin: '0 auto 2.5rem' }}>
                  {isLuxury
                    ? 'Every piece is being finished to the Corvo standard. Leave your email and be the first to see the collection.'
                    : 'The arsenal is being forged. Drop your email — first access goes to the inner circle.'}
                </p>
                <div className="text-left mx-auto" style={{ maxWidth: '380px' }}>
                  <NewsletterForm />
                </div>
              </div>
            </FadeIn>
          ) : (
            <ShopGrid products={products} />
          )}
        </div>
      </section>

      {/* ── Bottom CTA — only when the grid has products ── */}
      {products.length > 0 && (
        <section
          className="py-20 border-t text-center"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="eyebrow mb-4">Can&apos;t find what you need?</p>
          <p className="font-display uppercase text-2xl md:text-3xl mb-8" style={{ color: 'var(--page-fg)' }}>
            More drops coming.
          </p>
          <a
            href="/about"
            className="tech-label"
            style={{
              color: 'var(--accent)',
              fontWeight: 700,
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            }}
          >
            About Corvo Athletic →
          </a>
        </section>
      )}
    </>
  );
}
