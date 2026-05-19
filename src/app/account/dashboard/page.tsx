import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerMemberClient, type WixTokens } from '@/lib/wix-member-client';
import { getMemberOrders } from '@/lib/wix-orders';
import { Button } from '@/components/ui/Button';
import { fmtDate } from '@/lib/format';
import { FadeIn } from '@/components/motion/FadeIn';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function fmtDateLong(d: Date | string | null | undefined) {
  if (!d) return 'N/A';
  return fmtDate(d, { month: 'long', year: 'numeric' });
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const tokensRaw = cookieStore.get('wix_member_tokens')?.value;
  if (!tokensRaw) redirect('/account');

  let member: Awaited<ReturnType<ReturnType<typeof createServerMemberClient>['members']['getCurrentMember']>>['member'] | null = null;

  try {
    const tokens = JSON.parse(tokensRaw) as WixTokens;
    const client = createServerMemberClient(tokens);
    const res = await client.members.getCurrentMember();
    member = res.member ?? null;
  } catch {
    // Tokens invalid/expired — clear cookie then redirect to login
    redirect('/account/logout');
  }

  if (!member) redirect('/account/logout');

  const orders = await getMemberOrders(member.loginEmail ?? '').catch(() => []);

  const displayName =
    member.profile?.nickname ??
    member.contact?.firstName ??
    member.loginEmail?.split('@')[0] ??
    'Member';

  const fullName =
    [member.contact?.firstName, member.contact?.lastName].filter(Boolean).join(' ') ||
    displayName;

  const infoItems = [
    { label: 'Email', value: member.loginEmail ?? 'N/A' },
    { label: 'Member Since', value: fmtDateLong(member._createdDate) },
    { label: 'Status', value: member.activityStatus === 'ACTIVE' ? 'Active' : 'Pending' },
  ];

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      style={{ background: 'var(--page-bg)' }}
    >
      {/* Name watermark */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none"
        aria-hidden
      >
        <span
          className="font-display uppercase select-none"
          style={{
            fontSize: 'clamp(5rem, 16vw, 14rem)',
            color: 'var(--page-fg)',
            opacity: 0.025,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            paddingLeft: '2rem',
            whiteSpace: 'nowrap',
          }}
        >
          {displayName.toUpperCase()}
        </span>
      </div>

      {/* Crimson horizontal lines */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '14%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)',
          opacity: 0.15,
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-14 w-full pt-20 pb-28"
        style={{ maxWidth: '1440px' }}
      >
        {/* Eyebrow */}
        <HeroReveal delay={0.05}>
          <p
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '1.5rem',
            }}
          >
            ── Member
          </p>
        </HeroReveal>

        {/* Name headline */}
        <HeroReveal delay={0.18} y={50} duration={1.0}>
          <h1
            className="font-display uppercase leading-[0.88] mb-14"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 6.5rem)',
              color: 'var(--page-fg)',
              letterSpacing: '-0.01em',
              maxWidth: '900px',
            }}
          >
            Welcome back,
            <br />
            <span style={{ color: 'var(--accent)' }}>{fullName.toUpperCase()}.</span>
          </h1>
        </HeroReveal>

        {/* Info cards */}
        <Stagger staggerDelay={0.1} className="flex flex-col sm:flex-row gap-[1px] mb-14 max-w-2xl">
          {infoItems.map((item) => (
            <StaggerItem key={item.label} className="flex-1">
              <div
                className="py-7 px-6 h-full"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'var(--muted)',
                    wordBreak: 'break-all',
                  }}
                >
                  {item.value}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Actions */}
        <FadeIn delay={0.5}>
          <div className="flex flex-wrap gap-4">
            <Button href="/shop" variant="primary" size="lg">
              Browse Collection →
            </Button>
            {/* Plain anchor to prevent Next.js Link prefetch from triggering logout */}
            <a
              href="/account/logout"
              className="inline-flex items-center justify-center font-display uppercase tracking-wider transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99] cursor-pointer h-14 px-8 text-base border border-current hover:bg-blade hover:text-pure hover:border-blade"
              style={{ color: 'var(--page-fg)' }}
            >
              Sign Out
            </a>
          </div>
        </FadeIn>

        {/* Order history */}
        <FadeIn delay={0.65}>
          <div className="mt-20">
            <div
              className="flex items-center gap-4 mb-8"
              style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                ── Order History
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </span>
            </div>

            {orders.length === 0 ? (
              <div
                className="py-14 text-center"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
              >
                <p
                  className="font-display uppercase mb-2"
                  style={{ fontSize: '1.4rem', color: 'var(--muted)', letterSpacing: '0.04em' }}
                >
                  No orders yet
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  Your orders will appear here once placed.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-[1px]" style={{ background: 'var(--border)' }}>
                {orders.map((order) => {
                  const isPaid =
                    order.paymentStatus === 'PAID' || order.paymentStatus === 'FULLY_PAID';
                  const statusColor = isPaid ? '#00BDAC' : '#838DAA';
                  const statusLabel = isPaid
                    ? 'Paid'
                    : order.paymentStatus === 'PENDING'
                    ? 'Pending'
                    : order.paymentStatus === 'REFUNDED'
                    ? 'Refunded'
                    : order.paymentStatus;
                  const dateStr = order.createdDate ? fmtDate(order.createdDate) : null;

                  return (
                    <div
                      key={order.orderId}
                      style={{ background: 'var(--surface)', padding: '1.5rem 1.75rem' }}
                    >
                      {/* Order header row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-4">
                          <span
                            style={{
                              fontFamily: 'var(--font-rajdhani)',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.36em',
                              textTransform: 'uppercase',
                              color: 'var(--accent)',
                            }}
                          >
                            #{order.orderNumber}
                          </span>
                          {dateStr && (
                            <span
                              style={{
                                fontFamily: 'var(--font-rajdhani)',
                                fontSize: '11px',
                                letterSpacing: '0.18em',
                                color: 'var(--muted)',
                              }}
                            >
                              {dateStr}
                            </span>
                          )}
                          <span
                            style={{
                              fontFamily: 'var(--font-rajdhani)',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.28em',
                              textTransform: 'uppercase',
                              color: statusColor,
                              padding: '0.2rem 0.55rem',
                              border: `1px solid ${statusColor}`,
                            }}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <span
                          className="font-display"
                          style={{ fontSize: '1.1rem', color: 'var(--page-fg)' }}
                        >
                          {order.totalFormatted}
                        </span>
                      </div>

                      {/* Line items */}
                      <div className="flex flex-col gap-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '1.4rem',
                                  height: '1.4rem',
                                  background: 'var(--surface-elevated)',
                                  border: '1px solid var(--border)',
                                  fontFamily: 'var(--font-rajdhani)',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  color: 'var(--muted)',
                                  flexShrink: 0,
                                }}
                              >
                                {item.quantity}
                              </span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-rajdhani)',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  letterSpacing: '0.14em',
                                  textTransform: 'uppercase',
                                  color: 'var(--page-fg)',
                                }}
                              >
                                {item.name}
                              </span>
                            </div>
                            <span
                              style={{
                                fontFamily: 'var(--font-rajdhani)',
                                fontSize: '12px',
                                color: 'var(--muted)',
                                letterSpacing: '0.1em',
                              }}
                            >
                              {item.lineTotalFormatted}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
