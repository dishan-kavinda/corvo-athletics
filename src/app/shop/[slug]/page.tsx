import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { getProductBySlug } from '@/lib/wix-products';

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
    description: cleanDesc || `${product.name} — premium gym & athleisure from Corvo Athletics.`,
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

  const defaultOptions: Record<string, string> = {};
  if (product.manageVariants && product.productOptions) {
    for (const opt of product.productOptions) {
      const name = opt.name;
      const firstChoice = opt.choices?.find((c) => c.inStock !== false && c.visible !== false);
      if (name && firstChoice?.value) {
        defaultOptions[name] = firstChoice.value;
      }
    }
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.description ?? '').replace(/<[^>]+>/g, '').slice(0, 500),
    image: mainImage ? [mainImage] : [],
    brand: { '@type': 'Brand', name: 'Corvo Athletics' },
    sku: product._id,
    offers: {
      '@type': 'Offer',
      url: `https://corvoathletic.com/shop/${slug}`,
      priceCurrency: product.priceData?.currency ?? 'NZD',
      price: product.priceData?.price ?? 0,
      availability: product.stock?.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <FadeIn className="space-y-4" duration={0.7}>
            <div className="relative aspect-square bg-onyx overflow-hidden">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name ?? ''}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.slice(0, 4).map((item, i) => (
                  <div
                    key={item._id ?? i}
                    className="relative aspect-square bg-onyx overflow-hidden border border-graphite"
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
          </FadeIn>
          <div>
            <HeroReveal delay={0.1} y={20}>
              <p className="text-gold font-display tracking-[0.3em] uppercase text-xs mb-3">
                Corvo Athletics
              </p>
            </HeroReveal>
            <HeroReveal delay={0.2} y={30}>
              <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-tight mb-6">
                {product.name}
              </h1>
            </HeroReveal>
            <HeroReveal delay={0.35}>
              <p className="text-gold font-display text-3xl mb-8">
                {product.priceData?.formatted?.price}
              </p>
              <div className="border-t border-graphite my-8" />
            </HeroReveal>
            {product.description && (
              <HeroReveal delay={0.5}>
                <div
                  className="text-ash text-sm leading-relaxed mb-10 max-w-prose"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </HeroReveal>
            )}
            <HeroReveal delay={0.65}>
              {product._id && (
                <AddToCartButton
                  productId={product._id}
                  defaultOptions={
                    Object.keys(defaultOptions).length > 0 ? defaultOptions : undefined
                  }
                />
              )}
              <div className="mt-10 pt-8 border-t border-graphite space-y-3 text-xs text-ash uppercase tracking-wider">
                <p>Free Shipping on Orders Over $100</p>
                <p>30-Day Returns</p>
                <p>Lab-Tested & Verified</p>
              </div>
            </HeroReveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
