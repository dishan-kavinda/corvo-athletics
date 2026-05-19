'use client';

import { useState } from 'react';
import { SizeGuideModal } from './SizeGuideModal';

export function SizeGuideButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-rajdhani)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          background: 'transparent',
          border: '1px solid var(--accent)',
          padding: '0.25rem 0.55rem',
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
      >
        Size Guide
      </button>
      <SizeGuideModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
