'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/layout/Logo';
import { EKGPulse } from '@/components/svg/EKGPulse';
import { Reticle } from '@/components/svg/Reticle';
import { GoldBezel } from '@/components/svg/GoldBezel';
import { DustField } from '@/components/svg/DustField';

/* THE THRESHOLD — the front door.
   Two living dimensions separated by a rift of energy. The savage void
   hums with a targeting array, scanlines, rising embers, and a headline
   that glitches; the ivory atelier keeps time with a rotating gold bezel,
   drifting dust, and passing light. Picking a side doesn't navigate —
   the chosen dimension SWALLOWS the screen first. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Ambient ember field (savage, always on) ─────────── */
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 4) % 94}%`,
  size: 1.5 + (i % 3),
  delay: (i * 0.47) % 4,
  duration: 3.6 + (i % 4) * 0.9,
  bright: i % 5 === 0,
}));

function EmberField() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            bottom: '4%',
            left: e.left,
            width: e.size,
            height: e.size,
            borderRadius: '50%',
            background: e.bright ? '#C8FF2E' : '#FF2B3A',
            boxShadow: `0 0 ${e.size * 3}px ${e.bright ? 'rgba(200,255,46,0.8)' : 'rgba(255,43,58,0.8)'}`,
            opacity: 0,
            '--dust-o': 0.85,
            animation: `dust-rise ${e.duration}s linear ${e.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── The rift seam — lightning on one edge, gold filament on the other ── */
function RiftSeam({ energized }: { energized: boolean }) {
  return (
    <div
      aria-hidden
      className="hidden md:block"
      style={{ position: 'relative', width: '14px', flexShrink: 0, zIndex: 10, background: 'transparent' }}
    >
      {/* Core seam */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: energized ? '2px' : '1.5px',
          marginLeft: '-1px',
          background: 'linear-gradient(to bottom, #9C7C26 0%, #C9A961 38%, #FF2B3A 62%, #D31E2C 100%)',
          boxShadow: energized
            ? '0 0 22px rgba(201,169,97,0.55), 0 0 22px rgba(255,43,58,0.55)'
            : '0 0 10px rgba(201,169,97,0.3), 0 0 10px rgba(255,43,58,0.3)',
          transition: 'box-shadow 0.4s ease, width 0.4s ease',
        }}
      />
      {/* Lightning arcs — flicker on the savage flank */}
      <svg
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        style={{ position: 'absolute', left: '-13px', top: 0, width: '40px', height: '100%', overflow: 'visible' }}
      >
        {[
          { d: 'M20,120 L31,160 L24,175 L36,230 L27,250', delay: '0s' },
          { d: 'M20,430 L9,470 L17,495 L5,560 L14,585', delay: '1.7s' },
          { d: 'M20,760 L33,800 L25,830 L35,890 L26,915', delay: '3.1s' },
        ].map((bolt, i) => (
          <path
            key={i}
            d={bolt.d}
            fill="none"
            stroke="#FF2B3A"
            strokeWidth="1.4"
            strokeLinejoin="bevel"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255,43,58,0.9))',
              animation: `bolt-flicker ${3.4 + i * 0.9}s steps(1) ${bolt.delay} infinite`,
              opacity: 0,
            }}
          />
        ))}
        {/* Gold filament — slow drifting shimmer on the luxury flank */}
        <path
          d="M20,0 C12,140 28,260 16,400 C8,520 26,650 15,800 C10,900 22,960 20,1000"
          fill="none"
          stroke="#C9A961"
          strokeWidth="0.9"
          pathLength={1}
          strokeDasharray="0.22 0.78"
          opacity="0.8"
          style={{
            filter: 'drop-shadow(0 0 3px rgba(201,169,97,0.7))',
            animation: 'ekg-run 7s linear infinite',
          }}
        />
      </svg>
    </div>
  );
}

