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
import { fmtMoney } from '@/lib/format';

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

const fmt = fmtMoney;

const label: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-rajdhani)',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '0.5rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  padding: '0 1rem',
  background: 'var(--surface-elevated)',
  border: '1px solid var(--border)',
  color: 'var(--page-fg)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

function Field({
  lbl,
  children,
  span2 = false,
}: {
  lbl: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label style={label}>{lbl}</label>
      {children}
    </div>
  );
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; props.onFocus?.(e); }}
      onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border)'; props.onBlur?.(e); }}
    />
  );
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)' }}>
        {n}
      </span>
      <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <span className="font-display uppercase tracking-widest text-sm">{title}</span>
    </div>
  );
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
  const stripe     = useStripe();
  const elements   = useElements();
  const router     = useRouter();
  const { clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr]               = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErr(null);
    setSubmitting(true);
    try {
      const { error: submitErr } = await elements.submit();
      if (submitErr) { setErr(submitErr.message ?? 'Payment details invalid.'); return; }

      const { error: payErr, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: intent.clientSecret,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: {
              email:   shipping.email,
              name:    `${shipping.firstName} ${shipping.lastName}`.trim(),
              phone:   shipping.phone || undefined,
              address: {
                line1:       shipping.addressLine1,
                line2:       shipping.addressLine2 || undefined,
                city:        shipping.city,
                postal_code: shipping.postalCode,
                country:     shipping.country,
                state:       shipping.state || undefined,
              },
            },
          },
        },
      });

      if (payErr) { setErr(payErr.message ?? 'Payment failed.'); return; }
      if (paymentIntent?.status === 'succeeded') {
        const result = await completeCheckoutOrder({
          paymentIntentId: paymentIntent.id,
          lines: cartLines,
          shipping: {
            email:        shipping.email,
            firstName:    shipping.firstName,
            lastName:     shipping.lastName,
            phone:        shipping.phone || undefined,
            addressLine1: shipping.addressLine1,
            addressLine2: shipping.addressLine2 || undefined,
            city:         shipping.city,
            postalCode:   shipping.postalCode,
            country:      shipping.country,
            state:        shipping.state || undefined,
          },
        });
        await clearCart();
        router.push(`/thank-you?orderId=${encodeURIComponent(result.orderId)}`);
      }
    } catch (e: unknown) {
      console.error('[checkout]', e);
      setErr(e instanceof Error ? e.message : 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  };

  const upd = <K extends keyof ShippingForm>(k: K, v: ShippingForm[K]) =>
    setShipping((s) => ({ ...s, [k]: v }));

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* ── Contact ── */}
      <section>
        <SectionHead n="01" title="Contact" />
        <Field lbl="Email">
          <StyledInput type="email" required value={shipping.email}
            onChange={(e) => upd('email', e.target.value)} placeholder="you@email.com" />
        </Field>
      </section>

      {/* ── Shipping ── */}
      <section>
        <SectionHead n="02" title="Shipping Address" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field lbl="First Name">
            <StyledInput required value={shipping.firstName} onChange={(e) => upd('firstName', e.target.value)} />
          </Field>
          <Field lbl="Last Name">
            <StyledInput required value={shipping.lastName} onChange={(e) => upd('lastName', e.target.value)} />
          </Field>
          <Field lbl="Street Address" span2>
            <StyledInput required value={shipping.addressLine1}
              onChange={(e) => upd('addressLine1', e.target.value)} placeholder="123 Example St" />
          </Field>
          <Field lbl="Apartment / Suite (optional)" span2>
            <StyledInput value={shipping.addressLine2} onChange={(e) => upd('addressLine2', e.target.value)} />
          </Field>
          <Field lbl="City">
            <StyledInput required value={shipping.city} onChange={(e) => upd('city', e.target.value)} />
          </Field>
          <Field lbl="Postal Code">
            <StyledInput required value={shipping.postalCode} onChange={(e) => upd('postalCode', e.target.value)} />
          </Field>
          <Field lbl="State / Region (optional)">
            <StyledInput value={shipping.state} onChange={(e) => upd('state', e.target.value)} />
          </Field>
          <Field lbl="Country Code">
            <StyledInput required value={shipping.country} maxLength={2}
              onChange={(e) => upd('country', e.target.value.toUpperCase())} />
          </Field>
          <Field lbl="Phone (optional)" span2>
            <StyledInput type="tel" value={shipping.phone} onChange={(e) => upd('phone', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* ── Payment ── */}
      <section>
        <SectionHead n="03" title="Payment" />
        <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem' }}>
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>
      </section>

      {err && (
        <div style={{ border: '1px solid rgba(216,24,41,0.4)', background: 'rgba(216,24,41,0.08)', padding: '1rem', fontSize: '0.875rem', color: '#FF6070' }}>
          {err}
        </div>
      )}

      <Button variant="primary" size="lg" className="w-full" disabled={submitting || !stripe}>
        {submitting ? 'Processing…' : `Pay ${fmt(intent.amount / 100, intent.currency.toUpperCase())}`}
      </Button>
    </form>
  );
}

