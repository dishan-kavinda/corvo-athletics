import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

export function Section({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn('py-20 lg:py-28', className)} {...props}>
      {children}
    </section>
  );
}
