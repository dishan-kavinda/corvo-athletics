'use client';

import { useState, useCallback } from 'react';

const T = 'flex 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease';

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

  const luxuryGrow = chosen === 'luxury' ? 10 : chosen === 'savage' ? 0 : hovered === 'luxury' ? 1.45 : hovered === 'savage' ? 0.55 : 1;
  const savageGrow = chosen === 'savage' ? 10 : chosen === 'luxury' ? 0 : hovered === 'savage' ? 1.45 : hovered === 'luxury' ? 0.55 : 1;

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
          transition: T,
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
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: '#B8962C', opacity: 0.5 }} />

        {/* Subtle dot-grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #B8962C 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }} />

        {/* Warm glow top-right */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: '55%', height: '55%',
          background: 'radial-gradient(circle, rgba(184,150,44,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '460px' }}>
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
              marginTop: '2.5rem',
              display: 'inline-block',
              fontFamily: 'var(--font-cormorant), "Playfair Display", Georgia, serif',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B8962C',
              background: 'transparent',
              border: '1px solid rgba(184,150,44,0.5)',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#B8962C';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,150,44,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,150,44,0.5)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
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
          opacity: 0.45,
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
          transition: T,
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
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, background: '#D81829', opacity: 0.7 }} />

        {/* Diagonal hatch texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'repeating-linear-gradient(135deg, #D81829 0px, #D81829 1px, transparent 0px, transparent 50%)',
          backgroundSize: '28px 28px',
        }} />

        {/* Glow from top-left */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(216,24,41,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '460px' }}>
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
              marginTop: '2.5rem',
              display: 'inline-block',
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: '#D81829',
              background: 'transparent',
              border: '1px solid rgba(216,24,41,0.4)',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#D81829';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(216,24,41,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(216,24,41,0.4)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            Enter the Arena →
          </button>
        </div>
      </div>
    </div>
  );
}
