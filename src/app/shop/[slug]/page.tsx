import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { getProductBySlug } from '@/lib/wix-products';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { SizeGuideButton } from '@/components/ui/SizeGuideButton';
import { StickyAddToCart } from '@/components/ui/StickyAddToCart';
import { RestockNotify } from '@/components/ui/RestockNotify';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Not found' };
  const cleanDesc = (product.description ?? '').replace(/<[^>]+>/g, '').slice(0, 160);
  const imageUrl = product.media?.mainMedia?.image?.url;
  return {
    title: product.name ?? 'Product',
    description: cleanDesc || `${product.name} — premium gym & athleisure from Corvo Athletic.`,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: {
      title: product.name ?? 'Product',
      description: cleanDesc,
      type: 'website',
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image?.url;
  const gallery = product.media?.items ?? [];

  let defaultVariantId: string | undefined;
  if (product.manageVariants && product.variants && product.variants.length > 0) {
    const inStock = product.variants.find((v) => v.stock?.inStock !== false);
    defaultVariantId = (inStock ?? product.variants[0])?._id;
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.description ?? '').replace(/<[^>]+>/g, '').slice(0, 500),
    image: mainImage ? [mainImage] : [],
    brand: { '@type': 'Brand', name: 'Corvo Athletic' },
    sku: product._id,
    offers: {
      '@type': 'Offer',
      url: `https://www.corvoathletic.com/shop/${slug}`,
      priceCurrency: product.priceData?.currency ?? 'NZD',
      price: product.priceData?.price ?? 0,
      availability: product.stock?.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* ── Breadcrumb ───────────────────────────────── */}
      <div
        style={{
          background: 'var(--page-bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Container className="py-4">
          <div className="flex items-center gap-2">
            {['Home', 'Shop', product.name ?? 'Product'].map((crumb, i, arr) => (
              <div key={crumb} className="flex items-center gap-2">
                {i < arr.length - 1 ? (
                  <a
                    href={i === 0 ? '/home' : '/shop'}
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                    className="hover:text-blade transition-colors"
                  >
                    {crumb}
                  </a>
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'var(--page-fg)',
                    }}
                  >
                    {crumb}
                  </span>
                )}
                {i < arr.length - 1 && (
                  <span style={{ color: 'var(--muted)', fontSize: '10px' }}>›</span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Product layout ───────────────────────────── */}
      <section style={{ background: 'var(--page-bg)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '80vh' }}>

          {/* ── Image panel ────────────────────────────── */}
          <FadeIn duration={0.7} className="relative">
            {/* Main image */}
            <div
              className="sticky top-[72px]"
              style={{
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
              }}
            >
              <div
                className="relative"
                style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}
              >
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name ?? ''}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'var(--surface-elevated)' }}
                  >
                    <span
                      className="font-display uppercase"
                      style={{ fontSize: '5rem', color: 'var(--border)', opacity: 0.3 }}
                    >
                      C
                    </span>
                  </div>
                )}
                {/* Accent left bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'var(--accent)' }}
                />
              </div>

              {/* Gallery thumbnails */}
              {gallery.length > 1 && (
                <div
                  className="flex gap-[1px]"
                  style={{ background: 'var(--border)' }}
                >
                  {gallery.slice(0, 4).map((item, i) => (
                    <div
                      key={item._id ?? i}
                      className="relative flex-1"
                      style={{
                        aspectRatio: '1 / 1',
                        overflow: 'hidden',
                        background: 'var(--surface-elevated)',
                      }}
                    >
                      {item.image?.url && (
                        <Image
                          src={item.image.url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* ── Info panel ─────────────────────────────── */}
          <div className="px-8 md:px-12 lg:px-14 py-12">

            <HeroReveal delay={0.08} y={15}>
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.52em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '1rem',
                }}
              >
                Corvo Athletic
              </p>
            </HeroReveal>

            <HeroReveal delay={0.2} y={30}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <h1
                  className="font-display uppercase leading-[0.92]"
                  style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.01em' }}
                >
                  {product.name}
                </h1>
                {product.slug && <WishlistButton slug={product.slug} size={22} />}
              </div>
            </HeroReveal>

            <HeroReveal delay={0.35}>
              <div className="flex items-center gap-4 mb-8">
                <p
                  className="font-display"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--accent)' }}
                >
                  {product.priceData?.formatted?.price}
                </p>
                <span
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: product.stock?.inStock ? '#00BDAC' : '#838DAA',
                    padding: '0.25rem 0.6rem',
                    border: `1px solid ${product.stock?.inStock ? '#00BDAC' : '#838DAA'}`,
                  }}
                >
                  {product.stock?.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2rem' }} />
            </HeroReveal>

            {product.description && (
              <HeroReveal delay={0.5}>
                <div
                  className="text-sm leading-relaxed mb-10 max-w-prose"
                  style={{ color: 'var(--muted)' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </HeroReveal>
            )}

            <HeroReveal delay={0.65}>
              {product._id && (
                <div className="mb-10">
                  {product.stock?.inStock !== false ? (
                    <AddToCartButton productId={product._id} variantId={defaultVariantId} />
                  ) : (
                    <RestockNotify productSlug={product.slug ?? product._id} />
                  )}
                  {product._id && (
                    <StickyAddToCart
                      productId={product._id}
                      variantId={defaultVariantId}
                      productName={product.name ?? ''}
                      price={product.priceData?.formatted?.price ?? ''}
                      inStock={product.stock?.inStock !== false}
                    />
                  )}
                </div>
              )}

              {/* Trust row */}
              <div
                className="pt-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="space-y-4">
                  {[
                    { icon: '→', label: 'Free Shipping on Orders Over $100' },
                    { icon: '→', label: '30-Day Returns' },
                    { icon: '→', label: 'Lab-Tested & Independently Verified' },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '14px' }}>
                        {item.icon}
                      </span>
                      <p
                        style={{
                          fontFamily: 'var(--font-rajdhani)',
                          fontSize: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)',
                        }}
                      >
                        {item.label}
                      </p>
                      {idx === 0 && <SizeGuideButton />}
                    </div>
                  ))}
                </div>
              </div>
            </HeroReveal>
          </div>
        </div>
      </section>

      {/* ── Related CTA ──────────────────────────────── */}
      <div
        className="py-12 text-center border-t"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <a
          href="/shop"
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          ← Back to All Products
        </a>
      </div>
    </>
  );
}
