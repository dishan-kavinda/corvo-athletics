import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { AuthForm } from '@/components/ui/AuthForm';

export const metadata = {
  title: 'Create Account — Corvo Athletic',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const cookieStore = await cookies();
  if (cookieStore.get('wix_member_tokens')?.value) redirect('/account/dashboard');

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
          JOIN US
        </span>
      </div>

      {/* Diagonal slash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(135deg, transparent 0%, transparent 49.5%, rgba(255,43,58,0.08) 49.5%, rgba(255,43,58,0.08) 50.5%, transparent 50.5%)',
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-14 w-full py-24"
        style={{ maxWidth: '1440px' }}
      >
        <HeroReveal delay={0.1} y={20}>
          <AuthForm mode="register" />
        </HeroReveal>
      </div>
    </section>
  );
}
