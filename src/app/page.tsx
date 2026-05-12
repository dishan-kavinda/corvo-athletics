import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { HeroReveal } from '@/components/motion/HeroReveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

export default function Home() {
  return (
    <>
      <Section className="min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,97,0.08),transparent_50%)] pointer-events-none" />
        <Container className="relative">
          <div className="max-w-4xl">
            <HeroReveal delay={0.1} y={15}>
              <p className="text-gold font-display tracking-[0.4em] uppercase text-xs mb-6">
                Engineered for Athletes
              </p>
            </HeroReveal>
            <HeroReveal delay={0.25} y={40} duration={0.9}>
              <h1 className="font-display text-6xl md:text-8xl lg:text-[10rem] tracking-tight uppercase leading-[0.9] mb-8">
                Performance.
                <br />
                <span className="text-gold">Refined.</span>
              </h1>
            </HeroReveal>
            <HeroReveal delay={0.55}>
              <p className="text-ash text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                Premium protein, supplements, and training apparel for those who don&apos;t accept
                average.
              </p>
            </HeroReveal>
            <HeroReveal delay={0.75}>
              <div className="flex flex-wrap gap-4">
                <Button href="/shop" size="lg" variant="gold">
                  Shop Now
                </Button>
                <Button href="/about" size="lg" variant="ghost">
                  Our Story
                </Button>
              </div>
            </HeroReveal>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-graphite">
        <Container>
          <Stagger
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left"
          >
            <StaggerItem>
              <p className="font-display text-5xl text-gold mb-3">01</p>
              <h3 className="font-display uppercase tracking-widest text-sm mb-2">Lab Tested</h3>
              <p className="text-ash text-sm leading-relaxed">
                Every batch independently verified for purity and potency. No hidden fillers.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-5xl text-gold mb-3">02</p>
              <h3 className="font-display uppercase tracking-widest text-sm mb-2">
                Athlete Formulated
              </h3>
              <p className="text-ash text-sm leading-relaxed">
                Built with strength coaches and competitive athletes. Real-world performance.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-5xl text-gold mb-3">03</p>
              <h3 className="font-display uppercase tracking-widest text-sm mb-2">No Compromise</h3>
              <p className="text-ash text-sm leading-relaxed">
                Premium ingredients, premium materials, premium build. The way it should be.
              </p>
            </StaggerItem>
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
