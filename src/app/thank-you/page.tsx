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
  return order ? <OrderDetails order={order} /> : <GenericConfirmation />;
}

function GenericConfirmation() {
  return (
    <section
      className="min-h-[80vh] flex items-center"
      style={{ background: 'var(--page-bg)' }}
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-14 w-full py-20"
        style={{ maxWidth: '640px' }}
      >
        <div className="text-center">
          {/* Crimson check mark */}
          <div
            className="mx-auto mb-8 flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              border: '2px solid #D81829',
              color: '#D81829',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 12L9 17L20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: '#D81829',
              marginBottom: '1.25rem',
            }}
          >
            Order Confirmed
          </p>

          <h1
            className="font-display uppercase leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Train Harder.
          </h1>

          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: 'var(--muted)' }}
          >
            Your gear is on its way. We&apos;ve sent a confirmation email — keep an eye on your
            inbox.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/shop" variant="primary" size="lg">
              Shop More →
            </Button>
            <Button href="/" variant="ghost" size="lg">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderDetails({ order }: { order: WixOrderSummary }) {
  return (
    <section style={{ background: 'var(--page-bg)' }}>
      <div
        className="mx-auto px-6 md:px-10 lg:px-14 py-16"
        style={{ maxWidth: '800px' }}
      >
        {/* Confirmation header */}
        <div
          className="text-center mb-14 pb-14"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="mx-auto mb-8 flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              border: '2px solid #D81829',
              color: '#D81829',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 12L9 17L20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: '#D81829',
              marginBottom: '1rem',
            }}
          >
            Order Confirmed
          </p>

          <h1
            className="font-display uppercase leading-[0.9] mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Thanks{order.email ? `, ${order.email.split('@')[0]}` : ''}.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: 'var(--muted)',
            }}
          >
            Order{' '}
            <span className="font-display" style={{ color: 'var(--page-fg)' }}>
              #{order.orderNumber}
            </span>{' '}
            · paid in full · confirmation sent to{' '}
            <span style={{ color: 'var(--page-fg)' }}>{order.email || 'your email'}</span>
          </p>
        </div>

        {/* Items */}
        <div
          className="mb-6"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: '2px solid #D81829',
          }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Your Gear
            </h2>
          </div>

          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-4 px-6 py-5">
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                    className="truncate"
                  >
                    {it.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      color: 'var(--muted)',
                      marginTop: '2px',
                    }}
                  >
                    Qty {it.quantity}
                  </p>
                </div>
                <p className="font-display whitespace-nowrap" style={{ color: '#D81829' }}>
                  {it.lineTotalFormatted}
                </p>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div
            className="px-6 py-5 space-y-3"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-elevated)' }}
          >
            <TotalsRow label="Subtotal" value={order.subtotalFormatted} />
            <TotalsRow label="Shipping"  value={order.shippingFormatted} />
            <div
              className="flex justify-between items-baseline pt-4 mt-1"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Total
              </span>
              <span
                className="font-display"
                style={{ fontSize: '1.6rem', color: '#D81829' }}
              >
                {order.totalFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div
            className="mb-10"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: '2px solid var(--border)',
            }}
          >
            <div
              className="px-6 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Shipping To
              </h2>
            </div>
            <address className="px-6 py-5 not-italic space-y-1">
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                {order.shippingAddress.fullName}
              </p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {[order.shippingAddress.city, order.shippingAddress.state]
                  .filter(Boolean)
                  .join(', ')}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{order.shippingAddress.country}</p>
            </address>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button href="/shop" variant="primary" size="lg">
            Keep Shopping →
          </Button>
          <Button href="/" variant="ghost" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}

function TotalsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span
        style={{
          fontFamily: 'var(--font-rajdhani)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