/* ── Pick portals — the chosen dimension swallows the screen ── */
function SavagePortal() {
  return (
    <motion.div
      key="savage-portal"
      initial={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 80, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* screen shake */}
      <motion.div
        animate={{ x: [0, -7, 6, -4, 3, 0], y: [0, 4, -5, 3, -2, 0] }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* red detonation flash */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0.25] }}
          transition={{ duration: 0.55, times: [0, 0.35, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 72% 50%, rgba(255,43,58,0.95) 0%, rgba(211,30,44,0.6) 45%, rgba(5,5,6,0.9) 100%)',
          }}
        />
        {/* expanding rift */}
        <motion.div
          initial={{ scale: 0.001 }}
          animate={{ scale: 9 }}
          transition={{ duration: 1.05, ease: [0.7, 0, 0.84, 0] }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '72%',
            width: '40vmax',
            height: '40vmax',
            marginTop: '-20vmax',
            marginLeft: '-20vmax',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #050506 0%, #050506 52%, rgba(255,43,58,0.65) 66%, rgba(255,43,58,0.12) 80%, transparent 88%)',
          }}
        />
      </motion.div>
      <motion.p
        className="tech-label"
        initial={{ opacity: 0, letterSpacing: '0.3em' }}
        animate={{ opacity: 1, letterSpacing: '0.6em' }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          textAlign: 'center',
          color: '#F2F1EC',
          fontSize: '12px',
          fontWeight: 700,
        }}
      >
        Entering the Arena
      </motion.p>
    </motion.div>
  );
}

function LuxuryPortal() {
  return (
    <motion.div
      key="luxury-portal"
      initial={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 80, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* expanding espresso portal with gold rim */}
      <motion.div
        initial={{ scale: 0.001 }}
        animate={{ scale: 9 }}
        transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '28%',
          width: '40vmax',
          height: '40vmax',
          marginTop: '-20vmax',
          marginLeft: '-20vmax',
          borderRadius: '50%',
          background: '#14100A',
          boxShadow: '0 0 0 2px rgba(201,169,97,0.9), 0 0 60px rgba(201,169,97,0.5), inset 0 0 80px rgba(201,169,97,0.18)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{ position: 'absolute', left: 0, right: 0, top: '46%', textAlign: 'center' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            fontStyle: 'italic',
            color: '#C9A961',
          }}
        >
          Welcome to the House.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── Hover surge effects (kept from previous build, re-skinned) ── */
function FireSurge() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(to top, rgba(211,30,44,0.5) 0%, rgba(150,8,16,0.28) 40%, transparent 100%)',
      }} />
      {[0, 0.6].map((delay, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.6 + i * 0.4, delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            background: 'radial-gradient(ellipse 80% 55% at 50% 100%, rgba(255,43,58,0.4) 0%, transparent 70%)',
          }}
        />
      ))}
    </motion.div>
  );
}

