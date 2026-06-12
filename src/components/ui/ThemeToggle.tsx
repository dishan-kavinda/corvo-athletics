'use client';

import { useState } from 'react';

/* Diagonal-split swatch — gold (luxury) over crimson (savage).
   Clicking clears the aesthetic cookie and returns to the chooser. */
export function ThemeToggle() {
  const [hovered, setHovered] = useState(false);

  const goToChooser = () => {
    document.cookie = 'corvo_aesthetic=; path=/; max-age=0';
    window.location.href = '/';
  };

  return (
    <button
      onClick={goToChooser}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Switch aesthetic"
      title="Switch aesthetic"
      style={{
        position: 'relative',
        width: 26,
        height: 26,
        padding: 0,
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        background: 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        borderRadius: 0,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: '#9C7C26',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          opacity: 0.9,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FF2B3A',
          clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
          opacity: 0.9,
        }}
      />
    </button>
  );
}
