'use client';

import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Card({
  title,
  description,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-800/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-neutral-500 hover:bg-neutral-800/50 ${className}`.trim()}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-neutral-50">{title}</h3>
      )}
      {description && (
        <p className="mt-2 text-sm text-neutral-400">{description}</p>
      )}
      {children}
    </div>
  );
}
