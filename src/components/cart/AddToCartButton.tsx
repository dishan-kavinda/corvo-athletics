'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/Button';

export function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await addToCart(productId, 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handle}
      variant="gold"
      size="lg"
      disabled={loading}
      className="w-full sm:w-auto sm:min-w-[16rem]"
    >
      {loading ? 'Adding…' : 'Add to Cart'}
    </Button>
  );
}