export function CheckoutForm() {
  const { cart, itemCount, cartLoading } = useCart();
  const [intent, setIntent]       = useState<CreatePaymentIntentResult | null>(null);
  const [shipping, setShipping]   = useState<ShippingForm>(initialShipping);
  const [initError, setInitError] = useState<string | null>(null);

  const cartLines = useMemo(
    () =>
      (cart?.lineItems ?? []).map((li) => ({
        productId: li.catalogReference?.catalogItemId ?? '',
        quantity:  li.quantity ?? 1,
        variantId: (li.catalogReference?.options as { variantId?: string } | undefined)?.variantId,
      })),
    [cart],
  );

  const stripePromise = useMemo(() => {
    try { return getStripe(); } catch { return null; }
  }, []);

  useEffect(() => {
    if (!cartLines.length || intent) return;
    createCheckoutPaymentIntent(cartLines)
      .then(setIntent)
      .catch((e: unknown) => setInitError(e instanceof Error ? e.message : String(e)));
  }, [cartLines, intent]);

  /* ── Cart still loading from server ── */
  if (cartLoading) {
    return (
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <div className="text-center">
            <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Loading…
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  /* ── Empty cart ── */
  if (itemCount === 0) {
    return (
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>
              Cart
            </p>
            <h1 className="font-display text-4xl uppercase tracking-tight mb-6">Empty</h1>
            <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
              Add something to your cart before checkout.
            </p>
            <Button href="/shop" variant="primary" size="lg">Shop the Range</Button>
          </div>
        </Container>
      </Section>
    );
  }

  /* ── Init error ── */
  if (initError) {
    return (
      <Section>
        <Container>
          <div className="max-w-md mx-auto py-20">
            <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
              Checkout
            </p>
            <h1 className="font-display text-3xl uppercase tracking-tight mb-6">Couldn&apos;t start checkout</h1>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{initError}</p>
          </div>
        </Container>
      </Section>
    );
  }

  /* ── Loading ── */
  if (!intent || !stripePromise) {
    return (
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <div className="text-center">
            <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Loading checkout…
            </p>
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
        colorPrimary:    '#D81829',
        colorBackground: '#131825',
        colorText:       '#E8ECF4',
        colorDanger:     '#FF6070',
        fontFamily:      'var(--font-rajdhani), sans-serif',
        borderRadius:    '0px',
        spacingUnit:     '4px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#0C0F1B',
          border:          '1px solid #1B2038',
          color:           '#E8ECF4',
        },
        '.Input:focus': {
          border:     '1px solid #D81829',
          boxShadow:  '0 0 0 1px #D81829',
        },
        '.Label': {
          textTransform: 'uppercase',
          letterSpacing: '0.28em',
          fontSize:      '10px',
          color:         '#6B7494',
          fontFamily:    'var(--font-rajdhani), sans-serif',
          fontWeight:    '700',
        },
        '.Tab': {
          border:          '1px solid #1B2038',
          backgroundColor: '#0C0F1B',
        },
        '.Tab--selected': {
          border:          '1px solid #D81829',
          backgroundColor: '#0C0F1B',
        },
      },
    },
  };

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="mb-12">
          <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            Checkout
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight">
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14">
          {/* ── Form ── */}
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

          {/* ── Order Summary ── */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>
                Order Summary
              </p>

              <ul className="space-y-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                {intent.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="truncate uppercase tracking-wider text-xs">{it.name}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Qty {it.qty}</p>
                    </div>
                    <p className="font-display whitespace-nowrap">
                      {fmt(it.lineTotal, intent.currency.toUpperCase())}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Subtotal
                  </span>
                  <span>{fmt(intent.amount / 100, intent.currency.toUpperCase())}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Shipping
                  </span>
                  <span style={{ color: 'var(--muted)' }}>Calculated at next step</span>
                </div>
                <div className="flex justify-between pt-4 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="font-display uppercase tracking-widest text-sm">Total</span>
                  <span className="font-display text-2xl" style={{ color: 'var(--accent)' }}>
                    {fmt(intent.amount / 100, intent.currency.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
