'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export interface AccordionItem {
  title: string;
  body: string;
}

export function InfoAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title} style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-5 cursor-pointer"
              style={{ background: 'transparent', border: 'none', textAlign: 'left' }}
            >
              <span
                className="tech-label"
                style={{ color: isOpen ? 'var(--accent)' : 'var(--page-fg)', fontWeight: 700 }}
              >
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ color: isOpen ? 'var(--accent)' : 'var(--muted)', fontSize: '18px', lineHeight: 1 }}
                aria-hidden
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="text-sm leading-relaxed pb-6 max-w-prose" style={{ color: 'var(--muted)' }}>
                    {item.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
