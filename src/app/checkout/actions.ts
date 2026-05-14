'use server';

import { stripe } from '@/lib/stripe';
import { wixClient } from '@/lib/wix';

interface CartLineItemIn {
  productId: string;
  quantity: number;
  variantId?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; qty: number; unitPrice: number; lineTotal: number }>;
}

const SHIPPING_FLAT_NZD = 0; // free shipping for v1; refine via Wix shipping API later

export async function createCheckoutPaymentIntent(
  lines: CartLineItemIn[],
  email: string,
): Promise<CreatePaymentIntentResult> {
  try {
    if (!lines.length) throw new Error('Cart is empty');

    console.log('[checkout] createCheckoutPaymentIntent start', {
      lineCount: lines.length,
      hasEmail: !!email,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWixClientId: !!process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
    });

    const productsRes = await wixClient.products.queryProducts().find();
    console.log('[checkout] Wix products fetched', { count: productsRes.items.length });
    const products = new Map(productsRes.items.map((p) => [p._id ?? '', p]));

    const items: CreatePaymentIntentResult['items'] = [];
    let subtotalCents = 0;
    for (const line of lines) {
      const product = products.get(line.productId);
      if (!product) throw new Error(`Product ${line.productId} not found`);
      const unit = product.priceData?.discountedPrice ?? product.priceData?.price ?? 0;
      const lineTotal = unit * line.quantity;
      items.push({
        name: product.name ?? 'Product',
        qty: line.quantity,
        unitPrice: unit,
        lineTotal,
      });
      subtotalCents += Math.round(lineTotal * 100);
    }
    const totalCents = subtotalCents + Math.round(SHIPPING_FLAT_NZD * 100);
    const currency = (productsRes.items[0]?.priceData?.currency ?? 'NZD').toLowerCase();
    console.log('[checkout] cart priced', { totalCents, currency });

    const intent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency,
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart_line_count: String(lines.length),
        cart_items: JSON.stringify(
          lines.map((l) => ({ p: l.productId.slice(-8), q: l.quantity, v: l.variantId?.slice(-8) })),
        ).slice(0, 500),
      },
    });
    console.log('[checkout] Stripe PI created', { id: intent.id, status: intent.status });

    if (!intent.client_secret) {
      throw new Error('Stripe did not return a client_secret');
    }

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: totalCents,
      currency,
      items,
    };
  } catch (err) {
    console.error('[checkout] createCheckoutPaymentIntent FAILED:', err instanceof Error ? `${err.name}: ${err.message}\n${err.stack}` : err);
    throw err;
  }
}

export interface CompleteOrderInput {
  paymentIntentId: string;
  lines: CartLineItemIn[];
  shipping: ShippingAddress;
}

export interface CompleteOrderResult {
  orderId: string;
  orderNumber?: string;
}

export async function completeCheckoutOrder(
  input: CompleteOrderInput,
): Promise<CompleteOrderResult> {
  const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
  if (intent.status !== 'succeeded') {
    throw new Error(`Payment not completed (status: ${intent.status})`);
  }

  const orderPayload = {
    paymentIntentId: input.paymentIntentId,
    lines: input.lines,
    shipping: input.shipping,
    amount: intent.amount,
    currency: intent.currency,
  };

  const orderId = await createWixOrder(orderPayload).catch((err: unknown) => {
    console.error('[checkout] Wix order creation failed (payment captured):', err);
    return `stripe_${input.paymentIntentId}`;
  });

  return { orderId };
}

async function createWixOrder(payload: {
  paymentIntentId: string;
  lines: CartLineItemIn[];
  shipping: ShippingAddress;
  amount: number;
  currency: string;
}): Promise<string> {
  const adminKey = process.env.WIX_ADMIN_API_KEY;
  const siteId = process.env.WIX_SITE_ID ?? '7f2bc2ac-a03f-4f5c-8c37-7835ab0b0a29';
  if (!adminKey) {
    throw new Error('WIX_ADMIN_API_KEY not set — order will not sync to Wix');
  }

  const res = await fetch('https://www.wixapis.com/ecom/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: adminKey,
      'wix-site-id': siteId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order: {
        lineItems: payload.lines.map((l) => ({
          catalogReference: {
            appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e',
            catalogItemId: l.productId,
            ...(l.variantId ? { options: { variantId: l.variantId } } : {}),
          },
          quantity: l.quantity,
        })),
        buyerInfo: {
          email: payload.shipping.email,
        },
        shippingInfo: {
          shipmentDetails: {
            address: {
              addressLine: payload.shipping.addressLine1,
              addressLine2: payload.shipping.addressLine2,
              city: payload.shipping.city,
              postalCode: payload.shipping.postalCode,
              country: payload.shipping.country,
              subdivision: payload.shipping.state,
            },
            contactDetails: {
              firstName: payload.shipping.firstName,
              lastName: payload.shipping.lastName,
              phone: payload.shipping.phone,
            },
          },
        },
        paymentStatus: 'PAID',
        status: 'APPROVED',
        priceSummary: {
          total: { amount: String(payload.amount / 100), formattedAmount: '' },
        },
        channelInfo: { type: 'WEB' },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Wix Order create failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { order?: { _id?: string; number?: string } };
  return data.order?._id ?? `stripe_${payload.paymentIntentId}`;
}
