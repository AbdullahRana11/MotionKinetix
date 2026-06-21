'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'rounded-lg border border-neutral-700 bg-neutral-900/80 px-8 py-3 text-sm font-semibold tracking-widest text-neutral-50 shadow-[0_0_20px_-5px_rgba(0,238,252,0.2)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary-500 hover:text-primary-500 hover:shadow-[0_0_30px_-5px_rgba(0,238,252,0.4)] focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
  outline:
    'rounded-lg border border-neutral-700 bg-transparent px-8 py-3 text-sm font-semibold tracking-widest text-neutral-50 transition-all duration-300 hover:border-primary-500 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'text-xs font-medium tracking-widest text-neutral-400 transition-colors duration-300 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${variantClasses[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
