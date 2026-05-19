'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('done');
  };

  return (
    <form onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-4 h-[1.5px]" style={{ background: 'var(--accent)' }} />
              <p
                style={{
                  fontFamily: 'var(--font-rajdhani)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                You&apos;re in.
              </p>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
              Welcome to the inner circle. First drops incoming.
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex flex-col gap-3">
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--page-fg)',
                  caretColor: 'var(--accent)',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-glow"
              style={{
                padding: '1rem 2rem',
                fontFamily: 'var(--font-anton)',
                fontSize: '0.875rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'var(--accent)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                transition: 'background 0.2s ease',
              }}
            >
              {status === 'loading' ? 'Joining…' : 'Join the Circle →'}
            </motion.button>

            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginTop: '0.25rem',
              }}
            >
              No spam. Just signal.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
