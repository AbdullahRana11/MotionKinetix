'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'glass';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'rounded-xl border border-primary-500/30 bg-primary-500/10 px-8 py-3 text-sm font-semibold tracking-widest text-white shadow-glow backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary-500 hover:bg-primary-500/20 hover:shadow-[0_0_30px_-5px_rgba(0,238,252,0.5)] focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
  outline:
    'rounded-xl border border-white/20 bg-transparent px-8 py-3 text-sm font-semibold tracking-widest text-white text-crisp transition-all duration-300 hover:border-primary-500/50 hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'text-xs font-medium tracking-widest text-white/60 text-crisp transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50',
  glass:
    'rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold tracking-widest text-white shadow-liquid backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50',
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
