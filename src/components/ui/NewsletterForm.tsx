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
    // Simulate API call — replace with real endpoint later
    await new Promise((r) => setTimeout(r, 900));
    setStatus('done');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm tracking-[0.2em] uppercase w-full text-center py-4"
            style={{ color: '#7B5FFF' }}
          >
            ✓ You&apos;re in the inner circle.
          </motion.p>
        ) : (
          <motion.div key="form" className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-4 text-sm outline-none rounded-xl"
              style={{
                background: 'rgba(123,95,255,0.06)',
                border: '1px solid rgba(123,95,255,0.22)',
                color: 'var(--page-fg)',
                caretColor: '#7B5FFF',
              }}
            />
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl text-xs font-display uppercase tracking-[0.25em] shrink-0"
              style={{
                background: 'linear-gradient(135deg, #4A35C7 0%, #7B5FFF 100%)',
                color: '#FAFAFA',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? '...' : 'Join'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
