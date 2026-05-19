import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Account',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get('wix_member_tokens')?.value) redirect('/account/dashboard');

  const { error } = await searchParams;

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      style={{ background: 'var(--page-bg)' }}
    >
      {/* Background watermark */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none"
        aria-hidden
      >
        <span
          className="font-display uppercase select-none"
          style={{
            fontSize: 'clamp(7rem, 20vw, 18rem)',
            color: 'var(--page-fg)',
            opacity: 0.025,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            paddingLeft: '2rem',
            whiteSpace: 'nowrap',
          }}
        >
          ACCOUNT
        </span>
      </div>

      {/* Diagonal slash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(135deg, transparent 0%, transparent 49.5%, rgba(216,24,41,0.08) 49.5%, rgba(216,24,41,0.08) 50.5%, transparent 50.5%)',
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-14 w-full py-24"
        style={{ maxWidth: '1440px' }}
      >
        <HeroReveal delay={0.08}>
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
            ── Corvo Athletic
          </p>
        </HeroReveal>

        <HeroReveal delay={0.2} y={50} duration={1.0}>
          <h1
            className="font-display uppercase leading-[0.88] mb-12"
            style={{
              fontSize: 'clamp(3rem, 9vw, 8rem)',
              color: 'var(--page-fg)',
              letterSpacing: '-0.01em',
              maxWidth: '700px',
            }}
          >
            YOUR
            <br />
            <span style={{ color: 'var(--accent)' }}>ACCOUNT.</span>
          </h1>
        </HeroReveal>

        {error && (
          <FadeIn>
            <div
              className="mb-8 px-5 py-4 text-sm"
              style={{
                border: '1px solid rgba(216,24,41,0.4)',
                background: 'rgba(216,24,41,0.08)',
                color: '#FF6070',
                maxWidth: '480px',
                fontFamily: 'var(--font-rajdhani)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Something went wrong. Please try again.
            </div>
          </FadeIn>
        )}

        {/* Sign In / Create Account cards */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-[1px] max-w-2xl">
            {/* Sign In */}
            <div
              className="flex-1 p-8 md:p-10"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '1rem',
                }}
              >
                01
              </p>
              <h2
                className="font-display uppercase leading-none mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--page-fg)' }}
              >
                Sign In
              </h2>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: 'var(--muted)' }}
              >
                Access your orders, saved preferences, and member perks.
              </p>
              <Button href="/account/login" variant="primary" size="md">
                Sign In →
              </Button>
            </div>

            {/* Create Account */}
            <div
              className="flex-1 p-8 md:p-10"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '1rem',
                }}
              >
                02
              </p>
              <h2
                className="font-display uppercase leading-none mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--page-fg)' }}
              >
                New Here?
              </h2>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: 'var(--muted)' }}
              >
                Create a Corvo account for early drops, order tracking, and member exclusives.
              </p>
              <Button href="/account/register" variant="outline" size="md">
                Create Account →
              </Button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <p
            className="mt-10"
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Secured by Wix Identity
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
