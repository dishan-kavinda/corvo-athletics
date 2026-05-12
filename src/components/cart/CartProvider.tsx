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

const WIX_STORES_APP_ID = '1380b703-ce81-ff05-f115-39571d94dfcd';
const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID!;

const browserClient = createClient({
  modules: { currentCart, redirects },
  auth: OAuthStrategy({ clientId }),
});

type Cart = Awaited<ReturnType<typeof browserClient.currentCart.getCurrentCart>> | null;

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  isOpen: boolean;
  loading: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addToCart: (catalogItemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const c = await browserClient.currentCart.getCurrentCart();
      setCart(c);
    } catch {
      setCart(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = useCallback(
    async (catalogItemId: string, quantity = 1) => {
      setLoading(true);
      try {
        await browserClient.currentCart.addToCurrentCart({
          lineItems: [
            {
              catalogReference: {
                appId: WIX_STORES_APP_ID,
                catalogItemId,
              },
              quantity,
            },
          ],
        });
        await refresh();
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      setLoading(true);
      try {
        await browserClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
        await refresh();
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
      try {
        await browserClient.currentCart.updateCurrentCartLineItemQuantity([
          { _id: lineItemId, quantity },
        ]);
        await refresh();
      } finally {
        setLoading(false);
      }
    },
    [refresh, removeFromCart],
  );

  const checkout = useCallback(async () => {
    setLoading(true);
    try {
      const { checkoutId } = await browserClient.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      });
      if (!checkoutId) throw new Error('No checkout id returned');
      const { redirectSession } = await browserClient.redirects.createRedirectSession({
        ecomCheckout: { checkoutId },
        callbacks: {
          postFlowUrl: window.location.origin,
          thankYouPageUrl: `${window.location.origin}/thank-you`,
        },
      });
      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const itemCount = useMemo(() => {
    return (cart?.lineItems ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount,
      isOpen,
      loading,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      addToCart,
      removeFromCart,
      updateQuantity,
      checkout,
    }),
    [cart, itemCount, isOpen, loading, addToCart, removeFromCart, updateQuantity, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
