'use client';

import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  variant?: 'liquid' | 'solid';
}

export function Card({
  title,
  description,
  children,
  variant = 'liquid',
  className = '',
  ...props
}: CardProps) {
  const surfaceClass =
    variant === 'liquid'
      ? 'glass-liquid transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]'
      : 'border border-neutral-700/50 bg-neutral-800/30 backdrop-blur-md';

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl p-6 ${surfaceClass} ${className}`.trim()}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-crisp">{title}</h3>
      )}
      {description && (
        <p className="mt-2 text-sm text-white/60 text-crisp">{description}</p>
      )}
      {children}
    </div>
  );
}
