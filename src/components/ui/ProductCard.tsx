'use client';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { TiltCard } from '@/components/ui/TiltCard';

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
    <TiltCard intensity={6} className={cn('block', className)}>
      <Link
        href={`/shop/${slug}`}
        className="group block overflow-hidden rounded-lg border transition-all duration-500 ease-out hover:border-gold/40 hover:shadow-[0_20px_60px_-15px_rgba(201,169,97,0.18)]"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: 'var(--surface-elevated)' }}
        >
          <Image
            src={image}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        </div>
        <div className="p-5 flex items-center justify-between">
          <h3
            className="text-sm uppercase tracking-wider truncate mr-4"
            style={{ color: 'var(--page-fg)' }}
          >
            {name}
          </h3>
          <p className="text-gold font-display text-lg shrink-0">{price}</p>
        </div>
      </Link>
    </TiltCard>
  );
}
