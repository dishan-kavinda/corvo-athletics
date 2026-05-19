'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const sizes = [
  { size: 'XS', chest: '80–85', waist: '63–68', hips: '87–92', inseam: '74' },
  { size: 'S',  chest: '86–91', waist: '69–74', hips: '93–98', inseam: '76' },
  { size: 'M',  chest: '92–97', waist: '75–80', hips: '99–104', inseam: '78' },
  { size: 'L',  chest: '98–103', waist: '81–86', hips: '105–110', inseam: '80' },
  { size: 'XL', chest: '104–109', waist: '87–92', hips: '111–116', inseam: '80' },
  { size: '2XL', chest: '110–116', waist: '93–99', hips: '117–122', inseam: '81' },
];

const tips = [
  { label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
  { label: 'Waist', desc: 'Measure around your natural waistline, just above your belly button.' },
  { label: 'Hips', desc: 'Measure around the fullest part of your hips and seat.' },
  { label: 'Inseam', desc: 'Measure from the crotch seam to the bottom of your leg.' },
];

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [mounted, setMounted] = useState(false);
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  const convert = (val: string) => {
    if (unit === 'cm') return val;
    return val.split('–').map((v) => (parseFloat(v) / 2.54).toFixed(1)).join('–');
  };

  const modal = (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size Guide"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -48%)',
          width: '90vw',
          maxWidth: '640px',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease, transform 300ms ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            position: 'sticky', top: 0,
            background: 'var(--surface)',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'block', width: '1rem', height: '1.5px', background: 'var(--accent)' }} />
            <h2 style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '13px', fontWeight: 700,
              letterSpacing: '0.38em', textTransform: 'uppercase',
              color: 'var(--page-fg)',
            }}>
              Size Guide
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setUnit(unit === 'cm' ? 'in' : 'cm')}
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid var(--accent)',
                padding: '0.3rem 0.6rem',
                cursor: 'pointer',
              }}
            >
              {unit === 'cm' ? 'IN' : 'CM'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Size table */}
          <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Size', 'Chest', 'Waist', 'Hips', 'Inseam'].map((col) => (
                    <th
                      key={col}
                      style={{
                        fontFamily: 'var(--font-rajdhani)',
                        fontSize: '10px', fontWeight: 700,
                        letterSpacing: '0.32em', textTransform: 'uppercase',
                        color: 'var(--muted)',
                        padding: '0.5rem 0.75rem',
                        textAlign: 'left',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col} {col !== 'Size' ? `(${unit})` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizes.map((row, i) => (
                  <tr
                    key={row.size}
                    style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(128,128,128,0.04)' }}
                  >
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-rajdhani)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>
                      {row.size}
                    </td>
                    {[row.chest, row.waist, row.hips, row.inseam].map((val, j) => (
                      <td
                        key={j}
                        style={{
                          padding: '0.75rem', fontFamily: 'var(--font-rajdhani)',
                          fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em',
                          color: 'var(--page-fg)',
                          borderBottom: '1px solid var(--border)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {convert(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to measure */}
          <p style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.38em', textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: '1rem',
          }}>
            How to Measure
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tips.map((tip) => (
              <div key={tip.label} style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--page-fg)', minWidth: '3.5rem', paddingTop: '1px',
                }}>
                  {tip.label}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>

          <p style={{
            marginTop: '1.5rem',
            fontSize: '11px', color: 'var(--muted)',
            lineHeight: 1.6,
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem',
          }}>
            Between sizes? We recommend sizing up for a relaxed fit or staying true to size for a performance fit.
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
