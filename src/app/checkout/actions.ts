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
  if (!lines.length) throw new Error('Cart is empty');

  const productsRes = await wixClient.products.queryProducts().find();
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

  // Re-fetch products server-side so we can populate Wix's required line-item
  // fields (productName.original, price, lineItemPrice) authoritatively.
  const productsRes = await wixClient.products.queryProducts().find();
  const productsById = new Map(productsRes.items.map((p) => [p._id ?? '', p]));

  const enrichedLines = input.lines.map((l) => {
    const p = productsById.get(l.productId);
    const unit = p?.priceData?.discountedPrice ?? p?.priceData?.price ?? 0;
    return {
      ...l,
      productName: p?.name ?? 'Product',
      unitPrice: unit,
      lineTotal: unit * l.quantity,
    };
  });
  const subtotal = enrichedLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shippingCost = 0; // v1: free shipping
  const total = subtotal + shippingCost;
  const currencyUpper = (intent.currency ?? 'nzd').toUpperCase();

  const orderId = await createWixOrder({
    paymentIntentId: input.paymentIntentId,
    enrichedLines,
    shipping: input.shipping,
    subtotal,
    shippingCost,
    total,
    currency: currencyUpper,
  }).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`WIX_ORDER_FAIL ${msg.slice(0, 200)}`);
    return `stripe_${input.paymentIntentId}`;
  });

  return { orderId };
}

interface EnrichedLine extends CartLineItemIn {
  productName: string;
  unitPrice: number;
  lineTotal: number;
}

function fmtMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency }).format(amount);
}

async function createWixOrder(payload: {
  paymentIntentId: string;
  enrichedLines: EnrichedLine[];
  shipping: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
}): Promise<string> {
  const rawAdminKey = process.env.WIX_ADMIN_API_KEY;
  if (!rawAdminKey) {
    throw new Error('WIX_ADMIN_API_KEY not set');
  }
  // Same defense as src/lib/stripe.ts — strip whitespace + surrounding quotes.
  // Vercel UI paste can introduce invisible chars (zero-width space, NBSP)
  // that undici rejects as invalid header content.
  const adminKey = rawAdminKey.trim().replace(/^["']|["']$/g, '');
  const rawSiteId = process.env.WIX_SITE_ID ?? '7f2bc2ac-a03f-4f5c-8c37-7835ab0b0a29';
  const siteId = rawSiteId.trim().replace(/^["']|["']$/g, '');
  console.log(`WIX_KEY_LEN raw=${rawAdminKey.length} trimmed=${adminKey.length} sidLen=${siteId.length}`);

  const body = {
    order: {
      currency: payload.currency,
      lineItems: payload.enrichedLines.map((l) => ({
        productName: { original: l.productName },
        catalogReference: {
          appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e',
          catalogItemId: l.productId,
          ...(l.variantId ? { options: { variantId: l.variantId } } : {}),
        },
        quantity: l.quantity,
        price: {
          amount: l.unitPrice.toFixed(2),
          formattedAmount: fmtMoney(l.unitPrice, payload.currency),
        },
        lineItemPrice: {
          amount: l.lineTotal.toFixed(2),
          formattedAmount: fmtMoney(l.lineTotal, payload.currency),
        },
        itemType: { preset: 'PHYSICAL' },
        paymentOption: 'FULL_PAYMENT_ONLINE',
        // Required by Wix: each line must have taxInfo or taxDetails.
        // v1 = zero tax. Line is taxable, rate is 0.
        taxInfo: {
          taxableAmount: {
            amount: l.lineTotal.toFixed(2),
            formattedAmount: fmtMoney(l.lineTotal, payload.currency),
          },
          taxAmount: {
            amount: '0.00',
            formattedAmount: fmtMoney(0, payload.currency),
          },
          taxRate: '0',
          taxIncludedInPrice: false,
        },
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
        subtotal: {
          amount: payload.subtotal.toFixed(2),
          formattedAmount: fmtMoney(payload.subtotal, payload.currency),
        },
        shipping: {
          amount: payload.shippingCost.toFixed(2),
          formattedAmount: fmtMoney(payload.shippingCost, payload.currency),
        },
        tax: { amount: '0.00', formattedAmount: fmtMoney(0, payload.currency) },
        discount: { amount: '0.00', formattedAmount: fmtMoney(0, payload.currency) },
        total: {
          amount: payload.total.toFixed(2),
          formattedAmount: fmtMoney(payload.total, payload.currency),
        },
      },
      channelInfo: { type: 'WEB', externalOrderId: payload.paymentIntentId },
    },
  };

  const res = await fetch('https://www.wixapis.com/ecom/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: adminKey,
      'wix-site-id': siteId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    // Queryable error logs — split so Vercel runtime_logs preview window
    // (~28 chars) shows the critical status + first chars of the body.
    console.error(`WIX_E s=${res.status} top=${text.slice(0, 60)}`);
    console.error(`WIX_E_BODY ${text.slice(0, 400)}`);
    throw new Error(`Wix Order create failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { order?: { _id?: string; number?: string } };
  const orderId = data.order?._id;
  const orderNum = data.order?.number;
  console.log(`WIX_OK id=${orderId} num=${orderNum}`);
  return orderId ?? `stripe_${payload.paymentIntentId}`;
}
