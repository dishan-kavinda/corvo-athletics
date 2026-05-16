import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const variants = {
  primary:
    'bg-blade text-pure hover:bg-blade-deep shadow-[0_0_0_0_rgba(216,24,41,0)] hover:shadow-[0_0_36px_rgba(216,24,41,0.5)] active:scale-[0.98]',
  outline:
    'border border-current hover:bg-blade hover:text-pure hover:border-blade transition-colors duration-300',
  ghost:
    'relative hover:text-blade transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-blade after:transition-all after:duration-300 hover:after:w-full',
  gold:
    'relative bg-gold text-ink hover:bg-gold-deep overflow-hidden shadow-[0_0_0_0_rgba(201,169,97,0)] hover:shadow-[0_0_28px_rgba(201,169,97,0.4)]',
} as const;

const sizes = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
} as const;

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-display uppercase tracking-wider transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
