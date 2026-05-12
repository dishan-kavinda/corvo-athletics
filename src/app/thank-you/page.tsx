import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
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
