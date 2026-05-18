import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerMemberClient, type WixTokens } from '@/lib/wix-member-client';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return 'N/A';
  return new Intl.DateTimeFormat('en-NZ', { month: 'long', year: 'numeric' }).format(new Date(d as string));
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
    redirect('/account');
  }

  if (!member) redirect('/account');

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
    { label: 'Member Since', value: fmtDate(member._createdDate) },
    { label: 'Status', value: member.activityStatus === 'ACTIVE' ? 'Active' : 'Pending' },
  ];

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      style={{ background: '#07090F' }}
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
            color: '#CDD4EA',
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
          background: 'linear-gradient(90deg, transparent, #D81829 30%, #D81829 70%, transparent)',
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
              color: '#D81829',
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
              color: '#CDD4EA',
              letterSpacing: '-0.01em',
              maxWidth: '900px',
            }}
          >
            Welcome back,
            <br />
            <span style={{ color: '#D81829' }}>{fullName.toUpperCase()}.</span>
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
                    color: '#D81829',
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
                    color: '#838DAA',
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
              style={{ color: '#CDD4EA' }}
            >
              Sign Out
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
