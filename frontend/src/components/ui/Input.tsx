'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-widest text-neutral-400"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full rounded-md border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-neutral-50 placeholder-neutral-500 backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 aria-[invalid=true]:border-error aria-[invalid=true]:ring-error disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
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
