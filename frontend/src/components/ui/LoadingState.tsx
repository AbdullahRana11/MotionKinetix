'use client';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = 'Processing Telemetry...',
}: LoadingStateProps) {
  return (
    <div className="glass-liquid flex items-center gap-3 rounded-full px-4 py-2">
      <div className="h-2 w-2 animate-ping rounded-full bg-warning" />
      <span className="text-sm uppercase tracking-widest text-warning text-crisp">
        {message}
      </span>
    </div>
  );
}
