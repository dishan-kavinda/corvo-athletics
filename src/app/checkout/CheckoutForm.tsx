'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { getStripe } from '@/lib/stripe-client';
import { useCart } from '@/components/cart/CartProvider';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import {
  completeCheckoutOrder,
  createCheckoutPaymentIntent,
  type CreatePaymentIntentResult,
} from './actions';

interface ShippingForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
}

const initialShipping: ShippingForm = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'NZ',
  state: '',
};

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency }).format(amount);
}

function CheckoutInner({
  intent,
  shipping,
  setShipping,
  cartLines,
}: {
  intent: CreatePaymentIntentResult;
  shipping: ShippingForm;
  setShipping: React.Dispatch<React.SetStateAction<ShippingForm>>;
  cartLines: Array<{ productId: string; quantity: number; variantId?: string }>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErr(null);
    setSubmitting(true);
    try {
      const { error: submitErr } = await elements.submit();
      if (submitErr) {
        setErr(submitErr.message ?? 'Payment details invalid.');
        return;
      }

      const { error: payErr, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: intent.clientSecret,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: {
              email: shipping.email,
              name: `${shipping.firstName} ${shipping.lastName}`.trim(),
              phone: shipping.phone || undefined,
              address: {
                line1: shipping.addressLine1,
                line2: shipping.addressLine2 || undefined,
                city: shipping.city,
                postal_code: shipping.postalCode,
                country: shipping.country,
                state: shipping.state || undefined,
              },
            },
          },
        },
      });

      if (payErr) {
        setErr(payErr.message ?? 'Payment failed.');
        return;
      }
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const result = await completeCheckoutOrder({
          paymentIntentId: paymentIntent.id,
          lines: cartLines,
          shipping: {
            email: shipping.email,
            firstName: shipping.firstName,
            lastName: shipping.lastName,
            phone: shipping.phone || undefined,
            addressLine1: shipping.addressLine1,
            addressLine2: shipping.addressLine2 || undefined,
            city: shipping.city,
            postalCode: shipping.postalCode,
            country: shipping.country,
            state: shipping.state || undefined,
          },
        });
        router.push(`/thank-you?orderId=${encodeURIComponent(result.orderId)}`);
      }
    } catch (e: unknown) {
      console.error('[checkout]', e);
      setErr(e instanceof Error ? e.message : 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = <K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) =>
    setShipping((s) => ({ ...s, [key]: value }));

  const baseInput =
    'w-full h-12 px-4 bg-onyx border border-graphite text-bone placeholder:text-ash/60 text-sm focus:outline-none focus:border-gold transition-colors';
  const baseLabel = 'block text-[10px] uppercase tracking-[0.2em] text-ash mb-2';

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section>
        <h2 className="font-display text-xl uppercase tracking-widest mb-6">Contact</h2>
        <div>
          <label className={baseLabel}>Email</label>
          <input
            type="email"
            required
            className={baseInput}
            value={shipping.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@email.com"
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl uppercase tracking-widest mb-6">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={baseLabel}>First Name</label>
            <input
              required
              className={baseInput}
              value={shipping.firstName}
              onChange={(e) => update('firstName', e.target.value)}
            />
          </div>
          <div>
            <label className={baseLabel}>Last Name</label>
            <input
              required
              className={baseInput}
              value={shipping.lastName}
              onChange={(e) => update('lastName', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={baseLabel}>Address</label>
            <input
              required
              className={baseInput}
              value={shipping.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="md:col-span-2">
            <label className={baseLabel}>Apartment, suite, etc. (optional)</label>
            <input
              className={baseInput}
              value={shipping.addressLine2}
              onChange={(e) => update('addressLine2', e.target.value)}
            />
          </div>
          <div>
            <label className={baseLabel}>City</label>
            <input
              required
              className={baseInput}
              value={shipping.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>
          <div>
            <label className={baseLabel}>Postal Code</label>
            <input
              required
              className={baseInput}
              value={shipping.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
            />
          </div>
          <div>
            <label className={baseLabel}>State / Region (optional)</label>
            <input
              className={baseInput}
              value={shipping.state}
              onChange={(e) => update('state', e.target.value)}
            />
          </div>
          <div>
            <label className={baseLabel}>Country</label>
            <input
              required
              className={baseInput}
              value={shipping.country}
              onChange={(e) => update('country', e.target.value.toUpperCase())}
              maxLength={2}
            />
          </div>
          <div className="md:col-span-2">
            <label className={baseLabel}>Phone (optional)</label>
            <input
              type="tel"
              className={baseInput}
              value={shipping.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl uppercase tracking-widest mb-6">Payment</h2>
        <div className="bg-onyx border border-graphite p-5">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </section>

      {err && (
        <div className="border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {err}
        </div>
      )}

      <Button
        variant="gold"
        size="lg"
        className="w-full"
        disabled={submitting || !stripe}
      >
        {submitting ? 'Processing…' : `Pay ${fmt(intent.amount / 100, intent.currency.toUpperCase())}`}
      </Button>
    </form>
  );
}

export function CheckoutForm() {
  const { cart, itemCount } = useCart();
  const [intent, setIntent] = useState<CreatePaymentIntentResult | null>(null);
  const [shipping, setShipping] = useState<ShippingForm>(initialShipping);
  const [initError, setInitError] = useState<string | null>(null);

  const cartLines = useMemo(
    () =>
      (cart?.lineItems ?? []).map((li) => ({
        productId: li.catalogReference?.catalogItemId ?? '',
        quantity: li.quantity ?? 1,
        variantId: (li.catalogReference?.options as { variantId?: string } | undefined)?.variantId,
      })),
    [cart],
  );

  const stripePromise = useMemo(() => {
    try {
      return getStripe();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!cartLines.length) return;
    if (intent) return;
    const guestEmail = shipping.email || 'guest@example.com';
    createCheckoutPaymentIntent(cartLines, guestEmail)
      .then(setIntent)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        setInitError(msg);
      });
  }, [cartLines, intent, shipping.email]);

  if (itemCount === 0) {
    return (
      <Section>
        <Container>
          <div className="max-w-md mx-auto text-center py-20">
            <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-4">
              Cart
            </p>
            <h1 className="font-display text-4xl uppercase tracking-tight mb-6">Empty</h1>
            <p className="text-ash mb-10">Add something to your cart before checkout.</p>
            <Button href="/shop" variant="gold" size="lg">
              Shop the Range
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  if (initError) {
    return (
      <Section>
        <Container>
          <div className="max-w-md mx-auto py-20">
            <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-4">
              Checkout
            </p>
            <h1 className="font-display text-3xl uppercase tracking-tight mb-6">
              Couldn&apos;t start checkout
            </h1>
            <p className="text-ash mb-4 text-sm">{initError}</p>
            <p className="text-ash text-xs">
              This usually means Stripe isn&apos;t configured yet. Tell Claude in the chat.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!intent || !stripePromise) {
    return (
      <Section>
        <Container>
          <div className="max-w-md mx-auto py-20 text-center">
            <p className="text-ash uppercase tracking-widest text-xs">Loading checkout…</p>
          </div>
        </Container>
      </Section>
    );
  }

  const elementOptions: StripeElementsOptions = {
    clientSecret: intent.clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#C9A961',
        colorBackground: '#141414',
        colorText: '#FAFAFA',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#0A0A0A',
          border: '1px solid #262626',
        },
        '.Input:focus': {
          border: '1px solid #C9A961',
          boxShadow: 'none',
        },
        '.Label': {
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '10px',
          color: '#737373',
        },
      },
    },
  };

  return (
    <Section>
      <Container>
        <div className="mb-10">
          <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-3">
            Checkout
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight">
            Complete Your Order
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <Elements stripe={stripePromise} options={elementOptions}>
              <CheckoutInner
                intent={intent}
                shipping={shipping}
                setShipping={setShipping}
                cartLines={cartLines}
              />
            </Elements>
          </div>
          <aside className="lg:sticky lg:top-28 self-start">
            <h2 className="font-display text-xl uppercase tracking-widest mb-6">Order Summary</h2>
            <ul className="space-y-4 mb-6 pb-6 border-b border-graphite">
              {intent.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-4 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="truncate uppercase tracking-wider text-xs">{it.name}</p>
                    <p className="text-ash text-xs mt-1">Qty {it.qty}</p>
                  </div>
                  <p className="text-bone font-display whitespace-nowrap">
                    {fmt(it.lineTotal, intent.currency.toUpperCase())}
                  </p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ash uppercase tracking-wider text-xs">Subtotal</span>
                <span>{fmt(intent.amount / 100, intent.currency.toUpperCase())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ash uppercase tracking-wider text-xs">Shipping</span>
                <span className="text-ash">Calculated at next step</span>
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t border-graphite">
                <span className="font-display uppercase tracking-widest">Total</span>
                <span className="font-display text-2xl text-gold">
                  {fmt(intent.amount / 100, intent.currency.toUpperCase())}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
