'use client';

import { forwardRef, type HTMLAttributes } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'liquid' | 'spatial';
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ variant = 'liquid', className = '', children, ...props }, ref) => {
    const variantClass = variant === 'spatial' ? 'glass-spatial' : 'glass-liquid';

    return (
      <div
        ref={ref}
        className={`${variantClass} rounded-2xl ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = 'GlassPanel';
