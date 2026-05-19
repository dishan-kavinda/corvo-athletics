'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Fire data ───────────────────────────────────────────── */
const FLAMES = Array.from({ length: 16 }, (_, i) => ({
  left: `${-3 + i * 6.8}%`,
  width: 55 + (i * 23 + (i % 3) * 11) % 70,
  height: 110 + (i * 41 + (i % 4) * 19) % 140,
  delay: (i * 0.13) % 2.0,
  duration: 0.82 + (i % 6) * 0.16,
  blur: 9 + (i % 5) * 7,
  scaleV: 0.13 + (i % 5) * 0.055,
}));

const EMBERS = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 4.3 + 2) % 96}%`,
  bottom: 2 + (i % 6) * 2.5,
  size: 1.5 + (i % 3) * 1.2,
  delay: (i * 0.11) % 2.8,
  duration: 1.3 + ((i * 7) % 5) * 0.32,
  driftX: (i % 2 === 0 ? 1 : -1) * (6 + (i * 13) % 38),
  riseY: -(70 + (i * 29) % 170),
  bright: i % 4 === 0,
}));

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: 6 + ((i * 4.1 + i * i * 0.3) % 88),
  size: 2 + (i % 3),
  delay: i * 0.1,
  duration: 1.2 + (i % 5) * 0.22,
  driftX: (i % 2 === 0 ? 1 : -1) * (5 + (i * 13) % 30),
}));

/* ── Crimson fire (savage side) ──────────────────────────── */
function FireEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Persistent fire base gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%',
        background: 'linear-gradient(to top, rgba(210,35,0,0.85) 0%, rgba(180,10,0,0.62) 18%, rgba(140,0,0,0.32) 42%, rgba(80,0,0,0.1) 62%, transparent 100%)',
      }} />

      {/* Pulsing fire glow — three staggered pulses for living fire feel */}
      {[0, 0.7, 1.4].map((delay, i) => (
        <motion.div key={`glow-${i}`}
          animate={{ opacity: [0.35, 0.72, 0.35] }}
          transition={{ duration: 1.7 + i * 0.35, delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            background: 'radial-gradient(ellipse 80% 55% at 50% 100%, rgba(200,28,0,0.52) 0%, rgba(130,5,0,0.22) 45%, transparent 72%)',
          }}
        />
      ))}

      {/* Flame tongues */}
      {FLAMES.map((f, i) => (
        <motion.div key={`flame-${i}`}
          animate={{
            y: [0, -(f.height * 0.18), -(f.height * 0.07), -(f.height * 0.22), 0],
            scaleX: [1, 1 + f.scaleV, 1 - f.scaleV * 0.6, 1 + f.scaleV * 0.8, 1],
            scaleY: [1, 1.07, 0.94, 1.04, 1],
            opacity: [0.62, 0.9, 0.68, 0.94, 0.62],
          }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-6%',
            left: f.left,
            width: `${f.width}px`,
            height: `${f.height}px`,
            transformOrigin: 'bottom center',
            borderRadius: '50% 50% 35% 35% / 0% 0% 100% 100%',
            background: 'radial-gradient(ellipse 55% 45% at 50% 92%, rgba(255,130,0,0.95) 0%, rgba(225,45,0,0.82) 22%, rgba(190,15,0,0.6) 48%, rgba(130,0,0,0.22) 72%, transparent 100%)',
            filter: `blur(${f.blur}px)`,
          }}
        />
      ))}

      {/* Rising embers */}
      {EMBERS.map((e, i) => (
        <motion.div key={`ember-${i}`}
          animate={{
            y: [0, e.riseY],
            x: [0, e.driftX],
            opacity: [0, e.bright ? 1 : 0.8, 0.6, 0],
            scale: [0.3, 1, 0.7, 0.1],
          }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: `${e.bottom}%`,
            left: e.left,
            width: e.size,
            height: e.size,
            borderRadius: '50%',
            background: e.bright ? '#FFB020' : '#FF3800',
            boxShadow: `0 0 ${e.size * 3.5}px ${e.bright ? 'rgba(255,160,20,0.9)' : 'rgba(210,40,0,0.85)'}`,
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Gold aura (luxury side) ─────────────────────────────── */
function GoldAuraEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* Expanding concentric rings */}
      {[0, 0.75, 1.5].map((delay, i) => (
        <motion.div key={i}
          animate={{ scale: [0.15, 2.6], opacity: [0.75, 0] }}
          transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: '50%', top: '46%',
            width: '240px', height: '240px', borderRadius: '50%',
            border: '1px solid rgba(184,150,44,0.8)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Warm central pulse */}
      <motion.div
        animate={{ opacity: [0.07, 0.22, 0.07], scale: [0.85, 1.18, 0.85] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', left: '50%', top: '44%',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,200,70,0.45) 0%, rgba(184,150,44,0.15) 45%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Rising gold particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, -170], x: [0, p.driftX], opacity: [0, 1, 0.7, 0], scale: [0.3, 1, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', bottom: '8%', left: `${p.x}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            background: i % 4 === 0 ? '#F0D080' : '#C9A961',
            boxShadow: `0 0 ${p.size * 3}px rgba(201,169,97,0.9)`,
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Button style shared by both sides ───────────────────── */
const BTN: React.CSSProperties = {
  marginTop: '2.5rem',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: '48px', minWidth: '210px', padding: '0 2rem',
  fontFamily: 'var(--font-rajdhani), sans-serif',
  fontWeight: 700, letterSpacing: '0.3em', fontSize: '11px', textTransform: 'uppercase',
  background: 'transparent', cursor: 'pointer',
  transition: 'border-color 0.25s ease, background 0.25s ease',
};

