import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { FadeIn } from '@/components/motion/FadeIn';
import { getAllProducts } from '@/lib/wix-products';

interface FeaturedProductsProps {
  isLuxury: boolean;
}

/* Server component — fetches its own data and renders nothing if the
   catalog is unreachable, so the homepage never breaks on a Wix outage. */
export async function FeaturedProducts({ isLuxury }: FeaturedProductsProps) {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts();
  } catch {
    return null;
  }
  if (products.length === 0) return null;

  const featured = products.slice(0, 4);

  return (
    <section
      className="py-20 md:py-28 border-t"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="shell">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow mb-3">
                {isLuxury ? '── Selected Works' : '── The Arsenal'}
              </p>
              <h2
                className={`font-display leading-none${isLuxury ? '' : ' uppercase'}`}
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
              >
                {isLuxury ? 'Latest Acquisitions' : 'Fresh Drops'}
              </h2>
            </div>
            <Button href="/shop" variant="ghost" size="sm">
              {isLuxury ? 'View the Collection →' : 'Shop All →'}
            </Button>
          </div>
        </FadeIn>

        <Stagger
          staggerDelay={0.08}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {featured.map((product) => (
            <StaggerItem key={product._id}>
              <ProductCard
                slug={product.slug ?? ''}
                name={product.name ?? ''}
                price={product.priceData?.formatted?.price ?? ''}
                image={product.media?.mainMedia?.image?.url ?? ''}
                imageAlt={product.name ?? undefined}
                productId={product._id}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
