import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { getProductBySlug, getAllProducts } from '@/lib/wix-products';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { SizeGuideButton } from '@/components/ui/SizeGuideButton';
import { StickyAddToCart } from '@/components/ui/StickyAddToCart';
import { RestockNotify } from '@/components/ui/RestockNotify';
import { ProductGallery } from '@/components/ui/ProductGallery';
import { InfoAccordion } from '@/components/ui/InfoAccordion';
import { ProductCard } from '@/components/ui/ProductCard';
import { sanitizeHtml } from '@/lib/sanitize';

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
  const galleryUrls = gallery
    .map((item) => item.image?.url)
    .filter((url): url is string => Boolean(url));
  const images = galleryUrls.length > 0 ? galleryUrls : mainImage ? [mainImage] : [];

  // Related products — same catalog, excluding the current item
  let related: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    const all = await getAllProducts();
    related = all.filter((p) => p._id !== product._id).slice(0, 4);
  } catch {
    related = [];
  }

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

          {/* ── Image panel — interactive gallery ──────── */}
          <FadeIn duration={0.7} className="relative">
            <ProductGallery images={images} alt={product.name ?? ''} />
          </FadeIn>

          {/* ── Info panel ─────────────────────────────── */}
          <div className="px-6 md:px-10 lg:px-14 py-12">

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
                    color: product.stock?.inStock ? 'var(--color-pulse)' : 'var(--muted)',
                    padding: '0.25rem 0.6rem',
                    border: `1px solid ${product.stock?.inStock ? 'var(--color-pulse)' : 'var(--muted)'}`,
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
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
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

              {/* Details accordion */}
              <div className="mt-10">
                <InfoAccordion
                  items={[
                    {
                      title: 'Shipping',
                      body: 'Free shipping on all New Zealand orders over $100. Orders are dispatched within 1–2 business days and typically arrive within 2–5 business days nationwide.',
                    },
                    {
                      title: 'Returns & Exchanges',
                      body: 'Not right? You have 30 days from delivery to return unworn items in original condition for a full refund or exchange. No questions, no friction.',
                    },
                    {
                      title: 'The Corvo Standard',
                      body: 'Every product is independently lab-tested and verified before it carries the Corvo name. Premium materials, precision construction, zero compromise.',
                    },
                  ]}
                />
              </div>
            </HeroReveal>
          </div>
        </div>
      </section>

      {/* ── Related products ─────────────────────────── */}
      {related.length > 0 && (
        <section
          className="py-16 md:py-20 border-t"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="shell">
            <FadeIn>
              <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
                <div>
                  <p className="eyebrow mb-3">── Keep Hunting</p>
                  <h2
                    className="font-display uppercase leading-none"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                  >
                    You May Also Like
                  </h2>
                </div>
                <a
                  href="/shop"
                  className="tech-label"
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  View All →
                </a>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p._id}
                  slug={p.slug ?? ''}
                  name={p.name ?? ''}
                  price={p.priceData?.formatted?.price ?? ''}
                  image={p.media?.mainMedia?.image?.url ?? ''}
                  imageAlt={p.name ?? undefined}
                  productId={p._id}
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  );
}
