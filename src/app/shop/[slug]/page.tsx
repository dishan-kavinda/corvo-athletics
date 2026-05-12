import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { getProductBySlug } from '@/lib/wix-products';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Not found — Corvo Athletics' };
  return {
    title: `${product.name} — Corvo Athletics`,
    description: (product.description ?? '').replace(/<[^>]+>/g, '').slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image?.url;
  const gallery = product.media?.items ?? [];

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
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
          </div>
          <div>
            <p className="text-gold font-display tracking-[0.3em] uppercase text-xs mb-3">
              Corvo Athletics
            </p>
            <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-tight mb-6">
              {product.name}
            </h1>
            <p className="text-gold font-display text-3xl mb-8">
              {product.priceData?.formatted?.price}
            </p>
            <div className="border-t border-graphite my-8" />
            {product.description && (
              <div
                className="prose-corvo text-ash text-sm leading-relaxed mb-10 max-w-prose [&>br]:block"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {product._id && <AddToCartButton productId={product._id} />}
            <div className="mt-10 pt-8 border-t border-graphite space-y-3 text-xs text-ash uppercase tracking-wider">
              <p>Free Shipping on Orders Over $100</p>
              <p>30-Day Returns</p>
              <p>Lab-Tested & Verified</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
