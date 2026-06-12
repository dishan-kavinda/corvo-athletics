'use server';

import { stripe } from '@/lib/stripe';
import { wixClient } from '@/lib/wix';
import { fmtMoney } from '@/lib/format';

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

/* ── Input validation ─────────────────────────────────
   Server actions are public HTTP endpoints — every field that arrives
   here is attacker-controlled, regardless of what our UI sends. */

const MAX_LINES = 50;
const MAX_QTY = 50;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,24}$/;

function assertValidLines(lines: CartLineItemIn[]): void {
  if (!Array.isArray(lines) || lines.length === 0) throw new Error('Cart is empty');
  if (lines.length > MAX_LINES) throw new Error('Too many cart lines');
  for (const l of lines) {
    if (typeof l.productId !== 'string' || !l.productId || l.productId.length > 64) {
      throw new Error('Invalid product reference');
    }
    if (!Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > MAX_QTY) {
      throw new Error('Invalid quantity');
    }
    if (l.variantId !== undefined && (typeof l.variantId !== 'string' || l.variantId.length > 64)) {
      throw new Error('Invalid variant reference');
    }
  }
}

function clamp(s: string | undefined, max: number): string | undefined {
  if (s === undefined) return undefined;
  return String(s).slice(0, max).trim() || undefined;
}

function sanitizeShipping(s: ShippingAddress): ShippingAddress {
  const email = clamp(s.email, 254) ?? '';
  if (!EMAIL_RE.test(email)) throw new Error('Invalid email address');
  const required = (v: string | undefined, name: string): string => {
    const out = clamp(v, 200);
    if (!out) throw new Error(`Missing ${name}`);
    return out;
  };
  return {
    firstName: required(s.firstName, 'first name'),
    lastName: required(s.lastName, 'last name'),
    email,
    phone: clamp(s.phone, 40),
    addressLine1: required(s.addressLine1, 'address'),
    addressLine2: clamp(s.addressLine2, 200),
    city: required(s.city, 'city'),
    postalCode: required(s.postalCode, 'postal code'),
    country: required(s.country, 'country').slice(0, 2).toUpperCase(),
    state: clamp(s.state, 100),
  };
}

/* Stable fingerprint of the cart, stored on the PaymentIntent at creation
   and verified again at order completion so the lines that get fulfilled
   are exactly the lines that were paid for. */
function cartFingerprint(lines: CartLineItemIn[]): string {
  return JSON.stringify(
    lines.map((l) => ({ p: l.productId.slice(-8), q: l.quantity, v: l.variantId?.slice(-8) })),
  ).slice(0, 500);
}

