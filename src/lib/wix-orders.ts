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
  if (!rawAdminKey) {
    console.error('GETORDER_NO_KEY');
    return null;
  }
  const adminKey = rawAdminKey.trim().replace(/^["']|["']$/g, '');
  const rawSiteId = process.env.WIX_SITE_ID ?? DEFAULT_SITE_ID;
  const siteId = rawSiteId.trim().replace(/^["']|["']$/g, '');

  const url = `${WIX_API_BASE}/ecom/v1/orders/${encodeURIComponent(orderId)}`;
  console.log(
    `GETORDER_CALL oid=${orderId.slice(0, 8)} kLen=${adminKey.length} sLen=${siteId.length} sPfx=${siteId.slice(0, 8)}`,
  );

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: adminKey,
        'wix-site-id': siteId,
      },
      cache: 'no-store',
    });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}:${err.message}` : String(err);
    console.error(`GETORDER_NETERR ${msg.slice(0, 150)}`);
    return null;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // Vercel runtime_logs preview window is ~28 chars. Split the body across
    // queryable lines so each can be inspected via MCP query=... probes.
    console.error(`GETORDER_S s=${res.status}`);
    console.error(`GETORDER_B1 ${text.slice(0, 30)}`);
    console.error(`GETORDER_B2 ${text.slice(30, 60)}`);
    console.error(`GETORDER_B3 ${text.slice(60, 90)}`);
    console.error(`GETORDER_B4 ${text.slice(90, 120)}`);
    console.error(`GETORDER_B5 ${text.slice(120, 150)}`);
    console.error(`GETORDER_B6 ${text.slice(150, 180)}`);
    console.error(`GETORDER_B7 ${text.slice(180, 210)}`);
    return null;
  }

  const data = (await res.json()) as { order?: WixOrderRaw };
  if (!data.order) {
    console.error('GETORDER_NO_ORDER_IN_RESPONSE');
    return null;
  }
  console.log(`GETORDER_OK num=${data.order.number}`);
  return normalize(data.order);
}
