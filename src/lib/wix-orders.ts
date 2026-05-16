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
  shippingInfo?: {
    shipmentDetails?: {
      address?: {
        addressLine?: string;
        addressLine2?: string;
        city?: string;
        postalCode?: string;
        country?: string;
        subdivision?: string;
      };
      contactDetails?: { firstName?: string; lastName?: string };
    };
  };
}

function fmtFallback(m: WixMoney | undefined, currency: string): string {
  if (m?.formattedAmount) return m.formattedAmount;
  if (m?.amount) return `${currency} ${m.amount}`;
  return '—';
}

function normalize(order: WixOrderRaw): WixOrderSummary {
  const currency = order.currency ?? 'NZD';
  const ps = order.priceSummary;
  const ship = order.shippingInfo?.shipmentDetails;
  const addr = ship?.address;
  const contact = ship?.contactDetails;

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
          fullName: `${contact?.firstName ?? ''} ${contact?.lastName ?? ''}`.trim() || 'Customer',
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
    console.error(`[wix-orders] fetch ${res.status}: ${text.slice(0, 200)}`);
    return null;
  }

  const data = (await res.json()) as { order?: WixOrderRaw };
  if (!data.order) return null;
  return normalize(data.order);
}
