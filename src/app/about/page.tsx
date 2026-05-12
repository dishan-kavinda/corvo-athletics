import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'About — Corvo Athletics',
  description: 'Engineered for athletes who refuse average.',
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-12 pb-0">
        <Container>
          <div className="max-w-3xl">
            <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-6">
              The Brand
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.95] mb-10">
              No
              <br />
              <span className="text-gold">Compromise.</span>
            </h1>
            <p className="text-ash text-lg leading-relaxed mb-6">
              Corvo Athletics was built for one reason: the gear and fuel athletes deserved didn&apos;t
              exist. Cheap supplements, generic apparel, hollow promises — we were tired of it.
            </p>
            <p className="text-ash text-lg leading-relaxed">
              Every product carries our name because we built it, tested it, and stand behind it.
              Lab-verified ingredients. Fabrics that move with you. Designs that mean something.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-graphite mt-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="font-display text-7xl text-gold mb-4">01</p>
              <h2 className="font-display text-2xl uppercase tracking-widest mb-4">
                Lab Tested. Every Batch.
              </h2>
              <p className="text-ash leading-relaxed">
                We don&apos;t guess. Independent third-party labs verify the purity, potency, and
                composition of every supplement we ship. The full certificate of analysis is
                available for any product on request.
              </p>
            </div>
            <div>
              <p className="font-display text-7xl text-gold mb-4">02</p>
              <h2 className="font-display text-2xl uppercase tracking-widest mb-4">
                Built by Athletes.
              </h2>
              <p className="text-ash leading-relaxed">
                Our formulas and apparel are designed with strength coaches and competitive
                athletes. If it doesn&apos;t hold up in the gym, on the track, or in the cage, it
                doesn&apos;t carry our name.
              </p>
            </div>
            <div>
              <p className="font-display text-7xl text-gold mb-4">03</p>
              <h2 className="font-display text-2xl uppercase tracking-widest mb-4">
                Premium. Always.
              </h2>
              <p className="text-ash leading-relaxed">
                Cold-pressed isolates. Brushed performance knits. Heavy-duty zippers and stitching
                that lasts. We won&apos;t compete on price by cutting corners.
              </p>
            </div>
            <div>
              <p className="font-display text-7xl text-gold mb-4">04</p>
              <h2 className="font-display text-2xl uppercase tracking-widest mb-4">
                Engineered Forever.
              </h2>
              <p className="text-ash leading-relaxed">
                Trends fade. Real performance gear doesn&apos;t. Our apparel is built to outlast
                seasons. Our supplements are built to deliver. Every detail, intentional.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-graphite">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-6">
              Train Harder.
              <br />
              <span className="text-gold">Recover Smarter.</span>
            </h2>
            <p className="text-ash mb-10">
              See what we&apos;ve built. Every product engineered for athletes who don&apos;t quit.
            </p>
            <Button href="/shop" variant="gold" size="lg">
              Shop the Range
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
