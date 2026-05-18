'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/shop/${slug}`}
      className={cn('group block', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'relative',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: hovered ? '2px solid var(--accent)' : '2px solid transparent',
          transition: 'border-color 0.25s ease, transform 0.3s ease, box-shadow 0.3s ease',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 16px 40px rgba(0,0,0,0.18), -2px 0 0 var(--accent)'
            : '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
            background: 'var(--surface-elevated)',
          }}
        >
          {image && (
            <Image
              src={image}
              alt={imageAlt || name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out"
              style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
            />
          )}
          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7,9,15,0.25) 0%, transparent 50%)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
          {/* View label */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)',
              opacity: hovered ? 1 : 0,
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            VIEW PRODUCT
          </div>
        </div>

        {/* Info bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.1rem',
          }}
        >
          <h3
            className="truncate mr-3"
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--page-fg)',
            }}
          >
            {name}
          </h3>
          <p
            className="font-display shrink-0 text-base"
            style={{ color: 'var(--accent)' }}
          >
            {price}
          </p>
        </div>

        {/* Bottom blade line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1.5px',
            background: 'linear-gradient(90deg, var(--accent), transparent)',
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>
    </Link>
  );
}
