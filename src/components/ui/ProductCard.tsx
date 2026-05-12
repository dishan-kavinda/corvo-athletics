import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface ProductCardProps {
  slug: string;
  name: string;
  price: string;
  image: string;
  imageAlt?: string;
  className?: string;
}

export function ProductCard({ slug, name, price, image, imageAlt, className }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className={cn(
        'group block overflow-hidden bg-onyx border border-graphite transition-all duration-500 ease-out hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_50px_-15px_rgba(201,169,97,0.15)]',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-ink">
        <Image
          src={image}
          alt={imageAlt || name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-sm uppercase tracking-wider text-bone truncate mb-1">{name}</h3>
        <p className="text-gold font-display text-lg">{price}</p>
      </div>
    </Link>
  );
}
