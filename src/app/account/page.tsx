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
          <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-6">Account</p>
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-6">
            Sign In
          </h1>
          <p className="text-ash mb-10">
            Member accounts are coming soon. For now, your cart and orders are tied to this browser
            session.
          </p>
          <Button href="/shop" variant="gold" size="lg">
            Continue Shopping
          </Button>
        </div>
      </Container>
    </Section>
  );
}
