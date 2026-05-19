'use client';

import { useState } from 'react';

interface RestockNotifyProps {
  productSlug: string;
}

export function RestockNotify({ productSlug }: RestockNotifyProps) {
  const key = `corvo_restock_${productSlug}`;
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(() => {
    try { return !!localStorage.getItem(key); } catch { return false; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setError('Enter a valid email.'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    try { localStorage.setItem(key, email); } catch {}
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{
        padding: '1rem 1.25rem',
        border: '1px solid var(--accent)',
        background: 'rgba(var(--accent-rgb, 216,24,41), 0.05)',
      }}>
        <p style={{
          fontFamily: 'var(--font-rajdhani)',
          fontSize: '12px', fontWeight: 700,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '0.25rem',
        }}>
          You&apos;re on the list
        </p>
        <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
          We&apos;ll notify you the moment this item is back in stock.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.25rem',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      <p style={{
        fontFamily: 'var(--font-rajdhani)',
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.38em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '0.75rem',
      }}>
        Out of Stock — Notify Me
      </p>
      <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Enter your email and we&apos;ll let you know when it&apos;s available again.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            minWidth: '160px',
            padding: '0.7rem 1rem',
            background: 'var(--page-bg)',
            border: `1px solid ${error ? 'var(--accent)' : 'var(--border)'}`,
            color: 'var(--page-fg)',
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = error ? 'var(--accent)' : 'var(--border)')}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.7rem 1.25rem',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? '…' : 'Notify Me'}
        </button>
      </form>
      {error && (
        <p style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '0.4rem' }}>{error}</p>
      )}
    </div>
  );
}
