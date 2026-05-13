'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/Button';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
}

export function AddToCartButton({ productId, variantId }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await addToCart(productId, 1, variantId);
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
