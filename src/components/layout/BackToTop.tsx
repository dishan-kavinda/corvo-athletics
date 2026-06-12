'use client';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group flex items-center gap-3 cursor-pointer"
      style={{ background: 'transparent', border: 'none', padding: 0 }}
      aria-label="Back to top"
    >
      <span
        className="flex items-center justify-center transition-colors duration-300"
        style={{
          width: 34,
          height: 34,
          border: '1px solid var(--footer-border)',
          color: 'var(--footer-muted)',
        }}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:-translate-y-0.5"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
      <span
        style={{
          fontFamily: 'var(--font-rajdhani)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: 'var(--footer-muted)',
        }}
      >
        Top
      </span>
    </button>
  );
}