function GoldSurge() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {[0, 0.8, 1.6].map((delay, i) => (
        <motion.div key={i}
          animate={{ scale: [0.15, 2.4], opacity: [0.7, 0] }}
          transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: '50%', top: '46%',
            width: '240px', height: '240px', borderRadius: '50%',
            border: '1px solid rgba(201,169,97,0.8)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <motion.div
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', left: '50%', top: '44%',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,204,122,0.5) 0%, rgba(156,124,38,0.15) 45%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  );
}

/* ── Shared button ───────────────────────────────────── */
const BTN: React.CSSProperties = {
  marginTop: '2.5rem',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: '48px', minWidth: '210px', padding: '0 2rem',
  fontFamily: 'var(--font-rajdhani), sans-serif',
  fontWeight: 700, letterSpacing: '0.3em', fontSize: '11px', textTransform: 'uppercase',
  background: 'transparent', cursor: 'pointer',
  transition: 'border-color 0.25s ease, background 0.25s ease',
};

/* ── Main component ──────────────────────────────────── */
export function SplitChooser() {
  const [hovered,       setHovered]       = useState<'savage' | 'luxury' | null>(null);
  const [chosen,        setChosen]        = useState<'savage' | 'luxury' | null>(null);
  const [mobileFocused, setMobileFocused] = useState<'savage' | 'luxury' | null>(null);
  const [isTouch,       setIsTouch]       = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  const pick = useCallback(async (aesthetic: 'savage' | 'luxury') => {
    if (chosen) return;
    setChosen(aesthetic);
    await fetch('/api/set-aesthetic', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aesthetic }),
    });
    setTimeout(() => { window.location.href = '/home'; }, 1250);
  }, [chosen]);

  const active       = isTouch ? mobileFocused : hovered;
  const luxuryActive = !chosen && active === 'luxury';
  const savageActive = !chosen && active === 'savage';
  const luxuryGrow   = chosen === 'luxury' ? 10 : chosen === 'savage' ? 0 : luxuryActive ? 1.55 : savageActive ? 0.45 : 1;
  const savageGrow   = chosen === 'savage' ? 10 : chosen === 'luxury' ? 0 : savageActive ? 1.55 : luxuryActive ? 0.45 : 1;

  const handlePanel = (side: 'luxury' | 'savage') => {
    if (chosen) return;
    if (isTouch) setMobileFocused(prev => prev === side ? null : side);
    else pick(side);
  };

  return (
    <div className="flex flex-col md:flex-row relative" style={{ height: '100svh', overflow: 'hidden' }}>

      {/* Threshold label — blends against both worlds */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
        style={{ top: 'clamp(14px, 3vh, 34px)', zIndex: 20, mixBlendMode: 'difference' }}
        aria-hidden
      >
        <p
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.58em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            opacity: 0.75,
          }}
        >
          Choose Your Dimension
        </p>
        <span style={{ display: 'block', width: '1px', height: '22px', background: 'rgba(255,255,255,0.5)' }} />
      </div>

      {/* ── LUXURY — the Atelier ─────────────────────── */}
      <motion.div
        onClick={() => handlePanel('luxury')}
        onHoverStart={() => !chosen && !isTouch && setHovered('luxury')}
        onHoverEnd={() => !isTouch && setHovered(null)}
        animate={{ flexGrow: luxuryGrow, opacity: savageActive ? 0.55 : 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          flexShrink: 1, flexBasis: 0, minHeight: '20svh',
          background: '#F4EFE4', cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Hairline frame */}
        <div aria-hidden style={{ position: 'absolute', inset: 'clamp(10px, 1.8vw, 22px)', border: '1px solid rgba(156,124,38,0.3)', pointerEvents: 'none' }} />

        {/* The House keeps time */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 'min(720px, 110%)', aspectRatio: '1 / 1', opacity: 0.35,
          }}
        >
          <GoldBezel />
        </div>

        <DustField count={14} color="#9C7C26" />

        {/* Passing light */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute', top: '-20%', bottom: '-20%', left: 0, width: '38%',
              background: 'linear-gradient(90deg, transparent, rgba(232,204,122,0.14) 50%, transparent)',
              animation: 'sheen-sweep 8.5s ease-in-out infinite',
            }}
          />
        </div>

        <AnimatePresence>{luxuryActive && <GoldSurge />}</AnimatePresence>

        {/* Content */}
        <motion.div
          animate={{ y: luxuryActive ? -12 : 0, scale: luxuryActive ? 1.04 : 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ position: 'relative', textAlign: 'center', maxWidth: '460px', zIndex: 1 }}
        >
          <Logo height={34} style={{ color: '#9C7C26', opacity: 0.6, margin: '0 auto 2.25rem' }} />
          <p style={{ fontFamily: 'var(--font-cormorant), "Bodoni MT", Georgia, serif', fontSize: 11, fontWeight: 400, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#9C7C26', marginBottom: '2rem' }}>
            The House of Corvo
          </p>
          <h2 style={{ fontFamily: 'var(--font-cormorant), "Bodoni MT", Georgia, serif', fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', fontWeight: 400, lineHeight: 0.92, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#1C150C', marginBottom: '1.5rem' }}>
            Grace<br />Under<br />
            <span className="text-gradient-gold" style={{ fontStyle: 'italic' }}>Pressure.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-cormorant), "Bodoni MT", Georgia, serif', fontSize: 16, fontWeight: 400, letterSpacing: '0.04em', color: '#6E5E45' }}>
            The standard worth keeping.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); pick('luxury'); }}
            style={{ ...BTN, color: '#9C7C26', border: '1px solid rgba(156,124,38,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9C7C26'; e.currentTarget.style.background = 'rgba(156,124,38,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(156,124,38,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Enter the House →
          </button>
        </motion.div>
      </motion.div>

      {/* ── THE RIFT ─────────────────────────────────── */}
      <RiftSeam energized={Boolean(hovered || mobileFocused)} />
      {/* Mobile divider */}
      <div
        aria-hidden
        className="md:hidden h-px w-full"
        style={{ flexShrink: 0, background: 'linear-gradient(to right, #9C7C26, #C9A961 40%, #FF2B3A 60%, #D31E2C)' }}
      />

      {/* ── SAVAGE — the Void ────────────────────────── */}
      <motion.div
        onClick={() => handlePanel('savage')}
        onHoverStart={() => !chosen && !isTouch && setHovered('savage')}
        onHoverEnd={() => !isTouch && setHovered(null)}
        animate={{ flexGrow: savageGrow, opacity: luxuryActive ? 0.55 : 1, backgroundColor: savageActive ? '#0B0506' : '#070708' }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          flexShrink: 1, flexBasis: 0, minHeight: '20svh', cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Scanlines */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)',
          }}
        />

        {/* Targeting array */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 'min(700px, 110%)', aspectRatio: '1 / 1', opacity: 0.14,
          }}
        >
          <Reticle />
        </div>

        <EmberField />

        {/* Heartbeat */}
        <div aria-hidden style={{ position: 'absolute', bottom: '6%', left: 0, right: 0, opacity: 0.5, pointerEvents: 'none' }}>
          <EKGPulse height={38} color="#FF2B3A" echoColor="#C8FF2E" />
        </div>

        <AnimatePresence>{savageActive && <FireSurge />}</AnimatePresence>

        {/* Content */}
        <motion.div
          animate={{ y: savageActive ? -12 : 0, scale: savageActive ? 1.04 : 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ position: 'relative', textAlign: 'center', maxWidth: '460px', zIndex: 1 }}
        >
          <Logo height={34} style={{ color: '#FFFFFF', opacity: 0.42, margin: '0 auto 2.25rem' }} />
          <p className="flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.52em', textTransform: 'uppercase', color: '#FF2B3A', marginBottom: '2rem' }}>
            Corvo Athletic <span className="live-dot" style={{ width: 5, height: 5 }} aria-hidden />
          </p>
          <h2
            className="glitch-burst"
            style={{ fontFamily: 'var(--font-anton), Anton, sans-serif', fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 400, lineHeight: 0.88, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#F2F1EC', marginBottom: '1.5rem' }}
          >
            HUNT<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #F2F1EC' }}>WITHOUT</span><br />
            <span className="text-gradient-blade">MERCY.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8F919C' }}>
            Raw. Athletic. No compromise.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); pick('savage'); }}
            style={{ ...BTN, color: '#FF2B3A', border: '1px solid rgba(255,43,58,0.4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF2B3A'; e.currentTarget.style.background = 'rgba(255,43,58,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,43,58,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Enter the Arena →
          </button>
        </motion.div>
      </motion.div>

      {/* ── Pick portals ─────────────────────────────── */}
      <AnimatePresence>
        {chosen === 'savage' && <SavagePortal />}
        {chosen === 'luxury' && <LuxuryPortal />}
      </AnimatePresence>
    </div>
  );
}
