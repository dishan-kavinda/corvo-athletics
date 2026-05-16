import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Account',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Section className="min-h-[60vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto text-center">
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
            Account
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-6">
            Sign In
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
            Member accounts are coming soon. For now, your cart and orders are tied to this browser
            session.
          </p>
          <Button href="/shop" variant="primary" size="lg">
            Continue Shopping →
          </Button>
        </div>
      </Container>
    </Section>
  );
}
