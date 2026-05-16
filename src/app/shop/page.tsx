import { ProductCard } from '@/components/ui/ProductCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { getAllProducts } from '@/lib/wix-products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop All',
  description:
    'Shop premium gym apparel, luxury athleisure, sports gear, and supplements from Corvo Athletic. Engineered for athletes who refuse average.',
  keywords: ['gym apparel', 'athleisure', 'luxury sportswear', 'sports gear', 'supplements'],
  alternates: { canonical: '/shop' },
};

const filters = ['All', 'Training', 'Supplements', 'Recovery', 'Lifestyle'];

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      {/* ── Shop hero ───────────────────────────────── */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
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

        <div
          className="relative mx-auto px-6 md:px-10 lg:px-14"
          style={{ maxWidth: '1440px' }}
        >
          <HeroReveal delay={0.05} y={15}>
            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.52em',
                textTransform: 'uppercase',
                color: '#D81829',
                marginBottom: '1rem',
              }}
            >
              ── Corvo Athletic
            </p>
          </HeroReveal>

          <HeroReveal delay={0.18} y={40} duration={0.9}>
            <h1
              className="font-display uppercase leading-[0.9] mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.01em' }}
            >
              All Products
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                {products.length} items available
              </p>

              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                {filters.map((f, i) => (
                  <span
                    key={f}
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      padding: '0.35rem 0.85rem',
                      border: '1px solid var(--border)',
                      color: i === 0 ? '#D81829' : 'var(--muted)',
                      borderColor: i === 0 ? '#D81829' : 'var(--border)',
                      cursor: 'default',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ── Ticker ──────────────────────────────────── */}
      <div
        className="overflow-hidden py-[0.9rem]"
        style={{ background: '#07090F', borderBottom: '1px solid #1B2038' }}
      >
        <MarqueeStrip reverse />
      </div>

      {/* ── Product grid ────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: 'var(--page-bg)' }}
      >
        <div
          className="mx-auto px-6 md:px-10 lg:px-14"
          style={{ maxWidth: '1440px' }}
        >
          {products.length === 0 ? (
            <div className="py-32 text-center">
              <p
                className="font-display uppercase text-3xl mb-4"
                style={{ color: 'var(--muted)' }}
              >
                Collection Coming Soon
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                The full Corvo range is being assembled. Check back soon.
              </p>
            </div>
          ) : (
            <Stagger
              staggerDelay={0.05}
              initialDelay={0.1}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px]"
            >
              {products.map((product) => (
                <StaggerItem key={product._id}>
                  <ProductCard
                    slug={product.slug ?? ''}
                    name={product.name ?? ''}
                    price={product.priceData?.formatted?.price ?? ''}
                    image={product.media?.mainMedia?.image?.url ?? ''}
                    imageAlt={product.name ?? undefined}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────── */}
      <section
        className="py-20 border-t text-center"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: '#D81829',
            marginBottom: '1rem',
          }}
        >
          Can&apos;t find what you need?
        </p>
        <p
          className="font-display uppercase text-2xl md:text-3xl mb-8"
          style={{ color: 'var(--page-fg)' }}
        >
          More drops coming.
        </p>
        <a
          href="/about"
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#D81829',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          About Corvo Athletic →
        </a>
      </section>
    </>
  );
}
