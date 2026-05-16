import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { getWixOrder, type WixOrderSummary } from '@/lib/wix-orders';

export const metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId ? await getWixOrder(orderId) : null;

  if (!order) {
    return <GenericConfirmation />;
  }

  return <OrderDetails order={order} />;
}

function GenericConfirmation() {
  return (
    <Section className="min-h-[70vh] flex items-center">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-6">
            Order Confirmed
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-6">
            Train Harder.
          </h1>
          <p className="text-ash mb-10 text-lg">
            Your gear is on its way. We&apos;ve sent a confirmation email — keep an eye on your
            inbox.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/shop" variant="gold" size="lg">
              Shop More
            </Button>
            <Button href="/" variant="ghost" size="lg">
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function OrderDetails({ order }: { order: WixOrderSummary }) {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Hero / confirmation */}
          <div className="text-center mb-14">
            <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-4">
              Order Confirmed
            </p>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-3">
              Thanks {order.email ? order.email.split('@')[0] : 'and welcome'}.
            </h1>
            <p className="text-ash text-sm">
              Order <span className="text-bone font-display">#{order.orderNumber}</span> · paid in
              full · confirmation sent to{' '}
              <span className="text-bone">{order.email || 'your email'}</span>
            </p>
          </div>

          {/* Items */}
          <div className="border border-graphite bg-onyx p-6 md:p-8 mb-8">
            <h2 className="font-display text-sm uppercase tracking-[0.3em] text-ash mb-6">
              Your Gear
            </h2>
            <ul className="divide-y divide-graphite">
              {order.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="uppercase tracking-wider text-sm truncate">{it.name}</p>
                    <p className="text-ash text-xs mt-1">Qty {it.quantity}</p>
                  </div>
                  <p className="font-display whitespace-nowrap">{it.lineTotalFormatted}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-graphite mt-6 pt-6 space-y-2 text-sm">
              <Row label="Subtotal" value={order.subtotalFormatted} />
              <Row label="Shipping" value={order.shippingFormatted} />
              <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-graphite">
                <span className="font-display uppercase tracking-widest">Total</span>
                <span className="font-display text-2xl text-gold">{order.totalFormatted}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="border border-graphite bg-onyx p-6 md:p-8 mb-10">
              <h2 className="font-display text-sm uppercase tracking-[0.3em] text-ash mb-6">
                Shipping To
              </h2>
              <address className="text-sm not-italic space-y-1 text-bone">
                <p className="font-display uppercase tracking-wider">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {[order.shippingAddress.city, order.shippingAddress.state]
                    .filter(Boolean)
                    .join(', ')}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/shop" variant="gold" size="lg">
              Keep Shopping
            </Button>
            <Button href="/" variant="ghost" size="lg">
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ash uppercase tracking-wider text-xs">{label}</span>
      <span>{value}</span>
    </div>
  );
}
