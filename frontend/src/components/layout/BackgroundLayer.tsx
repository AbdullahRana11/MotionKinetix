import { type ReactNode } from 'react';

interface BackgroundLayerProps {
  children: ReactNode;
  className?: string;
  overlay?: 'dark' | 'none';
}

export default function BackgroundLayer({
  children,
  className = '',
  overlay = 'dark',
}: BackgroundLayerProps) {
  return (
    <div className={`relative min-h-screen ${className}`.trim()}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-app-background"
      />
      {overlay === 'dark' && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-black/40"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
