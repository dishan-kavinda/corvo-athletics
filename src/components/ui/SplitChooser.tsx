'use client';

import { useState, useCallback } from 'react';

const PANEL_T = 'flex 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease';
const CONTENT_T = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease';

const BTN: React.CSSProperties = {
  marginTop: '2.5rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '48px',
  minWidth: '210px',
  padding: '0 2rem',
  fontWeight: 700,
  letterSpacing: '0.3em',
  fontSize: '11px',
  textTransform: 'uppercase',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'border-color 0.25s ease, background 0.25s ease, transform 0.2s ease',
};

export function SplitChooser() {
  const [hovered, setHovered] = useState<'savage' | 'luxury' | null>(null);
  const [chosen, setChosen] = useState<'savage' | 'luxury' | null>(null);

  const pick = useCallback(async (aesthetic: 'savage' | 'luxury') => {
    if (chosen) return;
    setChosen(aesthetic);
    await fetch('/api/set-aesthetic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aesthetic }),
    });
    setTimeout(() => { window.location.href = '/home'; }, 750);
  }, [chosen]);

  const luxuryGrow = chosen === 'luxury' ? 10 : chosen === 'savage' ? 0 : hovered === 'luxury' ? 1.5 : hovered === 'savage' ? 0.5 : 1;
  const savageGrow = chosen === 'savage' ? 10 : chosen === 'luxury' ? 0 : hovered === 'savage' ? 1.5 : hovered === 'luxury' ? 0.5 : 1;

  const luxuryDim  = !chosen && hovered === 'savage';
  const savageDim  = !chosen && hovered === 'luxury';
  const luxuryLift = !chosen && hovered === 'luxury';
  const savageLift = !chosen && hovered === 'savage';

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ height: '100svh', overflow: 'hidden' }}
    >
      {/* ── LUXURY (LEFT) ──────────────────────────── */}
      <div
        onClick={() => pick('luxury')}
        onMouseEnter={() => !chosen && setHovered('luxury')}
        onMouseLeave={() => setHovered(null)}
        style={{
          flexGrow: luxuryGrow,
          flexShrink: 1,
          flexBasis: 0,
          minHeight: '50svh',
          transition: PANEL_T,
          background: '#FAF7F0',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Gold left edge */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: '#B8962C', opacity: luxuryLift ? 0.9 : 0.5, transition: 'opacity 0.4s ease' }} />

        {/* Subtle dot-grid */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: luxuryLift ? 0.07 : 0.03,
          transition: 'opacity 0.4s ease',
          backgroundImage: 'radial-gradient(circle at 1px 1px, #B8962C 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }} />

        {/* Warm glow — intensifies on hover */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: '70%', height: '70%',
          background: 'radial-gradient(circle, rgba(184,150,44,0.12) 0%, transparent 70%)',
          opacity: luxuryLift ? 1 : 0.5,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }} />

        {/* Dim overlay when OTHER side is hovered */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(250,247,240,0.55)',
          opacity: luxuryDim ? 1 : 0,
          transition: 'opacity 0.45s ease',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          textAlign: 'center',
          maxWidth: '460px',
          transform: luxuryLift ? 'scale(1.04)' : luxuryDim ? 'scale(0.97)' : 'scale(1)',
          opacity: luxuryDim ? 0.45 : 1,
          transition: CONTENT_T,
        }}>
          <p style={{
            fontFamily: 'var(--font-cormorant), "Playfair Display", Georgia, serif',
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: '#B8962C',
            marginBottom: '2rem',
          }}>
            The House of Corvo
          </p>

          <h2 style={{
            fontFamily: 'var(--font-cormorant), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.8rem, 6.5vw, 6rem)',
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
            color: '#1A1008',
            marginBottom: '1.5rem',
          }}>
            Quality Needs<br />No<br />
            <span style={{ color: '#B8962C' }}>Introduction.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-cormorant), "Playfair Display", Georgia, serif',
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: '#8B7355',
          }}>
            The standard worth keeping.
          </p>

          <button
            onClick={(e) => { e.stopPropagation(); pick('luxury'); }}
            style={{
              ...BTN,
              fontFamily: 'var(--font-rajdhani), sans-serif',
              color: '#B8962C',
              border: '1px solid rgba(184,150,44,0.5)',
              transform: luxuryLift ? 'scale(1.04)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget;
              b.style.borderColor = '#B8962C';
              b.style.background = 'rgba(184,150,44,0.08)';
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget;
              b.style.borderColor = 'rgba(184,150,44,0.5)';
              b.style.background = 'transparent';
            }}
          >
            Enter the House →
          </button>
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────── */}
      <div
        className="h-px w-full md:h-full md:w-px"
        style={{
          flexShrink: 0,
          background: 'linear-gradient(to bottom, #B8962C 0%, #B8962C 45%, #D81829 55%, #D81829 100%)',
          opacity: hovered ? 0.7 : 0.45,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* ── SAVAGE (RIGHT) ─────────────────────────── */}
      <div
        onClick={() => pick('savage')}
        onMouseEnter={() => !chosen && setHovered('savage')}
        onMouseLeave={() => setHovered(null)}
        style={{
          flexGrow: savageGrow,
          flexShrink: 1,
          flexBasis: 0,
          minHeight: '50svh',
          transition: PANEL_T,
          background: '#07090F',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Crimson right edge */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, background: '#D81829', opacity: savageLift ? 1 : 0.7, transition: 'opacity 0.4s ease' }} />

        {/* Diagonal hatch texture */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: savageLift ? 0.07 : 0.035,
          transition: 'opacity 0.4s ease',
          backgroundImage: 'repeating-linear-gradient(135deg, #D81829 0px, #D81829 1px, transparent 0px, transparent 50%)',
          backgroundSize: '28px 28px',
        }} />

        {/* Glow — intensifies on hover */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '70%', height: '70%',
          background: 'radial-gradient(circle, rgba(216,24,41,0.14) 0%, transparent 70%)',
          opacity: savageLift ? 1 : 0.5,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }} />

        {/* Dim overlay when OTHER side is hovered */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(7,9,15,0.6)',
          opacity: savageDim ? 1 : 0,
          transition: 'opacity 0.45s ease',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          textAlign: 'center',
          maxWidth: '460px',
          transform: savageLift ? 'scale(1.04)' : savageDim ? 'scale(0.97)' : 'scale(1)',
          opacity: savageDim ? 0.45 : 1,
          transition: CONTENT_T,
        }}>
          <p style={{
            fontFamily: 'var(--font-rajdhani), sans-serif',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.52em',
            textTransform: 'uppercase',
            color: '#D81829',
            marginBottom: '2rem',
          }}>
            ── Corvo Athletic ──
          </p>

          <h2 style={{
            fontFamily: 'var(--font-anton), Anton, sans-serif',
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#CDD4EA',
            marginBottom: '1.5rem',
          }}>
            HUNT<br />WITHOUT<br />
            <span style={{ color: '#D81829' }}>MERCY.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-rajdhani), sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#47516B',
          }}>
            Raw. Athletic. No compromise.
          </p>

          <button
            onClick={(e) => { e.stopPropagation(); pick('savage'); }}
            style={{
              ...BTN,
              fontFamily: 'var(--font-rajdhani), sans-serif',
              color: '#D81829',
              border: '1px solid rgba(216,24,41,0.4)',
              transform: savageLift ? 'scale(1.04)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget;
              b.style.borderColor = '#D81829';
              b.style.background = 'rgba(216,24,41,0.08)';
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget;
              b.style.borderColor = 'rgba(216,24,41,0.4)';
              b.style.background = 'transparent';
            }}
          >
            Enter the Arena →
          </button>
        </div>
      </div>
    </div>
  );
}
