const WIX_API_BASE = 'https://www.wixapis.com';
const DEFAULT_SITE_ID = '7f2bc2ac-a03f-4f5c-8c37-7835ab0b0a29';

export interface WixOrderSummary {
  orderId: string;
  orderNumber: string;
  email: string;
  paymentStatus: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPriceFormatted: string;
    lineTotalFormatted: string;
  }>;
  subtotalFormatted: string;
  shippingFormatted: string;
  totalFormatted: string;
  currency: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    state?: string;
  } | null;
}

interface WixMoney {
  amount?: string;
  formattedAmount?: string;
}
interface WixAddress {
  addressLine?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  subdivision?: string;
}
interface WixContact {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
interface WixDestination {
  address?: WixAddress;
  contactDetails?: WixContact;
}
interface WixOrderRaw {
  id?: string;
  number?: string;
  currency?: string;
  paymentStatus?: string;
  buyerInfo?: { email?: string };
  lineItems?: Array<{
    productName?: { original?: string };
    quantity?: number;
    price?: WixMoney;
    lineItemPrice?: WixMoney;
  }>;
  priceSummary?: {
    subtotal?: WixMoney;
    shipping?: WixMoney;
    total?: WixMoney;
    totalPrice?: WixMoney;
  };
  // Wix stores the shipping address on either of these paths depending on
  // how the order was created. recipientInfo is the modern path; the older
  // shippingInfo.logistics.shippingDestination is a fallback.
  recipientInfo?: WixDestination;
  shippingInfo?: {
    title?: string;
    logistics?: { shippingDestination?: WixDestination };
  };
}

function fmtFallback(m: WixMoney | undefined, currency: string): string {
  if (m?.formattedAmount) return m.formattedAmount;
  if (m?.amount) return `${currency} ${m.amount}`;
  return '—';
}

function extractDestination(order: WixOrderRaw): WixDestination | null {
  if (order.recipientInfo?.address) return order.recipientInfo;
  const fromLogistics = order.shippingInfo?.logistics?.shippingDestination;
  if (fromLogistics?.address) return fromLogistics;
  return null;
}

function normalize(order: WixOrderRaw): WixOrderSummary {
  const currency = order.currency ?? 'NZD';
  const ps = order.priceSummary;
  const dest = extractDestination(order);
  const addr = dest?.address;
  const contact = dest?.contactDetails;

  return {
    orderId: order.id ?? '',
    orderNumber: order.number ?? '—',
    email: order.buyerInfo?.email ?? '',
    paymentStatus: order.paymentStatus ?? 'UNKNOWN',
    items: (order.lineItems ?? []).map((li) => ({
      name: li.productName?.original ?? 'Product',
      quantity: li.quantity ?? 1,
      unitPriceFormatted: fmtFallback(li.price, currency),
      lineTotalFormatted: fmtFallback(li.lineItemPrice, currency),
    })),
    subtotalFormatted: fmtFallback(ps?.subtotal, currency),
    shippingFormatted: fmtFallback(ps?.shipping, currency),
    totalFormatted: fmtFallback(ps?.totalPrice ?? ps?.total, currency),
    currency,
    shippingAddress: addr
      ? {
          fullName:
            `${contact?.firstName ?? ''} ${contact?.lastName ?? ''}`.trim() || 'Customer',
          addressLine1: addr.addressLine ?? '',
          addressLine2: addr.addressLine2 || undefined,
          city: addr.city ?? '',
          postalCode: addr.postalCode ?? '',
          country: addr.country ?? '',
          state: addr.subdivision || undefined,
        }
      : null,
  };
}

export async function getWixOrder(orderId: string): Promise<WixOrderSummary | null> {
  if (!orderId || orderId.startsWith('stripe_')) return null;

  const rawAdminKey = process.env.WIX_ADMIN_API_KEY;
  if (!rawAdminKey) return null;
  const adminKey = rawAdminKey.trim().replace(/^["']|["']$/g, '');
  const rawSiteId = process.env.WIX_SITE_ID ?? DEFAULT_SITE_ID;
  const siteId = rawSiteId.trim().replace(/^["']|["']$/g, '');

  let res: Response;
  try {
    res = await fetch(`${WIX_API_BASE}/ecom/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: {
        Authorization: adminKey,
        'wix-site-id': siteId,
      },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[wix-orders] network failure:', err);
    return null;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`[wix-orders] fetch ${res.status}: ${text.slice(0, 300)}`);
    return null;
  }

  const data = (await res.json()) as { order?: WixOrderRaw };
  if (!data.order) return null;
  return normalize(data.order);
}