/* ── Main component ──────────────────────────────────────── */
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
    setTimeout(() => { window.location.href = '/home'; }, 750);
  }, [chosen]);

  // On touch: tap expands the panel (mobileFocused); the button confirms pick.
  // On desktop: hover expands, click anywhere on panel picks.
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
    <div className="flex flex-col md:flex-row" style={{ height: '100svh', overflow: 'hidden' }}>

      {/* ── LUXURY ──────────────────────────────────── */}
      <motion.div
        onClick={() => handlePanel('luxury')}
        onHoverStart={() => !chosen && !isTouch && setHovered('luxury')}
        onHoverEnd={() => !isTouch && setHovered(null)}
        animate={{ flexGrow: luxuryGrow, opacity: savageActive ? 0.5 : 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          flexShrink: 1, flexBasis: 0, minHeight: '20svh',
          background: '#FAF7F0', cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Static decorative elements */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: '#B8962C', opacity: 0.5 }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #B8962C 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }} />

        {/* Animated gold aura */}
        <AnimatePresence>{luxuryActive && <GoldAuraEffect />}</AnimatePresence>

        {/* Content */}
        <motion.div
          animate={{ y: luxuryActive ? -12 : 0, scale: luxuryActive ? 1.04 : 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ position: 'relative', textAlign: 'center', maxWidth: '460px', zIndex: 1 }}
        >
          <p style={{ fontFamily: 'var(--font-cormorant), "Bodoni MT", Georgia, serif', fontSize: 11, fontWeight: 400, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#B8962C', marginBottom: '2rem' }}>
            The House of Corvo
          </p>
          <h2 style={{ fontFamily: 'var(--font-cormorant), "Bodoni MT", Georgia, serif', fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', fontWeight: 400, lineHeight: 0.92, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#1A1008', marginBottom: '1.5rem' }}>
            Grace<br />Under<br />
            <span style={{ color: '#B8962C' }}>Pressure.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-cormorant), "Bodoni MT", Georgia, serif', fontSize: 16, fontWeight: 400, letterSpacing: '0.04em', color: '#8B7355' }}>
            The standard worth keeping.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); pick('luxury'); }}
            style={{ ...BTN, color: '#B8962C', border: '1px solid rgba(184,150,44,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#B8962C'; e.currentTarget.style.background = 'rgba(184,150,44,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(184,150,44,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Enter the House →
          </button>
        </motion.div>
      </motion.div>

      {/* ── DIVIDER ─────────────────────────────────── */}
      <motion.div
        className="h-px w-full md:h-full md:w-px"
        animate={{ opacity: (hovered || mobileFocused) ? 0.8 : 0.4 }}
        transition={{ duration: 0.3 }}
        style={{ flexShrink: 0, background: 'linear-gradient(to bottom, #B8962C 0%, #B8962C 45%, #D81829 55%, #D81829 100%)' }}
      />

      {/* ── SAVAGE ──────────────────────────────────── */}
      <motion.div
        onClick={() => handlePanel('savage')}
        onHoverStart={() => !chosen && !isTouch && setHovered('savage')}
        onHoverEnd={() => !isTouch && setHovered(null)}
        animate={{ flexGrow: savageGrow, opacity: luxuryActive ? 0.5 : 1, backgroundColor: savageActive ? '#0C0418' : '#07090F' }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          flexShrink: 1, flexBasis: 0, minHeight: '20svh', cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Static decorative elements */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, background: '#D81829', opacity: 0.7 }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'repeating-linear-gradient(135deg, #D81829 0px, #D81829 1px, transparent 0px, transparent 50%)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(216,24,41,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Crimson fire */}
        <AnimatePresence>{savageActive && <FireEffect />}</AnimatePresence>

        {/* Content */}
        <motion.div
          animate={{ y: savageActive ? -12 : 0, scale: savageActive ? 1.04 : 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ position: 'relative', textAlign: 'center', maxWidth: '460px', zIndex: 1 }}
        >
          <p style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.52em', textTransform: 'uppercase', color: '#D81829', marginBottom: '2rem' }}>
            ── Corvo Athletic ──
          </p>
          <h2 style={{ fontFamily: 'var(--font-anton), Anton, sans-serif', fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 400, lineHeight: 0.88, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#CDD4EA', marginBottom: '1.5rem' }}>
            HUNT<br />WITHOUT<br />
            <span style={{ color: '#D81829' }}>MERCY.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#47516B' }}>
            Raw. Athletic. No compromise.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); pick('savage'); }}
            style={{ ...BTN, color: '#D81829', border: '1px solid rgba(216,24,41,0.4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D81829'; e.currentTarget.style.background = 'rgba(216,24,41,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(216,24,41,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Enter the Arena →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
