'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { currentCart } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { useRouter } from 'next/navigation';

const WIX_STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';
const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID!;

const browserClient = createClient({
  modules: { currentCart, redirects },
  auth: OAuthStrategy({ clientId }),
});

type Cart = Awaited<ReturnType<typeof browserClient.currentCart.getCurrentCart>> | null;

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  cartLoading: boolean;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addToCart: (catalogItemId: string, quantity?: number, variantId?: string) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const c = await browserClient.currentCart.getCurrentCart();
      setCart(c);
    } catch {
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = useCallback(
    async (catalogItemId: string, quantity = 1, variantId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const catalogReference: {
          appId: string;
          catalogItemId: string;
          options?: { variantId: string };
        } = {
          appId: WIX_STORES_APP_ID,
          catalogItemId,
        };
        if (variantId) {
          catalogReference.options = { variantId };
        }
        await browserClient.currentCart.addToCurrentCart({
          lineItems: [{ catalogReference, quantity }],
        });
        const fresh = await browserClient.currentCart.getCurrentCart();
        setCart(fresh);
        if ((fresh.lineItems?.length ?? 0) === 0) {
          setError(
            `Cart is still empty after adding. productId=${catalogItemId.slice(-8)} variantId=${variantId?.slice(-8) ?? 'none'}. Send this to Claude.`,
          );
        }
        setIsOpen(true);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : JSON.stringify(e);
        console.error('[cart] addToCart failed:', e);
        setError(msg.slice(0, 500) || 'Could not add to cart. Try again.');
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      setLoading(true);
      setError(null);
      try {
        await browserClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
        await refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Could not remove item. Try again.');
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (quantity < 1) {
        await removeFromCart(lineItemId);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await browserClient.currentCart.updateCurrentCartLineItemQuantity([
          { _id: lineItemId, quantity },
        ]);
        await refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Could not update quantity. Try again.');
      } finally {
        setLoading(false);
      }
    },
    [refresh, removeFromCart],
  );

  const clearCart = useCallback(async () => {
    try {
      await browserClient.currentCart.deleteCurrentCart();
    } catch {
      // swallow — cart is done regardless
    } finally {
      setCart(null);
    }
  }, []);

  const checkout = useCallback(async () => {
    setIsOpen(false);
    router.push('/checkout');
  }, [router]);

  const itemCount = useMemo(() => {
    return (cart?.lineItems ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount,
      cartLoading,
      isOpen,
      loading,
      error,
      clearError: () => setError(null),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
    }),
    [cart, itemCount, cartLoading, isOpen, loading, error, addToCart, removeFromCart, updateQuantity, clearCart, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
