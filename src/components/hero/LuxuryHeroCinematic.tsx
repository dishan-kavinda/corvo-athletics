'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { GoldFlourish } from '@/components/svg/GoldFlourish';
import { GoldBezel } from '@/components/svg/GoldBezel';
import { DustField } from '@/components/svg/DustField';

/* THE VAULT — pinned cinematic hero, Bond-title energy.
   The ivory invitation holds while a gold-rimmed iris opens from the
   center of the screen — gun-barrel style — and the darkness of the
   House swallows the viewport. Inside the dark: "Corvo. House of
   Corvo." in gold Bodoni italic. Then you're through, into the site.

   Hydration note: scroll-driven MotionValues attach to style only after
   mount (`dyn`) — the server renders the identical rest-state markup. */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const entrance = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

const CENTER: React.CSSProperties = {
  top: '50%',
  left: '50%',
  translateX: '-50%',
  translateY: '-50%',
} as React.CSSProperties;

export function LuxuryHeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /* Ivory phase */
  const contentScale = useTransform(p, [0, 0.45], [1, 1.07]);
  const contentOpacity = useTransform(p, [0.3, 0.52], [1, 0]);
  const contentY = useTransform(p, [0, 0.5], [0, -36]);
  const frameOpacity = useTransform(p, [0.25, 0.5], [1, 0]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const bezelScale = useTransform(p, [0, 0.6], [1, 1.55]);
  const bezelRotate = useTransform(p, [0, 1], [0, 70]);
  const bezelOpacity = useTransform(p, [0, 0.35, 0.6], [0.34, 0.4, 0]);

  /* Iris phase */
  const irisClip = useTransform(p, [0.4, 0.86], ['circle(0% at 50% 50%)', 'circle(80% at 50% 50%)']);
  const ringScale = useTransform(p, [0.4, 0.88], [0.02, 9]);
  const ringOpacity = useTransform(p, [0.4, 0.5, 0.88], [0, 1, 0]);
  const titleOpacity = useTransform(p, [0.68, 0.84], [0, 1]);
  const titleScale = useTransform(p, [0.68, 0.95], [0.96, 1.02]);

  const dyn = mounted;
  const pin: React.CSSProperties = dyn
    ? { position: 'sticky', top: 0, height: '100svh' }
    : { position: 'relative', minHeight: '100svh' };

  return (
    <section ref={ref} style={{ height: dyn ? '230vh' : 'auto', background: 'var(--page-bg)' }}>
      <div className="flex items-center justify-center overflow-hidden" style={pin}>
        {/* Invitation frames */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={
            dyn
              ? { inset: 'clamp(12px, 2.5vw, 28px)', border: '1px solid rgba(156,124,38,0.42)', opacity: frameOpacity }
              : { inset: 'clamp(12px, 2.5vw, 28px)', border: '1px solid rgba(156,124,38,0.42)' }
          }
        />
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={
            dyn
              ? { inset: 'clamp(22px, 3.8vw, 44px)', border: '1px solid rgba(156,124,38,0.16)', opacity: frameOpacity }
              : { inset: 'clamp(22px, 3.8vw, 44px)', border: '1px solid rgba(156,124,38,0.16)' }
          }
        />

        {/* Warm center light */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 42%, rgba(201,169,97,0.1) 0%, transparent 70%)' }}
        />

        {/* Rotating gold bezel — the House keeps time */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={
            dyn
              ? { ...CENTER, width: 'min(860px, 94vw)', aspectRatio: '1 / 1', scale: bezelScale, rotate: bezelRotate, opacity: bezelOpacity }
              : { ...CENTER, width: 'min(860px, 94vw)', aspectRatio: '1 / 1', opacity: 0.34 }
          }
        >
          <GoldBezel />
        </motion.div>

        {/* Periodic light sheen across the invitation */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              bottom: '-20%',
              left: 0,
              width: '34%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,252,240,0.0) 20%, rgba(232,204,122,0.16) 50%, rgba(255,252,240,0.0) 80%, transparent 100%)',
              animation: 'sheen-sweep 7.5s ease-in-out infinite',
            }}
          />
        </div>

        <DustField count={20} color="#9C7C26" />

        {/* Ivory content */}
        <motion.div
          className="relative text-center px-6"
          style={
            dyn
              ? { maxWidth: '880px', scale: contentScale, opacity: contentOpacity, y: contentY }
              : { maxWidth: '880px' }
          }
        >
          <motion.div {...entrance(0.05)}>
            <Logo height={38} style={{ color: 'var(--accent)', opacity: 0.75, margin: '0 auto 2.5rem' }} />
          </motion.div>

          <motion.p
            {...entrance(0.16)}
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '13px',
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '2.5rem',
            }}
          >
            The House of Corvo
          </motion.p>

          <motion.h1
            {...entrance(0.3)}
            className="font-display leading-[0.98] mb-8"
            style={{ fontSize: 'clamp(3.2rem, 9vw, 8rem)', letterSpacing: '0.005em' }}
          >
            <span className="block" style={{ color: 'var(--page-fg)' }}>The Pursuit</span>
            <span className="block text-gradient-gold" style={{ fontStyle: 'italic' }}>of Excellence.</span>
          </motion.h1>

          <motion.div {...entrance(0.5)}>
            <GoldFlourish width={240} style={{ margin: '0 auto 2.5rem' }} delay={0.4} />
          </motion.div>

          <motion.p
            {...entrance(0.6)}
            className="text-base leading-relaxed mx-auto mb-12"
            style={{ color: 'var(--muted)', maxWidth: '460px' }}
          >
            Meticulously crafted performance wear for athletes who understand
            that true excellence requires no compromise.
          </motion.p>

          <motion.div {...entrance(0.78)} className="flex flex-wrap gap-4 items-center justify-center">
            <Button href="/shop" size="lg" variant="primary">View the Collection →</Button>
            <Button href="/about" size="lg" variant="ghost">Our Story</Button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={dyn ? { bottom: '26px', opacity: cueOpacity } : { bottom: '26px' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '11px',
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            Scroll
          </p>
          <span
            aria-hidden
            style={{
              display: 'block',
              width: '1px',
              height: '36px',
              background: 'rgba(156,124,38,0.7)',
              animation: 'cue-drop 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          />
        </motion.div>

        {/* Gold iris rim — the gun barrel */}
        {dyn && (
          <motion.div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              ...CENTER,
              width: '20vmax',
              height: '20vmax',
              borderRadius: '50%',
              border: '2px solid rgba(201,169,97,0.85)',
              boxShadow: '0 0 30px rgba(201,169,97,0.45), inset 0 0 30px rgba(201,169,97,0.3)',
              scale: ringScale,
              opacity: ringOpacity,
            }}
          />
        )}

        {/* The dark of the House — irises open over the viewport */}
        {dyn && (
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{ background: '#14100A', clipPath: irisClip }}
          >
            <motion.div className="text-center px-6" style={{ opacity: titleOpacity, scale: titleScale }}>
              <Logo height={34} style={{ color: '#C9A961', opacity: 0.8, margin: '0 auto 2rem' }} />
              <p
                className="font-display"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
                  color: '#EDE6D6',
                  lineHeight: 1.1,
                }}
              >
                Corvo.
                <br />
                <span style={{ color: '#C9A961', fontStyle: 'italic' }}>House of Corvo.</span>
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '12px',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,169,97,0.7)',
                  marginTop: '2rem',
                }}
              >
                Members Only · Est. New Zealand
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
