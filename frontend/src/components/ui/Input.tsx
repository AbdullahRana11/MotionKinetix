'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

type InputVariant = 'default' | 'spatial';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: InputVariant;
}

const variantClasses: Record<InputVariant, string> = {
  default:
    'rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 shadow-input-inner backdrop-blur-sm transition-all duration-300 focus:border-primary-500/50 focus:outline-none focus:shadow-input-focus-glow aria-[invalid=true]:border-error aria-[invalid=true]:shadow-[inset_0_2px_8px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,51,102,0.5)] disabled:cursor-not-allowed disabled:opacity-50',
  spatial:
    'rounded-xl border-0 bg-black/30 px-4 py-3.5 text-white placeholder-white/25 shadow-input-inner backdrop-blur-md transition-all duration-300 focus:outline-none focus:shadow-input-focus-glow aria-[invalid=true]:shadow-[inset_0_2px_8px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,51,102,0.5)] disabled:cursor-not-allowed disabled:opacity-50',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, id, variant = 'default', className = '', ...props },
    ref,
  ) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-widest text-white/60 text-crisp"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full ${variantClasses[variant]} ${className}`.trim()}
          {...props}
        />
        {hasError && (
          <span id={errorId} className="text-xs text-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