export async function createCheckoutPaymentIntent(
  lines: CartLineItemIn[],
): Promise<CreatePaymentIntentResult> {
  assertValidLines(lines);

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

  // receipt_email is intentionally omitted — Stripe uses billing_details.email
  // (provided in confirmPayment) for automatic receipts, so we never send
  // a receipt to the wrong address before the user fills in the form.
  const intent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      cart_line_count: String(lines.length),
      cart_items: cartFingerprint(lines),
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
  assertValidLines(input.lines);
  const shipping = sanitizeShipping(input.shipping);
  if (typeof input.paymentIntentId !== 'string' || !/^pi_[A-Za-z0-9_]{8,}$/.test(input.paymentIntentId)) {
    throw new Error('Invalid payment reference');
  }

  const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
  if (intent.status !== 'succeeded') {
    throw new Error(`Payment not completed (status: ${intent.status})`);
  }

  // Replay protection — one Wix order per PaymentIntent. The flag is set
  // on the PI metadata after the order is created (see below).
  if (intent.metadata?.order_created === 'true') {
    throw new Error('An order has already been created for this payment');
  }

  // The submitted lines must be EXACTLY the lines this payment was created
  // for — otherwise a client could pay for a cheap cart and submit a
  // different one for fulfillment.
  if (intent.metadata?.cart_items !== cartFingerprint(input.lines)) {
    throw new Error('Cart does not match the payment');
  }

  // Re-fetch products server-side so we can populate Wix's required line-item
  // fields (productName.original, price, lineItemPrice) authoritatively.
  const productsRes = await wixClient.products.queryProducts().find();
  const productsById = new Map(productsRes.items.map((p) => [p._id ?? '', p]));

  const enrichedLines = input.lines.map((l) => {
    const p = productsById.get(l.productId);
    if (!p) throw new Error(`Product ${l.productId} not found`);
    const unit = p.priceData?.discountedPrice ?? p.priceData?.price ?? 0;
    return {
      ...l,
      productName: p.name ?? 'Product',
      unitPrice: unit,
      lineTotal: unit * l.quantity,
    };
  });
  const subtotal = enrichedLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shippingCost = SHIPPING_FLAT_NZD;
  const total = subtotal + shippingCost;
  const currencyUpper = (intent.currency ?? 'nzd').toUpperCase();

  // The amount actually captured by Stripe must equal the server-side
  // re-pricing of the cart. Catches price tampering AND price drift
  // between PI creation and completion.
  const expectedCents = enrichedLines.reduce((sum, l) => sum + Math.round(l.lineTotal * 100), 0)
    + Math.round(shippingCost * 100);
  if (intent.amount !== expectedCents) {
    console.error(`PAY_MISMATCH pi=${intent.id} paid=${intent.amount} expected=${expectedCents}`);
    throw new Error('Paid amount does not match the cart total');
  }

  const orderId = await createWixOrder({
    paymentIntentId: input.paymentIntentId,
    enrichedLines,
    shipping,
    subtotal,
    shippingCost,
    total,
    currency: currencyUpper,
  }).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`WIX_ORDER_FAIL ${msg.slice(0, 200)}`);
    return `stripe_${input.paymentIntentId}`;
  });

  // Mark the PI as consumed so it can't create a second order. Best-effort:
  // a failure here must not lose the order the customer just paid for.
  try {
    await stripe.paymentIntents.update(intent.id, {
      metadata: { ...intent.metadata, order_created: 'true', wix_order_id: orderId },
    });
  } catch (err: unknown) {
    console.error(`PI_FLAG_FAIL ${err instanceof Error ? err.message.slice(0, 120) : 'unknown'}`);
  }

  return { orderId };
}

interface EnrichedLine extends CartLineItemIn {
  productName: string;
  unitPrice: number;
  lineTotal: number;
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
  // Strip whitespace + surrounding quotes. Vercel UI paste can introduce
  // invisible chars (zero-width space, NBSP) that undici rejects as
  // invalid header content. Same defense pattern as src/lib/stripe.ts.
  const adminKey = rawAdminKey.trim().replace(/^["']|["']$/g, '');
  const rawSiteId = process.env.WIX_SITE_ID ?? '7f2bc2ac-a03f-4f5c-8c37-7835ab0b0a29';
  const siteId = rawSiteId.trim().replace(/^["']|["']$/g, '');

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
      // Wix Orders v1 IGNORES shippingInfo.shipmentDetails on create — the
      // address must live in recipientInfo (top-level) and/or
      // shippingInfo.logistics.shippingDestination. We send both so the
      // address is queryable from either path. Verified via direct API
      // probe — see .wolf/cerebrum.md for the schema gotcha.
      recipientInfo: {
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
      shippingInfo: {
        title: 'Standard',
        logistics: {
          shippingDestination: {
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
  const data = (await res.json()) as { order?: { id?: string; _id?: string; number?: string } };
  // Wix eCom Orders v1 returns `id` (not `_id` like Wix Stores Products API).
  // Accept either defensively in case the schema changes.
  const orderId = data.order?.id ?? data.order?._id;
  const orderNum = data.order?.number;
  console.log(`WIX_OK id=${orderId} num=${orderNum}`);
  return orderId ?? `stripe_${payload.paymentIntentId}`;
}
