import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ProductCard } from '@/components/ui/ProductCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { getAllProducts } from '@/lib/wix-products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop — Corvo Athletics',
  description: 'Premium protein, supplements, and training apparel.',
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Section className="pt-12">
      <Container>
        <HeroReveal delay={0.1} y={20}>
          <header className="mb-12">
            <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-3">Shop</p>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight">
              All Products
            </h1>
            <p className="text-ash mt-4">{products.length} items</p>
          </header>
        </HeroReveal>
        <Stagger
          staggerDelay={0.05}
          initialDelay={0.2}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
      </Container>
    </Section>
  );
}
