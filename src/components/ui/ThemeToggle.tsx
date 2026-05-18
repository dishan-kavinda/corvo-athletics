'use client';

export function ThemeToggle() {
  const goToChooser = () => {
    document.cookie = 'corvo_aesthetic=; path=/; max-age=0';
    window.location.href = '/';
  };

  return (
    <button
      onClick={goToChooser}
      aria-label="Change aesthetic"
      title="Change aesthetic"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '5px 7px',
        border: '1px solid var(--border)',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        borderRadius: 0,
      }}
    >
      <span style={{ display: 'block', width: '6px', height: '14px', background: '#B8962C', opacity: 0.85 }} />
      <span style={{ display: 'block', width: '6px', height: '14px', background: '#D81829', opacity: 0.85 }} />
    </button>
  );
}
